const request = require('request');
const q_logger = require('q-logger');
const config = require('../../config');

const headers = {
  Authorization: `Bearer ${config.lifx.access_token}`,
};

module.exports = {
  getLights: () => new Promise((resolve, reject) => {
    const url = 'https://api.lifx.com/v1/lights/group:Qa';
    request.get({ url, headers }, (error, response) => {
      const { statusCode, body } = response;
      if (!error && (statusCode === 200 || statusCode === 201)) {
        resolve(JSON.parse(body));
      } else {
        q_logger.error(`Error while sending GET to ${url}`, response.body);
        reject(response.body);
      }
    });
  }),
};
