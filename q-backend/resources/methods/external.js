const requestModule = require('request');
const path = require('path');
const fs = require('fs');

const { q_logger } = require('../../q-lib/q-logger');
const { oathRequestOptions } = require('../../utils');

const acceptablePostResponseCodes = [200, 201, 207];

module.exports = {
  hitGetEndpoint: (url) => new Promise((resolve, reject) => {
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
  hitPostEndpoint: ({ url, body }) => new Promise((resolve, reject) => {
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
  hitPutEndpoint: ({ url, body }) => new Promise((resolve, reject) => {
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
  readDataFile: ({ file }) => new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, `../money/data/${file}`), 'UTF-8', (error, data) => {
      if (!error) {
        resolve(data);
      } else {
        q_logger.error(`Error when reading contents of ${file}`, error);
        reject(error);
      }
    });
  }),
  getDirFiles: () => new Promise((resolve, reject) => {
    fs.readdir(path.join(__dirname, '../money/data'), (error, files) => {
      if (!error) {
        resolve(files);
      } else {
        q_logger.error('Error when reading money data', error);
        reject(error);
      }
    });
  }),
};
