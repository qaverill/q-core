const R = require('ramda');
const { hitGetEndpoint } = require('../resources/methods/external');
const { ONE_DAY } = require('../utils/time');
// ----------------------------------
// HELPERS
// ----------------------------------
const TRACK_TYPE = 'tracks';
const ARTIST_TYPE = 'artists';
const ALBUM_TYPE = 'albums';
const spotifyDataEndpoint = (type, listings) => `https://api.spotify.com/v1/${type}?ids=${Object.keys(listings).join()}`;
const gatherData = async (type, listings) => {
  const data = await hitGetEndpoint(spotifyDataEndpoint(type, listings));
  return R.prop(type, data).map(o => ({ ...o, ...R.prop(o.id, listings), type }))
}
const spliceTopNAndGatherData = async (listings, type) => {
  const N = 5;
  function cutTopN(listings, field) {
    const topN = {};
    Object.keys(listings)
      .sort((a, b) => R.prop(field, listings[b]) - R.prop(field, listings[a]))
      .splice(0, N)
      .forEach(key => { topN[key] = listings[key]; });
    return topN;
  }
  return {
    byCount: await gatherData(type, cutTopN(listings, 'count')),
    byTime: await gatherData(type, cutTopN(listings, 'time')),
  };
};
const tallyChart = (listing, duration) => ({
  count: R.isNil(listing) ? 1 : listing.count + 1,
  time: R.isNil(listing) ? duration : listing.time + duration,
});
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  makeTopPlaysData: async data => {
    let topTracks = {};
    let topArtists = {};
    let topAlbums = {};
    function countListen({ track, artists, album, duration }) {
      topTracks[track] = tallyChart(topTracks[track], duration);
      artists.forEach(artist => { topArtists[artist] = tallyChart(topArtists[artist], duration); });
      topAlbums[album] = tallyChart(topAlbums[album], duration);
    }
    R.forEach(countListen, data);

    topTracks = await spliceTopNAndGatherData(topTracks, TRACK_TYPE);
    topArtists = await spliceTopNAndGatherData(topArtists, ARTIST_TYPE);
    topAlbums = await spliceTopNAndGatherData(topAlbums, ALBUM_TYPE);
    return { topTracks, topArtists, topAlbums };
  },
  makeDailyPlayTimeData: async (start, listens) => {
    const dailyPlayTime = [];
    let binStart = parseInt(start, 10);
    let playTime = 0;
    function binListen({ timestamp, duration }) {
      if (timestamp < binStart + ONE_DAY) {
        playTime += duration;
      } else {
        dailyPlayTime.push({ date: binStart, playTime });
        binStart += ONE_DAY;
        while (timestamp > binStart + ONE_DAY) {
          dailyPlayTime.push({ date: binStart, playTime: 0 });
          binStart += ONE_DAY;
        }
        playTime = duration;
      }
    }
    R.forEach(binListen, R.sortBy(R.prop('timestamp'), listens));
    dailyPlayTime.push({ date: binStart, playTime });
    return dailyPlayTime;
  },
};
