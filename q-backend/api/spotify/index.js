const routes = require('express').Router();
const { q_api } = require('q-lib');

const { handleExternalGetRequest, handleExternalPostRequest } = require('../../handlers/external');

routes.use('/auth', require('./auth'));

q_api.makeGetEndpoint(routes, '/', '/spotify', (req, res, then) => handleExternalGetRequest({ req, res, then }));
q_api.makePostEndpoint(routes, '/', '/spotify', (req, res, then) => handleExternalPostRequest({ req, res, then }));

module.exports = routes;
