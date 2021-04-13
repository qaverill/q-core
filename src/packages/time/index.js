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
const parseInput = (number) => parseInt(number, 10) || null;
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  timestampToDate,
  dateToTimestamp,
  dateStringToTimestamp: (date) => parseInt(new Date(date).getTime() / 1000, 10),
  getNDaysAgoTimestamp,
  currentTimeframe: () => ({
    start: getNDaysAgoTimestamp(3),
    end: null,
  }),
  requestToTimeframe: (request) => {
    const { start, end } = request.query;
    return { start: parseInput(start), end: parseInput(end) };
  },
  startOfMonth: (timestamp) => {
    const date = timestampToDate(timestamp);
    date.setUTCDate(1);
    date.setUTCHours(0, 0, 0);
    date.setMilliseconds(0);
    return date.getTime() / 1000;
  },
};
