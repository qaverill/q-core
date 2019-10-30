const routes = require('express').Router();
const request = require('request');
const config = require('config');
const { q_api, q_logger } = require('q-lib');

q_api.makePostEndpoint(routes, '/', '/spotify/playlists', (req, res) => {
  const requestOptions = {
    url: `https://api.spotify.com/v1/playlists/${req.body.playlistId}/tracks`,
    headers: {
      Authorization: `Bearer ${config.spotify.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      uris: req.body.uris,
      position: req.body.position,
    }),
  };
  request.post(requestOptions, (error, response, body) => {
    if (!error && response.statusCode === 201) {
      res.send(body);
    } else {
      q_logger.error('Error posting to Spotify playlist', response);
      res.send({ error: 'Cannot connect to the Spotify API' });
    }
  });
});

module.exports = routes;
