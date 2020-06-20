import axios from 'axios';
import queryString from 'query-string';
import { NotificationManager } from 'react-notifications';

export const getChartData = (query) => new Promise((resolve, reject) => {
  axios.get(`/music/charts?${queryString.stringify(query)}`)
    .then(results => resolve(results.data))
    .catch(error => {
      NotificationManager.error('Failed to get music chart data');
      console.error(error);
      reject(error);
    });
});

export const deleteme = 1;
