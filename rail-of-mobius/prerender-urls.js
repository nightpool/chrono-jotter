const channelExport = require('./data/channel-export.json');

const sessions = [
  {
    start: 939664058808950844,
  },
  {
    start: 939918052928139295,
  },
  {
    start: 940362638817361931,
  },
  {
    start: 940732063378706462,
  },
  {
    start: 941772548016853002,
  },
  {
    start: 943294185899950101,
  },
  {
    start: 944397494127845447,
  },
  {
    start: 944736250215170068,
  },
  {
    start: 945454360152924160,
  },
  {
    start: 946915581729325076,
  },
  {
    start: 947301796618072075,
  },
  {
    start: 947633016828735549,
  },
  {
    start: 949107680138637362,
  },
  {
    start: 949819324296749086,
  },
  {
    start: 951271155413688380,
  },
  {
    start: 952249111061618798,
  },
].map((session, i, allSessions) => ({
  url: `/part-${i + 1}`,
  title: `Rail of Mobius: Part ${i + 1}`,
  pageTitle: `Part ${i + 1}`,
  allSessions,
  ...session,
}));

const pages = [{
  url: '/',
  title: 'Rail of Mobius',
  subtitle: 'Deep Blue Prison- The Nonexistent 13th Boxcar- RAIL OF MOBIUS',
  sessions: sessions,
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