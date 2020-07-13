const crypto = require('crypto');
const { getDirFiles, readDataFile } = require('../methods/external');
const { dateToTimestamp } = require('../../utils');
const { isFactNeeded, tagTransaction } = require('./taggingTransactions');
// ----------------------------------
// HELPERS
// ----------------------------------
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

const parseRow = ({ line, file }) => {
  const row = cleanCSVRow(line).split(',');
  let fact;
  switch (file) {
    case 'mvcu.csv':
      fact = {
        account: row[0].indexOf('S0020') > -1 ? 'mvcu-checkings' : 'mvcu-savings',
        timestamp: dateToTimestamp(row[1]),
        amount: row[2].indexOf('(') > -1 ? parseFloat(row[2].replace(/[)$(]/g, '')) * -1 : parseFloat(row[2].replace('$', '')),
        description: row[5],
      };
      fact.tags = tagTransaction(fact);
      fact._id = generateFactId(fact);
      return fact;
    case 'citi.csv':
      fact = {
        account: 'citi-credit',
        timestamp: dateToTimestamp(row[1]),
        amount: row[3] !== '' ? parseFloat(row[3]) * -1 : parseFloat(row[4]) * -1,
        description: row[2].replace(/"/g, ''),
      };
      fact.tags = tagTransaction(fact);
      fact._id = generateFactId(fact);
      return fact;
    case 'venmo.csv':
      if (typeof parseInt(row[1], 10) === 'number' && row[3] !== 'Standard Transfer' && row[8] != null) {
        const type = row[8].indexOf('+') > -1 ? 'from' : 'to';
        const description = `Venmo ${type} ${row[6] === 'Quinn Averill' ? row[7] : row[6]}: ${row[5]}`;
        fact = {
          account: 'venmo',
          timestamp: dateToTimestamp(row[2]),
          amount: parseFloat(row[8].replace(/[ $+]/g, '')),
          description,
        };
        fact.tags = tagTransaction(fact);
        fact._id = generateFactId(fact);
        return fact;
      }
      return null;
    default:
      return null;
  }
};

const parseTransactionsData = ({ data, file }) => data
  .split('\n')
  .slice(1, -1)
  .map(line => parseRow({ line, file }))
  .filter(d => d != null);

module.exports = {
  getBankFacts: () => new Promise((resolve, reject) => {
    const facts = [];
    getDirFiles()
      .then(files => {
        files.forEach(file => {
          readDataFile({ file })
            .then(data => {
              facts.push(parseTransactionsData({ data, file }).filter(isFactNeeded));
              if (facts.length === files.length) {
                resolve([].concat(...facts));
              }
            })
            .catch(reject);
        });
      })
      .catch(reject);
  }),
  tagTransaction,
};
