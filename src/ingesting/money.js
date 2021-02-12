const { deleteTransactions, createTransactions } = require('../crud/money/transactions');
const { deletePaybacks, createPaybacks } = require('../crud/money/paybacks');
const { createTags, deleteTags } = require('../crud/money/tags');
const { processMoney } = require('../algorithms/money');
const { importBankFacts } = require('../data/bankFacts');
const { importPaybacks } = require('../data/paybacks');
const { importTags } = require('../data/tags');
// ----------------------------------
// HELPERS
// ----------------------------------
const clearLastIngestion = () => new Promise((resolve) => {
  deleteTransactions()
    .then(deletePaybacks)
    .then(deleteTags)
    .then(resolve);
});
const gatherInputs = () => new Promise((resolve) => {
  importBankFacts().then((bankFacts) => {
    importPaybacks().then((paybacks) => {
      importTags().then((tags) => {
        resolve({ bankFacts, paybacks, tags });
      });
    });
  });
});
const ingest = ({ bankFacts, paybacks, tags }) => {
  const transactions = processMoney(bankFacts, paybacks);
  createTransactions(transactions);
  createPaybacks(paybacks);
  createTags(tags);
};
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  ingestMoney: () => {
    clearLastIngestion()
      .then(gatherInputs)
      .then(ingest);
  },
};
