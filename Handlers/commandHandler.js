/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
const handleGetThresholdRequest = async ({ command, ack, say }) => {
  await ack();
  console.log(`Got command: getthreshold ${command.text}`);
  if (command.text.length > 0) {
    const threshold = getThreshold(command.text);
    say(`Threshold for ${command.text} is ${threshold}`);
  } else {
    say('Remember to write the office your refering to.');
  }
};

const handleGetWhoIsAttendingRequest = async ({ command, ack, say }) => {
  await ack();
  console.log(`Got command: whosattending ${command.text}`);
  if (command.text.includes(' ')) {
    const params = command.text.split(' ');
    const attendees = getAttendees(params[0], params[1]);
    say(`List of attendees: ${attendees}`);
  } else {
    say('Remember to write the office your refering to and the date.');
  }
};

const handleRemoveMeRequest = async ({ command, ack, say }) => {
  await ack();
  console.log(`Got command: removeme ${command.text}`);
  if (command.text.includes(' ')) {
    const params = command.text.split(' ');
    removeAttendee(command.user_name, params[0], params[1]);
    say(
      `${command.user_id
      } removed from the ${
        params[0]
      } attendees list, ${
        params[1]}`,
    );
  } else {
    say('Remember to write the office your refering to and the date.');
  }
};

const handleSetThresholdRequest = async ({ command, ack, say }) => {
  await ack();
  console.log(`Got command: setthreshold ${command.text}`);
  if (command.text.includes(' ')) {
    const params = command.text.split(' ');
    setThreshold(params[0], params[1]);
    say(`Threshold is updated for ${params[0]}`);
  } else {
    say('Remember to write the office your refering to and the new threshold.');
  }
};

function getThreshold() {
  return 0;
}

function getAttendees(office, date) {}

function removeAttendee(userId, office, date) {}

function setThreshold(office, threshold) {
  console.log(`Setting threshold for ${office} to ${threshold}`);
}

module.exports = {
  handleGetThresholdRequest,
  handleGetWhoIsAttendingRequest,
  handleRemoveMeRequest,
  handleSetThresholdRequest,
};
