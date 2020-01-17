const routes = require('express').Router();
const { q_api } = require('q-lib');

const { handleInternalPutRequest, handleInternalGetRequest } = require('../../../handlers/internal');

q_api.makePutEndpoint(routes, '/:name', '/mongodb/metadata/:name', (req, res, then) => {
  handleInternalPutRequest({ req, res, then }, { _id: req.params.name }, 'metadata');
});

q_api.makeGetEndpoint(routes, '/:name', '/mongodb/metadata/:name', (req, res, then) => {
  handleInternalGetRequest({ req, res, then }, 'metadata');
});

module.exports = routes;
