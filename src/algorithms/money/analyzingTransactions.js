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
  const tagSumPath = ['tags', tag];
  const polarity = amount > 0 ? 'incoming' : 'outcoming';
  const currentTagSum = R.path(tagSumPath, analysis) || 0;
  const currentDelta = R.prop('delta', analysis) || 0;
  const currentPolarityValue = R.prop(polarity, analysis) || 0;
  const newTagSum = round2Decimals(currentTagSum + amount);
  const newDelta = round2Decimals(currentDelta + amount);
  const newPolarityValue = round2Decimals(currentPolarityValue + amount);
  return R.compose(
    R.assocPath(tagSumPath, newTagSum),
    R.assoc('delta', newDelta),
    R.assoc(polarity, newPolarityValue),
  )(analysis);
};
const addNeutralTags = (baseAnalysis, uniqueTags) => (
  R.keys(baseAnalysis)
    .reduce((fullAnalysis, timestamp) => {
      const currentAnalysis = baseAnalysis[timestamp];
      const updatedTags = uniqueTags.reduce((result, tag) => {
        const tagValue = currentAnalysis.tags[tag] || 0;
        return R.assoc(tag, tagValue, result);
      }, {});
      const updatedAnalysis = { ...currentAnalysis, tags: updatedTags };
      return R.assoc(timestamp, updatedAnalysis, fullAnalysis);
    }, {})
);
// ----------------------------------
// LOGIC
// ----------------------------------
module.exports = {
  analyzeTransactions: (transactions, filter = null) => {
    const allTags = [];
    const baseAnalysis = transactions.reduce((analysis, transaction) => {
      const { timestamp, amount, tags } = transaction;
      const month = startOfMonth(timestamp);
      const tag = filter ? tagAfterFilter(tags, filter) : tags[0];
      allTags.push(tag);
      const monthLens = R.lens(R.prop(month), R.assoc(month));
      return R.over(monthLens, analyzeTransaction(amount, tag), analysis);
    }, {});
    const uniqueTags = R.uniq(allTags).filter((tag) => tag != null);
    const fullAnalysis = addNeutralTags(baseAnalysis, uniqueTags);
    return fullAnalysis;
  },
};
