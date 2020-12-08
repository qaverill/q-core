import axios from 'axios';
import { NotificationManager } from 'react-notifications';
import stringSimilarity from 'string-similarity';
// ----------------------------------
// HELPERS
// ----------------------------------
let tokenSource;
const TYPES = ['track', 'artist', 'album'];
// ----------------------------------
// REQUESTS
// ----------------------------------
export const getCurrentlyPlayingTrack = () => new Promise((resolve, reject) => {
  axios.get('/spotify', { params: { url: 'https://api.spotify.com/v1/me/player/currently-playing' } })
    .then(response => resolve(Object.keys(response.data).includes('item') ? response.data : null))
    .catch(error => {
      NotificationManager.error('Failed to get currently playing tracks from spotify');
      console.error(error);
      reject(error);
    });
});
export const searchSpotify = async searchString => {
  try {
    if (typeof tokenSource !== typeof undefined) {
      tokenSource.cancel('Operation canceled due to new request.');
    }

    tokenSource = axios.CancelToken.source();

    const { data } = await axios.get('/spotify', {
      params: { url: `https://api.spotify.com/v1/search?q=${searchString}&type=track,artist,album&limit=3` },
      cancelToken: tokenSource.token,
    });
    const result = TYPES
      .map(type => (
        data[`${type}s`].items.map(item => ({
          name: item.name,
          filter: item.id,
          confidence: stringSimilarity.compareTwoStrings(item.name, searchString),
          type,
        }))
      ))
      .flat()
      .filter(item => item.confidence > 0.5)
      .sort((a, b) => b.confidence - a.confidence);
    return { result };
  } catch (err) {
    NotificationManager.error('Failed to search spotify');
    console.error(err);
    if (axios.isCancel(err)) return { cancelPrevQuery: true };
    return [err];
  }
};
