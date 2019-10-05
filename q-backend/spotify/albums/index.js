const routes = require('express').Router();
const config = require('config');
const q_logger = require('q-logger');
const request = require('request');

routes.get('/', (req, res) => {
  if (req.query.ids.split(',').length > 20){
    res.send({error: 'Cannot process over 20 Track IDs'})
  }
  const requestOptions = {
    url: `https://api.spotify.com/v1/albums?ids=${req.query.ids}`,
    headers: {
      Authorization: 'Bearer ' + config.spotify.access_token
    }
  };
  request.get(requestOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      res.send(body)
    } else {
      q_logger.error('Error getting Spotify Albums', response);
      res.send({error: 'Error connecting to the Spotify API'})
    }
  });
});

console.log('  GET  /spotify/albums?ids={csv}');

module.exports = routes;