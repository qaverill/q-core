const R = require('ramda');
const { createQuery } = require('./internal');
const { getDocs, postDocs, putDoc, dropCollection } = require('../resources/methods/internal');
const { compileTransactions, getBiMonthlyAnalysis, tagTransaction } = require('../resources/money');
const { ingestData } = require('../ingesting/');
const { q_logger } = require('../q-lib/q-logger');
// ----------------------------------
// HELPERS
// ----------------------------------
const transactionCollection = 'transactions';
const paybackCollection = 'paybacks';
// ----------------------------------
// HANDLERS
// ----------------------------------
module.exports = {
  handleGetTransactionsRequest: async ({ request, response }) => {
    const query = createQuery(request);
    getDocs({ collection: transactionCollection, query })
      .then(transactions => {
        getDocs({ collection: paybackCollection })
          .then(data => {
            const paybacks = Array.isArray(data) ? data : [data];
            response.status(200).json(compileTransactions(transactions, paybacks));
          })
          .catch(() => response.status(400).send());
      })
      .catch(() => response.status(400).send());
  },
  handleReingestRequest: async ({ request, response }) => {
    const collection = transactionCollection;
    dropCollection(transactionCollection)
      .then(async _ => {
        await ingestData({ collection });
        module.exports.handleGetTransactionsRequest({ request, response })
      })
      .catch((e) => response.status(400).send(e));
  },
  handlePaybackTransactionRequest: async ({ request, response }) => {
    postDocs({ collection: paybackCollection, docs: [request.body] })
      .then(() => response.status(204).send())
      .catch(() => response.status(400).send());
  },
  handleGetBiMonthlyAnalysisRequest: async ({ request, response }) => {
    const query = createQuery(request);
    const { start } = request.query;
    getDocs({ collection: transactionCollection, query })
      .then(transactions => {
        getDocs({ collection: paybackCollection })
          .then(data => {
            const paybacks = Array.isArray(data) ? data : [data];
            response.status(200).json(
              getBiMonthlyAnalysis(compileTransactions(transactions, paybacks))
            );
          })
          .catch((e) => {
            console.error(e);
            response.status(400).send(e)
          });
      })
      .catch(() => response.status(400).send());
  },
};
