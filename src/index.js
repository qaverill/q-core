const logger = require('@q/logger');
const { validateConfig, port } = require('./config');
const SetupAllEndpoints = require('./endpoints');
const express = require('./services/express-server');

// ----------------------------------
// ROOT
// ----------------------------------
const run = async ({ server, routes }) => {
  logger.info('Starting server...');
  validateConfig();

  logger.info('Available endpoints:');
  SetupAllEndpoints(routes);

  server.use('/', routes);
  server.listen(port);
};

run(express);
