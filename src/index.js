const express = require('express');
const routes = require('express').Router();
const cookieParser = require('cookie-parser');
const { q_logger } = require('./q-logger');
const { validateConfig, port } = require('./config');

const server = require('./services/express-server');
// ----------------------------------
// INIT
// ----------------------------------
q_logger.info('Starting server...');
routes.use(express.static(`${__dirname}/public`)).use(cookieParser());
validateConfig();

// ----------------------------------
// START
// ----------------------------------
server.use('/', routes);
server.listen(port, () => {
  q_logger.info(`Started Q on port ${port}`);
});
