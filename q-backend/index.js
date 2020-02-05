const express = require('express');
const routes = require('express').Router();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { json, urlencoded } = require('body-parser');
const { q_logger } = require('./q-lib');
const { validateConfig, port } = require('./config');
const { logIncomingRequest } = require('./gates');
const {
  autoRefreshTokens,
  autoMineData,
} = require('./jobs');
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

const server = express();
let path;

q_logger.info('Starting server...');

server.use(cors());
server.use(json());
server.use(urlencoded({ extended: true }));
server.use(logIncomingRequest);

routes.use(express.static(`${__dirname}/public`)).use(cookieParser());

path = '/lifx';
makeGetEndpoint({ routes, path }, handleExternalGetRequest);
makePostEndpoint({ routes, path }, handleExternalPostRequest);
makePutEndpoint({ routes, path }, handleExternalPutRequest);

path = '/spotify';
makeGetEndpoint({ routes, path }, handleExternalGetRequest);
makePostEndpoint({ routes, path }, handleExternalPostRequest);

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

server.use('/', routes);

validateConfig();
autoRefreshTokens()
  .then(() => {
    autoMineData({ collection: 'listens', timeout: 3000 });
    autoMineData({ collection: 'saves', timeout: 3000 });
    autoMineData({ collection: 'transactions', timeout: 3000 });
  });

server.listen(port, () => q_logger.info(`Started Q on port ${port}`));
