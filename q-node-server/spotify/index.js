const routes = require('express').Router();
const request = require('request');

routes.use('/auth', require('./auth'));
routes.use('/recently-played', require('./recently-played'));
routes.use('/saved-tracks', require('./saved-tracks'));

routes.get('/', function(req, res) {
  const requestOptions = {
    url: `${req.query.url}&limit=50`,
    headers: {
      Authorization: 'Bearer ' + global.spotifyAuthTokens['access_token']
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

console.log('GET \t/spotify/');

module.exports = routes;
