const { getDocs, postDocs } = require('../resources/methods/internal');
const { getTransactionData } = require('./money/parsing');
const {
  getRecentlyPlayedTracks,
  getMyTracks,
  putTracksOntoPlaylist,
} = require('../ingesting/music');
const { getMinTimestamp } = require('../utils');
// ----------------------------------
// HELPERS
// ----------------------------------
const getRawData = ({ collection, mockIdx }) => new Promise((resolve, reject) => {
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
      getTransactionData()
        .then(resolve)
        .catch(reject);
      break;
    default:
      throw new Error(`Unknown collection in getRawData: ${collection}`);
  }
});
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  ingestData: async ({ collection }) => {
    const rawData = await getRawData({ collection });
    const existingData = await getDocs({ collection, query: { timestamp: { $gte: getMinTimestamp(rawData) }}});
    const newData = rawData.filter(item => !existingData.map(d => d._id).includes(item._id)); // ramda me
    if (newData.length > 0) {
      await postDocs({ collection, docs: newData });
      if (collection === 'saves') {
        await putTracksOntoPlaylist({ tracks: newData, playlist: '6d2V7fQS4CV0XvZr1iOVXJ' })
      }
      return newData;
    }
  },
};
