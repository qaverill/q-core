import axios from 'axios';
import NotificationManager from 'react-notifications';
import stringSimilarity from 'string-similarity';


export const getCPT = () => new Promise((resolve, reject) => {
  axios.get('/spotify', { params: { url: 'https://api.spotify.com/v1/me/player/currently-playing' } })
    .then(response => resolve(Object.keys(response.data).includes('item') ? response.data : null))
    .catch(error => {
      NotificationManager.error('Failed to get currently playing tracks from spotify');
      console.error(error);
      reject(error);
    });
});

export const searchSpotify = (searchString) => new Promise((resolve, reject) => {
  const types = ['track', 'artist', 'album'];
  axios.get('/spotify', { params: { url: `https://api.spotify.com/v1/search?q=${searchString}&type=track,artist,album&limit=3` } })
    .then(res => {
      resolve({
        suggestions: types
          .map(type => (
            res.data[`${type}s`].items.map(item => ({
              name: item.name,
              filter: item.id,
              confidence: stringSimilarity.compareTwoStrings(item.name, searchString),
              type,
            }))
          ))
          .flat()
          .filter(item => item.confidence > 0.5)
          .sort((a, b) => b.confidence - a.confidence),
      });
    }).catch(error => {
      NotificationManager.error('Failed to search spotify');
      console.error(error);
      reject(error);
    });
});
