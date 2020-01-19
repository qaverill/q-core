const request = require('request');
const { q_logger } = require('q-lib');

const { oathRequestOptions } = require('../utils');

const acceptablePostResponseCodes = [201, 207];
module.exports = {
  handleExternalGetRequest: ({ req, res, then }) => {
    const { url } = req.query;
    request.get(oathRequestOptions({ url }), (error, response) => {
      if (!error && (response.statusCode === 200 || response.statusCode === 201)) {
        res.send(response.body);
      } else {
        q_logger.error(`Error while sending GET to ${url}`, response);
        res.send({ error });
      }
      then();
    });
  },
  handleExternalPostRequest: ({ req, res, then }) => {
    const { url, body } = req.body;
    request.post(oathRequestOptions({ url, body }), (error, response) => {
      if (!error && acceptablePostResponseCodes.includes(response.statusCode)) {
        res.send(response.body);
      } else {
        q_logger.error(`Error while sending POST to ${url}`, response);
        res.send({ error });
      }
      then();
    });
  },
};
