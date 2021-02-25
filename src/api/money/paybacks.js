const { makePostEndpoint } = require('../gates');
const { exportPaybacks, importPaybacks } = require('../../data/paybacks');
const { processPayback } = require('../../algorithms/money');
// ----------------------------------
// ENDPOINTS
// ----------------------------------
module.exports = {
  createEndpoints: (socket, routes) => {
    /**
     * POST /money/paybacks
     * @param to transactionId NONNULL
     * @param from transactionId NONNULL
     * @param amount float NONNULL
     * @returns boolean
     */
    makePostEndpoint({ routes, path: '/money/paybacks' }, ({ request, respond }) => {
      const { to, from, amount } = request.query;
      processPayback({ to, from, amount })
        .then(respond);
      importPaybacks((paybacks) => {
        paybacks.push({ to, from, amount });
        exportPaybacks(paybacks);
      });
    });
  },
};
