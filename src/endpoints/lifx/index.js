const R = require('ramda');
const { makeGetEndpoint, makePutEndpoint } = require('../gates');
const { readLights, updateLights } = require('./crud');
const { buildStates } = require('./lightStates');
// ----------------------------------
// HELPERS
// ----------------------------------
const path = '/lifx';
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  createEndpoints: (routes) => {
    // GET /lifx
    makeGetEndpoint({ routes, path }, async ({ response }) => {
      response.send(await readLights());
    });
    // PUT /lifx
    makePutEndpoint({ routes, path }, async ({ request, response }) => {
      const states = buildStates(request.body.preset);
      if (R.isNil(states)) {
        response.send('Invalid state, see lightStates.js::buildStates() for possible states');
      } else {
        response.send(await updateLights(states));
      }
    });
  },
};
