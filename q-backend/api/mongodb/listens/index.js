const routes = require('express').Router();
const { q_api } = require('q-lib');
const { handleCommonPostEndpoint, handleCommonGetEndpoint } = require('../sharedEndpointHandlers');

q_api.makePostEndpoint(routes, '/', '/mongodb/listens', (request, response, then) => {
  handleCommonPostEndpoint(request.body, response, 'listens', then);
});

q_api.makeGetEndpoint(routes, '/', '/mongodb/listens', (request, response, then) => {
  handleCommonGetEndpoint(request.query, response, 'listens', then);
});

module.exports = routes;
