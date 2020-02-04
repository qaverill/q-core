const requestModule = require('request');
const { q_logger } = require('../q-lib');
const { oathRequestOptions } = require('../utils');

module.exports = {
  refreshToken: ({ Authorization, refresh_token }) => {
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { Authorization },
      form: { grant_type: 'refresh_token', refresh_token },
      json: true,
    };

    return new Promise(resolve => {
      requestModule.post(authOptions, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          resolve(body);
        }
      });
    });
  },
  hitGetEndpoint: async (url) => (
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
    });
  ),
  getRecentlyPlayed: async () => {

  },

};
