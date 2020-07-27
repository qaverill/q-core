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
    let netAmount = 0;
    let binStart = parseInt(start, 10);
    let binEnd = null;
    const biMonthlyAnalysis = [];
    function binTransactionAnalysis({ timestamp, tags, amount }) {
      if (binEnd != null && timestamp >= binEnd) {
        biMonthlyAnalysis.push({ date: binStart, netAmount: roundNumber2Decimals(netAmount) });
        netAmount = amount;
        binStart = binEnd;
        binEnd = null;
      } else {
        netAmount += amount;
        if (tags[1] === 'paycheck') {
          binEnd = getStartOfNextDay(timestamp);
        }
      }
    }
    R.forEach(
      binTransactionAnalysis,
      R.sortBy(R.prop('timestamp'), transactions)
    );
    return biMonthlyAnalysis;
  },
};
