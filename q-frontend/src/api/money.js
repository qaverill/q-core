import axios from 'axios';
import * as R from 'ramda';
import { stringify } from 'query-string';
import { NotificationManager } from 'react-notifications';

export const getTransactions = query => new Promise((resolve, reject) => {
  axios.get(`/money/transactions?${stringify(query)}`)
    .then(R.pipe(R.prop('data'), resolve))
    .catch(error => {
      NotificationManager.error('Failed to get transactions');
      console.error(error);
      reject(error);
    });
});

export const runTransactionTagger = () => new Promise((resolve, reject) => {
  axios.get('/money/tagAllTransactions')
    .then(R.pipe(R.prop('data'), resolve))
    .catch(error => {
      NotificationManager.error('Failed to run auto tag on all transactions');
      console.error(error);
      reject(error);
    });
});
