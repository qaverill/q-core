import axios from 'axios';
import { stringify } from 'query-string';
import { NotificationManager } from 'react-notifications';

// ----------------------------------
// REQUESTS
// ----------------------------------
export const getTopPlays = (query) => new Promise((resolve, reject) => {
  axios.get(`/music/topPlays?${stringify(query)}`)
    .then(results => resolve(results.data))
    .catch(error => {
      NotificationManager.error('Failed to get Overview data');
      console.error(error);
      reject(error);
    });
});
export const getDailyPlayTime = (query) => new Promise((resolve, reject) => {
  axios.get(`/music/dailyPlayTime?${stringify(query)}`)
    .then(results => resolve(results.data))
    .catch(error => {
      NotificationManager.error('Failed to get Daily Play Time data');
      console.error(error);
      reject(error);
    });
});
