/* eslint-disable no-use-before-define */
/* eslint-disable no-console */
const webClientProvider = require('./webClientProvider');
const messageBlockProvider = require('./messageBlockProvider');

function sendInitialRequestToAllEmployees(users) {
  users.forEach((user) => {
    webClientProvider.webClient.chat.postMessage({
      channel: user.id,
      text: 'Initial request prompt',
      blocks: messageBlockProvider.getInitialRequestBlock(`<@${user.id}>`),
    });
  });
}

async function deleteInitialRequests() {
  const list = await webClientProvider.webClient.conversations.list({ types: 'im' });
  console.log('Deleting previous messages');
  // eslint-disable-next-line no-use-before-define
  const messageTimestamps = await getMessageTimestamps(list);

  console.log(`Found ${messageTimestamps.length} messages, starting deletion...`);

  let counter = 0;

  const interval = setInterval(() => {
    if (counter === messageTimestamps.length) {
      console.log('finished deletion.');
      clearInterval(interval);
    } else {
      deleteMessage(messageTimestamps[counter]);
      // eslint-disable-next-line no-plusplus
      counter++;
    }
  }, 1250);
}

async function deleteMessage(element) {
  try {
    await webClientProvider.webClient.chat.delete({ channel: element.id, ts: element.ts });
  } catch (e) {
    console.log(e);
  }
}

async function getMessageTimestamps(list) {
  const messageTimestamps = [];

  for (let i = 0; i < list.channels.length; i++) {
    // eslint-disable-next-line max-len
    // eslint-disable-next-line no-await-in-loop
    const history = await webClientProvider.webClient.conversations.history({ channel: list.channels[i].id, limit: 100 });

    // eslint-disable-next-line no-plusplus
    for (let j = 0; j < history.messages.length; j++) {
      const currentMessage = history.messages[j];

      // if the message is from the slack app, rather than a user

      if (
        currentMessage.bot_profile
      ) {
        const obj = { id: list.channels[i].id, ts: currentMessage.ts };
        messageTimestamps.push(obj);
      }
    }
  }

  return messageTimestamps;
}

module.exports = {
  sendInitialRequestToAllEmployees,
  deleteInitialRequests,
  deleteMessage,
  getMessageTimestamps,
};
