const routes = require('express').Router();
const request = require('request');

routes.get('/', (req, res) => {
  if (req.query.ids.split(',').length > 20){
    res.send({error: 'Cannot process over 20 Track IDs'})
  }
  const requestOptions = {
    url: `https://api.spotify.com/v1/albums?ids=${req.query.ids}`,
    headers: {
      Authorization: 'Bearer ' + global.spotifyAuth.token
    }
  };
  request.get(requestOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      res.send(body)
    } else {
      console.log(response.statusCode);
      console.log(error);
      res.send({error: 'Cannot connect to the Spotify API'})
    }
  });
});

console.log('  GET  /spotify/albums?ids={csv}');

module.exports = routes;