/* eslint-disable no-console */
/* eslint-disable no-use-before-define */

const isDate = /^[0-9]{2}[\/][0-9]{2}[\/][0-9]{4}$/g;
const isNumber = /\d+/g;

const officesThreshold = new Map();
const usersAttendingToday = new Map();
const usersAttendingTomorrow = new Map();

const slackIds = new Set();
const ada = 'ada';
const turing = 'turing';
const dekker = 'dekker';
officesThreshold.set(ada, 0);
officesThreshold.set(turing, 0);
officesThreshold.set(dekker, 0);

// /getthreshold office1
const handleGetThresholdRequest = async ({ command, ack, say }) => {
  const params = splitText(command.text);
  const office = params[0];
  const officeExists = checkOffice(office);
  console.log(officeExists);
  if (params.length === 0) {
    await ack('Ops, looks like you forgot to enter the office name!');
  } else if (officeExists) {
    await ack();
    const threshold = getThreshold(office);
    say(`*${params[0].toUpperCase()}* seat threshold is ${threshold}`);
  } else {
    await ack('Please enter a valid office name');
  }
};

// /whosattending office1 today,tomorrow,dd/MM/yy
const handleGetWhoIsAttendingRequest = async ({ command, ack, say }) => {
  const params = splitText(command.text);
  const office = params[0];
  const day = params[1];
  const officeExists = checkOffice(office);
  if (params.length === 0) {
    await ack(
      'Ops, looks like you forgot to enter the correct office name and date!',
    );
  } else if (params.length === 1) {
    await ack('Ops, looks like you forgot to enter the date!');
  } else if (day.toLowerCase() === 'today' && officeExists) {
    params[1] = getTodaysDate();
    await ack();
    const attendees = getAttendeesToday(office, params[1]);
    const totalCount = getAttendeesTotalCount(usersAttendingToday, office);
    const verdict = getSafetyVerdict(totalCount, office);
    if (attendees) {
      say(`At present ${attendees} would be attending ${office.toUpperCase()} today. \nThis is *${totalCount}* person(s) in total, the office is *${verdict}*.`);
    } else {
      say(
        `At present no one would be attending ${office.toUpperCase()} today, the office is *safe*`,
      );
    }
  } else if (day.toLowerCase() === 'tomorrow' && officeExists) {
    params[1] = getTomorrowsDate();
    await ack();
    const attendees = getAttendeesTomorrow(office, params[1]);
    const totalCount = getAttendeesTotalCount(usersAttendingTomorrow, office);
    const verdict = getSafetyVerdict(totalCount, office);
    if (attendees) {
      say(`At present ${attendees} would be attending ${office.toUpperCase()} tomorrow. \nThis is *${totalCount}* person(s) in total, the office is *${verdict}*.`);
    } else {
      say(
        `At present no one would be attending ${office.toUpperCase()} tomorrow, the office is *safe*`,
      );
    }
  } else {
    await ack('Ops, make sure you write correctly: dd/mm/yyyy');
  }
};

// /removeme office1 today,tomorrow,dd/MM/yy
const handleRemoveMeRequest = async ({ command, ack, say }) => {
  const params = splitText(command.text);
  const office = params[0];
  const day = params[1];
  const officeExists = checkOffice(office);
  if (params.length === 0) {
    await ack(
      'Ops, looks like you forgot to enter the correct office name and date!',
    );
  } else if (params.length === 1) {
    await ack('Ops, looks like you forgot to enter the date!');
  } else if (day.toLowerCase() === 'today' && officeExists) {
    params[1] = getTodaysDate();
    await ack();
    const removed = removeAttendeeToday(command.user_id, office, params[1]);
    if (removed) {
      say(
        `<@${
          command.user_id
        }> has been removed from the ${office.toUpperCase()} attendees list today`,
      );
    } else {
      say(
        `<@${
          command.user_id
        }> was not on the list to attend ${office.toUpperCase()} today`,
      );
    }
  } else if (day.toLowerCase() === 'tomorrow' && officeExists) {
    params[1] = getTomorrowsDate();
    await ack();
    const removed = removeAttendeeTomorrow(command.user_id, office, params[1]);
    if (removed) {
      say(
        `<@${
          command.user_id
        }> has been removed from the the ${office.toUpperCase()} attendees list tomorrow`,
      );
    } else {
      say(
        `<@${
          command.user_id
        }> was not on the list to attend ${office.toUpperCase()} tomorrow`,
      );
    }
  } else {
    say('Ops, make sure you write correctly: dd/mm/yyyy');
  }
};

