const R = require('ramda');
const { startOfMonth } = require('@q/time');
const { round2Decimals } = require('@q/utils');
// ----------------------------------
// HELPERS
// ----------------------------------
const tagAfterFilter = (tags, filter) => {
  const indexOfFilter = tags.indexOf(filter);
  return indexOfFilter === tags.length - 1 ? tags[indexOfFilter] : tags[indexOfFilter + 1];
};
const analyzeTransaction = (amount, tag) => (analysis) => {
  const currentTagSum = R.path(['byTag', tag], analysis) || 0;
  const currentDelta = R.prop('delta', analysis) || 0;
  const newTagSum = round2Decimals(currentTagSum + amount);
  const newDelta = round2Decimals(currentDelta + amount);
  return R.compose(
    R.assocPath(['byTag', tag], newTagSum),
    R.assoc('delta', newDelta),
  )(analysis);
};
// ----------------------------------
// LOGIC
// ----------------------------------
module.exports = {
  analyzeTransactions: (transactions, filter = null) => (
    transactions.reduce((analysis, transaction) => {
      const { timestamp, amount, tags } = transaction;
      const month = startOfMonth(timestamp);
      const tag = filter ? tagAfterFilter(tags, filter) : tags[0];
      const monthLens = R.lens(R.prop(month), R.assoc(month));
      return R.over(monthLens, analyzeTransaction(amount, tag), analysis);
    }, {})
  ),
};
