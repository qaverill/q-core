const { makeGetEndpointAsync } = require('../gates');
const { readTransactions } = require('../../crud/money/transactions');
// ----------------------------------
// ENDPOINTS
// ----------------------------------
module.exports = {
  createEndpoints: (socket, routes) => {
    /**
     * GET /money/transactions
     * @params start (optional) TIMESTAMP default:null
     * @params end (optional only if start exists) TIMESTAMP default:now
     * @params filter (optional) STRING default: null
     * @returns list of transactions, post payback/tagging
     */
    makeGetEndpointAsync({ routes, path: '/money/transactions' }, ({ request, respond }) => {
      const { start, end, filter } = request.query;
      readTransactions({ start, end, filter }).then(respond);
    });
  },
};
