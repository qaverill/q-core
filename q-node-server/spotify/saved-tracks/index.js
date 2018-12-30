const routes = require('express').Router();
const request = require('request');

routes.get('/', function(req, res) {
  const requestOptions = {
    url: 'https://api.spotify.com/v1/me/tracks?limit=50',
    headers: {
      Authorization: 'Bearer ' + global.spotifyAuthTokens['access_token']
    }
  };
  request.get(requestOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      res.send(body)
    } else {
      res.send({error: 'Cannot connect to the Spotify API'})
    }
  });
});

console.log('GET \t/spotify/saved-tracks');

module.exports = routes;