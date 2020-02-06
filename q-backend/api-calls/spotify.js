const { hitGetEndpoint, hitPostEndpoint } = require('./methods/external')
const { q_logger } = require('../q-lib/q-logger');

module.exports = {
  putTracksOntoPlaylist: ({ tracks, playlist }) => (
    new Promise((resolve, reject) => {
      const url = `https://api.spotify.com/v1/playlists/${playlist}/tracks`;
      const body = { position: 0, uris: tracks.map(({ track }) => `spotify:track:${track}`) };
      hitPostEndpoint({ url, body })
        .then(() => {
          q_logger.info(`Added ${tracks.length} to the playlist ${playlist}`);
          resolve();
        })
        .catch(() => {
          q_logger.error(`Failed to add ${tracks.length} to the playlist ${playlist}`);
          reject();
        });
    })
  ),
  getRecentlyPlayedTracks: () => (
    new Promise((resolve, reject) => {
      const url = 'https://api.spotify.com/v1/me/player/recently-played?limit=50';
      hitGetEndpoint(url)
        .then(resolve)
        .catch(() => {
          q_logger.error('Failed to get recently played tracks');
          reject();
        });
    })
  ),
  getMyTracks: () => (
    new Promise((resolve, reject) => {
      const url = 'https://api.spotify.com/v1/me/tracks?limit=50';
      hitGetEndpoint(url)
        .then(resolve)
        .catch(() => {
          q_logger.error('Failed to get recently played tracks');
          reject();
        });
    })
  ),
};
