import {useState} from 'preact/hooks';
import classnames from 'classnames';

export const formatMessage = (content) => {
  const output = [];
  let currentBlockquote = [];

  content.split("\n").forEach(line => {
    if (line.startsWith("> ")) {
      if (currentBlockquote.length) {
        currentBlockquote.push("\n");
      }
      currentBlockquote.push(formatInline(line.replace(/^> /, '')));
    } else {
      if (currentBlockquote.length) {
        if (output.length) {
          output.push("\n")
        }
        output.push(<blockquote>{currentBlockquote}</blockquote>);
        currentBlockquote = [];
      }

      if (output.length) {
        output.push("\n")
      }

      output.push(formatInline(line));
    }
  });

  currentBlockquote.length && output.push(<blockquote>{currentBlockquote}</blockquote>);

  return output;
}

const formatInline = (message) => {
  const output = [];
  let currentIndex = 0;
  for (const match of message.matchAll(combinedRegexp)) {
    output.push(message.substring(currentIndex, match.index));
    const matchedString = match[0];
    const formattingIndex = inlineFormattingRegexs.findIndex((_, index) => 
      Boolean(match[index + 1])
    );
    const capture = match[formattingIndex + 1];
    const [formattingType] = inlineFormattingRegexs[formattingIndex];
    output.push(formatting[formattingType](capture));
    currentIndex = match.index + match[0].length;
  };
  output.push(message.substring(currentIndex, message.length));
  return output;
}

const inlineFormattingRegexs = [
  ['bold', /\*\*(.+?)\*\*(?!\*)/],
  ['italic', /\*(?!\s)(.+?)(?<!\s|\*)\*(?!\*)/],
  ['italic', /_([^_]+)_(?!\w)/],
  ['italic_bold', /\*(\*\*.+?\*\*)\*(?!\*)/],
  ['underline', /__(.+?)__(?!_)/],
  ['italic_under', /_(__.+?__)_(?!_)/],
  ['strike', /~~(.+?)~~/],
  ['spoiler', /\|\|(.+?)\|\|/],
  ['link', /<?(https?:\/\/\S*[^.,:;"'\s])>?/],
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
};

const combinedRegexp = new RegExp(Object.values(inlineFormattingRegexs).flat().map(i => `(?:${i.source})`).join('|'), 'g');
