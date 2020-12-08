const R = require('ramda');
const { roundNumber2Decimals } = require('../../utils');
// ----------------------------------
// LOGIC
// ----------------------------------
let delta, incomes, expenses, binStart, biMonthlyAnalysis;
function flushBiMonthlyAnalysis() {
  delta = 0;
  incomes = {};
  expenses = {};
  binStart = null;
}
function analyzeTransaction({ amount, tags }) {
  delta = roundNumber2Decimals(delta + amount);
  if (amount > 0) {
    const key = tags[1];
    if (R.isNil(incomes[key])) incomes[key] = 0;
    incomes[key] = roundNumber2Decimals(incomes[key] + amount);
  };
  if (amount < 0) {
    const key = tags[0];
    if (R.isNil(expenses[key])) expenses[key] = 0;
    expenses[key] = roundNumber2Decimals(expenses[key] + amount);
  };
}
function pushAnalysis() {
  biMonthlyAnalysis.push({ timestamp: binStart, delta, incomes, expenses });
  flushBiMonthlyAnalysis();
}
function isPaycheck(tags) {
  return tags[1] === 'paycheck';
}
function isPayback(tags) {
  return tags[0] === 'payback';
}
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  getBiMonthlyAnalysis: transactions => {
    flushBiMonthlyAnalysis();
    biMonthlyAnalysis = [];
    R.forEach(({ timestamp, tags, amount }) => {
      if (isPaycheck(tags)) {
        if (binStart) pushAnalysis();
        binStart = timestamp;
      }
      if (!isPayback(tags)) analyzeTransaction({ amount, tags});
    }, transactions);
    pushAnalysis();
    return biMonthlyAnalysis;
  },
};
