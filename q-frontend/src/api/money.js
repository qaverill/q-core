import axios from 'axios';
import * as R from 'ramda';
import { stringify } from 'query-string';
import { NotificationManager } from 'react-notifications';
// ----------------------------------
// CONSTANTS
// ----------------------------------
export const BIN_SIZES = {
  BI_MONTHLY: 'BI_MONTHLY',
};
// ----------------------------------
// API CALLS
// ----------------------------------
export const getTransactions = query => new Promise((resolve, reject) => {
  // query = { start, end, filter }
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
export const getBinnedNetAmounts = query => new Promise((resolve, reject) => {
  // query = { start, end, filter, binSize }
  axios.get(`/money/netAmount?${stringify(query)}`)
    .then(R.pipe(R.prop('data'), resolve))
    .catch(error => {
      NotificationManager.error('Failed to get netAmount');
      console.error(error);
      reject(error);
    });
});
