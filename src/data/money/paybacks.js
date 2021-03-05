const R = require('ramda');
const { readCsvFile, writeCsvFile } = require('../csv');
const paths = require('./paths.json');
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  importPaybacks: (mock) => new Promise((resolve) => {
    const path = mock ? paths.mockPaybacks : paths.paybacks;
    readCsvFile(path).then(resolve);
  }),
  exportPaybacks: (paybacks, mock) => new Promise((resolve) => {
    const path = mock ? paths.mockPaybacks : paths.paybacks;
    const header = 'from,to';
    const data = R.join(
      '\n',
      R.map(
        ({ from, to }) => `${from},${to}`,
        R.sortBy(R.prop('to'), paybacks),
      ),
    );
    writeCsvFile({ path, payload: `${header}\n${data}` }).then(resolve);
  }),
  mockImportPaybacks: () => module.exports.importPaybacks(true),
  mockExportPaybacks: (paybacks) => module.exports.exportPaybacks(paybacks, true),
};
