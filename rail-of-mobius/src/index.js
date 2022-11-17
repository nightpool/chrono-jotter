import 'components/style';
import './style';
import {useEffect} from 'preact/hooks';
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

const SessionNav = ({session, type}) =>
  !session ? <div/> :
  <a class={`nav-link nav-link--${type}`} href={session.url}>
    {type === 'next' ?
      <div class="nav-link_header">Next{session.subtitle ? <>: <strong>{session.pageTitle}</strong></> : null}</div> :
      <div class="nav-link_header">Previously{session.subtitle ? <>: <strong>{session.pageTitle}</strong></> : null}</div>
    }
    {session.subtitle ? <i>{session.subtitle}</i> : <strong>{session.pageTitle}</strong>}
  </a>;

const copyHandler = (event) => {
  const formattedLogText = window.getSelection().toString().
    replaceAll(/^[ \t]+/gm, '').
    replaceAll(/^\w+: /gm, '');
  event.clipboardData.setData('text/plain', formattedLogText);
  event.preventDefault();
};

const Session = ({pageTitle, subtitle, messages, cw, index, allSessions}) => {
  useEffect(() => {
    if (window.location.search.includes("plaintextcopy")) {
      document.addEventListener('copy', copyHandler);
      return () => {
        document.removeEventListener('copy', copyHandler);
      }
    }
  }, []);
  return <div class="session-container">
    <h1>{pageTitle}</h1>
    <h3>{subtitle}</h3>
    {cw && <div class="cw">{cw}</div>}
    <div class="log">
      <MessageList messages={messages} />
    </div>
    <nav class="session-nav">
      <SessionNav session={allSessions[index - 1]} type={'previous'} />
      <SessionNav session={allSessions[index + 1]} type={'next'} />
    </nav>
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
