const { q_logger } = require('./q-lib');

module.exports = {
  logIncomingRequest: ({ req, next }) => {
    const payload = {};
    if (req.query) payload.query = req.query;
    if (req.body) {
      if (Array.isArray(req.body)) {
        payload.body = { numItems: req.body.length };
      } else {
        payload.body = req.body;
      }
    }
    q_logger.apiIn(`${req.method} ${req.originalUrl}`, payload);
    next();
  },
};
