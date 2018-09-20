const express = require('express');
const auth = express.Router();
const request = require('request');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');

const stateKey = 'spotify_auth_state';

const generateRandomString = function(length) {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

auth.use(express.static(__dirname + '/public')).use(cookieParser());

auth.get('/login', function(req, res) {
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

auth.get('/callback', function(req, res) {
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
        global.spotifyAuthTokens = body;

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

auth.get('/refresh_token', function(req, res) {
  // requesting access token from refresh token
  let refresh_token = req.query.refresh_token;
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      let access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});
auth.get('/tokens', function(req, res) {
  res.send(global.spotifyAuthTokens);
});

console.log('GET\t/spotify/auth/login');
console.log('GET\t/spotify/auth/callback');
console.log('GET\t/spotify/auth/refresh_token');
console.log('GET\t/spotify/auth/tokens');

module.exports = auth;