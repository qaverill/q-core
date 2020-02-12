const { q_logger } = require('../q-lib/q-logger');
const { getData, postData } = require('../api-calls/methods/internal');
const { getBankData } = require('../api-calls/banks');
const {
  getRecentlyPlayedTracks,
  getMyTracks,
  putTracksOntoPlaylist,
} = require('../api-calls/spotify');

const getNewAvailableData = ({ collection }) => (
  new Promise((resolve, reject) => {
    switch (collection) {
      case 'listens':
        getRecentlyPlayedTracks()
          .then(resolve)
          .catch(reject);
        break;
      case 'saves':
        getMyTracks()
          .then(resolve)
          .catch(reject);
        break;
      case 'transactions':
        getBankData()
          .then(resolve)
          .catch(reject);
        break;
      default:
        throw new Error(`Unknown collection in getNewAvailableData: ${collection}`);
    }
  })
);

const mineData = ({ collection }) => (
  new Promise((resolve, reject) => {
    getNewAvailableData({ collection })
      .then(newData => {
        const query = { timestamp: { $gte: Math.min(...newData.map(item => item.timestamp)) } };
        getData({ collection, query })
          .then(data => {
            const unsavedData = newData
              .filter(newItem => !data.map(d => d._id).includes(newItem._id));
            if (unsavedData.length > 0) {
              postData({ collection, items: unsavedData })
                .then(() => {
                  if (collection === 'saves') {
                    putTracksOntoPlaylist({ tracks: unsavedData, playlist: '6d2V7fQS4CV0XvZr1iOVXJ' })
                      .then(() => resolve())
                      .catch(reject);
                  } else {
                    resolve();
                  }
                })
                .catch(reject);
            } else {
              resolve();
            }
          })
          .catch(reject);
      })
      .catch(reject);
  })
);

module.exports = {
  autoMineData: ({ collection, interval, attempts }) => {
    if (!attempts || attempts < 3) {
      mineData({ collection })
        .then(() => {
          if (interval) {
            setTimeout(() => module.exports.autoMineData({ collection, interval }), interval);
          }
        })
        .catch(() => {
          q_logger.warn(`Failed to mine ${collection}... trying again in 3 seconds`);
          setTimeout(() => module.exports.autoMineData({
            collection,
            interval,
            attempts: !attempts ? 1 : attempts + 1,
          }), 3000);
        });
    } else {
      throw new Error(`Failed to mine ${collection} 3 times in a row... ABORT`);
    }
  },
};
