import {useState} from 'preact/hooks';
import classnames from 'classnames';

const join = (seperator, array) =>
  array.flatMap((element, index) => 
    index == 0 ? [element] : [seperator, element]
  );

export const formatMessage = (content) => {
  const output = [];

  const lines = content.split("\n");
  while (lines.length) {
    const peekLine = lines[0];

    if (peekLine.startsWith("> ")) {
      output.push(formatBlockquote(lines));
    } else if (peekLine.startsWith('```')) {
      output.push(formatCodeblock(lines));
    } else {
      output.push(formatInline(lines.shift()));
    }
  };

  return join("\n", output);
}


const formatCodeblock = (lines) => {
  const output = [];
  const startingLine = lines.shift();
  const [_, languageCode, rest] = startingLine.match(/^```(\w*)(.*)/);

  if (rest.length) {
    output.push(rest);
  }

  const consumedLines = [];
  const formatter = (codeblockLanguages[languageCode] || codeblockLanguages.normal)();
  let foundEndMarker = false;
  while (lines.length) {
    const line = lines.shift();
    if (line.includes('```')) {
      foundEndMarker = true;
      const [content, rest] = line.split('```');
      content && output.push(formatter(content));
      rest && lines.unshift(rest);
      break;
    } else {
      output.push(formatter(line));
    }
  }

  if (!foundEndMarker) {
    lines.unshift(...consumedLines);
    return startingLine;
  }

  return <pre><code>{join('\n', output)}</code></pre>;
}

const codeblockLanguages = {
  ini: () => {
    let isHeader = false;
    return line => {
      if (isHeader) {
        const [header, rest] = line.split("]");
        if (rest) {
          isHeader = false;
        }
        return <><span style={{color: 'teal'}}>{header}]</span>{rest}</>;
      } else {
        const [text, header] = line.split("[");
        if (header) {
          isHeader = true;
          return <>{text}<span style={{color: 'teal'}}>[{header}</span></>;
        } else {
          return text;
        }
      }
    };
  },
  diff: () => (line) => {
    if (line.startsWith('-')) {
      return <span style={{color: '#dc322f'}}>{line}</span>;
    } else if (line.startsWith('+')) {
      return <span style={{color: 'green'}}>{line}</span>;
    } else {
      return line;
    }
  },
  normal: () => () => line,
};

const formatBlockquote = (lines) => {
  const output = [];
  while (lines.length && lines[0].startsWith('> ')) {
    output.push(formatInline(lines.shift().replace(/^> /, '')));
  }

  return <blockquote>{join("\n", output)}</blockquote>;
}

const formatInline = (message) => {
  const output = [];
  let currentIndex = 0;
  for (const match of message.matchAll(combinedRegexp)) {
    output.push(message.substring(currentIndex, match.index));

    const [matchedString, ...captureGroups] = match;
    const matchedCaptureGroup = captureGroups.findIndex((group) => Boolean(group));

    const capture = captureGroups[matchedCaptureGroup];
    const [formattingType] = inlineFormattingRegexs[matchedCaptureGroup];

    output.push(formatting[formattingType](capture));
    currentIndex = match.index + matchedString.length;
  };
  output.push(message.substring(currentIndex, message.length));
  return output;
};

const inlineFormattingRegexs = [
  ['bold', /\*\*(.+?)\*\*(?!\*)/],
  ['italic', /\*(?!\s)(.*?(?:[^\s*]))\*(?!\*)/],
  ['italic', /_([^_]+)_(?!\w)/],
  ['italic_bold', /\*(\*\*.+?\*\*)\*(?!\*)/],
  ['underline', /__(.+?)__(?!_)/],
  ['italic_under', /_(__.+?__)_(?!_)/],
  ['strike', /~~(.+?)~~/],
  ['spoiler', /\|\|(.+?)\|\|/],
  ['link', /<(https?:\/\/[^\s>]*[^.,:;"'\s>])>/],
  ['link', /(https?:\/\/\S*[^.,:;"'\s>])/],
  ['emoji', /<:(\w+:\d+)>/]
];

const Spoiler = ({children}) => {
  const [shown, setShown] = useState(false);
  return <button
    class={classnames({
      spoiler: true,
      "spoiler--showing": shown,
    })}
    onClick={() => setShown(s => !s)}
  >{children}</button>;
}

const formatting = {
  bold:         s => <strong>{formatInline(s)}</strong>,
  italic:       s => <em>{formatInline(s)}</em>,
  italic_bold:  s => <strong><em>{formatInline(s)}</em></strong>,
  underline:    s => <u>{formatInline(s)}</u>,
  italic_under: s => <em><u>{formatInline(s)}</u></em>,
  strike:       s => <s>{formatInline(s)}</s>,
  spoiler:      s => <Spoiler>{formatInline(s)}</Spoiler>,
  link:         s => <a href={s}>{s}</a>,
  emoji:        s => {
    const [title, id] = s.split(':');
    return <img alt={title} title={title} src={`https://cdn.discordapp.com/emojis/${id}.png`} style="height: 1rem; vertical-align: bottom;" />;
  },
};

const combinedRegexp = new RegExp(Object.values(inlineFormattingRegexs).flat().map(i => `(?:${i.source})`).join('|'), 'g');
