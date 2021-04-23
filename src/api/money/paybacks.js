const R = require('ramda');
const { makePostEndpointAsync } = require('../gates');
const { exportPaybacks, importPaybacks } = require('../../data/money/paybacks');
const { processPaybacks } = require('../../algorithms/money/processPaybacks');
// ----------------------------------
// ENDPOINTS
// ----------------------------------
module.exports = {
  createEndpoints: (socket, routes) => {
    /**
     * POST /money/paybacks
     * @param to transactionId NONNULL
     * @param from transactionId NONNULL
     * @returns boolean
     */
    makePostEndpointAsync({ routes, path: '/money/paybacks' }, ({ request, respond }) => {
      const { from, to, mock } = request.body;
      processPaybacks([{ from, to }])
        .then(() => importPaybacks(mock))
        .then((paybacks) => exportPaybacks([...paybacks, request.body], mock))
        .then(respond)
        .catch(R.compose(respond, R.prop('message')));
    });
  },
};
