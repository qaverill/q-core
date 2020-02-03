const querystring = require('querystring');
const { request: requestModule } = require('request');

const config = require('../config');
const { q_logger } = require('../q-lib');
const { generateRandomString } = require('../utils');

const STATE_KEY = 'spotify_auth_state';

const {
  client_id,
  client_secret,
  scope,
  redirect_uri,
} = config.spotify;

module.exports = {
  handleSpotifyLogin: async ({ response }) => {
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
  },
  handleSpotifyCallback: async ({ request, response }) => {
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
          code: request.query.code || null,
          redirect_uri,
          grant_type: 'authorization_code',
        },
        headers: {
          Authorization: `Basic ${new Buffer(`${client_id}:${client_secret}`).toString('base64')}`,
        },
        json: true,
      };

      requestModule.post(authOptions, (error, tokenResponse, body) => {
        if (!error && tokenResponse.statusCode === 200) {
          config.persistTokens('spotify', body.access_token, body.refresh_token, body.expires_in * 1000 + Date.now());

          response.redirect(`http://localhost:3333/#${
            querystring.stringify({
              access_token: body.access_token,
              refresh_token: body.refresh_token,
            })}`);
        } else {
          q_logger.error('Error posting Spotify auth', tokenResponse);
          response.redirect(`/#${
            querystring.stringify({
              error: 'invalid_token',
            })}`);
        }
      });
    }
  },
  handleTokenCheck: async ({ response }) => {
    if (config.spotify.valid_until < Date.now()) {
      response.send({ valid: false });
    } else {
      response.send({ valid: true });
    }
  },
};
