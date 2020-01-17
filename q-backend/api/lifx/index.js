const routes = require('express').Router();
const { q_api } = require('q-lib');

const { handleExternalGetRequest, handleExternalPostRequest } = require('../../handlers/external');

q_api.makeGetEndpoint(routes, '/', '/lifx', (req, res, then) => handleExternalGetRequest({ req, res, then }));
q_api.makePostEndpoint(routes, '/', '/lifx', (req, res, then) => handleExternalPostRequest({ req, res, then }));

module.exports = routes;
