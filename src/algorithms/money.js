const R = require('ramda');
const { deleteTransaction, updateTransaction, readTransaction } = require('../crud/money/transactions');
// ----------------------------------
// HELPERS
// ----------------------------------
const gatherTransactions = R.compose(
  R.reduce((p, fn) => p.then(fn), Promise.resolve([])),
  R.map(({ from, to }) => (acc) => new Promise((resolve) => {
    readTransaction(from).then((fromTransaction) => {
      readTransaction(to).then((toTransaction) => {
        resolve([...acc, {
          from, fromTransaction, to, toTransaction,
        }]);
      });
    });
  })),
);
const validatePaybackTransactions = (paybackTransactions) => {
  paybackTransactions.forEach(({
    from, fromTransaction, to, toTransaction,
  }) => {
    if (fromTransaction == null) throw new Error(`From transaction ${from} does not exist!`);
    if (fromTransaction.amount < 0) throw new Error(`From transaction ${from} must have a positive amount`);
    if (toTransaction == null) throw new Error(`To transaction ${to} does not exist!`);
    if (toTransaction.amount > 0) throw new Error(`toAmount must be less than 0 ---- toAmount: ${toTransaction.amount}`);
    const newAmount = toTransaction.amount + fromTransaction.amount;
    if (newAmount > 0) throw new Error(`newAmount must be less than 0 ---- newAmount: ${newAmount}`);
  });
  return paybackTransactions;
};
const processPaybackTransactions = R.compose(
  R.reduce((p, fn) => p.then(fn), Promise.resolve()),
  R.map(({ fromTransaction, toTransaction }) => () => new Promise((resolve) => {
    deleteTransaction(fromTransaction.id).then(() => {
      const newAmount = toTransaction.amount + fromTransaction.amount;
      updateTransaction({ id: toTransaction.id, amount: newAmount })
        .then(resolve);
    });
  })),
);
// ----------------------------------
// LOGIC
// ----------------------------------
const tagTransaction = (fact, tags) => {
  // TODO: tag fact and return it
};
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  gatherTransactions,
  processPaybacks: (paybacks) => (
    gatherTransactions(Array.isArray(paybacks) ? paybacks : [paybacks])
      .then(validatePaybackTransactions)
      .then(processPaybackTransactions)
  ),
  tagTransactions: ({ bankFacts, tags }) => bankFacts.map(
    (bankFact) => tagTransaction(bankFact, tags),
  ),
};
