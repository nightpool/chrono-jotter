import {useState} from 'preact/hooks';
import classnames from 'classnames';

const join = (seperator, array) =>
  array.flatMap((element, index) => 
    index == 0 ? [element] : [seperator, element]
  );

export const formatMessage = (content) => {
  const output = [];
  let currentBlockquote = [];

  content.split("\n").forEach(line => {
    if (line.startsWith("> ")) {
      currentBlockquote.push(formatInline(line.replace(/^> /, '')));
    } else {
      if (currentBlockquote.length) {
        output.push(<blockquote>{join("\n", currentBlockquote)}</blockquote>);
        currentBlockquote = [];
      }

      output.push(formatInline(line));
    }
  });

  currentBlockquote.length && output.push(<blockquote>{join("\n", currentBlockquote)}</blockquote>);

  return join("\n", output);
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
  ['italic', /\*(?!\s)(.+?)(?<!\s|\*)\*(?!\*)/],
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
