const { createQuery } = require('./internal');
const { getDocs } = require('../resources/methods/internal');
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
      .then(async data => {
        response.status(200).json(data);
      })
      .catch(() => response.status(400).send());
  },
};
