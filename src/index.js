import './style';
import {MessageGroup} from './components/MessageGroup.js';

const Index = ({sessions}) =>
  <div class="index">
    <h1>Chrono Jotter</h1>
    <img width="1080" height="608" class="hero-image" src="/assets/banner.png" />
    <ul class="session-list">
      {sessions.map(s => 
        <a href={s.url}><li>{s.pageTitle}: <i>{s.subtitle}</i></li></a>
      )}
    </ul>
  </div>;

const secondsBetween = (message, lastMessage) => 
  Number(
    (BigInt(message.id) >> 22n)
    - (BigInt(lastMessage.id) >> 22n)
  ) / 1000;

const Session = (props) => {
  const {pageTitle, subtitle, messages} = props;

  const groupedMessages = [];
  let currentGroup = [];
  messages.forEach((message, i) => {
    const lastMessage = messages[i - 1];
    const sameGroup = !lastMessage || (
      lastMessage.author.id == message.author.id &&
      secondsBetween(message, lastMessage) < 60 &&
      !message.reference
    );

    if (sameGroup) {
      currentGroup.push(message)
    } else {
      currentGroup.length && groupedMessages.push(currentGroup);
      currentGroup = [message];
    }
  });
  currentGroup.length && groupedMessages.push(currentGroup);

  return <div class="session-container">
    <h1>{pageTitle}</h1>
    <h3>{subtitle}</h3>
    <div class="log">
      {groupedMessages.map(messages => 
        <MessageGroup messages={messages} />
      )}
    </div>
  </div>;
}

export default function App(props) {
  const {url, ...data} = props.CLI_DATA.preRenderData;

  if (url == '/') {
    return <Index {...data} />;
  } else if (url.startsWith('/part-')) {
    return <Session {...data} />;
  }
}
