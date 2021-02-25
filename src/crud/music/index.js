const { mongoFind, timeframeToQuery } = require('../mongo');
// ----------------------------------
// HELPERS
// ----------------------------------
const collection = 'listens';
// ----------------------------------
// CRUD mssql TOBE
// ----------------------------------
module.exports = {
  readListens: (timeframe = {}) => mongoFind(timeframeToQuery(timeframe), collection),
};
