const logger = require('@q/logger');
const config = require('./config.json');
const tokens = require('./tokens.json');

module.exports = {
  ...config,
  spotify: {
    ...config.spotify,
    ...tokens.spotify,
  },
  lifx: {
    ...config.lifx,
    ...tokens.lifx,
  },
  validateConfig: () => {
    const itemsToValidate = [
      'port',
      'MONGO_URI',
      'MONGO_DB',
      'MONGO_PARAMS',
      'SQL_CONFIG',
      'spotify.client_id',
      'spotify.client_secret',
      'spotify.redirect_uri',
      'spotify.scope',
      'spotify.access_token',
      'spotify.refresh_token',
      'spotify.valid_until',
    ];
    itemsToValidate.forEach((item) => {
      const splitItem = item.split('.');
      const itemToValidate = splitItem.length === 2
        ? module.exports[splitItem[0]][splitItem[1]]
        : module.exports[item];
      if (itemToValidate == null) {
        logger.error('Missing config parameter: ', item);
        process.exit();
      }
    });
  },
};
