const routes = require('express').Router();
const request = require('request');
const config = require('config');
const q_logger = require('q-logger');

routes.use('/auth', require('./auth'));
routes.use((req, res, next) => {
  if (config.spotify.valid_until < Date.now()){
    q_logger.error("Missing Spotify Auth!");
    res.status(401).send({
      "message": "Missing Spotify Auth"
    })
  } else {
    next();
  }
});
routes.use('/recently-played', require('./recently-played'));
routes.use('/saved-tracks', require('./saved-tracks'));
routes.use('/tracks', require('./tracks'));
routes.use('/artists', require('./artists'));
routes.use('/albums', require('./albums'));

routes.get('/', (req, res) => {
  q_logger.info("THAT WEIRD ENDPOINT WAS HIT!!!!!");
  const requestOptions = {
    url: `${req.query.url}&limit=50`,
    headers: {
      Authorization: 'Bearer ' + config.spotify.access_token
    }
  };
  request.get(requestOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      res.send(body)
    } else {
      res.send({error: error})
    }
  });
});

console.log('  GET  /spotify/');

module.exports = routes;
