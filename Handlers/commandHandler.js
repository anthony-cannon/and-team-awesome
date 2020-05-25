/* eslint-disable no-console */
/* eslint-disable no-use-before-define */

const isDate = /^[0-9]{2}[\/][0-9]{2}[\/][0-9]{4}$/g;
const isNumber = /\d+/g;

const officesThreshold = new Map();
const usersAttendingToday = new Map();
const usersAttendingTomorrow = new Map();
const ada = 'ada';
const turing = 'turing';
const dekker = 'dekker';
officesThreshold.set(ada, 0);
officesThreshold.set(turing, 0);
officesThreshold.set(dekker, 0);


// /getthreshold office1
const handleGetThresholdRequest = async ({ command, ack, say }) => {
  const params = splitText(command.text);
  const office = params[0].toLowerCase();
  const officeExists = checkOffice(office);
  console.log(officeExists);
  if (params.length === 0) {
    await ack('Ops, looks like you forgot to enter the office name!');
  } else if (officeExists) {
    await ack();
    const threshold = getThreshold(office);
    say(`Threshold for ${params[0]} is ${threshold}`);
  } else {
    await ack('Please enter a valid office name');
  }
};

// /whosattending office1 today,tomorrow,dd/MM/yy
const handleGetWhoIsAttendingRequest = async ({ command, ack, say }) => {
  const params = splitText(command.text);
  if (params.length === 0) {
    await ack('Ops, looks like you forgot to enter the office name and date!');
  } else if (params.length === 1) {
    await ack('Ops, looks like you forgot to enter the date!');
  } else {
    if (params[1] === 'today') {
      params[1] = getTodaysDate();
    } else if (params[1] === 'tomorrow') {
      params[1] = getTomorrowsDate();
    }

    if (params[1].match(isDate)) {
      await ack();
      const attendees = getAttendees(params[0], params[1]);
      say(`List of attendees: ${attendees}`);
    } else {
      await ack('Ops, make sure you write correctly: dd/mm/yyyy');
    }
  }
};

// /removeme office1 today,tomorrow,dd/MM/yy
const handleRemoveMeRequest = async ({ command, ack, say }) => {
  const params = splitText(command.text);
  const office = params[0].toLowerCase();
  const officeExists = checkOffice(office);
  if (params.length === 0) {
    await ack('Ops, looks like you forgot to enter the correct office name and date!');
  } else if (params.length === 1) {
    await ack('Ops, looks like you forgot to enter the date!');
  } else if (params[1] === 'today' && officeExists) {
    params[1] = getTodaysDate();
    await ack();
    const removed = removeAttendeeToday(command.user_id, office, params[1]);
    if (removed) {
      say(`${command.user_name} has been removed from the ${office} attendees list today`);
    } else {
      say(`${command.user_name} was not on the list to attend ${office} today`);
    }
  } else if (params[1] === 'tomorrow' && officeExists) {
    params[1] = getTomorrowsDate();
    await ack();
    const removed = removeAttendeeTomorrow(command.user_id, office, params[1]);
    if (removed) {
      say(`${command.user_name} has been removed from the the ${office} attendees list tomorrow`);
    } else {
      say(`${command.user_name} was not on the list to attend ${office} tomorrow`);
    }
  } else {
    say('Ops, make sure you write correctly: dd/mm/yyyy');
  }
};


// /addme office1 today
const handleAddMeRequest = async ({ command, ack, say }) => {
  const params = splitText(command.text);
  const office = params[0].toLowerCase();
  const officeExists = checkOffice(office);
  if (params.length === 0) {
    await ack('Ops, looks like you forgot to enter the correct office name and date!');
  } else if (params.length === 1) {
    await ack('Ops, looks like you forgot to enter the date!');
  } else if (params[1] === 'today' && officeExists) {
    params[1] = getTodaysDate();
    await ack();
    const added = addAttendeeToday(command.user_id, office, params[1]);
    if (added) {
      say(`${command.user_name} added to the ${office} attendees list today`);
    } else {
      say(`${command.user_name} is already on the list to attend ${usersAttendingToday.get(command.user_id)} today`);
    }
  } else if (params[1] === 'tomorrow' && officeExists) {
    params[1] = getTomorrowsDate();
    await ack();
    const added = addAttendeeTomorrow(command.user_id, office, params[1]);
    if (added) {
      say(`${command.user_name} added to the the ${office} attendees list tomorrow`);
    } else {
      say(`${command.user_name} is already on the list to attend ${usersAttendingTomorrow.get(command.user_id)} tomorrow`);
    }
  } else {
    say('Ops, make sure you write correctly: dd/mm/yyyy');
  }
};

// /setthreshold office1 12
const handleSetThresholdRequest = async ({ command, ack, say }) => {
  const params = splitText(command.text);
  const office = params[0].toLowerCase();
  const officeExists = checkOffice(office);
  if (params.length === 0) {
    await ack(
      'Ops, looks like you forgot to enter the office name and the new theshold!',
    );
  } else if (params.length === 1) {
    await ack('Ops, looks like you forgot to enter the new theshold!');
  } else if (params[1].match(isNumber) && officeExists) {
    await ack();
    setThreshold(office, params[1]);
    say(`Threshold is updated for ${params[0]}`);
  } else {
    await ack('Ops, make sure your new theshold is a number and the office exists!');
  }
};

// Utils
function splitText(text) {
  return text.split(' ').filter((el) => el.length > 0);
}

function getTodaysDate() {
  return dateToString(new Date());
}

function getTomorrowsDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return dateToString(tomorrow);
}

function dateToString(date) {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();

  return `${dd}/${mm}/${yyyy}`;
}

// DB
function getThreshold(office) {
  const result = officesThreshold.get(office);
  console.log(result);
  return result;
}

function getAttendeesToday(office, date) {}

function getAttendeesTomorrow(office, date) {}

function removeAttendeeToday(userId, office, date) {
  if (usersAttendingToday.has(userId)) {
    console.log(`Removing ${userId} to attend ${office} on ${date}`);
    return usersAttendingToday.delete(userId);
  }
  return false;
}

function removeAttendeeTomorrow(userId, office, date) {
  if (usersAttendingTomorrow.has(userId)) {
    console.log(`Removing ${userId} to attend ${office} on ${date}`);
    return usersAttendingTomorrow.delete(userId);
  }
  return false;
}

function addAttendeeToday(userId, office, date) {
  if (!usersAttendingToday.has(userId)) {
    console.log(`Adding ${userId} to attend ${office} on ${date}`);
    return usersAttendingToday.set(userId, office);
  }
  return false;
}
function addAttendeeTomorrow(userId, office, date) {
  if (!usersAttendingTomorrow.has(userId)) {
    console.log(`Adding ${userId} to attend ${office} on ${date}`);
    return usersAttendingTomorrow.set(userId, office);
  }
  return false;
}

function setThreshold(office, threshold) {
  console.log(`Setting threshold for ${office} to ${threshold}`);
  officesThreshold.set(office, threshold);
}

function checkOffice(input) {
  const office = input;
  console.log(office);
  if (office === ada || office === turing || office === dekker) {
    return true;
  }
  return false;
}

module.exports = {
  handleGetThresholdRequest,
  handleGetWhoIsAttendingRequest,
  handleRemoveMeRequest,
  handleAddMeRequest,
  handleSetThresholdRequest,
};
