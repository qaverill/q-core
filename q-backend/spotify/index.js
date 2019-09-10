const routes = require('express').Router();
const request = require('request');

routes.use('/auth', require('./auth'));
routes.use((req, res, next) => {
  if (global.spotifyAuth == null || global.spotifyAuth.expiresTimestampMs < Date.now()){
    console.log("Missing Spotify Auth!");
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
