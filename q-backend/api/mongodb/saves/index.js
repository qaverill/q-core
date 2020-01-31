const routes = require('express').Router();
const { q_api } = require('../../../q-lib');
const { handleInternalGetRequest, handleInternalPostRequest } = require('../../../handlers/internal');

q_api.makeGetEndpoint(routes, '/', '/mongodb/saves', (req, res, then) => {
  handleInternalGetRequest({ req, res, then }, 'saves');
});

q_api.makePostEndpoint(routes, '/', '/mongodb/saves', (req, res, then) => {
  handleInternalPostRequest({ req, res, then }, 'saves');
});

module.exports = routes;
