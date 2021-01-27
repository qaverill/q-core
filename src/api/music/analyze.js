const { currentTimeframe } = require('@q/time');
const { readListens } = require('./crud');
// ----------------------------------
// LOGIC
// ----------------------------------
const buildAnalysis = (listens) => {
  const analysis = listens;
  return analysis;
};
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  analyzeMusic: (timeframe) => new Promise((resolve) => {
    readListens(timeframe || currentTimeframe()).then((listens) => {
      const analysis = buildAnalysis(listens);
      resolve(analysis);
    });
  }),
};
