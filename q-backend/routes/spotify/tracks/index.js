const routes = require('express').Router();
const request = require('request');
const config = require('config');
const { q_api, q_logger } = require('q-lib');

q_api.makeGetEndpoint(routes, '/', '/spotify/tracks', (req, res) => {
  if (req.query.ids.split(',').length > 50) {
    res.send({ error: 'Cannot process over 50 Track IDs' });
  }
  const requestOptions = {
    url: `https://api.spotify.com/v1/tracks?ids=${req.query.ids}`,
    headers: {
      Authorization: `Bearer ${config.spotify.access_token}`,
    },
  };
  request.get(requestOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      res.send(body);
    } else {
      q_logger.error('Error getting spotify tracks:', error);
      res.send({ error: 'Cannot connect to the Spotify API' })
    }
  });
});

module.exports = routes;