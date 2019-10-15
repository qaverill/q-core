const routes = require('express').Router();
const { q_api } = require('q-lib');
const { handleCommonPostEndpoint, handleCommonGetEndpoint } = require('../sharedEndpointHandlers');

q_api.makePostEndpoint(routes, '/', '/mongodb/listens', (request, response) => {
  handleCommonPostEndpoint(request.body, response, 'listens');
});

q_api.makeGetEndpoint(routes, '/', '/mongodb/listens', (request, response) => {
  handleCommonGetEndpoint(request.query, response, 'listens');
});

module.exports = routes;
