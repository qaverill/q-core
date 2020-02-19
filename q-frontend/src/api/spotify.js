import axios from 'axios';
import NotificationManager from 'react-notifications';

export const getCPT = () => new Promise((resolve, reject) => {
  axios.get('/spotify', { params: { url: 'https://api.spotify.com/v1/me/player/currently-playing' } })
    .then(response => resolve(Object.keys(response.data).includes('item') ? response.data : null))
    .catch(error => {
      NotificationManager.error('Failed to get currently playing tracks from spotify');
      console.error(error);
      reject(error);
    });
});

export const a = () => 1;
