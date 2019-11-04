const discreteTags = {
  dinner: ['Mouse food', '9 TASTES CAMBRIDGE', 'DUMPLING HOUSE CAMBRIDGE', 'POSTMATES', 'Pizza', '🍕', 'borgar'],
  lunch: ['REVIVAL CAFE', 'AUGUSTA SUBS', 'GOGI ON THE BL', 'CHEF LOUIE Cambridge', 'zaaki'],
  coffee: ['DUNKIN', 'PAVEMENT COFFE', 'DARWIN S LTD'],
  dessert: ['JP LICKS', 'INSOMNIA COOKIES'],
  groceries: ['Insta🅱️art', 'TRADER JOE', 'groceries', 'tj', 'Grocery', 'MARKET BASKET'],
  alcohol: ['LIQUORS', 'BELL IN HAND TAVERN', 'DAEDALUS', 'TAVERN IN THE SQUARE', 'Night cap', 'FOUNDRY ON ELM', 'ARAMARK FENWAY', 'booze', '🍷', 'smutty', 'snurf', 'Margaritas', 'truly'],
  travel: ['Snoober', 'uber', 'zoom', 'ubr', 'MBTA'],
  utilities: ['eversource', 'wifi'],
  misc: ['kodak', 'MUSEUM OF SCIENCE'],
  clothes: ['GARMENT DISTRICT', 'ISLANDERS OUTF'],
  'house-hold': ['TARGET', 'BED BATH & BEYOND'],
  furniture: ['Center Chanel Holder'],
  records: ['RECORDS'],
  income: ['Dividend Deposit', 'Deposit TRINETX', 'Check Deposit'],
  'video-games': ['blizzard', 'Microsoft'],
  loans: ['NAVI ED', 'Withdrawal UAS'],
  cash: ['ATM Withdrawal'],
  gas: ['CUMBERLAND FARMS'],
  streaming: ['HULU'],
  events: ['BROWNPAPERTICKETS'],
  movies: ['SOMERVILLE THEATRE'],
  concerts: ['SOFAR SOUNDS']
};

module.exports = {
  autoTagTransaction: transaction => {
    const { tags, amount } = transaction;
    const description = transaction.description.toLowerCase();
    if (description.indexOf('venmo from') > -1) {
      return ['NEEDS ORDINAL'];
    }
    Object.keys(discreteTags).forEach(tagKey => {
      discreteTags[tagKey].forEach(tag => {
        if (description.toLowerCase().indexOf(tag.toLowerCase()) > -1) {
          tags.push(tagKey);
        }
      });
    });
    if (description.indexOf('check withdrawal') > -1 && amount === -1150) tags.push('rent');
    return [...new Set(tags)];
  },
};
