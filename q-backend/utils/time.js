// ----------------------------------
// HELPERS
// ----------------------------------
const ONE_DAY = 86400;
// ----------------------------------
// EXPROTS
// ----------------------------------
module.exports = {
  ONE_DAY,
  timestampToDate: timestamp => new Date(timestamp * 1000),
  dateStringToTimestamp: date => parseInt(new Date(date).getTime() / 1000, 10),
  dateToTimestamp: date => parseInt(date.getTime() / 1000, 10),
  msToFullTime: ms => {
    let seconds = ms / 1000;
    const hours = parseInt(seconds / 3600, 10);
    seconds %= 3600;
    const minutes = parseInt(seconds / 60, 10);
    seconds %= 60;
    const hourTime = hours > 0 ? Math.round(hours) : 0;
    const minuteTime = minutes > 0 ? Math.round(minutes) : 0;
    const secondTime = seconds > 0 ? Math.round(seconds) : 0;
    return `${hourTime}h ${minuteTime}m ${secondTime}s`;
  },
};
