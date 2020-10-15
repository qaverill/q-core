const R = require('ramda');
const { roundNumber2Decimals } = require('../../utils');
// ----------------------------------
// HELPERS
// ----------------------------------
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  compileTransactions: (transactions, paybacks) => {
    const froms = R.map(R.prop('from'), paybacks);
    const tos = R.map(R.prop('to'), paybacks);
    function ingestedTransaction(transaction) {
      const { _id, amount } = transaction;
      if (froms.includes(_id)) return null;
      if (tos.includes(_id)) {
        const adjustedAmount = amount + R.sum(R.map(R.prop('amount'), R.filter(p => p.to === _id, paybacks)));
        return { ...transaction, amount: roundNumber2Decimals(adjustedAmount) };
      }
      return transaction;
    }

    return R.reverse(
      R.sortBy(
        R.prop('timestamp'),
        R.reject(
          R.isNil,
          R.map(
            ingestedTransaction,
            transactions,
          ),
        ),
      ),
    );
  },
};
