const logger = require('@q/logger');
const { deleteTransactions, updateTransactions, readTransactions } = require('../crud/money/transactions');
// ----------------------------------
// HELPERS
// ----------------------------------
const tagTransaction = (fact, tags) => {
  // TODO: tag fact and return it
};
// TODO: test me!
const processPayback = ({ to, from, amount }) => new Promise((resolve) => {
  deleteTransactions(from)
    .then((rowsAffected) => {
      if (rowsAffected !== [1]) {
        throw new Error(`From transaction ${from} does not currently exist!`);
      }
      readTransactions(to)
        .then(({ amount: originalAmount }) => {
          updateTransactions({ id: to, amount: originalAmount - amount })
            .then(resolve);
        });
    });
});
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  processPayback,
  processPaybacks: async (paybacks) => {
    paybacks.forEach(async (payback) => {
      await processPayback(payback);
    });
    logger.info(`Successfully processed ${paybacks.length} paybacks!`);
  },
  tagTransactions: ({ bankFacts, tags }) => bankFacts.map((fact) => tagTransaction(fact, tags)),
};
