const routes = require('express').Router();
const request = require('request');
const config = require('config').lifx;
const { q_api, q_utils } = require('q-lib');

q_api.makeGetEndpoint(routes, '/login', '/lifx/auth/login', (req, res) => {
  const request_params = {
    url: 'https://cloud.lifx.com/oauth/authorize',
    form: {
      client_id: config.client_id,
      scope: config.scope,
      state: q_utils.generateRandomString(16),
      response_type: 'code',
    },
  };
  console.log("hit")
  res.redirect(request_params);
});

module.exports = routes;
