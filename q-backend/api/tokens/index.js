const routes = require('express').Router();

const config = require('../../config');
const { q_api } = require('../../q-lib');

q_api.makeGetEndpoint(routes, '/spotify', '/tokens/spotify', (req, res, then) => {
  if (config.spotify.valid_until < Date.now()) {
    res.send({ valid: false });
  } else {
    res.send({ valid: true });
  }
  then();
});

module.exports = routes;
