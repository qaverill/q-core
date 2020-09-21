const { tagTransaction } = require('../../ingesting/money/tagging');
const { compileTransactions } = require('./compilingTransactions');
const { getBiMonthlyAnalysis } = require('./analyzingTransactions');
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  tagTransaction,
  compileTransactions,
  getBiMonthlyAnalysis,
};
