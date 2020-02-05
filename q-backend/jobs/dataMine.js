const { q_logger } = require('../q-lib');

const { getData, postData } = require('../api-calls/internal');
const { hitGetEndpoint, readDataDump } = require('../api-calls/external');

const listensUrl = 'https://api.spotify.com/v1/me/player/recently-played?limit=50';
const savesUrl = 'https://api.spotify.com/v1/me/tracks?limit=50';

const mapToListens = spotifyResponse => {
  // TODO: map the spotify list of tracks to my listens object
};

const mapToSaves = spotifyResponse => {
  // TODO: map the spotify list of tracks to my saves object
};

const getNewAvailableData = async ({ collection }) => {
  switch (collection) {
    case 'listens':
      return mapToListens(hitGetEndpoint(listensUrl));
    case 'saves':
      return mapToSaves(hitGetEndpoint(savesUrl));
    case 'transactions':
      return readDataDump();
    default:
      throw new Error(`Unknown collection in getNewAvailableData: ${collection}`);
  }
};

const startDataMineCycle = ({ collection }) => (
  new Promise((resolve, reject) => {
    getNewAvailableData({ collection }).then(newData => {
      const query = { timestamp: { $gte: Math.min(...newData.map(item => item.timestamp)) } };
      getData({ collection, query }).then(data => {
        const unsavedData = newData.filter(newItem => !data.includes(newItem));
        postData({ collection, items: unsavedData })
          .then(() => resolve())
          .catch(() => reject());
      });
    });
  })
);

module.exports = {
  autoMineData: ({ collection, timeout }) => {
    startDataMineCycle({ collection })
      .then(() => {
        q_logger.info(`Successfully mined ${collection}, will again in ${timeout}ms`);
        setTimeout(() => startDataMineCycle({ collection }), timeout);
      }).catch(() => {
        q_logger.error(`Failed to mine ${collection}, will retry again in ${timeout}ms`);
        setTimeout(() => startDataMineCycle({ collection }), timeout);
      });
  },
};
