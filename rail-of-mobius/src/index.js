import 'components/style';
import './style';
import {MessageList} from 'components/MessageList.js';

const Index = ({sessions}) =>
  <div class="index">
    <h1>Rail of Mobius</h1>
    <img width="1080" height="608" class="hero-image" src="/assets/banner.jpg" />
    <div class="game-description">
       Game by PHOSEPO. Translation by Zerovirus. <a href="https://store.steampowered.com/app/1479500/Rail_of_Mbius/">Purchase the game on Steam</a>.
    </div>
    <ul class="session-list">
      {sessions.map(s => 
        <a href={s.url}><li>{s.pageTitle}{s.subtitle && <>: <i>{s.subtitle}</i></>}</li></a>
      )}
    </ul>
  </div>;

const Session = ({pageTitle, subtitle, messages, cw}) => {
  return <div class="session-container">
    <h1>{pageTitle}</h1>
    <h3>{subtitle}</h3>
    {cw && <div class="cw">{cw}</div>}
    <div class="log">
      <MessageList messages={messages} />
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
