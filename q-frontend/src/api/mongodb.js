/* eslint-disable no-unused-vars */
import axios from 'axios';
import queryString from 'query-string';
import { NotificationManager } from 'react-notifications';
// ----------------------------------
// HELPERS
// ----------------------------------
const readDocuments = ({ collection, _id, query }) => new Promise((resolve, reject) => {
  axios.get(`/mongodb/${collection}${_id ? `/${_id}` : ''}?${queryString.stringify(query)}`)
    .then(results => resolve(results.data))
    .catch(error => {
      NotificationManager.error(`Failed to fetch documents in ${collection}`, `${_id ? `_id: ${_id}` : ''}`);
      console.error(error);
      reject(error);
    });
});
const writeDocument = ({ collection, _id, document }) => new Promise((resolve, reject) => {
  axios.put(`/mongodb/${collection}/${_id}`, document)
    .then(resolve)
    .catch(error => {
      NotificationManager.error(`Failed to write document to ${collection}`, `_id: ${_id}`);
      console.error(error);
      reject(error);
    });
});
// ----------------------------------
// REQUESTS
// ----------------------------------
const collection = 'metadata';
const _id = 'settings';
export const readSettings = () => readDocuments({ collection, _id });
export const writeSettings = settings => writeDocument({ collection, _id, document: settings });
