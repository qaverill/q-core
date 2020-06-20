const { createQuery } = require('./internal');
const { getDocs } = require('../resources/methods/internal');
const { makeChartData } = require('../resources/music');
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
  handleMusicChartsRequest: async ({ request, response }) => {
    const query = createQuery(request);
    if (cachedQuery === query) {
      response.status(200).json(cachedData);
    } else {
      getDocs({ collection, query })
        .then(async data => {
          setCache(query, data);
          const chartData = await makeChartData(data);
          response.status(200).json(chartData);
        })
        .catch(() => response.status(400).send());
    }
  },
};
