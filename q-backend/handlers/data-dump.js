const { path: pathModule } = require('path');
const fs = require('fs');

const { q_logger } = require('../q-lib');
const { dateToTimestamp } = require('../utils');

const parseRow = (row, source) => {
  // TODO: When description has comma in it, this all get fucks up
  switch (source) {
    case 'mvcu':
      return {
        account: row[0].indexOf('S0020') > -1 ? 'mvcu-checkings' : 'mvcu-savings',
        timestamp: dateToTimestamp(row[1]),
        amount: row[2].indexOf('(') > -1 ? parseFloat(row[2].replace(/[)$(]/g, '')) * -1 : parseFloat(row[2].replace('$', '')),
        description: row[5],
        tags: [],
      };
    case 'citi':
      return {
        account: 'citi-credit',
        timestamp: dateToTimestamp(row[1]),
        amount: row[3] !== '' ? parseFloat(row[3]) * -1 : parseFloat(row[4]) * -1,
        description: row[2].replace(/"/g, ''),
        tags: [],
      };
    case 'venmo':
      if (typeof parseInt(row[1], 10) === 'number' && row[3] !== 'Standard Transfer' && row[8] != null) {
        const type = row[8].indexOf('+') > -1 ? 'from' : 'to';
        return {
          account: 'venmo',
          timestamp: dateToTimestamp(row[2]),
          amount: parseFloat(row[8].replace(/[ $+]/g, '')),
          description: `Venmo ${type} ${row[6] === 'Quinn Averill' ? row[7] : row[6]}: ${row[5]}`,
          tags: [],
        };
      }
      return null;
    default:
      return null;
  }
};

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

const parseTransactionsData = (data, source) => {
  const parsedData = data
    .split('\n')
    .slice(1, -1)
    .map(line => parseRow(cleanCSVRow(line).split(','), source))
    .filter(d => d != null);
  if (parsedData.length === 0) q_logger.error(`Unknown data source found in transactions data: ${source}`);
  return parsedData;
};

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

const isFactNeeded = (fact) => (
  fact.timestamp >= START_OF_SEPTEMBER
  && fact.amount !== 0
  && !new RegExp(unneededFactDescriptions
    .map(d => d.toLowerCase())
    .join('|'))
    .test(fact.description.toLowerCase())
);

// TODO: Move this into the internal handlers instead of it's own "data-dump"
module.exports = {
  readInDataDump: async ({ response }) => {
    let facts = [];
    fs.readdir(pathModule.join(__dirname, 'data-dump'), (readdirError, files) => {
      if (readdirError) {
        response.status(500).send();
        q_logger.error('Cannot read files in data-dump dir');
      }
      files.forEach(file => {
        fs.readFile(pathModule.join(__dirname, `./data-dump/${file}`), 'UTF-8', (readFileError, data) => {
          if (readFileError) return q_logger.error(`Cannot read data in ${file}.csv`);
          facts.push(parseTransactionsData(data, file.slice(0, -4)));
          if (facts.length === files.length) {
            facts = [].concat(...facts).filter(fact => isFactNeeded(fact));
            response.status(200)
              .json({ items: facts.sort((a, b) => ((a.timestamp > b.timestamp) ? -1 : 1)) });
          }
        });
      });
    });
  },
};
