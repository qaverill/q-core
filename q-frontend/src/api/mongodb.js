import axios from 'axios';
import NotificationManager from 'react-notifications';
import queryString from 'query-string';

export const fetchDocuments = ({ collection, _id, query }) => new Promise((resolve, reject) => {
  axios.get(`/mongodb/${collection}${_id ? `/${_id}` : ''}${queryString.stringify(query)}`)
    .then(results => resolve(results.data))
    .catch(error => {
      NotificationManager.error(`Failed to fetch documents in ${collection}`, `${_id ? `_id: ${_id}` : ''}`);
      console.error(error);
      reject(error);
    });
});

export const writeDocument = ({ collection, _id, document }) => new Promise((resolve, reject) => {
  axios.put(`/mongodb/${collection}/${_id}`, document)
    .then(resolve)
    .catch(error => {
      NotificationManager.error(`Failed to write document to ${collection}`, `_id: ${_id}`);
      console.error(error);
      reject(error);
    });
});

export const saveSettings = settings => {
  const collection = 'metadata';
  const _id = 'settings';
  writeDocument({ collection, _id, document: settings });
};

export const a = () => 1;
