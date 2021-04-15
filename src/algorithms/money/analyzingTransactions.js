const R = require('ramda');
const { startOfMonth } = require('@q/time');
const { round2Decimals } = require('@q/utils');
// ----------------------------------
// HELPERS
// ----------------------------------
const emptyAnalysis = {
  monthlyTagSums: {},
  monthlyDeltas: {},
};
const tagAfterFilter = (tags, filter) => {
  const indexOfFilter = tags.indexOf(filter);
  return indexOfFilter === tags.length - 1 ? tags[indexOfFilter] : tags[indexOfFilter + 1];
};
const sumTag = (amount, tag) => (currentSum) => {
  const sum = round2Decimals(currentSum && currentSum[tag] ? currentSum[tag] + amount : amount);
  return R.assoc(tag, sum, currentSum);
};
const sumDetla = (amount) => (currentSum) => (
  round2Decimals(currentSum == null ? amount : currentSum + amount)
);
// ----------------------------------
// LOGIC
// ----------------------------------
module.exports = {
  analyzeTransactions: (transactions, filter = null) => (
    transactions.reduce((analysis, transaction) => {
      const { monthlyTagSums, monthlyDeltas } = analysis;
      const { timestamp, amount, tags } = transaction;
      const month = startOfMonth(timestamp);
      const tag = filter ? tagAfterFilter(tags, filter) : tags[0];
      const monthLens = R.lens(R.prop(month), R.assoc(month));
      return {
        monthlyTagSums: R.over(monthLens, sumTag(amount, tag), monthlyTagSums),
        monthlyDeltas: R.over(monthLens, sumDetla(amount), monthlyDeltas),
      };
    }, emptyAnalysis)
  ),
};
