const fs = require('fs');
const paths = require('./paths.json');
// ----------------------------------
// EXPORTS
// ----------------------------------
// no need to mock, there is no exporting involved so import away!
module.exports = {
  importTags: () => JSON.parse(fs.readFileSync(paths.tags), 'utf-8'),
};
