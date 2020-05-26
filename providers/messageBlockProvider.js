const messageBlockProvider = {
  getInitialRequestBlock: (nameOfUser) => {
    const replace = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `Hi ${nameOfUser}, Could you please let me know if you are planning to work from an office tomorrow?  \nThese are the differnt commands and parameters to perform different operations`,
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '`/setthreshold`  *(Ada, Turing or Dekker)  (12)* - This would set the office threshold to 12',
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '`/getthreshold`  *(Ada, Turing or Dekker)* - Returns the threshold number for a particular office',
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '`/whosattending`  *(Ada, Turing or Dekker),  (today or tomorrow)* - Returns the number of people attending that office for the day specified',
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '`/removeme`  *(Ada, Turing or Dekker),  (today or tomorrow)* - Removes the current user from an office attendee list.',
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '`/addme`  *(Ada, Turing or Dekker),  (today or tomorrow)* - Adds the current user to the office specified for the day specified',
        },
      },
    ];
    return replace;
  },

};

module.exports = messageBlockProvider;
