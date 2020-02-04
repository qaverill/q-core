const { request: requestModule } = require('request');

const { q_logger } = require('../q-lib');
const { oathRequestOptions } = require('../utils');

const { hitGetEndpoint } = require('../api-calls/external');

const acceptablePostResponseCodes = [201, 207];
module.exports = {
  handleExternalGetRequest: ({ request, response }) => {
    hitGetEndpoint(request.query.url)
      .then(apiResponse => response.send(apiResponse))
      .catch(error => response.send(error));
  },
  handleExternalPostRequest: ({ request, response }) => {
    const { url, body } = request.body;
    requestModule.post(oathRequestOptions({ url, body }), (error, externalResponse) => {
      const { statusCode, body: externalBody } = externalResponse;
      if (!error && acceptablePostResponseCodes.includes(statusCode)) {
        response.send(externalBody);
      } else {
        q_logger.error(`Error while sending POST to ${url}`, error);
        response.send({ error });
      }
    });
  },
  handleExternalPutRequest: ({ request, response }) => {
    const { url, body } = request.body;
    requestModule.put(oathRequestOptions({ url, body }), (error, externalResponse) => {
      const { statusCode, body: externalBody } = externalResponse;
      if (!error && acceptablePostResponseCodes.includes(statusCode)) {
        response.send(externalBody);
      } else {
        q_logger.error(`Error while sending PUT to ${url}`, error);
        response.send({ error });
      }
    });
  },
};
