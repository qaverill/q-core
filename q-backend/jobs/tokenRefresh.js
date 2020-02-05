const fs = require('fs');

const config = require('../config');
const tokens = require('../config/tokens.json');

const { q_logger } = require('../q-lib');

const { hitPostEndpoint } = require('../api-calls/external');

const tokenRefreshUrl = 'https://accounts.spotify.com/api/token';

const writeSpotifyTokens = ({ access_token, valid_until }) => {
  tokens.spotify.access_token = access_token;
  tokens.spotify.valid_until = valid_until;
  config.spotify.access_token = access_token;
  config.spotify.valid_until = valid_until;
  return new Promise((resolve, reject) => {
    fs.writeFile('./config/tokens.json', JSON.stringify(tokens, null, 2), (err) => {
      if (err) reject(err);
      q_logger.info(`Persisted new spotify token. Next refresh @ ${valid_until}`);
      resolve();
    });
  });
};

const startSpotifyRefreshCycle = () => (
  new Promise(resolve => {
    hitPostEndpoint({ url: tokenRefreshUrl }).then(newToken => {
      const { access_token, expires_in } = newToken;
      const valid_until = expires_in * 1000 + Date.now();
      writeSpotifyTokens({ access_token, valid_until }).then(() => {
        setTimeout(() => startSpotifyRefreshCycle(), (expires_in * 1000) - 1000);
        resolve();
      });
    });
  })
);

module.exports = {
  autoRefreshTokens: () => {
    const timeUntilRefreshIsNeeded = config.spotify.valid_until - new Date().getTime();
    return new Promise(resolve => {
      if (timeUntilRefreshIsNeeded > 0) {
        q_logger.info(`Spotify token is still good, will refresh in ${timeUntilRefreshIsNeeded}ms`);
        setTimeout(() => startSpotifyRefreshCycle(tokens), timeUntilRefreshIsNeeded - 1000);
        resolve();
      } else {
        startSpotifyRefreshCycle().then(resolve);
      }
    });
  },
};
