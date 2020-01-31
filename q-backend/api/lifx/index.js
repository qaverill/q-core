const routes = require('express').Router();
const { q_api } = require('../../q-lib');

const { handleExternalGetRequest, handleExternalPostRequest, handleExternalPutRequest } = require('../../handlers/external');

q_api.makeGetEndpoint(routes, '/', '/lifx', (req, res, then) => handleExternalGetRequest({ req, res, then }));
q_api.makePostEndpoint(routes, '/', '/lifx', (req, res, then) => handleExternalPostRequest({ req, res, then }));
q_api.makePutEndpoint(routes, '/', '/lifx', (req, res, then) => handleExternalPutRequest({ req, res, then }));

module.exports = routes;
