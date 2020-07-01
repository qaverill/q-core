const R = require('ramda');
const { createQuery } = require('./internal');
const { getDocs, putDoc } = require('../resources/methods/internal');
const { autoTagTransaction } = require('../resources/banks');
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
  handleAutoTagTransactionsRequest: async ({ request, response }) => {
    const { body: transactions } = request;
    transactions.map(transaction => {
      const newTags = autoTagTransaction(transaction);
      if (newTags !== transaction.tags) {
        transaction.tags = newTags;
        putDoc({ collection, query, doc })
          .then(() => response.status(204).send())
          .catch(() => response.status(400).send());
        // TODO: fuck need to separate auto tags from custom tags
      } else {
        return transaction;
      }
    });
    response.status(200).json(transactions);
  },
};
