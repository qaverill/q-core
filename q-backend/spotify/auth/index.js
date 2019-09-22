const express = require('express');
const routes = express.Router();
const request = require('request');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const config = require('config');
const q_logger = require('q-logger');
const q_utils = require('q-utils');

const STATE_KEY = 'spotify_auth_state';

routes.use(express.static(__dirname + '/public')).use(cookieParser());

routes.get('/login', (req, res) => {
  res.cookie(STATE_KEY, state);

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: config.spotify.client_id,
      scope: config.spotify.scope,
      redirect_uri: config.spotify.redirect_uri,
      state: q_utils.generateRandomString(16)
    }));
});

routes.get('/callback', (req, res) => {
  let state = req.query.state || null;
  let storedState = req.cookies ? req.cookies[STATE_KEY] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(STATE_KEY);
    let authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: req.query.code || null,
        redirect_uri: config.spotify.redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': `Basic ${new Buffer(config.spotify.client_id + ':' + config.spotify.client_secret).toString('base64')}`
      },
      json: true
    };

    request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        q_logger.warn("TODO: make better use of this data from GET spotify/auth/callback", body);
        config.setTokens('spotify', body.access_token, body.refresh_token);

        res.redirect('http://localhost:3000/#' +
          querystring.stringify({
            access_token: body.access_token,
            refresh_token: body.refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

console.log('  GET  /spotify/auth/login');
console.log('  GET  /spotify/auth/callback');

module.exports = routes;