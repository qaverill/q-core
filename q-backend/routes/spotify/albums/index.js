const routes = require('express').Router();
const config = require('config');
const request = require('request');
const { q_logger, q_api } = require('q-lib');

q_api.makeGetEndpoint(routes, '/', '/spotify/albums', (req, res) => {
  if (req.query.ids.split(',').length > 20){
    res.send({error: 'Cannot process over 20 Track IDs'})
  }
  const requestOptions = {
    url: `https://api.spotify.com/v1/albums?ids=${req.query.ids}`,
    headers: {
      Authorization: 'Bearer ' + config.spotify.access_token
    }
  };
  request.get(requestOptions, (error, response) => {
    if (!error && response.statusCode === 200) {
      res.send(response.body)
    } else {
      q_logger.error('Error getting Spotify Albums', response);
      res.send({error: 'Error connecting to the Spotify API'})
    }
  });
});

module.exports = routes;