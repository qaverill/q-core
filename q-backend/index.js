const express = require('express');
const routes = require('express').Router();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { json, urlencoded } = require('body-parser');
const testedAlgorithms = require('./tests');
const { q_logger } = require('./q-lib/q-logger');
const { validateConfig, port } = require('./config');
const { logIncomingRequest } = require('./gates');
const { autoRefreshTokens } = require('./jobs/tokenRefresh');
const { ingest } = require('./jobs/ingesting');
const {
  makeGetEndpoint,
  makePostEndpoint,
  makePutEndpoint,
} = require('./q-lib/q-api');
const {
  handleExternalGetRequest,
  handleExternalPostRequest,
  handleExternalPutRequest,
} = require('./handlers/external');
const {
  handleInternalGetRequest,
  handleInternalPutRequest,
} = require('./handlers/internal');
const {
  handleGetTransactionsRequest,
  handleReingestRequest,
  handlePaybackTransactionRequest,
  handleGetBiMonthlyAnalysisRequest
} = require('./handlers/money');
const {
  handleMusicTopPlaysRequest,
  handleDailyPlayTimeRequest
} = require('./handlers/music');
const {
  handleKasaInfo,
  handleKasaPowerToggle
} = require('./handlers/kasa');
// ----------------------------------
// HELPERS
// ----------------------------------
let path;
// ----------------------------------
// INIT
// ----------------------------------
q_logger.info('Running unit tests:');
if (!testedAlgorithms.every(algorithm => algorithm())) {
  process.exit();
}

q_logger.info('Starting server...');
const server = express();
server.use(cors());
server.use(json());
server.use(urlencoded({ extended: true }));
server.use(logIncomingRequest);
routes.use(express.static(`${__dirname}/public`)).use(cookieParser());
validateConfig();
// ----------------------------------
// ENDPOINTS
// ----------------------------------
path = '/lifx';
makeGetEndpoint({ routes, path }, handleExternalGetRequest);
makePostEndpoint({ routes, path }, handleExternalPostRequest);
makePutEndpoint({ routes, path }, handleExternalPutRequest);

path = '/spotify';
makeGetEndpoint({ routes, path }, handleExternalGetRequest);
makePostEndpoint({ routes, path }, handleExternalPostRequest);

path = '/mongodb/metadata/:_id';
makeGetEndpoint({ routes, path }, handleInternalGetRequest);
makePutEndpoint({ routes, path }, handleInternalPutRequest);

path = '/money/transactions';
makeGetEndpoint({ routes, path }, handleGetTransactionsRequest);

path = '/money/reingest';
makeGetEndpoint({ routes, path }, handleReingestRequest);

path = '/money/paybackTransaction';
makePostEndpoint({ routes, path }, handlePaybackTransactionRequest);

path = '/money/biMonthlyAnalysis';
makeGetEndpoint({ routes, path }, handleGetBiMonthlyAnalysisRequest);

path = '/music/topPlays';
makeGetEndpoint({ routes, path }, handleMusicTopPlaysRequest);

path = '/music/dailyPlayTime';
makeGetEndpoint({ routes, path }, handleDailyPlayTimeRequest);

path = '/kasa';
makeGetEndpoint({ routes, path}, handleKasaInfo);
makePutEndpoint({ routes, path}, handleKasaPowerToggle);
// ----------------------------------
// START
// ----------------------------------
server.use('/', routes);
server.listen(port, () => {
  q_logger.info(`Started Q on port ${port}`);
  autoRefreshTokens()
    .then(() => {
      ingest({ collection: 'listens', interval: 1800000 });
      ingest({ collection: 'saves', interval: 2600000 });
      ingest({ collection: 'transactions' });
    })
    .catch(() => {
      q_logger.error('Cannot start refresh tokens job, killing server...');
      process.exit();
    });
});
