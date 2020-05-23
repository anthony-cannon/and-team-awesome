/* eslint-disable no-console */
const webClientProvider = require('./webClientProvider');
const messageBlockProvider = require('./messageBlockProvider');

function sendInitialRequestToAllEmployees(users) {
  users.forEach((user) => {
    webClientProvider.webClient.chat.postMessage({
      channel: user.id,
      text: 'Initial request prompt',
      blocks: messageBlockProvider.getInitialRequestBlock(`${user.profile.first_name}`),
    });
  });
}

module.exports = {
  sendInitialRequestToAllEmployees,
};
