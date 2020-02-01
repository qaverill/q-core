const routes = require('express').Router();
const { q_api } = require('../../../q-lib');
const {
  handleInternalGetRequest,
  handleInternalPostRequest,
  handleInternalPutRequest,
  handleInternalDeleteRequest,
} = require('../../../handlers/internal');

let path = '/';
let title = '/mongodb/transactions';
const collection = 'transactions';

q_api.makeGetEndpoint({ routes, path, title, collection }, handleInternalGetRequest);
q_api.makePostEndpoint({ routes, path, title, collection }, handleInternalPostRequest);

path += ':ordinal';
title += ':ordinal';
q_api.makePutEndpoint({ routes, path, title, collection }, handleInternalPutRequest);
q_api.makeDeleteEndpoint({ routes, path, title, collection }, handleInternalDeleteRequest);

module.exports = routes;
