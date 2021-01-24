const R = require('ramda');
const { makeGetEndpoint, makePutEndpoint } = require('../gates');
const { readLights, updateLights } = require('./crud');
const { buildPayload } = require('./lightStates');
// ----------------------------------
// HELPERS
// ----------------------------------
const path = '/lifx';
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  createEndpoints: (socket, routes) => {
    // GET /lifx
    makeGetEndpoint({ routes, path }, async ({ response }) => {
      response.send(await readLights());
    });
    // PUT /lifx
    makePutEndpoint({ routes, path, socket }, async ({ request, response }) => {
      const states = buildPayload(request.body);
      if (R.any(R.isNil, states)) {
        response.send('Invalid state, see lightStates.js::buildPayload() for possible states');
      } else {
        response.send(await updateLights(states, request.body.preset));
        socket.emit(path, await readLights());
      }
    });
  },
};
