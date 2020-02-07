const express = require('express');
const routes = require('express').Router();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { json, urlencoded } = require('body-parser');
const { q_logger } = require('./q-lib/q-logger');
const { validateConfig, port } = require('./config');
const { logIncomingRequest } = require('./gates');
const { autoRefreshTokens } = require('./jobs/tokenRefresh');
const { autoMineData } = require('./jobs/dataMine');
const {
  makeGetEndpoint,
  makePostEndpoint,
  makePutEndpoint,
  makeDeleteEndpoint,
} = require('./q-lib/q-api');
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

validateConfig();

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

server.listen(port, () => {
  q_logger.info(`Started Q on port ${port}`);
  autoRefreshTokens()
    .then(() => {
      autoMineData({ collection: 'listens', interval: 180000 });
      autoMineData({ collection: 'saves', interval: 260000 });
      autoMineData({ collection: 'transactions' });
    })
    .catch(() => {
      q_logger.error('Cannot start refresh tokens job, killing server...');
      process.exit();
    });
});
