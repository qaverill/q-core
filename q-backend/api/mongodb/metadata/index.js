const routes = require('express').Router();
const { q_api } = require('../../../q-lib');

const { handleInternalPutRequest, handleInternalGetRequest } = require('../../../handlers/internal');

const path = '/:_id';
const title = '/mongodb/metadata/:_id';
const collection = 'metadata';

q_api.makeGetEndpoint({ routes, path, title, collection }, handleInternalGetRequest);
q_api.makePutEndpoint({ routes, path, title, collection }, handleInternalPutRequest);

module.exports = routes;
