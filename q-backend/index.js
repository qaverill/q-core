const express = require('express');
const routes = require('express').Router();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { q_logger } = require('./q-lib');
const config = require('./config');
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
  handleSpotifyLogin,
  handleSpotifyCallback,
  handleTokenCheck,
} = require('./handlers/auth');
const {
  readInDataDump,
} = require('./handlers/data-dump');
const {
  handleUnsavedGetRequest,
} = require('./handlers/unsaved');

let path;
const server = express();

q_logger.info('Starting server...');

config.validate();

server.use(require('cors')());

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use((req, res, next) => logIncomingRequest({ req, next }));

routes.use(express.static(`${__dirname}/public`)).use(cookieParser());

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

path = '/spotify';
makeGetEndpoint({ routes, path }, handleExternalGetRequest);
makePostEndpoint({ routes, path }, handleExternalPostRequest);

path = '/spotify/auth/login';
makeGetEndpoint({ routes, path }, handleSpotifyLogin);

path = '/spotify/auth/callback';
makeGetEndpoint({ routes, path }, handleSpotifyCallback);

path = '/tokens/spotify';
makeGetEndpoint({ routes, path }, handleTokenCheck);

path = '/transactions';
makeGetEndpoint({ routes, path }, readInDataDump);

path = '/unsaved/listens';
makeGetEndpoint({ routes, path }, handleUnsavedGetRequest);

path = '/unsaved/saves';
makeGetEndpoint({ routes, path }, handleUnsavedGetRequest);

server.use('/', routes);
server.listen(config.port, () => q_logger.info(`Started Q on port ${config.port}`));
