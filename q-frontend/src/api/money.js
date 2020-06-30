import axios from 'axios';
import { stringify } from 'query-string';
import { NotificationManager } from 'react-notifications';

export const getTransactions = (query) => new Promise((resolve, reject) => {
  axios.get(`/money/transactions?${stringify(query)}`)
    .then(results => resolve(results.data))
    .catch(error => {
      NotificationManager.error('Failed to get transactions');
      console.error(error);
      reject(error);
    });
});

export const deleteme = true;
