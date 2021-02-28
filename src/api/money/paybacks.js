const R = require('ramda');
const { makePostEndpointAsync } = require('../gates');
const { exportPaybacks, importPaybacks } = require('../../data/paybacks');
const { processPaybacks } = require('../../algorithms/processPaybacks');
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
      processPaybacks(request.body)
        .then(respond)
        .catch(R.compose(respond, R.prop('message')));
      // processPaybacks({ to, from }).then(() => {
      //   importPaybacks().then((paybacks) => {
      //     exportPaybacks([...paybacks, { from, to }]).then(respond);
      //   });
      // });
    });
  },
};
