const { hitGetEndpoint, hitPostEndpoint } = require('./methods/external');
const { dateToTimestamp } = require('../utils');
const { q_logger } = require('../q-lib/q-logger');

const mapToSpotifyDocument = async ({ response, timeParam }) => (
  response.items.map((item) => ({
    _id: dateToTimestamp(item[timeParam]),
    timestamp: dateToTimestamp(item[timeParam]),
    track: item.track.id,
    album: item.track.album.id,
    artists: item.track.artists.map(artist => artist.id),
    popularity: item.track.popularity,
    duration: item.track.duration_ms,
  }))
);

module.exports = {
  putTracksOntoPlaylist: ({ tracks, playlist }) => (
    new Promise((resolve, reject) => {
      const url = `https://api.spotify.com/v1/playlists/${playlist}/tracks`;
      const body = { position: 0, uris: tracks.map(({ track }) => `spotify:track:${track}`) };
      hitPostEndpoint({ url, body })
        .then(() => {
          q_logger.info(`Added ${tracks.length} track(s) to spotify:playlist:${playlist}`);
          resolve();
        })
        .catch(() => {
          q_logger.error(`Failed to add ${tracks.length} track(s) to spotify:playlist:${playlist}`);
          reject();
        });
    })
  ),
  getRecentlyPlayedTracks: () => (
    new Promise((resolve, reject) => {
      const url = 'https://api.spotify.com/v1/me/player/recently-played?limit=50';
      hitGetEndpoint(url)
        .then(response => {
          resolve(mapToSpotifyDocument({ response, timeParam: 'played_at' }));
        })
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
        .then(response => {
          resolve(mapToSpotifyDocument({ response, timeParam: 'added_at' })); 
        })
        .catch(() => {
          q_logger.error('Failed to get recently played tracks');
          reject();
        });
    })
  ),
};
