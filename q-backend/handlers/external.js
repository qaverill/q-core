const { hitGetEndpoint, hitPostEndpoint, hitPutEndpoint } = require('../resources/methods/external');

module.exports = {
  handleExternalGetRequest: async ({ request, response }) => {
    hitGetEndpoint(request.query.url)
      .then(apiResponse => response.status(200).send(apiResponse))
      .catch(error => response.status(400).send(error));
  },
  handleExternalPostRequest: async ({ request, response }) => {
    hitPostEndpoint(request.body)
      .then(apiResponse => response.status(200).send(apiResponse))
      .catch(error => response.status(400).send(error));
  },
  handleExternalPutRequest: async ({ request, response }) => {
    hitPutEndpoint(request.body)
      .then(apiResponse => response.status(200).send(apiResponse))
      .catch(error => response.status(400).send(error));
  },
};
