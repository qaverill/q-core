const routes = require('express').Router();
const { q_api } = require('q-lib');

const { handleGetWrapperRequest, handlePostWrapperRequest } = require('../../handlers');

q_api.makeGetEndpoint(routes, '/', '/lifx', (req, res, then) => handleGetWrapperRequest({ req, res, then }));
q_api.makePostEndpoint(routes, '/', '/lifx', (req, res, then) => handlePostWrapperRequest({req, res, then }));

module.exports = routes;
