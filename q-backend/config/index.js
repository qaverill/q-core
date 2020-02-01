const fs = require('fs');
const config = require('./config.json');

const { q_logger } = require('../q-lib');
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
  persistTokens: (granter, access_token, refresh_token, valid_until) => {
    tokens[granter].access_token = access_token;
    tokens[granter].refresh_token = refresh_token;
    tokens[granter].valid_until = valid_until;
    module.exports[granter].access_token = access_token;
    module.exports[granter].refresh_token = refresh_token;
    module.exports[granter].valid_until = valid_until;
    fs.writeFile('./tokens.json', JSON.stringify(tokens, null, 2), writeError => {
      if (writeError) throw writeError;
      q_logger.info(`Persisted new tokens for ${granter}`);
    });
  },
  validate: () => {
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
