const logger = require('@q/logger');
const { deleteTransaction, updateTransaction, readTransaction } = require('../crud/money/transactions');
// ----------------------------------
// HELPERS
// ----------------------------------
const validateFrom = ({ from, fromTransaction }) => {

}
// ----------------------------------
// LOGIC
// ----------------------------------
const tagTransaction = (fact, tags) => {
  // TODO: tag fact and return it
};
// TODO: test me!
const processPayback = ({ from, to }) => new Promise((resolve, reject) => {
  readTransaction(from).then((fromTransaction) => {
    if (fromTransaction == null) throw new Error(`From transaction ${from} does not exist!`);
    const { amount: fromAmount } = fromTransaction;
    if (fromAmount < 0) throw new Error(`From transaction ${from} must have a positive amount`);
    readTransaction(to).then((toTransaction) => {
      if (toTransaction == null) throw new Error(`To transaction ${to} does not exist!`);
      const { amount: toAmount } = toTransaction;
      if (toAmount > 0) throw new Error(`toAmount must be less than 0 ---- toAmount: ${toAmount}`);
      const newAmount = toAmount + fromAmount;
      if (newAmount > 0) throw new Error(`newAmount must be less than 0 ---- newAmount: ${newAmount}`);
      deleteTransaction(from).then(() => {
        updateTransaction({ id: to, amount: toAmount + fromAmount }).then(resolve);
      });
    }).catch(reject);
  }).catch(reject);
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
