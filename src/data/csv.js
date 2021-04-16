const fs = require('fs');
const parse = require('csv-parse');
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  readCsvFile: (path) => new Promise((resolve) => {
    fs.readFile(path, (readError, fileData) => {
      if (readError) console.error(readError);
      parse(fileData, { columns: true, relaxColumnCount: true }, (parseError, rows) => {
        if (parseError) console.error(parseError);
        resolve(rows);
      });
    });
  }),
  writeCsvFile: ({ path, payload }) => new Promise((resolve) => {
    fs.writeFile(path, payload, 'utf8', resolve);
  }),
};
