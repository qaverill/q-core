import axios from 'axios';
import queryString from 'query-string';
import { NotificationManager } from 'react-notifications';

export const getTopPlays = (query) => new Promise((resolve, reject) => {
  axios.get(`/music/topPlays?${queryString.stringify(query)}`)
    .then(results => resolve(results.data))
    .catch(error => {
      NotificationManager.error('Failed to get Overview data');
      console.error(error);
      reject(error);
    });
});

export const getDailyPlayTime = (query) => new Promise((resolve, reject) => {
  axios.get(`/music/dailyPlayTime?${queryString.stringify(query)}`)
    .then(results => resolve(results.data))
    .catch(error => {
      NotificationManager.error('Failed to get Daily Play Time data');
      console.error(error);
      reject(error);
    });
});
