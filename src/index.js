const q_logger = require('q-logger');
const { validateConfig, port } = require('./config');
const SetupAllEndpoints = require('./endpoints');
const express = require('./services/express-server');

// ----------------------------------
// ROOT
// ----------------------------------
const run = async ({ server, routes }) => {
  q_logger.info('Starting server...');
  validateConfig();

  q_logger.info('Available endpoints:');
  SetupAllEndpoints(routes);

  server.use('/', routes);
  server.listen(port);
};

run(express);
