const R = require('ramda');
const { makeGetEndpoint, makePutEndpoint } = require('../gates');
const { readLights, updateLights } = require('./crud');
const states = require('./states');
// ----------------------------------
// HELPERS
// ----------------------------------
const path = '/lifx';
const possibleStates = R.keys(states).join(', ');
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
      const body = states[request.body.state];
      if (R.isNil(body)) {
        response.status(400).send(`Invalid state. Possible states: ${possibleStates}`);
        return;
      }
      response.send(await updateLights(body));
    });
  },
};
