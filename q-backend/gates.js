const config = require('config');
const { q_logger } = require('q-lib');

const urlNeedsAuthentication = url => (
  (url.includes('spotify') || url.includes('saves') || url.includes('listens'))
  && !url.includes('auth')
);

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
  checkForAuthentication: ({ req, res, next }) => {
    if (urlNeedsAuthentication(req.originalUrl)) {
      if (config.spotify.valid_until < Date.now()) {
        q_logger.warn('Missing Spotify Auth!');
        res.status(401).send({ message: 'Missing Spotify Auth' });
      } else {
        next();
      }
    } else {
      next();
    }
  },
};
