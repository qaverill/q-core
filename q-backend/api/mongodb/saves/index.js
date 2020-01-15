const routes = require('express').Router();
const { q_api } = require('q-lib');
const { handleCommonPostEndpoint, handleCommonGetEndpoint } = require('../sharedEndpointHandlers');

q_api.makePostEndpoint(routes, '/', '/mongodb/saves', (request, response, then) => {
  handleCommonPostEndpoint(request.body, response, 'saves', then);
});

q_api.makeGetEndpoint(routes, '/', '/mongodb/saves', (request, response, then) => {
  handleCommonGetEndpoint(request.query, response, 'saves', then);
});

module.exports = routes;
