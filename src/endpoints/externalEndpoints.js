const requestModule = require('request');
const path = require('path');
const fs = require('fs');
const q_logger = require('q-logger');
const config = require('../config');
// ----------------------------------
// HELPERS
// ----------------------------------
const acceptablePostResponseCodes = [200, 201, 207];
const oathRequestOptions = ({ url, body }) => {
  const { spotify, lifx } = config;
  let Authorization = null;
  if (url.includes('token')) {
    Authorization = `Basic ${Buffer.from(`${spotify.client_id}:${spotify.client_secret}`).toString('base64')}`;
  } if (url.includes('spotify')) {
    Authorization = `Bearer ${spotify.access_token}`;
  return {
    ...url.requestOptions,
    headers: {
      Authorization,
      'Content-Type': body && 'application/json',
    },
    body,
    json: body ? true : null,
    form: url.includes('token') ? {
      grant_type: 'refresh_token',
      refresh_token: spotify.refresh_token,
    } : null,
  };
};
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  hitExternalGet: (url) => new Promise((resolve, reject) => {
    requestModule.get(oathRequestOptions({ url }), (error, response) => {
      const { statusCode, body } = response;
      if (!error && (statusCode === 200 || statusCode === 201)) {
        resolve(JSON.parse(body));
      } else {
        q_logger.error(`Error while sending GET to ${url}`, error);
        reject(error);
      }
    });
  }),
  hitExternalPost: ({ url, body }) => new Promise((resolve, reject) => {
    requestModule.post(oathRequestOptions({ url, body }), (error, externalResponse) => {
      const { statusCode, body: externalBody } = externalResponse;
      if (!error && acceptablePostResponseCodes.includes(statusCode)) {
        resolve(externalBody);
      } else {
        q_logger.error(`Error while sending POST to ${url}`, error);
        reject(error);
      }
    });
  }),
  hitExternalPut: ({ url, body }) => new Promise((resolve, reject) => {
    requestModule.put(oathRequestOptions({ url, body }), (error, externalResponse) => {
      const { statusCode, body: externalBody } = externalResponse;
      if (!error && acceptablePostResponseCodes.includes(statusCode)) {
        resolve(externalBody);
      } else {
        q_logger.error(`Error while sending PUT to ${url}`, error);
        reject(error);
      }
    });
  }),
  readContentsOfFile: (file) => new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, `../../ingesting/money/data/${file}`), 'UTF-8', (error, data) => {
      if (!error) {
        resolve(data);
      } else {
        q_logger.error(`Error when reading contents of ${file}`, error);
        reject(error);
      }
    });
  }),
};
