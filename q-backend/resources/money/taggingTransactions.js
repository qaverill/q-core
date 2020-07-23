// ----------------------------------
// HELPERS
// ----------------------------------
const RENT_AMOUNT = -1150;
// TODO: this should really be saved in a file and read into memory only when needed
const factTags = {
  food: {
    breakfast: ['TST* AREA FOUR RESTAUR', 'Donovan: Breakfast'],
    dinner: {
      sushi: ['SUSHI', 'THELONIOUS MONKFI', 'SAKANA', 'TAKEMURA RESTAURANT'],
      ramen: ['GRUBHUBHOKKAIDORAMENS'],
      indian: ['Indian from like two', 'Schoppe: Desi', 'Mouse food',],
      thai: ['Spicies', 'Thai 🍲', 'THELONIOUS MONKFI CAMBRIDGE', '9 TASTES CAMBRIDGE', 'THAI CUSINE', 'THAI CUISINE'],
      foodies: ['Orfanos', 'U pays at du pays'],
      chinese: ['DUMPLING HOUSE',],
      italian: ['Spoodles', 'BASTA PASTA'],
      subs: ['CAMBRIDGE DELI & GRILL CAMBRIDGE'],
      pizza: ['Romanoff: ZA', 'Bizza', 'Binocchios bizza', 'Pizza', '🍕', 'Lanctot: Za'],
      miscDinner: ['Green dragon', 'POSTMATES', 'VEGGIE GRILL HAR OLO', 'Curry fries'],
      burgers: ['F26674 WINDHAM', 'BBC CAMBRIDGE CAMBRIDGE', 'TASTY BURGER', 'Burger co', 'borgar', 'MOATMOUNTAINSMOKEHOUSE'],
      spanish: ['FELIPES TAQUERIA CAMBRIDGE', 'BORDER CAFE CAMBRIDGE', 'Las Olas', 'MI TIERRA RESTAURANT'],
      fancyDinner: ['Sams bornt day', 'The day of my birth'],
    },
    lunch: {
      cpd200: ['SQ *200 CAMBRIDGE PARK'],
      foodTrucks: ['MOYZILLA', 'SA PA Boston', 'SATE GRILL Cambridge', 'GOGI ON THE BL', 'CHEF LOUIE Cambridge', 'zaaki', 'AUGUSTA SUBS'],
      revival: ['REVIVAL CAFE'],
      miscLunch: ['Boat foods', 'Lunch'],
      lunchOut: ['Time Out Market', 'ye moodle narket', 'DUCK FAT'],
    },
    brunch: ['Brunch'],
    dessert: ['ZINNEKENS CAMBRIDGE', 'JP LICKS', 'INSOMNIA COOKIES'],
    groceries: {
      wholeFoods: ['Wf 3-', 'Pork shoulder for carnitas', 'Ho foods', 'WHOLEFDS RVR'],
      traderJoes: ['Trader Howies', 'TRADER JOE', 'tj', 'Apples from god'],
      marketBasket: ['Double bucket', 'Insta never again', 'Market bucket 🍖 run', 'supplies from the bucket', 'Insta🅱️art', 'MARKET BASKET'],
      hMart: ['BibimBAP', 'Hmart', 'H MART'],
      unknownGroceryStore: ['Grocery', 'Fujdddddddd', 'Once a fan always a fan', 'Food stuff', 'Skinner: Groceries'],
      surreySt: ['SURREY ST. MARKET'],
      stopAndShop: ['Stop and shop'],
      costco: ['Costco', '👏🏻 sponges 👏🏻 and 👏🏻 stock 👏🏻'],
      convenienceSores: ['UNIVERSITY MARKET CAMBRIDGE'],
      shaws: ['STAR MARKET', 'SHAWS'],
    },
    drunkFood: ['TST* EL JEFE', 'ALEPPO PALACE', 'DOG HOUSE BOSTON'],
    snacks: ['Mercier: Chocolate bar', 'CVS/PHARMACY #00240', 'PARIS BAGUETTE E15', 'TATTE BAKERY'],
  },
  drinks: {
    coffee: ['ATOMIC BEAN CA Cambridge', 'Coofie', 'DUNKIN', 'PAVEMENT COFFE', 'DARWIN S LTD'],
    tea: ['STASH TEA'],
    alcohol: {
      brewery: ['Leap beer', 'LAMPLIGHTER BREWIN', 'AUSTIN STREET BREWERY', 'DEFINITIVE BREWING', 'ALLAGASH BREWING', 'TRILLIUM BREWING'],
      liquorStore: ['yea: 🍷 & 🥖', 'rson: 🍷', 'Schoppe: Snurfs', 'Skinner: Smutty', 'Truly shipment', 'Lanctot: Truly', 'DANA HILL LIQUORS', 'The goodies', 'Sweet treat', 'THE CITY TOBACCO & BEV', 'Keith stone and juicy boys', 'A few cooking wines and a trip to the doctor', 'Skinner: Treehouse','TOTAL WINE AND MORE', 'Maple syrup and mimosas', 'LIQUOR STORE', 'BEER & WINE', 'WALGREENS #10378 EAST HAMPSTEA', 'SUPREME LIQUORS CAMBRIDGE', 'HANNAFORD #8190 HAMPSTEAD NH', 'Boat brews and ice', 'Liquor haul', 'Merlot'],
      bars: ['LOLITA COCINA', 'WHISKEY STEAKHOUSE', 'Margaritas ay caramba', 'Alden and Harlow', 'RUSSELL HOUSE TAVERN', 'JAMISONS HAMPSTEAD', 'GREEN STREET CAMBRIDGE', 'PASTA LOFT E HAMPSTEAD', 'Hennessy\'s Boston', 'TST* GOURMET INDIA', 'BROADSIDE BOSTON', 'Skinner: Greeny', 'SQ *SQ *SOWA BOSTO', 'MIDDLE EAST RESTAURANT', 'The Harp Boston', 'SQU*SQ *THE PEOPLE', 'Dranks', 'SCHOLAR', 'BELL IN HAND TAVERN', 'DAEDALUS', 'TAVERN IN THE SQUARE', 'Night cap', 'FOUNDRY ON ELM', 'ARAMARK FENWAY'],
    },
  },
  travel: {
    bikes: ['BLUEBIKES'],
    commuterRail: ['MBTA'],
    subway: [],
    ride: {
      uber: ['Schoppe: Ubr', 'Snoober', 'uber', 'Santa’s sleigh rides'],
      lyft: ['Lyft', 'Zoom zoom'],
    },
  },
  living: {
    wifi: ['wifi'],
    cellphone: ['cell'],
    utilities: ['Rigs and the oven', 'eversource', 'utils'],
    houseHold: ['TARGET', 'BED BATH & BEYOND', 'me MAGPIE'],
    airFilter: ['GI8IM8UE3'],
    cleaningSupplies: ['mouth guard cleaner', 'Drain juice'],
    pharmacy: ['RITE AID STORE'],
    furniture: ['MO75G5MB0', 'W78VQ4M33', 'HE6EP2P83', '7V6RQ99T3', 'WS8OK6P73', 'Q85IO03M3', 'X399867X3', '8Q9QG9SJ3', 'Center Chanel Holder'],
    gas: ['EXXONMOBIL', 'CUMBERLAND FARMS'],
    laundry: ['Qworters', 'Quarters', 'Kwarters'],
    rent: ['Skinner: Blowjob', 'Roont', 'ACH Withdrawal BOSTON LUXURY'],
    healthCare: ['shaver AMAZON', 'patchouli AMZN', 'WN0GX5B13', 'L66H83GF3', '5Q96J9DR3', 'OT1LO79C3', 'ARMOR GUARD LLC 8884755215', 'JULIAN LENZI HOSPI', 'TUFTS MC PO BOSTON'],
    hairCut: ['SUPERCUTS 2 PLAISTOW'],
    kitchenWare: {
      drinking: ['scotch glasses me', 'CD85Q4WS3'],
      cooking: ['HD1SJ6J53'],
    },
  },
  clothing: {
    online: {
      territoryAhead: ['TERRITORY AHEAD'],
      vissla: ['VISSLA'],
      poler: ['POLER STUFF'],
      music: ['ters: SHIRTTTTT', 'SANDBAG LTD/W.A.S.T.E READING', 'SP * TOROYMOI'],
      a24: ['SP * A24 SHOP'],
      amazon: ['6R4C17P03', 'clothes AMZN'],
    },
    inStore: ['RENYS WELLS -9464', 'MUJI NEWBURY 617502117', 'T J MAXX', 'GARMENT DISTRICT', 'ISLANDERS OUTF', 'FORSAKE BOSTON MA'],
  },
  income: {
    savingsInterest: ['Dividend Deposit'],
    cashBack: ['ACH Deposit CITICARDS CASH'],
    paycheck: ['Deposit TRINETX'],
    check: ['Check Deposit'],
    random: ['CITIBANK CONDITIONAL CREDIT FOR DISPUTE', 'Premera Blue Cross Customer Data Security Breach'],
    taxes: ['ACH Deposit COMM. OF MASS.', 'ACH Deposit IRS TREAS 310 taxes'],
    stimulusCheck: ['ACH Deposit IRS TREAS 310 stimulus'],
  },
  loans: {
    UAS: ['ACH Withdrawal UAS'],
    navient: ['NAVI ED'],
    heartland: ['ACH Withdrawal EDUCATIONAL COMP'],
  },
  mail: ['USPS PO 2401020139'],
  cash: ['Bih', 'Cooooover', 'ATM Withdrawal', 'Cash Withdrawal'],
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
  vices: {
    weed: ['And for driving all the way out', 'Flanagan: Thanks'],
    paraphenilia: ['NU7HD7BX3', 'pax part', 'pipe AMZN'],
    condoms: ['condoms'],
  },
  fun: {
    events: {
      event: ['MUSEUM OF SCIENCE', 'Greeeen juice season'],
      beerFestival: ['BROWNPAPERTICKETS', 'How far can ya crawllll'],
      movies: ['APPLE CINEMAS FRESH', 'ARCLIGHT CINEMAS BOSTO', 'ROYAL 2 CAMBRIDGE', 'SOMERVILLE THEATRE', 'REGAL CINEMAS'],
      shows: ['INNER WAVE DIVINO', 'SOFAR SOUNDS', 'TM *THUNDERCAT', 'ORPHEUM THEATER BOSTON'],
      blackMountain: ['F shack', 'Db supplies and breakfast'],
      escapeRooms: ['BODA BORG'],
    },
    hobbies: {
      pictures: ['kodak', 'CVS/PHARMACY #08319'],
      musicGear: ['GL3OF9403', 'M16E76XP3', 'guitar pics', '1M37C19F3', 'GUITAR CENTER'],
      videoGames: ['blizzard', 'Microsoft', 'MOJANG STOCKHOLM SWE'],
      records: ['RECORDS'],
      computerParts: ['MO5DK4S00', '295AB3OQ3', 'N62Z52OA3', 'WWW.RAZER.COM SAN FRANCISCO', 'MICRO CENTER', 'nner: Windforce', 'Skinner: Oops this too prob'],
      art: ['FISK GALLERY', 'GOODWILL CAMBRIDGE 506'],
      housePlants: ['plant supplies AMZN', 'Zz top', 'PILL HARDWARE CAMBRIDGE', 'DICKSON BROS TRUE VALU CAMBRIDGE MA', 'me SQ *SQ *THE HAPPY CACT'],
      movies: ['VIMEO.COM 646-470-8422', 'pink floyd dvd'],
      surfing: ['SURFARI MANCHESTER'],
      candles: ['drip candles'],
    },
  },
  karma: {
    sam: ['scotch glasses sam', 'HOMEBREW EMPORIUM CAMBRIDGE', '6F5F15NJ3'],
    friends: ['Lord Hobo Cambridge karma'],
    rosalie: ['DK7PS4A73', 'For Rosalie 🌹', 'STAPLES 00109074 PLAISTOW', 'STATELINE PET SUPPLY PLAISTOW', 'NINTENDO *AMERICAUS', 'rosalie SQ *SQ *THE HAPPY CACT', 'rosalie MAGPIE'],
    tyler: ['scotch glasses tyler', 'SUR LA TABLE #123', 'Skinner: fork'],
    madre: ['MAHONEYS GARDEN CENTER', 'SQUARE *SQ *ABODE'],
    annie: ['TRILLIUM annie BREWING', 'SQU*SQ *CURIO SPICE', 'TREEHOUSEBREW.COM 4139491891', 'SP * LAMPLIGHTER BREWI 2076503325'],
    friendGroup: ['Lord Hobo Cambridge MA karma', 'karma CAPO'],
    daddy: ['7532M4NX3', 'CL73N0133'],
    cousins: ['PAPAGINOS'],
  },
  unknown: ['DAVIS SQUARE'],
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
