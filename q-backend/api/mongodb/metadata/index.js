const routes = require('express').Router();
const { q_api } = require('q-lib');

const { handleInternalPutRequest, handleInternalGetRequest } = require('../../../handlers/internal');

q_api.makePutEndpoint(routes, '/:_id', '/mongodb/metadata/:_id', (req, res, then) => {
  handleInternalPutRequest({ req, res, then }, { _id: req.params._id }, 'metadata');
});

q_api.makeGetEndpoint(routes, '/:_id', '/mongodb/metadata/:_id', (req, res, then) => {
  handleInternalGetRequest({ req, res, then }, 'metadata');
});

module.exports = routes;
