const crypto = require('crypto');
const R = require('ramda');
const { readContentsOfFile } = require('../methods/external');
const { dateStringToTimestamp } = require('../../utils/time');
const { roundNumber2Decimals } = require('../../utils');
const { tagTransaction } = require('./taggingTransactions');
// ----------------------------------
// HELPERS
// ----------------------------------
const START_OF_SEPTEMBER = 1567310400;
const unneededFactDescriptions = [
  'Withdrawal VENMO',
  'Online Transfer',
  'Transfer Withdrawal',
  'ACH Deposit VENMO',
  'ONLINE PAYMENT THANK YOU',
  'PAYMENT THANK YOU',
  'Withdrawal CITI CARD ONLINE',
  'Transfer Deposit From Share',
];
const cleanCSVRow = row => {
  let editableRow = row;
  if (row.indexOf('"') > 0) {
    const firstHalf = row.slice(0, row.indexOf('"'));
    const secondHalf = row.slice(row.lastIndexOf('"') + 1, row.length);
    const cleanedMiddle = row.slice(row.indexOf('"') + 1, row.lastIndexOf('"')).replace(/,/g, '');
    editableRow = firstHalf + cleanedMiddle + secondHalf;
  }
  return editableRow;
};
const generateFactId = ({ account, timestamp, amount, description }) => (
  crypto.createHash('md5')
    .update(account + timestamp + amount + description)
    .digest('hex')
);
// ----------------------------------
// LOGIC
// ----------------------------------
const isFactNeeded = ({ timestamp, amount, description }) => (
  timestamp >= START_OF_SEPTEMBER
  && amount !== 0
  && !new RegExp(R.join('|', R.map(R.toLower, unneededFactDescriptions)))
    .test(R.toLower(description))
);
const parseRow = (line, file) => {
  const row = cleanCSVRow(line).split(',');
  let fact = null;
  if (file === 'mvcu_old.csv') {
    fact = {
      account: row[0].indexOf('S0020') > -1 ? 'mvcu-checkings' : 'mvcu-savings',
      timestamp: dateStringToTimestamp(row[1]),
      amount: roundNumber2Decimals(row[2].indexOf('(') > -1 ? parseFloat(row[2].replace(/[)$(]/g, '')) * -1 : parseFloat(row[2].replace('$', ''))),
      description: row[5],
    };
  } else if (file === 'citi.csv') {
    fact = {
      account: 'citi-credit',
      timestamp: dateStringToTimestamp(row[1]),
      amount: roundNumber2Decimals(row[3] !== '' ? parseFloat(row[3]) * -1 : parseFloat(row[4]) * -1),
      description: row[2].replace(/"/g, ''),
    };
  } else if (file === 'venmo.csv') {
    if (typeof parseInt(row[1], 10) === 'number' && row[3] !== 'Standard Transfer' && row[8] != null) {
      const type = row[8].indexOf('+') > -1 ? 'from' : 'to';
      const description = `Venmo ${type} ${row[6] === 'Quinn Averill' ? row[7] : row[6]}: ${row[5]}`;
      fact = {
        account: 'venmo',
        timestamp: dateStringToTimestamp(row[2]),
        amount: roundNumber2Decimals(parseFloat(row[8].replace(/[ $+]/g, ''))),
        description,
      };
    }
  } else if (file === 'mvcu.csv') {
    fact = {
      account: 'mvcu',
      timestamp: dateStringToTimestamp(row[3]),
      amount: roundNumber2Decimals(parseFloat(row[6].replace(/"/g, '').slice(0, -3))),
      description: row[9],
    };
  }

  if (fact) {
    fact.tags = tagTransaction(fact);
    fact._id = generateFactId(fact);
  }
  return fact;
};
const parseTransactionsFacts = (data, file) => (
  data.split('\n')
    .slice(1, -1)
    .map(line => parseRow(line, file))
    .filter(d => d != null)
);
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  importTransactionData: async () => {
    async function importFile(file) {
      const rawFacts = await readContentsOfFile(file);
      return (
        R.filter(
          isFactNeeded,
          parseTransactionsFacts(rawFacts, file),
        )
      );
    }
    return [
      ...await importFile('citi.csv'),
      ...await importFile('mvcu.csv'),
      ...await importFile('mvcu_old.csv'),
      ...await importFile('venmo.csv'),
    ];
  },
};
