import {MessageGroup} from './MessageGroup.js';

export const MessageList = ({messages}) => {
  const groupedMessages = [];

  let currentGroup = [];
  currentGroup.showTimestamp = true;

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
      currentGroup.showTimestamp =
        !lastMessage || secondsBetween(message, lastMessage) > (15 * 60);
    }
  });
  currentGroup.length && groupedMessages.push(currentGroup);

  return <div class="message_list">
    {groupedMessages.map(messages => 
      <MessageGroup messages={messages} showTimestamp={messages.showTimestamp} />
    )}
  </div>;
}

const createdAtMs = (message) => Number(BigInt(message.id) >> 22n);
const secondsBetween = (message, lastMessage) =>
  (createdAtMs(message) - createdAtMs(lastMessage)) / 1000;
