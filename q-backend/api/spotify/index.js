const routes = require('express').Router();

const { q_api } = require('../../q-lib');
const { handleExternalGetRequest, handleExternalPostRequest } = require('../../handlers/external');

routes.use('/auth', require('./auth'));

const path = '/';
const title = '/spotify';
q_api.makeGetEndpoint({ routes, path, title }, handleExternalGetRequest);
q_api.makePostEndpoint({ routes, path, title }, handleExternalPostRequest);

module.exports = routes;
