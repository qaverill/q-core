const R = require('ramda');
const { makeGetEndpointAsync, makePutEndpointAsync } = require('../gates');
const { readLights, updateLights } = require('../../crud/control/lights');
const { buildPayloads } = require('../../algorithms/lights');
// ----------------------------------
// HELPERS
// ----------------------------------
const path = '/control/lights';
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  createEndpoints: (socket, routes) => {
    // GET /control/lights
    makeGetEndpointAsync({ routes, path }, ({ respond }) => {
      readLights().then(respond);
    });
    // PUT /control/lights
    makePutEndpointAsync({ routes, path, socket }, ({ request, respond }) => {
      const states = buildPayloads(request.body);
      if (R.any(R.isNil, states)) {
        respond('Invalid state, see lightStates.js::buildPayloads() for possible states');
      } else {
        updateLights(states, request.body.preset).then((result) => {
          respond(result);
          readLights();
        });
      }
    });
  },
};
