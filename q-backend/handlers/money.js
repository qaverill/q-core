const R = require('ramda');
const { createQuery } = require('./internal');
const { getDocs, putDoc } = require('../resources/methods/internal');
const { tagTransaction } = require('../resources/money');
// ----------------------------------
// HELPERS
// ----------------------------------
const collection = 'transactions';
// ----------------------------------
// HANDLERS
// ----------------------------------
module.exports = {
  handleGetTransactionsRequest: async ({ request, response }) => {
    const query = createQuery(request);
    getDocs({ collection, query })
      .then(data => {
        response.status(200).json(R.reverse(R.sortBy(R.prop('timestamp'), data)));
      })
      .catch(() => response.status(400).send());
  },
  handleTagTransactionsRequest: async ({ response }) => {
    getDocs({ collection })
      .then(transactions => {
        transactions.map(async transaction => {
          const taggedTransaction = { ...transaction, tags: tagTransaction(transaction) };
          if (!R.equals(taggedTransaction.tags, transaction.tags)) {
            console.log(transaction.tags, '=>', taggedTransaction.tags);
            const query = { _id: transaction._id };
            await putDoc({ collection, query, doc: taggedTransaction });
            return taggedTransaction;
          }
          return transaction;
        });
        response.status(200).json(transactions);
      })
      .catch(() => response.status(400).send());
  },
};
