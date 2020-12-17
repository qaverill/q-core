const config = require('../config');
// ----------------------------------
// HELPERS
// ----------------------------------

// ----------------------------------
// EXPROTS
// ----------------------------------
module.exports = {
  generateRandomString: length => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i += 1) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  },
  roundNumber2Decimals: num => +((num).toFixed(2)),
  getMinTimestamp: objectsWithTimestampProp => Math.min(...objectsWithTimestampProp.map(item => item.timestamp)), // ramda me
};
