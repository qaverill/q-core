const routes = require('express').Router();
const request = require('request');
const config = require('config');
const { q_logger, q_api } = require('q-lib');

const { access_token } = config.lifx;

q_api.makeGetEndpoint(routes, '/', '/lifx', (req, res) => {
  const requestOptions = {
    headers: { Authorization: `Bearer ${access_token}` },
    url: req.query.url,
  };
  request.get(requestOptions, (error, response) => {
    if (!error && response.statusCode === 200) {
      res.send(response.body);
    } else {
      q_logger.error(`Error while sending GET to ${req.body.url}`, response);
      res.send({ error });
    }
  });
});

q_api.makePostEndpoint(routes, '/', '/lifx', (req, res) => {
  const requestOptions = {
    headers: { Authorization: `Bearer ${access_token}` },
    url: req.body.url,
  };
  request.post(requestOptions, (error, response) => {
    if (!error && response.statusCode === 200) {
      res.send(response.body);
    } else {
      q_logger.error(`Error while sending POST to ${req.body.url}`, response);
      res.send({ error });
    }
  });
});

module.exports = routes;
