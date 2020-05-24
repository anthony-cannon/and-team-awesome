/* eslint-disable no-console */
/* eslint-disable no-use-before-define */

const isDate = /^[0-9]{2}[\/][0-9]{2}[\/][0-9]{4}$/g;
const isNumber = /\d+/g;

// /getthreshold office1
const handleGetThresholdRequest = async ({ command, ack, say }) => {
  var params = splitText(command.text);
  if (params.length == 0) {
    await ack(`Ops, looks like you forgot to enter the office name!`);
  } else {
    await ack()
    const threshold = getThreshold(command.text);
    say(`Threshold for ${params[0]} is ${threshold}`);
  }
};

// /whosattending office1 today,tomorrow,dd/MM/yy
const handleGetWhoIsAttendingRequest = async ({ command, ack, say }) => {
  var params = splitText(command.text);
  if (params.length == 0) {
    await ack(`Ops, looks like you forgot to enter the office name and date!`);

  } else if (params.length == 1) {
    await ack(`Ops, looks like you forgot to enter the date!`);

  } else {
    if (params[1] === `today`) {
      params[1] = getTodaysDate();
    } else if (params[1] === `tomorrow`) {
      params[1] = getTomorrowsDate();
    }

    if (params[1].match(isDate)) {
      await ack()
      const attendees = getAttendees(params[0], params[1]);
      say(`List of attendees: ${attendees}`);

    } else {
      await ack(`Ops, make sure you write correctly: dd/mm/yyyy`);
    }
  }
};

// /removeme office1 today,tomorrow,dd/MM/yy
const handleRemoveMeRequest = async ({ command, ack, say }) => {
  var params = splitText(command.text);
  if (params.length == 0) {
    await ack(`Ops, looks like you forgot to enter the office name and date!`);

  } else if (params.length == 1) {
    await ack(`Ops, looks like you forgot to enter the date!`);

  } else {
    if (params[1] === `today`) {
      params[1] = getTodaysDate();
    } else if (params[1] === `tomorrow`) {
      params[1] = getTomorrowsDate();
    }

    if (params[1].match(isDate)) {
      await ack()
      removeAttendee(command.user_name, params[0], params[1]);
      say(`${command.user_id} removed from the ${params[0]} attendees list`);

    } else {
      await ack(`Ops, make sure you write correctly: dd/mm/yyyy`);
    }
  }
};

// /setthreshold office1 12
const handleSetThresholdRequest = async ({ command, ack, say }) => {
  var params = splitText(command.text);
  if (params.length == 0) {
    await ack(`Ops, looks like you forgot to enter the office name and the new theshold!`);

  } else if (params.length == 1) {
    await ack(`Ops, looks like you forgot to enter the new theshold!`);

  } else if (params[1].match(isNumber)) {
    await ack()
    setThreshold(params[0], params[1]);
    say(`Threshold is updated for ${params[0]}`);

  } else {
    await ack(`Ops, make sure your new theshold is a number!`);
  }
};

// Utils
function splitText(text) {
  return text.split(` `).filter(function (el) {
    return el.length > 0;
  });
}

function getTodaysDate() {
  return dateToString(new Date());
}

function getTomorrowsDate() {
  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return dateToString(tomorrow)
}

function dateToString(date) {
  var dd = String(date.getDate()).padStart(2, '0');
  var mm = String(date.getMonth() + 1).padStart(2, '0');
  var yyyy = date.getFullYear();

  return dd + '/' + mm + '/' + yyyy;
}

// DB
function getThreshold() {
  return 0;
}

function getAttendees(office, date) { }

function removeAttendee(userId, office, date) { }

function setThreshold(office, threshold) {
  console.log(`Setting threshold for ${office} to ${threshold}`);
}

module.exports = {
  handleGetThresholdRequest,
  handleGetWhoIsAttendingRequest,
  handleRemoveMeRequest,
  handleSetThresholdRequest,
};
