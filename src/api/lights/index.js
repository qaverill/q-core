const R = require('ramda');
const { makeGetEndpointAsync, makePutEndpointAsync } = require('../gates');
const { readLights, updateLights } = require('../../crud/lifx');
const { buildPayload } = require('../../crud/lifx/lightStates');
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
      const states = buildPayload(request.body);
      if (R.any(R.isNil, states)) {
        respond('Invalid state, see lightStates.js::buildPayload() for possible states');
      } else {
        updateLights(states, request.body.preset).then((result) => {
          respond(result);
          readLights().then((lights) => socket.emit('/lights', lights));
        });
      }
    });
  },
};
