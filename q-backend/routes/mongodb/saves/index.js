const routes = require('express').Router();
const { q_api } = require('q-lib');
const { handleCommonPostEndpoint, handleCommonGetEndpoint } = require('../sharedEndpointHandlers');

q_api.makePostEndpoint(routes, '/', '/mongodb/saves', (request, response) => {
  handleCommonPostEndpoint(request.body, response, 'saves');
});

q_api.makeGetEndpoint(routes, '/', '/mongodb/saves', (request, response) => {
  handleCommonGetEndpoint(request.query, response, 'saves');
});

module.exports = routes;
