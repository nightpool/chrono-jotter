import {formatMessage} from './MessageContent.js';
import classnames from 'classnames';

const Reaction = ({emoji, count}) =>
  <div class="message-reaction">
    <img src={emoji.imageUrl} alt={emoji.name} /> {count}
  </div>;
const Embed = (props) => JSON.stringify(props);
const Attachment = ({url}) => <img src={url} loading="lazy" fetchpriority="low" />;

const Message = ({content, reactions, attachments, embeds, id}) => {
  return <div class="message" id={id}>
    <p>{formatMessage(content)}</p>
    {attachments.length ? attachments.map(a => <Attachment {...a}/>) : null}
    {/*embeds && embeds.map(e => <Embed {...e}/>)*/}
    {reactions.length ? 
      <div class="message-reactions">{reactions.map(r => <Reaction {...r}/>)}</div>
      : null}
  </div>;
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
              <img src={replyMessage.author.avatarUrl}/><span>&nbsp;
              <strong>{replyMessage.author.name}</strong>: {
                replyMessage.content
              }</span>
            </a>
          </div> :
        reference ? <div class="message_group-reply">
          <span>Reply to <a href={`#${reference.messageId}`}>{reference.messageId}</a></span>
        </div> : null
      }
      <img class="message_group-avatar" src={author.avatarUrl} />
      <div class="message_group-nick">{author.nickname}</div>
      <div class="message_group-messages">
        {messages.map(m => <Message {...m} />)}
      </div>
    </div>
  </>;
}