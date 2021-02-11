const { mongoFind, timeframeToQuery } = require('../mongo');
// ----------------------------------
// HELPERS
// ----------------------------------
const collection = 'listens';
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  readListens: (timeframe = {}) => mongoFind(timeframeToQuery(timeframe), collection),
};
