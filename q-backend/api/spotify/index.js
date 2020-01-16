const routes = require('express').Router();
const { q_api } = require('q-lib');

const { handleGetWrapperRequest, handlePostWrapperRequest } = require('../../handlers');

routes.use('/auth', require('./auth'));

q_api.makeGetEndpoint(routes, '/', '/spotify', (req, res, then) => handleGetWrapperRequest({ req, res, then }));
q_api.makePostEndpoint(routes, '/', '/spotify', (req, res, then) => handlePostWrapperRequest({ req, res, then }));

module.exports = routes;
