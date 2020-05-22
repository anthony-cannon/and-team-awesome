require('dotenv').config();
const { App } = require('@slack/bolt');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();

// /setthreshold office1 12
// /getthreshold office1
// /whosattending office1 today,tomorrow,dd/MM/yy
// /removeme office1 today,tomorrow,dd/MM/yy
app.command("/setthreshold", async ({ command, ack, say }) => {
  await ack();
  console.log('Got command: setthreshold ' + command.text);
  if (command.text.includes(" ")) {
    var params = command.text.split(" ")
    setThreshold(params[0], params[1])
    say("Threshold is updated for " + params[0]);
  } else {
    say("Remember to write the office your refering to and the new threshold.");
  }
});

app.command("/getthreshold", async ({ command, ack, say }) => {
  await ack();
  console.log('Got command: getthreshold ' + command.text);
  if (command.text.length > 0) {
    var threshold = getThreshold(command.text)
    say("Threshold for " + command.text + " is " + threshold);
  } else {
    say("Remember to write the office your refering to.");
  }
});

app.command("/whosattending", async ({ command, ack, say }) => {
  await ack();
  console.log('Got command: whosattending ' + command.text);
  if (command.text.includes(" ")) {
    var params = command.text.split(" ")
    var attendees = getAttendees(params[0], params[1])
    say("List of attendees: " + attendees);
  } else {
    say("Remember to write the office your refering to and the date.");
  }
});

app.command("/removeme", async ({ command, ack, say }) => {
  await ack();
  console.log('Got command: removeme ' + command.text);
  if (command.text.includes(" ")) {
    var params = command.text.split(" ")
    removeAttendee(command.user_name, params[0], params[1])
    say(command.user_id + " removed from the " + params[0] + " attendees list, " + params[1]);
  } else {
    say("Remember to write the office your refering to and the date.");
  }
});

function setThreshold(office, threshold) {
  console.log('Setting threshold for ' + office + ' to ' + threshold);
}

function getThreshold() {
  return 0;
}

function getAttendees(office, date) {

}

function removeAttendee(userId, office, date) {

}
