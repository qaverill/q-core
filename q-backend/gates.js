const { q_logger } = require('./q-lib/q-logger');

module.exports = {
  logIncomingRequest: (request, response, next) => {
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
  },
};
