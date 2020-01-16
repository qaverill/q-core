const routes = require('express').Router();
const { q_api } = require('q-lib');
const { handleUnsavedRequest } = require('../../handlers');

q_api.makeGetEndpoint(routes, '/listens', '/unsaved/listens', (requestFromUi, responseToUi, then) => {
  handleUnsavedRequest({
    url: 'https://api.spotify.com/v1/me/player/recently-played?limit=50',
    timeParam: 'played_at',
    collection: 'listens',
    responseToUi,
    then,
  });
});

q_api.makeGetEndpoint(routes, '/saves', '/unsaved/saves', (requestFromUi, responseToUi, then) => {
  handleUnsavedRequest({
    url: 'https://api.spotify.com/v1/me/tracks?limit=50',
    timeParam: 'added_at',
    collection: 'saves',
    responseToUi,
    then,
  });
});

module.exports = routes;
