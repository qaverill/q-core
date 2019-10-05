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
  const state = q_utils.generateRandomString(16);
  res.cookie(STATE_KEY, state);

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: config.spotify.client_id,
      scope: config.spotify.scope,
      redirect_uri: config.spotify.redirect_uri,
      state: state
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
        config.persistTokens('spotify', body.access_token, body.refresh_token, body.expires_in * 1000 + Date.now());

        res.redirect('http://localhost:3333/#' +
          querystring.stringify({
            access_token: body.access_token,
            refresh_token: body.refresh_token
          }));
      } else {
        q_logger.error('Error posting Spotify auth', response);
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