/* eslint-disable no-console */

require('dotenv').config();
const { App } = require('@slack/bolt');
const commandHandler = require('./Handlers/commandHandler');
const userStore = require('./userStore/userStore');
const requestProvider = require('./providers/requestProvider');


const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');

  await requestProvider.deleteInitialRequests();
  console.log('Finished deleting previous messages');

  userStore.fetchAllUsersFromWorkspace().then(() => {
    const users = userStore.getUserList();
    requestProvider.sendInitialRequestToAllEmployees(users);
    console.log('Sent request to all employees!');
  });
})();


// /setthreshold office1 12
// /getthreshold office1
// /whosattending office1 today,tomorrow,dd/MM/yy
// /removeme office1 today,tomorrow,dd/MM/yy
// /addme office today, tomorrow
app.command('/setthreshold', commandHandler.handleSetThresholdRequest);

app.command('/getthreshold', commandHandler.handleGetThresholdRequest);

app.command('/whosattending', commandHandler.handleGetWhoIsAttendingRequest);

app.command('/removeme', commandHandler.handleRemoveMeRequest);

app.command('/addme', commandHandler.handleAddMeRequest);
