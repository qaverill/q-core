const R = require('ramda');
const { createQuery } = require('./internal');
const { getDocs, postDocs, putDoc } = require('../resources/methods/internal');
const { ingestTransactions } = require('../resources/money/ingestingTransactions');
const { tagTransaction } = require('../resources/money');
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
          .then(paybacks => {
            response.status(200).json(ingestTransactions(transactions, paybacks));
          })
          .catch(() => response.status(400).send());
      })
      .catch(() => response.status(400).send());
  },
  handleTagAllTransactionsRequest: async ({ response }) => {
    getDocs({ collection: transactionCollection })
      .then(transactions => {
        const updatedTransactions = [];
        transactions.forEach(async transaction => {
          const taggedTransaction = { ...transaction, automaticTags: tagTransaction(transaction) };
          if (!R.equals(taggedTransaction.automaticTags, transaction.automaticTags)) {
            updatedTransactions.push(taggedTransaction);
            await putDoc({
              collection: transactionCollection,
              query: { _id: transaction._id },
              doc: taggedTransaction,
            });
          }
        });
        if (updatedTransactions.length > 0) q_logger.info(`Tagged ${updatedTransactions.length} transactions`);
        response.status(200).json(updatedTransactions);
      })
      .catch(() => response.status(400).send());
  },
  handlePaybackTransactionRequest: async ({ request, response }) => {
    postDocs({ collection: paybackCollection, docs: [request.body] })
      .then(() => response.status(204).send())
      .catch(() => response.status(400).send());
  },
};
