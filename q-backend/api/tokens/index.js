const routes = require('express').Router();

const config = require('../../config');
const { q_api } = require('../../q-lib');

const path = '/spotify';
const title = '/tokens/spotify';

q_api.makeGetEndpoint({ routes, path, title }, async ({ response }) => {
  if (config.spotify.valid_until < Date.now()) {
    response.send({ valid: false });
  } else {
    response.send({ valid: true });
  }
});

module.exports = routes;
