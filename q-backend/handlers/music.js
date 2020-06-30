const R = require('ramda');
const { createQuery } = require('./internal');
const { getDocs } = require('../resources/methods/internal');
const { makeTopPlaysData, makeDailyPlayTimeData } = require('../resources/music');
// ----------------------------------
// HELPERS
// ----------------------------------
const collection = 'listens';
// ----------------------------------
// CACHE
// ----------------------------------
let cachedQuery;
let cachedData;
const setCache = (query, data) => {
  cachedQuery = query;
  cachedData = data;
};
// ----------------------------------
// HANDLERS
// ----------------------------------
module.exports = {
  handleMusicTopPlaysRequest: async ({ request, response }) => {
    const query = createQuery(request);
    if (cachedQuery === query) {
      response.status(200).json(cachedData);
    } else {
      getDocs({ collection, query })
        .then(async data => {
          setCache(query, data);
          const chartData = await makeTopPlaysData(data);
          response.status(200).json(chartData);
        })
        .catch(() => response.status(400).send());
    }
  },
  handleDailyPlayTimeRequest: async ({ request, response }) => {
    const query = createQuery(request);
    const start = R.path(['query', 'start'], request);
    if (cachedQuery === query) {
      console.log('cached!');
      response.status(200).json(cachedData);
    } else {
      getDocs({ collection, query })
        .then(async data => {
          setCache(query, data);
          const dailyPlayTimeData = await makeDailyPlayTimeData(start, data);
          response.status(200).json(dailyPlayTimeData);
        })
        .catch((e) => {
          console.error(e);
          response.status(400).send();
        });
    }
  },
};
