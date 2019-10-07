const routes = require('express').Router();
const request = require('request');
const config = require('config');
const q_logger = require('q-logger');
const q_api = require('q-api');

q_api.makeGetEndpoint(routes, '/', '/spotify/recently-played', (req, res) => {
  const requestOptions = {
    url: 'https://api.spotify.com/v1/me/player/recently-played?limit=50',
    headers: {
      Authorization: 'Bearer ' + config.spotify.access_token
    }
  };
  request.get(requestOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      res.send(body)
    } else {
      q_logger.error('Error getting Spotify recently-played', response);
      res.send({ error: 'Cannot connect to the Spotify API' })
    }
  });
});

module.exports = routes;