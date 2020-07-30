const R = require('ramda');
const { roundNumber2Decimals } = require('../../utils');
const { dateToTimestamp, timestampToDate } = require('../../utils/time');
// ----------------------------------
// HELPERS
// ----------------------------------
function getStartOfNextDay(timestamp) {
  const date = timestampToDate(timestamp);
  date.setHours(0, 0, 0);
  date.setDate(date.getDate() + 1);
  return dateToTimestamp(date);
};
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  getBiMonthlyAnalysis: (start, transactions) => {
    let delta = 0;
    let income = 0;
    let expense = 0;
    let binStart = parseInt(start, 10);
    let binEnd = null;
    const biMonthlyAnalysis = [];
    function analyzeTransaction(amount) {
      delta += amount;
      if (amount > 0) income += amount;
      if (amount < 0) expense += amount;
    }
    function pushAnalysis() {
      biMonthlyAnalysis.push({
        timestamp: binStart,
        delta: roundNumber2Decimals(delta),
        income: roundNumber2Decimals(income),
        expense: roundNumber2Decimals(expense)
      });
      delta = 0;
      income = 0;
      expense = 0;
      binStart = binEnd;
      binEnd = null;
    }
    function binTransactionAnalysis({ timestamp, tags, amount }) {
      if (binEnd != null && timestamp >= binEnd) {
        pushAnalysis();
      } else if (tags[1] === 'paycheck') {
        binEnd = getStartOfNextDay(timestamp);
      }
      analyzeTransaction(amount);
    }
    R.forEach(
      binTransactionAnalysis,
      R.sortBy(R.prop('timestamp'), transactions)
    );
    return biMonthlyAnalysis;
  },
};
