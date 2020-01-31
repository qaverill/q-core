const routes = require('express').Router();
const { q_api } = require('../../../q-lib');
const { handleInternalGetRequest, handleInternalPostRequest } = require('../../../handlers/internal');

const path = '/';
const title = '/mongodb/listens';
const collection = 'listens';

q_api.makeGetEndpoint({ routes, path, title, collection }, handleInternalGetRequest);
q_api.makePostEndpoint({ routes, path, title, collection }, handleInternalPostRequest);

module.exports = routes;
