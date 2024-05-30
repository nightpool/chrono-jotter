import {formatMessage, plainTextFormat} from './MessageContent.js';
import MessageContext from './MessageContext.js';
import classnames from 'classnames';

const assetUrl = (url) => {
  const path = url.replace(/^([^/]+).json_Files/, '$1');
  return new URL(path, "https://static.nightpool.club").toString();
}

const Reaction = ({emoji, count}) =>
  <div class="message-reaction">
    <img src={assetUrl(emoji.imageUrl)} alt={emoji.name} loading="lazy" /> {count}
  </div>;
const Embed = (props) => JSON.stringify(props);
const Attachment = ({url}) => <img src={assetUrl(url)} loading="lazy" fetchpriority="low" />;

const Message = (message) => {
  const {content, reactions, attachments, embeds, id} = message;
  return (
    <MessageContext.Provider value={message}>
      <div class="message" id={id}>
        <div class="message-content">{formatMessage(content)}</div>
        {attachments.length ? attachments.map(a => <Attachment {...a}/>) : null}
        {/*embeds && embeds.map(e => <Embed {...e}/>)*/}
        {reactions.length ? 
          <div class="message-reactions">{reactions.map(r => <Reaction {...r}/>)}</div>
          : null}
      </div>
    </MessageContext.Provider>
  );
}

const formatTimestamp = time =>
  time.toLocaleString('en-CA', {
    timeZone: 'America/New_York',
    dateStyle: 'short',
    timeStyle: 'short'
  }).replace(',', '').replace('p.m.', 'PM').replace('a.m.', 'AM');

export const MessageGroup = ({messages, showTimestamp = false}) => {
  const [firstMessage] = messages;
  const {author, reference, replyMessage, timestamp} = firstMessage;
  const authorIsStoryteller = author.id === '192760402025775106';

  return <>
    {showTimestamp && <time datetime={timestamp}>{formatTimestamp(new Date(timestamp))}</time>}
    <div class={classnames({
        message_group: true,
        'message_group--storyteller': authorIsStoryteller,
        'message_group--chat': !authorIsStoryteller
      })}>
      {
        replyMessage ?
          <div class="message_group-reply message_group-reply--preview">
            <a href={`#${reference.messageId}`}>
              <img src={assetUrl(replyMessage.author.avatarUrl)}/><span>&nbsp;
              <strong>{replyMessage.author.name}</strong>: {
                plainTextFormat(replyMessage)
              }</span>
            </a>
          </div> :
        reference ? <div class="message_group-reply">
          <span>Reply to <a href={`#${reference.messageId}`}>{reference.messageId}</a></span>
        </div> : null
      }
      <img class="message_group-avatar" src={assetUrl(author.avatarUrl)} />
      <div class="message_group-nick">{author.nickname}</div>
      <div class="message_group-messages">
        {messages.map(m => <Message {...m} />)}
      </div>
    </div>
  </>;
}