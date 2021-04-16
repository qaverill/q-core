const logger = require('@q/logger');
const { deleteTransactions, createTransactions } = require('../crud/money/transactions');
const { tagTransactions } = require('../algorithms/money/tagTransactions');
const { processPaybacks } = require('../algorithms/money/processPaybacks');
const { importBankFacts } = require('../data/money/bankFacts');
const { importPaybacks } = require('../data/money/paybacks');
// ----------------------------------
// PROCEDURE
// ----------------------------------
module.exports = {
  ingestMoney: () => {
    const start = new Date().getTime();
    logger.info('Starting money ingestion...');
    deleteTransactions()
      .then(() => importBankFacts())
      .then((bankFacts) => {
        logger.info(`Imported ${bankFacts.length} bankFacts`);
        return tagTransactions(bankFacts);
      })
      .then(createTransactions)
      .then(() => importPaybacks())
      .then((paybacks) => {
        logger.info(`Imported ${paybacks.length} paybacks`);
        return processPaybacks(paybacks);
      })
      .then(() => {
        const totalTime = new Date().getTime() - start;
        logger.info(`Successfully ingested money! ...${totalTime}ms`);
      });
  },
};
