const routes = require('express').Router();
const request = require('request');

routes.get('/', (req, res) => {
  if (req.query.ids.split(',').length > 50){
    res.send({error: 'Cannot process over 50 Track IDs'})
  }
  const requestOptions = {
    url: `https://api.spotify.com/v1/artists?ids=${req.query.ids}`,
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

console.log('GET \t/spotify/artists?ids={csv}');

module.exports = routes;