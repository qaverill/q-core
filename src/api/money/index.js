const { makeGetEndpointAsync } = require('../gates');
const { readTransactions } = require('../../crud/transactions');
// ----------------------------------
// ENDPOINTS
// ----------------------------------
module.exports = {
  createEndpoints: (socket, routes) => {
    /**
     * GET /money
     * @params start (optional) TIMESTAMP default:null
     * @params end (optional only if start exists) TIMESTAMP default:now
     * @returns Analysis of music data over a period of time (specified, or current)
     */
    makeGetEndpointAsync({ routes, path: '/money' }, ({ request, respond }) => {
      const { start, end } = request.query;
      readTransactions({ start, end }).then(respond);
    });
  },
};
