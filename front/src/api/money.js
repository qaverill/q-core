import axios from 'axios';
import * as R from 'ramda';
import { stringify } from 'query-string';
import { NotificationManager } from 'react-notifications';
// ----------------------------------
// CONSTANTS
// ----------------------------------
// ----------------------------------
// REQUESTS
// ----------------------------------
export const getTransactions = query => new Promise((resolve, reject) => {
  // query = { start, end, filter }
  axios.get(`/money/transactions?${stringify(query)}`)
    .then(({ data }) => resolve(data))
    .catch(error => {
      NotificationManager.error('Failed to get transactions');
      console.error(error);
      reject(error);
    });
});
export const reingestTransactions = query => new Promise((resolve, reject) => {
  // query = { start, end, filter }
  axios.get(`/money/reingest?${stringify(query)}`)
    .then(R.pipe(R.prop('data'), resolve))
    .catch(error => {
      NotificationManager.error('Failed to reingest transactions');
      console.error(error);
      reject(error);
    });
});
export const markPaybackTransaction = params => new Promise((resolve, reject) => {
  // params = { from, to, amount }
  axios.post('/money/paybackTransaction', params)
    .then(resolve)
    .catch(error => {
      NotificationManager.error('Failed to payback');
      console.error(error);
      reject(error);
    });
});
export const getBiMonthlyAnalysis = query => new Promise((resolve, reject) => {
  // query = { start, end, filter }
  axios.get(`/money/biMonthlyAnalysis?${stringify(query)}`)
    .then(R.pipe(R.prop('data'), resolve))
    .catch(error => {
      NotificationManager.error('Failed to get netAmount');
      console.error(error);
      reject(error);
    });
});
