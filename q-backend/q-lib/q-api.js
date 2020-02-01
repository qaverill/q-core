const q_logger = require('./q-logger');

module.exports = {
  makeGetEndpoint: ({ routes, path, title, collection }, action) => {
    console.log(`  GET  ${title}`);
    routes.get(path, (request, response) => {
      const start = new Date().getTime();
      action({ request, response, collection }).then(() => {
        q_logger.apiout(`GET ${request.originalUrl} returned in ${new Date().getTime() - start}ms ... ${response.statusCode}`);
      });
    });
  },
  makePutEndpoint: ({ routes, path, title, collection }, action) => {
    console.log(`  PUT ${title}`);
    routes.put(path, (request, response) => {
      const start = new Date().getTime();
      action({ request, response, collection }).then(() => {
        q_logger.apiout(`PUT ${request.originalUrl} returned in ${new Date().getTime() - start}ms ... ${response.statusCode}`);
      });
    });
  },
  makePostEndpoint: ({ routes, path, title, collection }, action) => {
    console.log(`  POST ${title}`);
    routes.post(path, (request, response) => {
      const start = new Date().getTime();
      action({ request, response, collection }).then(() => {
        q_logger.apiout(`POST ${request.originalUrl} returned in ${new Date().getTime() - start}ms ... ${response.statusCode}`);
      });
    });
  },
  makeDeleteEndpoint: ({ routes, path, title, collection }, action) => {
    console.log(`  DELETE ${title}`);
    routes.delete(path, (request, response) => {
      const start = new Date().getTime();
      action({ request, response, collection }).then(() => {
        q_logger.apiout(`DELETE ${request.originalUrl} returned in ${new Date().getTime() - start}ms ... ${response.statusCode}`);
      });
    });
  },
};
