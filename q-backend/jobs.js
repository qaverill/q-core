const fs = require('fs');

const config = require('./config');
const tokens = require('./config/tokens.json');

const { q_logger } = require('./q-lib');

const { refreshToken } = require('./api-calls/external');

const { getRecentlyPlayed, getMyTracks, getTransactions } = require('./api-calls/external');
const { postData } = require('./api-calls/internal');

module.exports = {
  autoRefreshTokens: () => {
    const startSpotifyRefreshCycle = () => {
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
      return new Promise(resolve => {
        refreshToken(config.spotify).then(newToken => {
          const { access_token, expires_in } = newToken;
          const valid_until = expires_in * 1000 + Date.now();
          writeSpotifyTokens({ access_token, valid_until }).then(() => {
            setTimeout(() => startSpotifyRefreshCycle(), (expires_in * 1000) - 1000);
            resolve();
          });
        });
      });
    };
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
  autoMineData: ({ collection, timeout }) => {
    const startDataMineCycle = () => {
      const getExistingData = async ({ start }) => {
        switch (collection) {
          case 'listens':
            return getListens({ start });
          case 'saves':
            return getSaves({ start });
          case 'transactions':
            return getTransactions({ start });
          default:
            throw new Error(`Unknown collection in getExistingData: ${collection}`);
        }
      };
      const getNewAvailableData = async () => {
        switch (collection) {
          case 'listens':
            return getRecentlyPlayed();
          case 'saves':
            return getMyTracks();
          case 'transactions':
            return readDataDump();
          default:
            throw new Error(`Unknown collection in getNewAvailableData: ${collection}`);
        }
      };
      return new Promise((resolve, reject) => {
        getNewAvailableData({ collection }).then(newData => {
          const youngestItem = Math.min(...newData.map(item => item.timestamp));
          getExistingData({ collection, start: youngestItem }).then(existingData => {
            const unsavedData = newData.filter(newItem => !existingData.includes(newItem));
            postData({ collection, items: unsavedData })
              .then(() => resolve())
              .catch(() => reject());
          });
        });
      });
    };

    startDataMineCycle()
      .then(() => {
        q_logger.info(`Successfully mined ${collection}, will again in ${timeout}ms`);
        setTimeout(() => startDataMineCycle(), timeout);
      }).catch(() => {
        q_logger.error(`Failed to mine ${collection}, will retry again in ${timeout}ms`);
        setTimeout(() => startDataMineCycle(), timeout);
      });
  },
};
