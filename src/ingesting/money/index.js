const { deleteTransactions, createTransactions } = require('../../crud/transactions');
const { readPaybacks } = require('../../crud/paybacks');
const { importTransactions } = require('./importing');
const { processMoney } = require('./processing');
// ----------------------------------
// HELPERS
// ----------------------------------
const gatherInputs = () => new Promise((resolve) => {
  importTransactions().then((transactions) => {
    readPaybacks().then((paybacks) => {
      resolve({ transactions, paybacks });
    });
  });
});
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  ingestMoney: () => {
    deleteTransactions()
      .then(gatherInputs)
      .then(processMoney)
      .then(createTransactions);
  },
};
