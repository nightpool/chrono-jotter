import 'components/style';
import './style';
import {useEffect} from 'preact/hooks';
import {MessageList} from 'components/MessageList.js';

const Index = ({sessions}) =>
  <div class="index">
    <h1>Chrono Jotter</h1>
    <img width="1080" height="608" class="hero-image" src="/assets/banner.png" />
    <div class="game-description">
      Ran Ibuki wakes up in an abandoned school with a lot of memory problems and not a lot of answers. All she knows is that she’s looking for her missing girlfriend. Things get... weirder, from there.
    </div>
    <div class="game-description">
      Chrono Jotter is a visual novel by Orca Layout. This website is an archive of a translation/let's play of the game done by Zerovirus and the TFTBN discord. The translation used in this LP formed the basis of the new English version of the game, <a href="https://store.steampowered.com/app/1398740/The_Chrono_Jotter/">please support the developers and purchase the game on Steam</a>.
    </div>
    <div class="cw">
      <strong>Content Warning:</strong> Chrono Jotter contains graphic depictions of suicide, gore, and self-harm. Reader discretion is advised.
    </div>
    <ul class="session-list">
      {sessions.map(s => 
        <a href={s.url}><li>{s.pageTitle}: <i>{s.subtitle}</i></li></a>
      )}
    </ul>
    <footer>See also: <a href="https://rail-of-mobius.netlify.app">The Rail Of Mobius</a></footer>
  </div>;

const SessionNav = ({session, type}) =>
  !session ? <div/> :
  <a class={`nav-link nav-link--${type}`} href={session.url}>
    {type === 'next' ?
      <div class="nav-link_header">Next: <strong>{session.pageTitle}</strong></div> :
      <div class="nav-link_header">Previously: <strong>{session.pageTitle}</strong></div>
    }
    <i>{session.subtitle}</i>
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
