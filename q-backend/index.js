const express = require('express');
const routes = require('express').Router();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { json, urlencoded } = require('body-parser');
const { q_logger } = require('./q-lib');
const { validateConfig, autoRefreshTokens, port } = require('./config');
const { logIncomingRequest } = require('./gates');
const {
  makeGetEndpoint,
  makePostEndpoint,
  makePutEndpoint,
  makeDeleteEndpoint,
} = require('./q-lib').q_api;
const {
  handleExternalGetRequest,
  handleExternalPostRequest,
  handleExternalPutRequest,
} = require('./handlers/external');
const {
  handleInternalGetRequest,
  handleInternalPostRequest,
  handleInternalPutRequest,
  handleInternalDeleteRequest,
} = require('./handlers/internal');
const {
  readInDataDump,
} = require('./handlers/data-dump');
const {
  handleUnsavedGetRequest,
} = require('./handlers/unsaved');

const server = express();
let path;

q_logger.info('Starting server...');

validateConfig();
autoRefreshTokens();

server.use(cors());
server.use(json());
server.use(urlencoded({ extended: true }));
server.use(logIncomingRequest);

routes.use(express.static(`${__dirname}/public`)).use(cookieParser());

path = '/spotify';
makeGetEndpoint({ routes, path }, handleExternalGetRequest);
makePostEndpoint({ routes, path }, handleExternalPostRequest);

path = '/lifx';
makeGetEndpoint({ routes, path }, handleExternalGetRequest);
makePostEndpoint({ routes, path }, handleExternalPostRequest);
makePutEndpoint({ routes, path }, handleExternalPutRequest);

path = '/mongodb/listens';
makeGetEndpoint({ routes, path }, handleInternalGetRequest);
makePostEndpoint({ routes, path }, handleInternalPostRequest);

path = '/mongodb/metadata/:_id';
makeGetEndpoint({ routes, path }, handleInternalGetRequest);
makePutEndpoint({ routes, path }, handleInternalPutRequest);

path = '/mongodb/saves';
makeGetEndpoint({ routes, path }, handleInternalGetRequest);
makePostEndpoint({ routes, path }, handleInternalPostRequest);

path = '/mongodb/transactions';
makeGetEndpoint({ routes, path }, handleInternalGetRequest);
makePostEndpoint({ routes, path }, handleInternalPostRequest);

path = '/mongodb/transactions/:ordinal';
makePutEndpoint({ routes, path }, handleInternalPutRequest);
makeDeleteEndpoint({ routes, path }, handleInternalDeleteRequest);


// TODO: make these 3 endpoints be just /unsaved/:collection
path = '/transactions';
makeGetEndpoint({ routes, path }, readInDataDump);

path = '/unsaved/listens';
makeGetEndpoint({ routes, path }, handleUnsavedGetRequest);

path = '/unsaved/saves';
makeGetEndpoint({ routes, path }, handleUnsavedGetRequest);

server.use('/', routes);
server.listen(port, () => q_logger.info(`Started Q on port ${port}`));
