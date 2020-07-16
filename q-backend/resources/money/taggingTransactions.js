// ----------------------------------
// HELPERS
// ----------------------------------
const RENT_AMOUNT = -1150;
// TODO: this should really be saved in a file and read into memory only when needed
const factTags = {
  food: {
    breakfast: ['TST* AREA FOUR RESTAUR', 'Breakfast'],
    dinner: {
      sushi: ['THELONIOUS MONKFI', 'SAKANA', 'TAKEMURA RESTAURANT'],
      ramen: ['GRUBHUBHOKKAIDORAMENS'],
      indian: ['Schoppe: Desi', 'Mouse food',],
      thai: ['THELONIOUS MONKFI CAMBRIDGE', '9 TASTES CAMBRIDGE', 'THAI CUSINE', 'THAI CUISINE'],
      foodies: ['Orfanos', 'U pays at du pays'],
      chinese: ['DUMPLING HOUSE',],
      italian: ['BASTA PASTA',],
      subs: ['CAMBRIDGE DELI & GRILL CAMBRIDGE'],
      pizza: ['Bizza', 'Binocchios bizza', 'Pizza', '🍕',],
      miscDinner: ['POSTMATES', 'VEGGIE GRILL HAR OLO', 'Curry fries'],
      burgers: ['borgar', 'MOATMOUNTAINSMOKEHOUSE'],
      spanish: ['Las Olas', 'MI TIERRA RESTAURANT'],
      fancyDinner: ['Sams bornt day'],
    },
    lunch: {
      cpd200: ['SQ *200 CAMBRIDGE PARK'],
      foodTrucks: ['MOYZILLA', 'SA PA Boston', 'SATE GRILL Cambridge', 'GOGI ON THE BL', 'CHEF LOUIE Cambridge', 'zaaki', 'AUGUSTA SUBS'],
      revival: ['REVIVAL CAFE'],
      miscLunch: ['Boat foods', 'Lunch'],
      lunchOut: ['ye moodle narket', 'DUCK FAT']
    },
    brunch: ['Brunch'],
    dessert: ['ZINNEKENS CAMBRIDGE', 'JP LICKS', 'INSOMNIA COOKIES'],
    groceries: {
      wholeFoods: ['Wf 3-', 'Pork shoulder for carnitas', 'Ho foods', 'WHOLEFDS RVR'],
      traderJoes: ['Trader Howies', 'TRADER JOE', 'tj', 'Apples from god'],
      marketBasket: ['Market bucket 🍖 run', 'supplies from the bucket', 'Insta🅱️art', 'MARKET BASKET'],
      hMart: ['H MART'],
      unknownGroceryStore: ['Food stuff', 'groceries', 'Grocery'],
      surreySt: ['SURREY ST. MARKET'],
      stopAndShop: ['Stop and shop'],
      costco: ['👏🏻 sponges 👏🏻 and 👏🏻 stock 👏🏻'],
    },
    drunkFood: ['EL JEFE\'S TAQUERI', 'ALEPPO PALACE', 'DOG HOUSE BOSTON'],
    snacks: ['CVS/PHARMACY #00240', 'PARIS BAGUETTE E15', 'TATTE BAKERY'],
  },
  drinks: {
    coffee: ['Coofie', 'DUNKIN', 'PAVEMENT COFFE', 'DARWIN S LTD'],
    alcohol: {
      brewery: ['Leap beer', 'LAMPLIGHTER BREWIN', 'AUSTIN STREET BREWERY', 'DEFINITIVE BREWING', 'ALLAGASH BREWING', 'TRILLIUM BREWING'],
      liquorStore: ['TOTAL WINE AND MORE', 'Maple syrup and mimosas', 'LIQUOR STORE', 'BEER & WINE', 'WALGREENS #10378 EAST HAMPSTEA', 'SUPREME LIQUORS CAMBRIDGE', 'HANNAFORD #8190 HAMPSTEAD NH', 'Boat brews and ice', 'Liquor haul', 'Merlot'],
      bars: ['Hennessy\'s Boston', 'TST* GOURMET INDIA', 'BROADSIDE BOSTON', 'Skinner: Greeny', 'SQ *SQ *SOWA BOSTO', 'MIDDLE EAST RESTAURANT', 'The Harp Boston', 'SQU*SQ *THE PEOPLE', 'Dranks', 'SCHOLAR', 'BELL IN HAND TAVERN', 'DAEDALUS', 'TAVERN IN THE SQUARE', 'Night cap', 'FOUNDRY ON ELM', 'ARAMARK FENWAY'],
    },
  },
  travel: {
    bikes: ['BLUEBIKES'],
    commuterRail: ['MBTA'],
    subway: [],
    ride: {
      uber: ['Snoober', 'uber', 'Santa’s sleigh rides'],
      lyft: ['Lyft'],
    },
  },
  living: {
    wifi: ['wifi'],
    cellphone: ['cell'],
    utilities: ['Rigs and the oven', 'eversource', 'utils'],
    houseHold: ['TARGET', 'BED BATH & BEYOND', 'me MAGPIE'],
    pharmacy: ['RITE AID STORE'],
    furniture: ['Center Chanel Holder'],
    gas: ['CUMBERLAND FARMS'],
    laundry: ['Qworters', 'Quarters', 'Kwarters'],
    rent: ['Roont', 'ACH Withdrawal BOSTON LUXURY'],
    healthCare: ['JULIAN LENZI HOSPI', 'TUFTS MC PO BOSTON'],
  },
  clothing: {
    online: {
      territoryAhead: ['TERRITORY AHEAD'],
      vissla: ['VISSLA'],
      poler: ['POLER STUFF'],
      music: ['SANDBAG LTD/W.A.S.T.E READING', 'SP * TOROYMOI'],
      a24: ['SP * A24 SHOP'],
    },
    inStore: ['MUJI NEWBURY 617502117', 'T J MAXX', 'GARMENT DISTRICT', 'ISLANDERS OUTF', 'FORSAKE BOSTON MA'],
  },
  income: {
    savingsInterest: ['Dividend Deposit'],
    cashBack: ['ACH Deposit CITICARDS CASH'],
    paycheck: ['Deposit TRINETX'],
    check: ['Check Deposit'],
    random: ['Premera Blue Cross Customer Data Security Breach'],
    taxes: ['ACH Deposit COMM. OF MASS.', 'ACH Deposit IRS TREAS 310 taxes'],
    stimulusCheck: ['ACH Deposit IRS TREAS 310 stimulus'],
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
      patreon: ['HIATUS KAIYOTE PRESTON', 'CKO*PATREON* MEMBERSHI'],
    },
    streaming: {
      hulu: ['HULU'],
      hbo: ['HELP.HBOMAX.COM'],
    },
  },
  events: {
    event: ['MUSEUM OF SCIENCE'],
    festivals: ['BROWNPAPERTICKETS'],
    movies: ['SOMERVILLE THEATRE', 'Parasites', 'Movie tickets', 'REGAL CINEMAS'],
    shows: ['SOFAR SOUNDS', 'TM *THUNDERCAT', 'ORPHEUM THEATER BOSTON'],
    blackMountain: ['F shack', 'Db supplies and breakfast'],
  },
  weed: ['And for driving all the way out', 'Flanagan: Thanks'],
  hobbies: {
    pictures: ['kodak', 'CVS/PHARMACY #08319'],
    musicGear: ['GUITAR CENTER'],
    videoGames: ['blizzard', 'Microsoft', 'MOJANG STOCKHOLM SWE'],
    records: ['RECORDS'],
    computerParts: ['WWW.RAZER.COM SAN FRANCISCO', 'MICRO CENTER', 'Venmo to Skinner: Windforce', 'Skinner: Oops this too prob'],
    art: ['FISK GALLERY', 'GOODWILL CAMBRIDGE 506'],
    housePlants: ['PILL HARDWARE CAMBRIDGE', 'DICKSON BROS TRUE VALU CAMBRIDGE MA', 'me SQ *SQ *THE HAPPY CACT'],
    movies: ['VIMEO.COM 646-470-8422'],
  },
  karma: {
    sam: ['HOMEBREW EMPORIUM CAMBRIDGE'],
    friends: ['Lord Hobo Cambridge karma'],
    rosalie: ['STAPLES 00109074 PLAISTOW', 'STATELINE PET SUPPLY PLAISTOW', 'NINTENDO *AMERICAUS', 'rosalie SQ *SQ *THE HAPPY CACT', 'rosalie MAGPIE'],
    tyler: ['SUR LA TABLE #123', 'Skinner: fork'],
    madre: ['MAHONEYS GARDEN CENTER', 'SQUARE *SQ *ABODE'],
    annie: ['TRILLIUM annie BREWING', 'SQU*SQ *CURIO SPICE', 'TREEHOUSEBREW.COM 4139491891', 'SP * LAMPLIGHTER BREWI 2076503325'],
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
