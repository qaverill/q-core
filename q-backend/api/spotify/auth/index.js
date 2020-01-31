const express = require('express');

const routes = express.Router();
const request = require('request');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');

const config = require('../../../config');
const { q_api, q_logger } = require('../../../q-lib');
const { generateRandomString } = require('../../../utils');

const STATE_KEY = 'spotify_auth_state';

const {
  client_id,
  client_secret,
  scope,
  redirect_uri,
} = config.spotify;

routes.use(express.static(`${__dirname}/public`)).use(cookieParser());

let path = '/login';
let title = '/spotify/auth/login';

q_api.makeGetEndpoint({ routes, path, title }, async ({ response }) => {
  const state = generateRandomString(16);
  response.cookie(STATE_KEY, state);

  response.redirect(`https://accounts.spotify.com/authorize?${
    querystring.stringify({
      response_type: 'code',
      client_id,
      scope,
      redirect_uri,
      state,
    })}`);
});

path = '/callback';
title = '/spotify/auth/callback';

q_api.makeGetEndpoint({ routes, path, title }, async ({ request, response }) => {
  const state = request.query.state || null;
  const storedState = request.cookies ? request.cookies[STATE_KEY] : null;

  if (state === null || state !== storedState) {
    response.redirect(`/#${
      querystring.stringify({
        error: 'state_mismatch',
      })}`);
  } else {
    response.clearCookie(STATE_KEY);
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: req.query.code || null,
        redirect_uri,
        grant_type: 'authorization_code',
      },
      headers: {
        Authorization: `Basic ${new Buffer(`${client_id}:${client_secret}`).toString('base64')}`,
      },
      json: true,
    };

    request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        config.persistTokens('spotify', body.access_token, body.refresh_token, body.expires_in * 1000 + Date.now());

        res.redirect(`http://localhost:3333/#${
          querystring.stringify({
            access_token: body.access_token,
            refresh_token: body.refresh_token,
          })}`);
      } else {
        q_logger.error('Error posting Spotify auth', response);
        res.redirect(`/#${
          querystring.stringify({
            error: 'invalid_token',
          })}`);
      }
    });
  }
});

module.exports = routes;