// /addme office1 today
const handleAddMeRequest = async ({ command, ack, say }) => {
  const params = splitText(command.text);
  const office = params[0];
  const day = params[1];
  const officeExists = checkOffice(office);
  if (params.length === 0) {
    await ack(
      'Ops, looks like you forgot to enter the correct office name and date!',
    );
  } else if (params.length === 1) {
    await ack('Ops, looks like you forgot to enter the date!');
  } else if (day.toLowerCase() === 'today' && officeExists) {
    params[1] = getTodaysDate();
    await ack();
    const added = addAttendeeToday(command.user_id, office, params[1]);
    if (added) {
      say(
        `<@${
          command.user_id
        }> added to the ${office.toUpperCase()} attendees list today`,
      );
    } else {
      say(
        `<@${
          command.user_id
        }> is already on the list to attend ${(usersAttendingToday.get(command.user_id)).toUpperCase()} today`,
      );
    }
  } else if (day.toLowerCase() === 'tomorrow' && officeExists) {
    params[1] = getTomorrowsDate();
    await ack();
    const added = addAttendeeTomorrow(command.user_id, office, params[1]);
    if (added) {
      say(
        `<@${
          command.user_id
        }> added to the the ${office.toUpperCase()} attendees list tomorrow`,
      );
    } else {
      say(
        `<@${
          command.user_id
        }> is already on the list to attend ${(usersAttendingTomorrow
          .get(command.user_id))
          .toUpperCase()} tomorrow`,
      );
    }
  } else {
    await ack('Ops, make sure you write correctly: dd/mm/yyyy');
  }
};

// /setthreshold office1 12
const handleSetThresholdRequest = async ({ command, ack, say }) => {
  const params = splitText(command.text);
  const office = params[0];
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
    say(`Thanks <@${command.user_id}>. I have set seat threshold for ${office.toUpperCase()} to *${params[1]}*`);
  } else {
    await ack(
      'Ops, make sure your new theshold is a number and the office exists!',
    );
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
  const result = officesThreshold.get(office.toLowerCase());
  console.log(result);
  return result;
}

function getAttendeesToday(office, date) {
  const ids = Array.from(slackIds);
  const attendees = [];
  let result = '';
  ids.forEach((id) => {
    if (usersAttendingToday.get(id) === office.toLowerCase()) attendees.push(id);
  });
  attendees.forEach((attendee) => {
    result += `<@${attendee}>,`;
  });
  return result;
}

function getAttendeesTomorrow(office, date) {
  const ids = Array.from(slackIds);
  const attendees = [];
  let result = '';
  ids.forEach((id) => {
    if (usersAttendingTomorrow.get(id) === office.toLowerCase()) attendees.push(id);
  });
  attendees.forEach((attendee) => {
    result += `<@${attendee}>,`;
  });
  return result;
}

function getAttendeesTotalCount(attendeeMap, office) {
  let count = 0;
  const ids = Array.from(slackIds);
  ids.forEach((id) => {
    if (attendeeMap.get(id) === office.toLowerCase()) count += 1;
  });
  return count;
}

function getSafetyVerdict(count, office) {
  let verdict = 'safe';
  if (count >= officesThreshold.get(office.toLowerCase())) {
    verdict = 'not safe';
  }
  return verdict;
}

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
    slackIds.add(userId);
    return usersAttendingToday.set(userId, office.toLowerCase());
  }
  return false;
}
function addAttendeeTomorrow(userId, office, date) {
  if (!usersAttendingTomorrow.has(userId)) {
    console.log(`Adding ${userId} to attend ${office} on ${date}`);
    slackIds.add(userId);
    return usersAttendingTomorrow.set(userId, office.toLowerCase());
  }
  return false;
}

function setThreshold(office, threshold) {
  console.log(`Setting threshold for ${office} to ${threshold}`);
  officesThreshold.set(office.toLowerCase(), threshold);
}

function checkOffice(input) {
  let office = input;
  if (office) {
    office = office.toLowerCase();
  }
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
