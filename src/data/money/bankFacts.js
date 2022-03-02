const R = require('ramda');
const logger = require('@q/logger');
const { isNotNull } = require('@q/utils');
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
// STATE
// ----------------------------------
// ----------------------------------
// LOGIC
// ----------------------------------
function parseBankFacts(bankFacts) {
  const existingIds = {};
  return bankFacts.map((bankFact) => {
    const parsedFact = {
      ...bankFact,
      amount: parseFloat(bankFact.amount),
      timestamp: parseInt(bankFact.timestamp, 10),
    };
    const id = parsedFact.id || computeFactId(parsedFact);
    if (existingIds[id]) {
      logger.error(`Duplicate id in bankFacts: ${id}`);
      return null;
    }
    existingIds[id] = true;
    return { ...parsedFact, id };
  }).filter(isNotNull);
}
const importExistingBankFacts = (mock) => new Promise((resolve) => {
  const path = mock ? paths.mockBankFacts : paths.bankFacts;
  readCsvFile(path).then(R.compose(
    resolve,
    parseBankFacts,
  ));
});
const importNewBankFacts = (mock) => new Promise((resolve, reject) => {
  const path = mock ? paths.mockBankFactInputs : paths.bankFactInputs;
  readCsvFile(`${path}/citi.csv`).then(parseCiti).then((citiFacts) => {
    readCsvFile(`${path}/mvcu.csv`).then(parseMvcu).then((mvcuFacts) => {
      readCsvFile(`${path}/mvcu_old.csv`).then(parseMvcuOld).then((mvcuOldFacts) => {
        readCsvFile(`${path}/venmo.csv`).then(parseVenmo).then((venmoFacts) => {
          const bankFacts = [...citiFacts, ...mvcuFacts, ...mvcuOldFacts, ...venmoFacts];
          const existingIds = {};
          resolve(R.compose(
            R.reverse,
            R.sortBy(R.prop('timestamp')),
            R.reject(R.isNil),
            R.map((fact) => {
              const id = computeFactId(fact);
              if (existingIds[id]) {
                logger.error(`Duplicate ${fact.account} ids in input: ${JSON.stringify(fact)}`);
                return null;
              }
              existingIds[id] = true;
              return { ...fact, id, description: fact.description.slice(0, 100) };
            }),
            R.filter(factIsNeeded),
          )(bankFacts));
        }).catch(reject);
      });
    });
  });
});
const exportBankFacts = (bankFacts) => new Promise((resolve) => {
  const path = paths.bankFacts;
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
      }) => `${id || ''},${timestamp},${amount},"${description}",${account}`,
      R.sortBy(({ timestamp, amount }) => `${timestamp}${amount}`, bankFacts).reverse(),
    ),
  );
  writeCsvFile({ path, payload: `${header}\n${data}` }).then(resolve);
});
function importBankFacts() {
  return new Promise((resolve) => {
    importExistingBankFacts().then((existingTransactions) => {
      importNewBankFacts().then((newTransactions) => {
        const allFacts = R.reverse(R.sortBy(
          R.prop('timestamp'),
          R.unionWith(R.eqBy(R.prop('id')), existingTransactions, newTransactions),
        ));
        exportBankFacts(allFacts);
        logger.info(`Imported ${allFacts.length} bankFacts`);
        resolve(allFacts);
      });
    });
  });
}
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  mockImportExistingBankFacts: () => importExistingBankFacts(true),
  mockImportNewBankFacts: () => importNewBankFacts(true),
  mockExportBankFacts: (mockBankFacts) => exportBankFacts(mockBankFacts, true),
  importBankFacts,
  mockImportBankFacts: () => module.exports.importBankFacts(true),
};
