const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { json, urlencoded } = require('body-parser');
const logger = require('@q/logger');
// ----------------------------------
// HELPERS
// ----------------------------------
const logIncomingRequest = (request, response, next) => {
  const payload = {};
  if (request.query) payload.query = request.query;
  if (request.body) {
    if (Array.isArray(request.body)) {
      payload.body = { numItems: request.body.length };
    } else {
      payload.body = request.body;
    }
  }
  logger.apiIn(`${request.method} ${request.originalUrl}`, payload);
  next();
};
// ----------------------------------
// INIT
// ----------------------------------
const server = express();
server.use(cors());
server.use(json());
server.use(urlencoded({ extended: true }));
server.use(logIncomingRequest);

const routes = express.Router();
routes.use(express.static(`${__dirname}/public`)).use(cookieParser());

module.exports = {
  server,
  routes,
};
