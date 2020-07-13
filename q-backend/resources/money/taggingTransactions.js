// ----------------------------------
// HELPERS
// ----------------------------------
const START_OF_SEPTEMBER = 1567310400;
const RENT_AMOUNT = '-1150';
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
// ----------------------------------
// ALGORITHMS
// ----------------------------------
const isFactNeeded = fact => (
  fact.timestamp >= START_OF_SEPTEMBER
  && fact.amount !== 0
  && !new RegExp(unneededFactDescriptions
    .map(d => d.toLowerCase())
    .join('|'))
    .test(fact.description.toLowerCase())
);
const tagTransaction = (fact, tags, parentTag) => {
  const lowercaseDescription = fact.description.toLowerCase();
  if (Array.isArray(tags)) {
    return [...new Set(
      tags.map(keyWord => (
        lowercaseDescription.includes(keyWord.toLowerCase())
          ? parentTag
          : null
      )).filter(tag => tag != null),
    )];
  }
  return [...new Set(Object.keys(tags).flatMap(subTag => {
    const possibleTag = tagTransaction(fact, tags[subTag], subTag);
    return possibleTag.length > 0 ? [parentTag, ...possibleTag] : null;
  }).filter(tag => tag != null))];
};
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  isFactNeeded,
  tagTransaction: fact => {
    const { description, amount } = fact;
    if (description.includes('venmo from')) {
      return ['payBack'];
    }
    if (description.includes('Check Withdrawal') && amount === RENT_AMOUNT) {
      return ['rent'];
    }
    return tagTransaction(fact, factTags, null);
  },
  testTagTransaction: (fact, tags, label) => tagTransaction(fact, tags, label),
};
