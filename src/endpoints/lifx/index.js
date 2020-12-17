const { makeGetEndpoint } = require('../gates');
const { getLights } = require('./api');

const path = '/lifx';

module.exports = {
  createEndpoints: (routes) => {
    makeGetEndpoint({ routes, path }, async ({ request, response }) => {
      getLights(request.query.url)
        .then((lights) => response.status(200).send(lights))
        .catch((error) => response.status(400).send(error));
    });
  },
};
