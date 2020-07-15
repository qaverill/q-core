// ----------------------------------
// HELPERS
// ----------------------------------
const RENT_AMOUNT = -1150;
// TODO: this should really be saved in a file and read into memory only when needed
const factTags = {
  food: {
    dinner: {
      sushi: ['SAKANA CAMBRIDGE',],
      indian: ['Mouse food',],
      thai: ['9 TASTES CAMBRIDGE',],
      foodies: ['Orfanos',],
      chinese: ['DUMPLING HOUSE',],
      italian: ['BASTA PASTA',],
      pizza: ['Binocchios bizza', 'Pizza', '🍕',],
      unknownDinner: ['POSTMATES',],
      burgers: ['borgar'],
    },
    lunch: {
      foodTrucks: ['MOYZILLA', 'SA PA Boston', 'SATE GRILL Cambridge', 'GOGI ON THE BL', 'CHEF LOUIE Cambridge', 'zaaki'],
      revival: ['REVIVAL CAFE'],
      unknownLunch: ['Lunch', 'AUGUSTA SUBS', 'DUCK FAT'],
    },
    brunch: ['Brunch'],
    dessert: ['ZINNEKENS CAMBRIDGE', 'JP LICKS', 'INSOMNIA COOKIES'],
    groceries: {
      wholeFoods: ['Ho foods', 'WHOLEFDS RVR'],
      traderJoes: ['Trader Howies', 'TRADER JOE', 'tj',],
      marketBasket: ['supplies from the bucket', 'Insta🅱️art', 'MARKET BASKET'],
      hMart: ['H MART'],
      unknownGroceryStore: ['Food stuff', 'groceries', 'Grocery'],
      surreySt: ['SURREY ST. MARKET'],
    },
    lateNightFood: ['EL JEFE\'S TAQUERI', 'ALEPPO PALACE'],
  },
  drinks: {
    coffee: ['Coofie', 'DUNKIN', 'PAVEMENT COFFE', 'DARWIN S LTD'],
    alcohol: {
      brewery: ['LAMPLIGHTER BREWIN', 'AUSTIN STREET BREWERY', 'DEFINITIVE BREWING', 'ALLAGASH BREWING', 'TRILLIUM BREWING'],
      liquorStore: ['Liquor haul', 'Merlot'],
      bars: ['MIDDLE EAST RESTAURANT', 'The Harp Boston', 'SQU*SQ *THE PEOPLE', 'Dranks', 'SCHOLAR', 'BELL IN HAND TAVERN', 'DAEDALUS', 'TAVERN IN THE SQUARE', 'Night cap', 'FOUNDRY ON ELM', 'ARAMARK FENWAY'],
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
    houseHold: ['TARGET', 'BED BATH & BEYOND'],
    pharmacy: ['RITE AID STORE'],
    furniture: ['Center Chanel Holder'],
    gas: ['CUMBERLAND FARMS'],
    laundry: ['Qworters', 'Quarters'],
  },
  fun: {
    pictures: ['kodak'],
    events: ['MUSEUM OF SCIENCE'],
  },
  clothing: {
    online: {
      territoryAhead: ['TERRITORY AHEAD'],
      vissla: ['VISSLA'],
      poler: ['POLER STUFF'],
      music: ['SANDBAG LTD/W.A.S.T.E READING', 'SP * TOROYMOI'],
    },
    inStore: ['GARMENT DISTRICT', 'ISLANDERS OUTF', 'FORSAKE BOSTON MA'],
  },
  income: {
    savingsInterest: ['Dividend Deposit'],
    paycheck: ['Deposit TRINETX'],
    check: ['Check Deposit'],
    random: ['Premera Blue Cross Customer Data Security Breach'],
  },
  loans: {
    UAS: ['ACH Withdrawal UAS'],
    navient: ['NAVI ED'],
    heartland: ['ACH Withdrawal EDUCATIONAL COMP'],
  },
  cash: ['ATM Withdrawal', 'Cash Withdrawal'],
  subscriptions: {
    memberships: {
      amazonPrime: ['Amazon Prime'],
      patreon: ['CKO*PATREON* MEMBERSHI'],
    },
    streaming: {
      hulu: ['HULU'],
      hbo: ['HELP.HBOMAX.COM'],
    },
  },
  events: {
    festivals: ['BROWNPAPERTICKETS'],
    movies: ['SOMERVILLE THEATRE', 'Parasites', 'Movie tickets', 'REGAL CINEMAS'],
    shows: ['SOFAR SOUNDS'],
    blackMountain: ['F shack', 'Db supplies and breakfast'],
  },
  hobbies: {
    musicGear: ['GUITAR CENTER'],
    videoGames: ['blizzard', 'Microsoft'],
    records: ['RECORDS'],
    computerParts: ['MICRO CENTER'],
    art: ['FISK GALLERY'],
  },
  rent: ['Roont', 'ACH Withdrawal BOSTON LUXURY'],
  karma: {
    sam: ['HOMEBREW EMPORIUM CAMBRIDGE'],
    friends: ['Lord Hobo Cambridge karma'],
  },
};
// ----------------------------------
// LOGIC
// ----------------------------------
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
  tagTransaction: fact => {
    const { description, amount } = fact;
    if (description.toLowerCase().includes('venmo from')) {
      return ['payBack'];
    }
    if (description.includes('Check Withdrawal') && amount === RENT_AMOUNT) {
      return ['rent'];
    }
    return tagTransaction(fact, factTags, null);
  },
  testTagTransaction: (fact, tags, label) => tagTransaction(fact, tags, label),
};
