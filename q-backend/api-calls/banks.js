const crypto = require('crypto');

const { getDirFiles, readDataFile } = require('../api-calls/methods/external');
const { dateToTimestamp } = require('../utils');

const START_OF_SEPTEMBER = 1567310400;

const factTags = {
  dinner: ['DUMPLING HOUSE', 'Mouse food', '9 TASTES CAMBRIDGE', 'DUMPLING HOUSE CAMBRIDGE', 'POSTMATES', 'Pizza', '🍕', 'borgar'],
  lunch: ['SATE GRILL Cambridge', 'SA PA Boston', 'MOYZILLA', 'REVIVAL CAFE', 'AUGUSTA SUBS', 'GOGI ON THE BL', 'CHEF LOUIE Cambridge', 'zaaki'],
  coffee: ['Coofie', 'DUNKIN', 'PAVEMENT COFFE', 'DARWIN S LTD'],
  dessert: ['JP LICKS', 'INSOMNIA COOKIES'],
  'late-night-food': ['EL JEFE\'S TAQUERI', 'ALEPPO PALACE'],
  groceries: ['H MART', 'Insta🅱️art', 'TRADER JOE', 'groceries', 'tj', 'Grocery', 'MARKET BASKET'],
  alcohol: ['BEER & WINE', 'LIQUOR', 'Dranks', 'SCHOLAR', 'TRILLIUM BREWING', 'LIQUORS', 'BELL IN HAND TAVERN', 'DAEDALUS', 'TAVERN IN THE SQUARE', 'Night cap', 'FOUNDRY ON ELM', 'ARAMARK FENWAY', 'booze', '🍷', 'smutty', 'snurf', 'Margaritas', 'truly'],
  travel: ['Lyft', 'BLUEBIKES', 'Snoober', 'uber', 'zoom', 'ubr', 'MBTA'],
  utilities: ['eversource', 'wifi', 'utils', 'cell'],
  misc: ['kodak', 'MUSEUM OF SCIENCE'],
  clothes: ['TERRITORY AHEAD', 'GARMENT DISTRICT', 'ISLANDERS OUTF'],
  'house-hold': ['TARGET', 'BED BATH & BEYOND'],
  furniture: ['Center Chanel Holder'],
  records: ['RECORDS'],
  income: ['Dividend Deposit', 'Deposit TRINETX', 'Check Deposit'],
  'video-games': ['blizzard', 'Microsoft'],
  loans: ['NAVI ED', 'Withdrawal UAS'],
  cash: ['ATM Withdrawal', 'Cash Withdrawal'],
  gas: ['CUMBERLAND FARMS'],
  streaming: ['HULU'],
  subscriptions: ['Amazon Prime'],
  events: ['BROWNPAPERTICKETS'],
  movies: ['SOMERVILLE THEATRE'],
  concerts: ['SOFAR SOUNDS'],
  'music-gear': ['GUITAR CENTER'],
};

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
  crypto
    .createHash('md5')
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
        tags: [],
      };
      fact._id = generateFactId(fact);
      return fact;
    case 'citi.csv':
      fact = {
        account: 'citi-credit',
        timestamp: dateToTimestamp(row[1]),
        amount: row[3] !== '' ? parseFloat(row[3]) * -1 : parseFloat(row[4]) * -1,
        description: row[2].replace(/"/g, ''),
        tags: [],
      };
      fact._id = generateFactId(fact);
      return fact;
    case 'venmo.csv':
      if (typeof parseInt(row[1], 10) === 'number' && row[3] !== 'Standard Transfer' && row[8] != null) {
        const type = row[8].indexOf('+') > -1 ? 'from' : 'to';
        fact = {
          account: 'venmo',
          timestamp: dateToTimestamp(row[2]),
          amount: parseFloat(row[8].replace(/[ $+]/g, '')),
          description: `Venmo ${type} ${row[6] === 'Quinn Averill' ? row[7] : row[6]}: ${row[5]}`,
          tags: [],
        };
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
    getDirFiles({ dir: 'banks' })
      .then(files => {
        files.forEach(file => {
          readDataFile({ file: `banks/${file}` })
            .then((data) => {
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
  autoTagBankDocs: docs => {
    return docs.map(doc => {
      const taggedDoc = { ...doc, tags: [] };
      if (doc.description.includes('venmo from')) {
        taggedDoc.tags.push('pay-back');
      } else {
        Object.keys(factTags).forEach(tagKey => {
          factTags[tagKey].forEach(tag => {
            if (doc.description.toLowerCase().includes(tag.toLowerCase())) {
              taggedDoc.tags.push(tagKey);
              taggedDoc.tags.push(tag);
            }
          });
        });
      }
      return taggedDoc;
    })
  }
};
