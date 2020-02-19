const { hitGetEndpoint, hitPostEndpoint, hitPutEndpoint } = require('../resources/methods/external');

module.exports = {
  handleExternalGetRequest: ({ request, response }) => {
    hitGetEndpoint(request.query.url)
      .then(apiResponse => response.status(200).send(apiResponse))
      .catch(error => response.status(400).send(error));
  },
  handleExternalPostRequest: ({ request, response }) => {
    hitPostEndpoint(request.body)
      .then(apiResponse => response.status(200).send(apiResponse))
      .catch(error => response.status(400).send(error));
  },
  handleExternalPutRequest: ({ request, response }) => {
    hitPutEndpoint(request.body)
      .then(apiResponse => response.status(200).send(apiResponse))
      .catch(error => response.status(400).send(error));
  },
};
