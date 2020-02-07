const { q_logger } = require('../q-lib/q-logger');
const { dateToTimestamp, msToFullTime } = require('../utils');
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

const mapToSpotifyDocument = async (collection, spotifyResponse) => (
  spotifyResponse.items.map((item) => ({
    _id: dateToTimestamp(item[getTimeParam(collection)]),
    timestamp: dateToTimestamp(item[getTimeParam(collection)]),
    track: item.track.id,
    album: item.track.album.id,
    artists: item.track.artists.map(artist => artist.id),
    popularity: item.track.popularity,
    duration: item.track.duration_ms,
  }))
);

const getNewAvailableData = ({ collection }) => (
  new Promise((resolve, reject) => {
    switch (collection) {
      case 'listens':
        getRecentlyPlayedTracks()
          .then(recentlyPlayedTracks => resolve(
            mapToSpotifyDocument(collection, recentlyPlayedTracks),
          ))
          .catch(reject);
        break;
      case 'saves':
        getMyTracks()
          .then(myTracks => resolve(
            mapToSpotifyDocument(collection, myTracks),
          ))
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
            const unsavedData = newData.filter(newItem => !data.map(d => d._id).includes(newItem._id));
            if (unsavedData.length > 0) {
              postData({ collection, items: unsavedData })
                .then(() => {
                  if (collection === 'saves') {
                    putTracksOntoPlaylist({ tracks: unsavedData, playlist: '6d2V7fQS4CV0XvZr1iOVXJ' })
                      .then(() => resolve(unsavedData))
                      .catch(reject);
                  } else {
                    resolve(unsavedData);
                  }
                })
                .catch(reject);
            } else {
              resolve(unsavedData);
            }
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
        .then((newData) => {
          if (newData.length > 0) {
            q_logger.info(`Successfully mined ${newData.length} ${collection}, will again in ${msToFullTime(timeout)}`);
          } else {
            q_logger.info(`No new ${collection} to mine, will again in ${msToFullTime(timeout)}`);
          }
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
