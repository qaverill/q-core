const express = require('express');
const cors = require('cors');
const { json, urlencoded } = require('body-parser');
const { q_logger } = require('../q-logger');
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
  q_logger.apiIn(`${request.method} ${request.originalUrl}`, payload);
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

module.exports = server;
