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
routes.use('/playlists', require('./playlists'));

q_api.makeGetEndpoint(routes, '/', '/spotify', (req, res, then) => {
  const requestOptions = {
    headers: { Authorization: `Bearer ${config.spotify.access_token}` },
    url: req.query.url,
  };
  request.get(requestOptions, (error, response) => {
    if (!error && response.statusCode === 200) {
      res.send(response.body);
    } else {
      q_logger.error(`Error while sending GET to ${req.body.url}`, response);
      res.send({ error });
    }
    then();
  });
});

q_api.makePostEndpoint(routes, '/', '/spotify', (req, res, then) => {
  const requestOptions = {
    headers: { Authorization: `Bearer ${config.spotify.access_token}` },
    url: req.body.url,
  };
  request.post(requestOptions, (error, response) => {
    if (!error && response.statusCode === 200) {
      res.send(response.body);
    } else {
      q_logger.error(`Error while sending POST to ${req.body.url}`, response);
      res.send({ error });
    }
    then();
  });
});

module.exports = routes;
