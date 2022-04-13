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
    start: "962138603293655102",
  }, {
    subtitle: "In which we finally get the chance to start going through the Recall Point backlog",
    start: "962837829082288168",
  },
].map((session, i) => ({
  url: `/part-${i + 1}`,
  title: `Chrono Jotter: Part ${i + 1}`,
  pageTitle: `Part ${i + 1}`,
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