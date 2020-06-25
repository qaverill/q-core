const R = require('ramda');
const { hitGetEndpoint } = require('../resources/methods/external');
// ----------------------------------
// HELPERS
// ----------------------------------
const TRACK_TYPE = 'tracks';
const ARTIST_TYPE = 'artists';
const ALBUM_TYPE = 'albums';
const ONE_DAY = 86400;
const spotifyDataEndpoint = (type, items) => `https://api.spotify.com/v1/${type}?ids=${Object.keys(items).join()}`;
const spliceTopN = counts => {
  const N = 5;
  const topN = {};
  Object.keys(counts)
    .sort((a, b) => counts[b] - counts[a])
    .splice(0, N)
    .forEach(key => { topN[key] = counts[key]; });
  return topN;
};
// ----------------------------------
// RESOURCES
// ----------------------------------
module.exports = {
  makeTopPlaysData: async data => {
    let tracks = {};
    let artists = {};
    let albums = {};
    console.log(data);
    function countListen({ track, artists: as, album }) {
      const currentAmount = amount => (amount == null ? 0 : amount);
      tracks[track] = 1 + currentAmount(tracks[track]);
      as.forEach(artist => { artists[artist] = 1 + currentAmount(artists[artist]); });
      albums[album] = 1 + currentAmount(albums[album]);
    }
    R.forEach(countListen, data);

    tracks = spliceTopN(tracks);
    artists = spliceTopN(artists);
    albums = spliceTopN(albums);
    const trackData = await hitGetEndpoint(spotifyDataEndpoint(TRACK_TYPE, tracks));
    const artistData = await hitGetEndpoint(spotifyDataEndpoint(ARTIST_TYPE, artists));
    const albumData = await hitGetEndpoint(spotifyDataEndpoint(ALBUM_TYPE, albums));

    tracks = trackData.tracks.map(t => ({ ...t, count: tracks[t.id], type: TRACK_TYPE }));
    artists = artistData.artists.map(a => ({ ...a, count: artists[a.id], type: ARTIST_TYPE }));
    albums = albumData.albums.map(a => ({ ...a, count: albums[a.id], type: ALBUM_TYPE }));
    return { tracks, artists, albums };
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
