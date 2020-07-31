const R = require('ramda');
const { roundNumber2Decimals } = require('../../utils');
const { dateToTimestamp, timestampToDate } = require('../../utils/time');
// ----------------------------------
// HELPERS
// ----------------------------------
function getStartOfNextDay(timestamp) {
  const date = timestampToDate(timestamp);
  date.setDate(date.getDate() + 1);
  date.setHours(0, 0, 0);
  return dateToTimestamp(date);
};
// ----------------------------------
// LOGIC
// ----------------------------------
let delta, incomes, expenses, binStart, binEnd, biMonthlyAnalysis;
function flushBiMonthlyAnalysis() {
  delta = 0;
  incomes = {};
  expenses = {};
  binStart = null;
  binEnd = null;
}
function analyzeTransaction({ amount, tags }) {
  delta += amount;
  if (amount > 0) {
    const key = tags[1];
    if (R.isNil(incomes[key])) incomes[key] = 0;
    incomes[key] = roundNumber2Decimals(incomes[key] + amount);
  };
  if (amount < 0) {
    const key = tags[0];
    if (R.isNil(expenses[key])) expenses[key] = 1;
    expenses[key] = roundNumber2Decimals(expenses[key] + amount);
  };
}
function pushAnalysis() {
  biMonthlyAnalysis.push({ timestamp: binStart, delta, incomes, expenses });
  flushBiMonthlyAnalysis();
  binStart = binEnd;
}
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  getBiMonthlyAnalysis: transactions => {
    flushBiMonthlyAnalysis();
    biMonthlyAnalysis = [];
    R.forEach(({ timestamp, tags, amount }) => {
      if (binStart === null) binStart = parseInt(timestamp, 10);
      if (binEnd != null && timestamp >= getStartOfNextDay(binEnd)) pushAnalysis();
      if (tags[1] === 'paycheck') binEnd = timestamp;
      if (tags[0] !== 'payBack') analyzeTransaction({ amount, tags });
    }, transactions);
    return biMonthlyAnalysis;
  },
};
