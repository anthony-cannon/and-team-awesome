const messageBlockProvider = {
  getInitialRequestBlock: (nameOfUser) => {
    const replace = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `Hi ${nameOfUser}, Could you please let me know if you are planning to work from an office tomorrow? \n Please respond with yes or no. If yes, please state the name of the department(e.g. Ada, Turing etc) whose office you intend to work from.`,
        },
      },
    ];
    return replace;
  },

};

module.exports = messageBlockProvider;
