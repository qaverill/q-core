const R = require('ramda');
const logger = require('@q/logger');
const { readCsvFile, writeCsvFile } = require('../csv');
const paths = require('./paths.json');
const {
  parseCiti,
  parseMvcu,
  parseMvcuOld,
  parseVenmo,
  computeFactId,
  factIsNeeded,
} = require('../../algorithms/money/parsingBankFacts');
// ----------------------------------
// HELPERS
// ----------------------------------
const importExistingBankFacts = (mock) => new Promise((resolve, reject) => {
  const path = mock ? paths.mockBankFacts : paths.bankFacts;
  readCsvFile(path).then((bankFacts) => {
    const existingIds = [];
    resolve(R.pipe(
      bankFacts,
      R.map((fact) => {
        const parsedFact = {
          ...fact,
          amount: parseFloat(fact.amount),
          timestamp: parseInt(fact.timestamp, 10),
        };
        const id = parsedFact.id || computeFactId(parsedFact);
        if (existingIds.includes(id)) {
          logger.error(`Duplicate ids in bankFacts: ${id}`);
          return null;
        }
        existingIds.push(id);
        return { ...parsedFact, id };
      }),
      R.reject(R.isNil),
    ));
  }).catch(reject);
});
const importNewBankFacts = (mock) => new Promise((resolve, reject) => {
  const path = mock ? paths.mockBankFactInputs : paths.bankFactInputs;
  readCsvFile(`${path}/citi.csv`).then(parseCiti).then((citiFacts) => {
    readCsvFile(`${path}/mvcu.csv`).then(parseMvcu).then((mvcuFacts) => {
      readCsvFile(`${path}/mvcu_old.csv`).then(parseMvcuOld).then((mvcuOldFacts) => {
        readCsvFile(`${path}/venmo.csv`).then(parseVenmo).then((venmoFacts) => {
          const bankFacts = [...citiFacts, ...mvcuFacts, ...mvcuOldFacts, ...venmoFacts];
          const existingIds = [];
          resolve(R.pipe(
            bankFacts,
            R.filter(factIsNeeded),
            R.map((fact) => {
              const id = computeFactId(fact);
              if (existingIds.includes(id)) {
                logger.error(`Duplicate ${fact.account} ids in input: ${JSON.stringify(fact)}`);
                return null;
              }
              existingIds.push(id);
              return { ...fact, id };
            }),
            R.reject(R.isNil),
          ));
        }).catch(reject);
      });
    });
  });
});
const exportBankFacts = (bankFacts, mock) => new Promise((resolve) => {
  const path = mock ? paths.mockBankFacts : paths.bankFacts;
  const header = 'id,timestamp,amount,description,account';
  const data = R.join(
    '\n',
    R.map(
      ({
        id,
        timestamp,
        amount,
        description,
        account,
      }) => `${id},${timestamp},${amount},${description},${account}`,
      R.sortBy(R.prop('timestamp'), bankFacts),
    ),
  );
  writeCsvFile({ path, payload: `${header}\n${data}` }).then(resolve);
});
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  mockImportExistingBankFacts: () => importExistingBankFacts(true),
  mockImportNewBankFacts: () => importNewBankFacts(true),
  mockExportBankFacts: (mockBankFacts) => exportBankFacts(mockBankFacts, true),
  importBankFacts: (mock) => new Promise((resolve) => {
    importExistingBankFacts(mock).then((existingTransactions) => {
      importNewBankFacts(mock).then((newTransactions) => {
        const allFacts = R.sortBy(
          R.prop('timestamp'),
          R.unionWith(R.eqBy(R.prop('id')), newTransactions, existingTransactions),
        );
        exportBankFacts(allFacts, mock);
        resolve(allFacts);
      });
    });
  }),
  mockImportBankFacts: () => module.exports.importBankFacts(true),
};
