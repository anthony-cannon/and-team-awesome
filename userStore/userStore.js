/* eslint-disable no-console */
const webClientProvider = require('../providers/webClientProvider');

let users = [];

async function fetchAllUsersFromWorkspace() {
  try {
    users = [];
    const req = await webClientProvider.webClient.users.list();
    req.members.forEach((user) => {
      if (user.id !== 'USLACKBOT' && user.is_bot === false && user.is_app_user === false) {
        users.push(user);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

function getUserList() {
  return users;
}

module.exports = {
  fetchAllUsersFromWorkspace,
  getUserList,
};
