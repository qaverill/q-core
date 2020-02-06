const { q_logger } = require('../q-lib/q-logger');
const { dateToTimestamp } = require('../utils');
const { getData, postData } = require('../api-calls/methods/internal');
const { readDataDump } = require('../api-calls/methods/external');
const {
  getRecentlyPlayedTracks,
  getMyTracks,
  putTracksOntoPlaylist,
} = require('../api-calls/spotify');

const getTimeParam = collection => {
  switch (collection) {
    case 'listens':
      return 'played_at';
    case 'saves':
      return 'added_at';
    default:
      q_logger.error(`Unknown collection ${collection} in getTimeParam`);
  }
};

const mapToDocument = (collection, spotifyResponse) => (
  spotifyResponse.items.map(spotifyTrack => ({
    _id: dateToTimestamp(spotifyTrack[getTimeParam(collection)]),
    timestamp: dateToTimestamp(spotifyTrack[getTimeParam(collection)]),
    track: spotifyTrack.id,
    album: spotifyTrack.album.id,
    artists: spotifyTrack.artists.map(artist => artist.id),
    popularity: spotifyTrack.popularity,
    duration: spotifyTrack.duration_ms,
  }))
);

const getNewAvailableData = ({ collection }) => (
  new Promise((resolve, reject) => {
    switch (collection) {
      case 'listens':
        getRecentlyPlayedTracks()
          .then(recentlyPlayedTracks => resolve(mapToDocument(collection, recentlyPlayedTracks)))
          .catch(reject);
        break;
      case 'saves':
        getMyTracks()
          .then(myTracks => resolve(mapToDocument(collection, myTracks)))
          .catch(reject);
        break;
      case 'transactions':
        readDataDump()
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
            const unsavedData = newData.filter(newItem => !data.includes(newItem));
            postData({ collection, items: unsavedData })
              .then(() => {
                if (collection === 'saves') {
                  putTracksOntoPlaylist({ tracks: unsavedData, playlist: '6d2V7fQS4CV0XvZr1iOVXJ' })
                    .then(resolve)
                    .catch(reject);
                } else {
                  resolve();
                }
              })
              .catch(reject);
          })
          .catch(reject);
      })
      .catch(reject);
  })
);

module.exports = {
  autoMineData: ({ collection, timeout, attempts }) => {
    q_logger.info(`Starting ${collection} AUTO MINE...`);
    if (!attempts || attempts < 3) {
      mineData({ collection })
        .then(() => {
          q_logger.info(`Successfully mined ${collection}, will again in ${timeout}ms`);
          if (timeout) {
            setTimeout(() => module.exports.autoMineData({ collection, timeout }), timeout);
          }
        })
        .catch(() => {
          q_logger.warn(`Failed to mine ${collection}... trying again in 3 seconds`);
          setTimeout(() => module.exports.autoMineData({
            collection,
            timeout,
            attempts: !attempts ? 1 : attempts + 1,
          }), 3000);
        });
    } else {
      throw new Error(`Failed to mine ${collection} 3 times in a row... ABORT`);
    }
  },
};
