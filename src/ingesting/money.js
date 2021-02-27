const { deleteTransactions, createTransactions } = require('../crud/money/transactions');
const { tagTransactions, processPaybacks } = require('../algorithms/money');
const { importBankFacts } = require('../data/bankFacts');
const { importPaybacks } = require('../data/paybacks');
const { importTags } = require('../data/tags');
// ----------------------------------
// HELPERS
// ----------------------------------
const gatherBankFactsAndTags = () => new Promise((resolve) => {
  importBankFacts().then((bankFacts) => {
    importTags().then((tags) => {
      resolve({ bankFacts, tags });
    });
  });
});
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
