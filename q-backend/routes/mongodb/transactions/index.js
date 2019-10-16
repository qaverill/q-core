const routes = require('express').Router();
const { q_api } = require('q-lib');
const { handleCommonPostEndpoint, handleCommonGetEndpoint } = require('../sharedEndpointHandlers');

q_api.makePostEndpoint(routes, '/', '/mongodb/transactions', (request, response) => {
  handleCommonPostEndpoint(request.body, response, 'transactions');
});

q_api.makeGetEndpoint(routes, '/', '/mongodb/transactions', (request, response) => {
  handleCommonGetEndpoint(request.query, response, 'transactions');
});

module.exports = routes;
