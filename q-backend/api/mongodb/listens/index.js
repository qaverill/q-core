const routes = require('express').Router();
const { q_api } = require('q-lib');
const { handleInternalGetRequest, handleInternalPostRequest } = require('../../../handlers/internal');

q_api.makeGetEndpoint(routes, '/', '/mongodb/listens', (req, res, then) => {
  handleInternalGetRequest({ req, res, then }, 'listens');
});

q_api.makePostEndpoint(routes, '/', '/mongodb/listens', (req, res, then) => {
  handleInternalPostRequest({ req, res, then }, 'listens');
});

module.exports = routes;
