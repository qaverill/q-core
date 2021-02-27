const logger = require('@q/logger');
const { deleteTransactions, createTransactions } = require('../crud/money/transactions');
const { tagTransaction, processPayback } = require('../algorithms/money');
const { importBankFacts } = require('../data/bankFacts');
const { importPaybacks } = require('../data/paybacks');
const { importTags } = require('../data/tags');
// ----------------------------------
// HELPERS
// ----------------------------------
const gatherBankFactsAndTags = () => new Promise((resolve) => {
  importBankFacts().then((bankFacts) => {
    importTags().then((tags) => {
      logger.info(`Successfully imported ${bankFacts.length} and tags`);
      resolve({ bankFacts, tags });
    });
  });
});
const tagTransactions = ({ bankFacts, tags }) => (
  bankFacts.map((fact) => tagTransaction(fact, tags))
);
const processPaybacks = async (paybacks) => {
  paybacks.forEach(async (payback) => {
    await processPayback(payback);
  });
  logger.info(`Successfully processed ${paybacks.length} paybacks!`);
};
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  ingestMoney: () => {
    deleteTransactions()
      .then(gatherBankFactsAndTags)
      .then(tagTransactions)
      .then(createTransactions)
      .then(importPaybacks)
      .then(processPaybacks);
  },
};
