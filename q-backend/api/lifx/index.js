const routes = require('express').Router();
const { q_api } = require('../../q-lib');
const {
  handleExternalGetRequest,
  handleExternalPostRequest,
  handleExternalPutRequest,
} = require('../../handlers/external');

const path = '/';
const title = '/lifx';

q_api.makeGetEndpoint({ routes, path, title }, handleExternalGetRequest);
q_api.makePostEndpoint({ routes, path, title }, handleExternalPostRequest);
q_api.makePutEndpoint({ routes, path, title }, handleExternalPutRequest);

module.exports = routes;
