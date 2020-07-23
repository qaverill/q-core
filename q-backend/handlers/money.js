const R = require('ramda');
const { createQuery } = require('./internal');
const { getDocs, postDocs, putDoc } = require('../resources/methods/internal');
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
      .then(data => {
        response.status(200).json(R.reverse(R.sortBy(R.prop('timestamp'), data)));
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
    postDocs({ collection: paybackCollection, docs: [request.query] })
      .then(() => response.status(204).send())
      .catch(() => response.status(400).send());
  },
};
