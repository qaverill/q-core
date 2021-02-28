const R = require('ramda');
const { deleteTransaction, updateTransaction, readTransaction } = require('../crud/money/transactions');
// ----------------------------------
// HELPERS
// ----------------------------------
const gatherTransactions = R.compose(
  R.reduce((p, fn) => p.then(fn), Promise.resolve([])),
  R.map(({ from, to }) => (acc) => new Promise((resolve) => {
    if (R.isNil(from) || R.isNil(to)) throw new Error(`Must provide a ${R.isNil(from) ? 'from' : 'to'} field!`);
    readTransaction(from).then((fromTransaction) => {
      readTransaction(to).then((toTransaction) => {
        resolve([...acc, { from, fromTransaction, to, toTransaction }]);
      });
    });
  })),
);
// ----------------------------------
// LOGIC
// ----------------------------------
const fullyValidatePaybacks = (paybacks) => new Promise((resolve, reject) => {
  const existingFroms = [];
  try {
    paybacks.forEach(({ from }) => {
      if (existingFroms.includes(from)) throw new Error(`From ${from} already exists, they cannot be used twice!`);
      existingFroms.push(from);
    });
    gatherTransactions(paybacks)
      .then((paybackTransactions) => {
        const transactions = {};
        paybackTransactions.forEach(({ from, fromTransaction, to, toTransaction }) => {
          if (fromTransaction == null) throw new Error(`From transaction ${from} does not exist!`);
          if (toTransaction == null) throw new Error(`To transaction ${to} does not exist!`);
          transactions[fromTransaction.id] = fromTransaction;
          transactions[toTransaction.id] = toTransaction;
        });
        paybacks.forEach(({ from, to }) => {
          if (transactions[from].amount < 0) throw new Error(`From transaction ${from} must have a positive amount`);
          if (transactions[to].amount > 0) throw new Error(`toAmount must be less than 0 ---- toAmount: ${transactions[to].amount}`);
          transactions[to].amount += transactions[from].amount;
          if (transactions[to].amount >= 0) throw new Error(`newAmount must be less than 0 ---- newAmount: ${transactions[to].amount}`);
        });
        resolve(paybacks);
      })
      .catch(reject);
  } catch (e) {
    reject(e);
  }
});
const processPaybackTransactions = R.compose(
  R.reduce((p, fn) => p.then(fn), Promise.resolve()),
  R.map(({ from, to }) => () => new Promise((resolve) => {
    readTransaction(from).then((fromTransaction) => {
      readTransaction(to).then((toTransaction) => {
        deleteTransaction(fromTransaction.id).then(() => {
          const newAmount = toTransaction.amount + fromTransaction.amount;
          updateTransaction({ id: toTransaction.id, amount: newAmount })
            .then(resolve);
        });
      });
    });
  })),
);
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  processPaybacks: (paybacks) => (
    fullyValidatePaybacks(Array.isArray(paybacks) ? paybacks : [paybacks])
      .then(processPaybackTransactions)
  ),
};
