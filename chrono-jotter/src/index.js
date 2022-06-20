import 'components/style';
import './style';
import {MessageList} from 'components/MessageList.js';
import classnames from 'classnames';

const Index = ({sessions}) =>
  <div class="index">
    <h1>Chrono Jotter</h1>
    <img width="1080" height="608" class="hero-image" src="/assets/banner.png" />
    <div class="game-description">
      Ran Ibuki wakes up in an abandoned school with a lot of memory problems and not a lot of answers. All she knows is that she’s looking for her missing girlfriend. Things get... weirder, from there. Game by Orca Layout. Translation by Zerovirus. <a href="https://store.steampowered.com/app/1398740/The_Chrono_Jotter/">Purchase the game on Steam</a>.
    </div>
    <div class="cw">
      <strong>Content Warning:</strong> Chrono Jotter contains graphic depictions of suicide, gore, and self-harm. Reader discretion is advised.
    </div>
    <ul class="session-list">
      {sessions.map(s => 
        <a href={s.url}><li>{s.pageTitle}: <i>{s.subtitle}</i></li></a>
      )}
    </ul>
  </div>;

const SessionNav = ({session, type}) =>
  !session ? <div/> :
  <a class={classnames('nav-link', `nav-link--${type}`)} href={session.url}>
    {type === 'next' ?
      <div class="nav-link_header">Next: <strong>{session.pageTitle}</strong></div> :
      <div class="nav-link_header">Previously: <strong>{session.pageTitle}</strong></div>
    }
    <i>{session.subtitle}</i>
  </a>;

const Session = ({pageTitle, subtitle, messages, cw, index, allSessions}) => {
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
