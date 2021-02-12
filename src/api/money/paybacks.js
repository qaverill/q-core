const { makePostEndpoint } = require('../gates');
const { createPaybacks, readPaybacks } = require('../../crud/money/paybacks');
const { exportPaybacks } = require('../../data/paybacks');
const { ingestMoney } = require('../../ingesting/money');
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
      createPaybacks({ to, from, amount })
        .then(readPaybacks)
        .then(exportPaybacks)
        .then(ingestMoney)
        .then(respond);
    });
  },
};
