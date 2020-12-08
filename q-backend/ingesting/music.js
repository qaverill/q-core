const { hitGetEndpoint, hitPostEndpoint } = require('../resources/methods/external');
const { dateStringToTimestamp } = require('../utils/time');
const { q_logger } = require('../q-lib/q-logger');

const mapToSpotifyDocument = async ({ response, timeParam }) => (
  response.items.map((item) => ({
    _id: dateStringToTimestamp(item[timeParam]),
    timestamp: dateStringToTimestamp(item[timeParam]),
    track: item.track.id,
    album: item.track.album.id,
    artists: item.track.artists.map(artist => artist.id),
    popularity: item.track.popularity,
    duration: item.track.duration_ms,
  }))
);

module.exports = {
  putTracksOntoPlaylist: ({ tracks, playlist }) => new Promise((resolve, reject) => {
    const url = `https://api.spotify.com/v1/playlists/${playlist}/tracks`;
    const body = { position: 0, uris: tracks.map(({ track }) => `spotify:track:${track}`) };
    hitPostEndpoint({ url, body })
      .then(() => {
        q_logger.info(`Added ${tracks.length} track(s) to spotify:playlist:${playlist}`);
        resolve();
      })
      .catch(error => {
        q_logger.error(`Failed to add ${tracks.length} track(s) to spotify:playlist:${playlist}`);
        reject(error);
      });
  }),
  getRecentlyPlayedTracks: () => new Promise((resolve, reject) => {
    const url = 'https://api.spotify.com/v1/me/player/recently-played?limit=50';
    hitGetEndpoint(url)
      .then(response => resolve(mapToSpotifyDocument({ response, timeParam: 'played_at' })))
      .catch(error => {
        q_logger.error('Failed to get recently played tracks');
        reject(error);
      });
  }),
  getMyTracks: () => new Promise((resolve, reject) => {
    const url = 'https://api.spotify.com/v1/me/tracks?limit=50';
    hitGetEndpoint(url)
      .then(response => resolve(mapToSpotifyDocument({ response, timeParam: 'added_at' })))
      .catch(error => {
        q_logger.error('Failed to get recently played tracks');
        reject(error);
      });
  }),
};
