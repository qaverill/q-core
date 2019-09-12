const routes = require('express').Router();

routes.post('/:playlist_id/tracks', (request) => {
  request.get(requestOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      res.send(body)
    } else {
      res.send({error: 'Cannot connect to the Spotify API'})
    }
  });
});

console.log('  POST /spotify/playlists/{playlist_id}/tracks');

module.exports = routes;