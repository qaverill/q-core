const fs = require('fs');
const parse = require('csv-parse');
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  readCsvFile: (path) => new Promise((resolve) => {
    fs.readFile(path, (readError, fileData) => {
      parse(fileData, { columns: true }, (parseError, rows) => {
        resolve(rows);
      });
    });
  }),
  writeCsvFile: ({ path, payload }) => new Promise((resolve) => {
    fs.writeFile(path, payload, 'utf8', resolve);
  }),
};
