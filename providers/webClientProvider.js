require('dotenv').config();
const { WebClient } = require('@slack/web-api');

const webClient = new WebClient(process.env.SLACK_BOT_TOKEN);

module.exports = {
  webClient,
};
