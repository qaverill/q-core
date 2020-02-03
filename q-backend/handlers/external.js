const { request: requestModule } = require('request');

const { q_logger } = require('../q-lib');
const { oathRequestOptions } = require('../utils');

const acceptablePostResponseCodes = [201, 207];
module.exports = {
  handleExternalGetRequest: ({ request, res }) => {
    const { url } = request.query;
    requestModule.get(oathRequestOptions({ url }), (error, externalResponse) => {
      const { statusCode, body } = externalResponse;
      if (!error && (statusCode === 200 || statusCode === 201)) {
        res.send(body);
      } else {
        q_logger.error(`Error while sending GET to ${url}`, error);
        res.send({ error });
      }
    });
  },
  handleExternalPostRequest: ({ request, res }) => {
    const { url, body } = request.body;
    requestModule.post(oathRequestOptions({ url, body }), (error, externalResponse) => {
      const { statusCode, body: externalBody } = externalResponse;
      if (!error && acceptablePostResponseCodes.includes(statusCode)) {
        res.send(externalBody);
      } else {
        q_logger.error(`Error while sending POST to ${url}`, error);
        res.send({ error });
      }
    });
  },
  handleExternalPutRequest: ({ request, res }) => {
    const { url, body } = request.body;
    requestModule.put(oathRequestOptions({ url, body }), (error, externalResponse) => {
      const { statusCode, body: externalBody } = externalResponse;
      if (!error && acceptablePostResponseCodes.includes(statusCode)) {
        res.send(externalBody);
      } else {
        q_logger.error(`Error while sending PUT to ${url}`, error);
        res.send({ error });
      }
    });
  },
};
