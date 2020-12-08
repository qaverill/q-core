const config = require('./config.json');

const tokens = require('./tokens.json'); // TODO: this doesn't seem safe
const { q_logger } = require('../q-logger');

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
};
