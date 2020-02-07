const fs = require('fs');

const config = require('../config');
const tokens = require('../config/tokens.json');

const { q_logger } = require('../q-lib/q-logger');
const { msToFullTime } = require('../utils');

const { hitPostEndpoint } = require('../api-calls/methods/external');

const writeSpotifyTokens = ({ access_token, valid_until }) => (
  new Promise((resolve, reject) => {
    tokens.spotify.access_token = access_token;
    tokens.spotify.valid_until = valid_until;
    config.spotify.access_token = access_token;
    config.spotify.valid_until = valid_until;
    fs.writeFile('./config/tokens.json', JSON.stringify(tokens, null, 2), (err) => {
      if (err) {
        q_logger.error('Failed to write spotify tokens to tokens.json file', err);
        reject(err);
      } else {
        resolve();
      }
    });
  })
);

const refreshTokens = () => (
  new Promise((resolve, reject) => {
    hitPostEndpoint({ url: 'https://accounts.spotify.com/api/token' })
      .then(newToken => {
        const { access_token, expires_in } = newToken;
        const valid_until = expires_in * 1000 + Date.now();
        writeSpotifyTokens({ access_token, valid_until })
          .then(() => resolve({ newToken, valid_until }))
          .catch(reject);
      })
      .catch(reject);
  })
);

module.exports = {
  autoRefreshTokens: (attempts) => (
    new Promise((resolve, reject) => {
      q_logger.info('Starting AUTO REFRESH');
      if (!attempts || attempts < 3) {
        const timeUntilRefreshIsNeeded = config.spotify.valid_until - new Date().getTime();
        if (timeUntilRefreshIsNeeded > 0) {
          q_logger.info(`Spotify token is still good, will refresh in ${msToFullTime(timeUntilRefreshIsNeeded)}`);
          setTimeout(() => module.exports.autoRefreshTokens(), timeUntilRefreshIsNeeded + 1);
          resolve();
        } else {
          refreshTokens()
            .then((newToken) => {
              q_logger.info(`Persisted new spotify token. Next refresh @ ${newToken.valid_until}`);
              setTimeout(() => module.exports.autoRefreshTokens(), newToken.expires_in + 1);
              resolve();
            })
            .catch(() => {
              q_logger.warn('Failed to refresh tokens... trying again in 3 seconds');
              setTimeout(() => module.exports.autoRefreshTokens(!attempts ? 1 : attempts + 1), 3000);
            });
        }
      } else {
        reject();
        throw new Error('Failed to refreshTokens 3 times in a row... ABORT');
      }
    })
  ),
};
