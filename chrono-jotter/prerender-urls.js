const channelExport = require('./data/channel-export.json');

const sessions = [
  {
    subtitle: "In which our protagonist is apparently addicted to eating notebook paper",
    start: "954852865548099634",
  }, {
    subtitle: "In which a good homicide is its own reward!",
    start: "955244223920234526",
  }, {
    subtitle: "In which we casually travel through time and resurrect the dead!",
    start: "955966172870897754",
  }, {
    subtitle: "In which we learn about the Astromorticians.",
    start: "957442361749798912",
  }, {
    subtitle: "In which we spend some quality time with the other characters!",
    start: "958877124788355185",
  }, {
    subtitle: "We are... Kindred?",
    start: "959231598597914674",
  }, {
    subtitle: "In which we enjoy a picnic with biscuits and tea.",
    start: "960347600714870874",
  }, {
    subtitle: "In which we enjoy more free time and socialization, and reminisce about that time one of our got arms chopped off.",
    start: "961417457719967826",
  }, {
    subtitle: "My GF has dismembered me more than your GF",
    start: "962138499576905760",
  }, {
    subtitle: "In which we finally get the chance to start working on that Recall Point backlog",
    start: "962837829082288168",
  }, {
    subtitle: "In which we are reminded that, yes, she still eats paper.",
    start: "963608795953631302",
  }, {
    subtitle: "turns out murdergames aren't always lighthearted fun",
    start: "964300186153283677",
    cw: 'Content warning: This chapter contains graphic descriptions of suicide.',
  }, {
    subtitle: "In which there is LOTS OF INTERPERSONAL DRAMA hoo boy.",
    start: "964654233649545257",
  }, {
    subtitle: "Did you know? Ran once beat up twelve orphans to steal their bus tickets.",
    start: "965376874593267813",
  }, {
    subtitle: "In which Ran teaches Tama to do dog tricks. Also, lots of screaming, and a double whammy",
    start: "966474012295299145",
  }, {
    subtitle: "Tama crowbars a door open with a severed arm, and stares at Ran's boobs.",
    start: "967573504264372296",
  }
].map((session, i, allSessions) => ({
  url: `/part-${i + 1}`,
  title: `Chrono Jotter: Part ${i + 1}`,
  pageTitle: `Part ${i + 1}`,
  allSessions,
  ...session,
}));

const pages = [{
  url: '/',
  title: 'Chrono Jotter',
  subtitle: 'Lingering Remembrances: The Chrono Jotter',
  sessions: sessions,
}, {
  url: '/character-list',
  title: "Character List",
  messages: ['957468842500718653'],
}];

const messagesById = Object.fromEntries(channelExport.messages.map(i => [i.id, i]));

const sessionMessages = {};
let currentSessionIndex = 0;
channelExport.messages.forEach(message => {
  if (message.id == sessions[currentSessionIndex + 1]?.start) {
    currentSessionIndex += 1;
  }

  if (!sessionMessages[currentSessionIndex]) {
    sessionMessages[currentSessionIndex] = [];
  }

  if (message.reference) {
    message.replyMessage = messagesById[message.reference.messageId];
  }

  sessionMessages[currentSessionIndex].push(message);
});

module.exports = () => [
  ...sessions.map((session, i) => ({
    ...session,
    messages: sessionMessages[i]
  })),
  ...pages,
];