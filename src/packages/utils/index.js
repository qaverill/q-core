const R = require('ramda');
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  percentageStringToFloat: (percentageString) => {
    if (percentageString.indexOf('%') < 0) return null;
    const numberString = percentageString.replace('%', '');
    if (R.isNil(numberString)) return null;
    const number = parseInt(numberString, 10);
    if (`${number}` !== numberString) return null;
    if (number < 0 || number > 100) return null;
    return number / 100;
  },
};
