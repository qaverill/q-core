const { timeframeRead } = require('../mongo');
// ----------------------------------
// HELPERS
// ----------------------------------
const collection = 'listens';
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  readListens: (timeframe) => timeframeRead({ timeframe, collection }),
};
