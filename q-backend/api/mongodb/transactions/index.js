const routes = require('express').Router();
const { q_api } = require('q-lib');
const {
  handleInternalGetRequest,
  handleInternalPostRequest,
  handleInternalPutRequest,
  handleInternalDeleteRequest,
} = require('../../../handlers/internal');

q_api.makeGetEndpoint(routes, '/', '/mongodb/transactions', (req, res, then) => {
  handleInternalGetRequest({ req, res, then }, 'transactions');
});

q_api.makePostEndpoint(routes, '/', '/mongodb/transactions', (req, res, then) => {
  handleInternalPostRequest({ req, res, then }, 'transactions');
});

q_api.makePutEndpoint(routes, '/:ordinal', '/mongodb/transactions/:ordinal', (req, res, then) => {
  handleInternalPutRequest({ req, res, then }, 'transactions');
});

q_api.makeDeleteEndpoint(routes, '/:ordinal', '/mongodb/transactions/:ordinal', (req, res, then) => {
  handleInternalDeleteRequest({ req, res, then }, 'transactions');
});

module.exports = routes;
