const fs = require('fs');
const config = require('./config.json');

const { q_logger } = require('../q-lib');
const tokens = require('./tokens.json');

const { client_id, client_secret } = config.spotify;
const { refreshToken } = require('../api-calls/external');

const writeSpotifyTokens = ({ access_token, valid_until }) => {
  tokens.spotify.access_token = access_token;
  tokens.spotify.valid_until = valid_until;
  module.exports.spotify.access_token = access_token;
  module.exports.spotify.valid_until = valid_until;
  return new Promise((resolve, reject) => {
    fs.writeFile('./config/tokens.json', JSON.stringify(tokens, null, 2), (err) => {
      if (err) reject(err);
      q_logger.info(`Persisted new spotify tokens. Next refresh @ ${valid_until}`);
      resolve();
    });
  });
};

const startSpotifyRefreshCycle = () => {
  refreshToken(module.exports.spotify).then(newToken => {
    const { access_token, expires_in } = newToken;
    const valid_until = expires_in * 1000 + Date.now();
    writeSpotifyTokens({ access_token, valid_until }).then(() => {
      setTimeout(() => startSpotifyRefreshCycle(), (expires_in * 1000) - 1000);
    });
  });
};

module.exports = {
  ...config,
  spotify: {
    ...config.spotify,
    ...tokens.spotify,
    Authorization: `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`,
  },
  lifx: {
    ...config.lifx,
    ...tokens.lifx,
  },
  validateConfig: () => {
    const itemsToValidate = [
      'port',
      'mongo_uri',
      'spotify.client_id',
      'spotify.client_secret',
      'spotify.redirect_uri',
      'spotify.scope',
      'spotify.access_token',
      'spotify.refresh_token',
      'spotify.valid_until',
    ];
    itemsToValidate.forEach(item => {
      const splitItem = item.split('.');
      const itemToValidate = splitItem.length === 2
        ? module.exports[splitItem[0]][splitItem[1]]
        : module.exports[item];
      if (itemToValidate == null) {
        q_logger.error('Missing config parameter: ', item);
        process.exit();
      }
    });
  },
  autoRefreshTokens: () => {
    const timeUntilRefreshIsNeeded = module.exports.spotify.valid_until - new Date().getTime();
    if (timeUntilRefreshIsNeeded > 0) {
      q_logger.info(`Spotify token is still good, will refresh in ${timeUntilRefreshIsNeeded}ms`);
      setTimeout(() => startSpotifyRefreshCycle(), timeUntilRefreshIsNeeded - 1000);
    } else {
      startSpotifyRefreshCycle();
    }
  },
};
