const { makeGetEndpointAsync } = require('../gates');
const { readTransactions } = require('../../crud/money/transactions');
const { analyzeTransactions } = require('../../algorithms/money/analyzingTransactions');
// ----------------------------------
// ENDPOINTS
// ----------------------------------
module.exports = {
  createEndpoints: (socket, routes) => {
    /**
     * GET /money/analysis
     * @params start (optional) TIMESTAMP default:null
     * @params end (optional only if start exists) TIMESTAMP default:now
     * @params filter (optional) STRING default: null
     * @returns list of transactions, post payback/tagging
     */
    makeGetEndpointAsync({ routes, path: '/analyze/money' }, ({ request, respond }) => {
      const { start, end, filter } = request.query;
      readTransactions({ start, end, filter })
        .then((transactions) => {
          // TODO: can this be written curry style?
          const analysis = analyzeTransactions(transactions);
          respond(analysis);
        });
    });
  },
};
