const requestModule = require('request');
const { q_logger } = require('../q-lib');
const { oathRequestOptions } = require('../utils');

const acceptablePostResponseCodes = [200, 201, 207];

module.exports = {
  hitGetEndpoint: (url) => (
    new Promise((resolve, reject) => {
      requestModule.get(oathRequestOptions({ url }), (error, response) => {
        const { statusCode, body } = response;
        if (!error && (statusCode === 200 || statusCode === 201)) {
          resolve(body);
        } else {
          q_logger.error(`Error while sending GET to ${url}`, error);
          reject(error);
        }
      });
    })
  ),
  hitPostEndpoint: async ({ url, body }) => (
    new Promise((resolve, reject) => {
      requestModule.post(oathRequestOptions({ url, body }), (error, externalResponse) => {
        const { statusCode, body: externalBody } = externalResponse;
        if (!error && acceptablePostResponseCodes.includes(statusCode)) {
          resolve(JSON.parse(externalBody));
        } else {
          q_logger.error(`Error while sending POST to ${url}`, error);
          reject(error);
        }
      });
    })
  ),
  refreshToken: async () => (
    new Promise(resolve => {
      module.exports.hitPostEndpoint({ url: 'https://accounts.spotify.com/api/token' })
        .then(resolve)
        .catch(error => console.log(error));
    })
  ),
  getRecentlyPlayed: async () => {

  },

};
