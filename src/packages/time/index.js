// ----------------------------------
// HELPERS
// ----------------------------------
const timestampToDate = (timestamp) => new Date(timestamp * 1000);
const dateToTimestamp = (date) => parseInt(date.getTime() / 1000, 10);
const getNDaysAgoTimestamp = (N) => {
  const date = new Date();
  date.setDate(date.getDate() - N);
  return dateToTimestamp(date);
};
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  timestampToDate,
  dateToTimestamp,
  getNDaysAgoTimestamp,
  currentTimeframe: () => ({
    start: getNDaysAgoTimestamp(3),
    end: null,
  }),
};
