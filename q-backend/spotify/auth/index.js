const express = require('express');
const routes = express.Router();
const request = require('request');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const q_logger = require('q-logger');

const stateKey = 'spotify_auth_state';

const generateRandomString = function(length) {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

routes.use(express.static(__dirname + '/public')).use(cookieParser());

routes.get('/login', function(req, res) {
  let state = generateRandomString(16);
  res.cookie(stateKey, state);

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope: process.env.SPOTIFY_SCOPE,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      state: state
    }));
});

routes.get('/callback', function(req, res) {
  let code = req.query.code || null;
  let state = req.query.state || null;
  let storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    let authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        global.spotifyAuth = {
          "token": body.access_token,
          "expiresTimestampMs": body.expires_in * 1000 + Date.now()
        };

        let access_token = body.access_token;
        let refresh_token = body.refresh_token;

        // we can also pass the token to the browser to make requests from there
        res.redirect('http://localhost:3000/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
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

routes.get('/tokens', function(req, res) {
  res.send(global.spotifyAuth);
});

console.log('  GET  /spotify/auth/login');
console.log('  GET  /spotify/auth/callback');
console.log('  GET  /spotify/auth/tokens');

module.exports = routes;