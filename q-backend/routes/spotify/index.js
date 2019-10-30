const routes = require('express').Router();
const request = require('request');
const config = require('config');
const { q_api, q_logger } = require('q-lib');

routes.use('/auth', require('./auth'));
routes.use((req, res, next) => {
  if (config.spotify.valid_until < Date.now()) {
    q_logger.warn('Missing Spotify Auth!');
    res.status(401).send({ message: 'Missing Spotify Auth' });
  } else {
    next();
  }
});
routes.use('/recently-played', require('./recently-played'));
routes.use('/saved-tracks', require('./saved-tracks'));
routes.use('/artists', require('./artists'));
routes.use('/albums', require('./albums'));
routes.use('/playlists', require('./playlists'));

q_api.makeGetEndpoint(routes, '/', '/spotify', (req, res) => {
  q_logger.info('THAT WEIRD ENDPOINT WAS HIT!!!!!');
  const requestOptions = {
    url: `${req.query.url}&limit=50`,
    headers: { Authorization: `Bearer ${config.spotify.access_token}` },
  };
  request.get(requestOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) res.send(body);
    res.send({ error });
  });
});

module.exports = routes;
