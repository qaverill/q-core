const { importTransactionData } = require('./importingTransactions');
const { tagTransaction } = require('./taggingTransactions');
const { ingestTransactions } = require('./ingestingTransactions');
const { getBiMonthlyAnalysis } = require('./analyzingTransactions');
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  importTransactionData,
  tagTransaction,
  ingestTransactions,
  getBiMonthlyAnalysis,
};
