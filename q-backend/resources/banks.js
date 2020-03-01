const crypto = require('crypto');

const { getDirFiles, readDataFile } = require('./methods/external');
const { dateToTimestamp } = require('../utils');

const START_OF_SEPTEMBER = 1567310400;

// TODO: this should really be saved in a file and read into memory only when needed
const factTags = {
  food: {
    dinner: ['Orfanos', 'Binocchios bizza', 'DUMPLING HOUSE', 'Mouse food', '9 TASTES CAMBRIDGE', 'DUMPLING HOUSE CAMBRIDGE', 'POSTMATES', 'Pizza', '🍕', 'borgar'],
    lunch: ['Lunch', 'SATE GRILL Cambridge', 'SA PA Boston', 'MOYZILLA', 'REVIVAL CAFE', 'AUGUSTA SUBS', 'GOGI ON THE BL', 'CHEF LOUIE Cambridge', 'zaaki'],
    brunch: ['Brunch'],
    dessert: ['JP LICKS', 'INSOMNIA COOKIES'],
    groceries: ['Trader Howies', 'supplies from the bucket', 'Food stuff', 'H MART', 'Insta🅱️art', 'TRADER JOE', 'groceries', 'tj', 'Grocery', 'MARKET BASKET'],
    lateNightFood: ['EL JEFE\'S TAQUERI', 'ALEPPO PALACE'],
  },
  drinks: {
    coffee: ['Coofie', 'DUNKIN', 'PAVEMENT COFFE', 'DARWIN S LTD'],
    alcohol: {
      brewery: ['TRILLIUM BREWING'],
      liquorStore: ['Merlot'],
      bars: ['Dranks', 'SCHOLAR', 'BELL IN HAND TAVERN', 'DAEDALUS', 'TAVERN IN THE SQUARE', 'Night cap', 'FOUNDRY ON ELM', 'ARAMARK FENWAY'],
    },
  },
  travel: {
    bikes: ['BLUEBIKES'],
    commuterRail: ['MBTA'],
    subway: [],
    ride: {
      uber: ['Snoober', 'uber'],
      lyft: ['Lyft'],
    },
  },
  living: {
    wifi: ['wifi'],
    cellphone: ['cell'],
    utilities: ['eversource', 'utils'],
  },
  fun: {
    pictures: ['kodak'],
    events: ['MUSEUM OF SCIENCE'],
  },
  clothing: {
    online: ['TERRITORY AHEAD'],
    inStore: ['GARMENT DISTRICT', 'ISLANDERS OUTF'],
  },
  houseHold: ['TARGET', 'BED BATH & BEYOND'],
  furniture: ['Center Chanel Holder'],
  records: ['RECORDS'],
  income: {
    savingsInterest: ['Dividend Deposit'],
    paycheck: ['Deposit TRINETX'],
    check: ['Check Deposit'],
  },
  videoGames: ['blizzard', 'Microsoft'],
  loans: ['NAVI ED', 'Withdrawal UAS'],
  cash: ['ATM Withdrawal', 'Cash Withdrawal'],
  laundry: ['Qworters', 'Quarters'],
  gas: ['CUMBERLAND FARMS'],
  subscriptions: {
    memberships: ['Amazon Prime'],
    streaming: ['HULU'],
  },
  events: {
    festivals: ['BROWNPAPERTICKETS'],
    movies: ['SOMERVILLE THEATRE', 'Parasites', 'Movie tickets'],
    shows: ['SOFAR SOUNDS'],
    blackMountain: ['F shack', 'Db supplies and breakfast'],
  },
  musicGear: ['GUITAR CENTER'],
  rent: ['Roont'],
};

const autoTagFact = (fact, tags, parentTag) => {
  const { description, amount } = fact;
  if (description.includes('venmo from')) {
    return ['payBack'];
  }
  if (description.includes('Check Withdrawal') && amount === '-1150') {
    return ['rent'];
  }
  if (Array.isArray(tags)) {
    return [...new Set(
      tags.map(keyWord => (
        description.toLowerCase().includes(keyWord.toLowerCase())
          ? parentTag
          : null
      )).filter(tag => tag != null),
    )];
  }
  return [...new Set(Object.keys(tags).flatMap(subTag => {
    const possibleTag = autoTagFact(fact, tags[subTag], subTag);
    return possibleTag.length > 0 ? [parentTag, ...possibleTag] : null;
  }).filter(tag => tag != null))];
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
      };
      fact.tags = autoTagFact(fact, factTags, null);
      fact._id = generateFactId(fact);
      return fact;
    case 'citi.csv':
      fact = {
        account: 'citi-credit',
        timestamp: dateToTimestamp(row[1]),
        amount: row[3] !== '' ? parseFloat(row[3]) * -1 : parseFloat(row[4]) * -1,
        description: row[2].replace(/"/g, ''),
      };
      fact.tags = autoTagFact(fact, factTags, null);
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
        fact.tags = autoTagFact(fact, factTags, null);
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
  testAutoTagDoc: (fact, tags, label) => autoTagFact(fact, tags, label),
};
