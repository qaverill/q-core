const { deleteTransactions, createTransactions } = require('../crud/money/transactions');
const { tagTransactions } = require('../algorithms/tagTransactions');
const { processPaybacks } = require('../algorithms/processPaybacks');
const { importBankFacts } = require('../data/bankFacts');
const { importPaybacks } = require('../data/paybacks');
// ----------------------------------
// PROCEDURE
// ----------------------------------
module.exports = {
  ingestMoney: () => {
    deleteTransactions()
      .then(importBankFacts)
      .then(tagTransactions)
      .then(createTransactions)
      .then(importPaybacks)
      .then(processPaybacks);
  },
};
