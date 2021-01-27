const R = require('ramda');
const { makeGetEndpointAsync, makePutEndpointAsync } = require('../gates');
const { readLights, updateLights } = require('./crud');
const { buildPayload } = require('./lightStates');
// ----------------------------------
// HELPERS
// ----------------------------------
const path = '/control/lifx';
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  createEndpoints: (socket, routes) => {
    // GET /control/lifx
    makeGetEndpointAsync({ routes, path }, ({ respond }) => {
      readLights().then(respond);
    });
    // PUT /control/lifx
    makePutEndpointAsync({ routes, path, socket }, ({ request, respond }) => {
      const states = buildPayload(request.body);
      if (R.any(R.isNil, states)) {
        respond('Invalid state, see lightStates.js::buildPayload() for possible states');
      } else {
        updateLights(states, request.body.preset).then(respond);
        readLights().then((lights) => socket.emit('/lifx', lights));
      }
    });
  },
};
