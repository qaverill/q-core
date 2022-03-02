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
      .then(importBankFacts)
      .then(tagTransactions)
      .then(createTransactions)
      .then(importPaybacks)
      .then(processPaybacks)
      .then(() => {
        const totalTime = new Date().getTime() - start;
        logger.info(`Successfully ingested money! ...${totalTime}ms`);
      });
  },
};
