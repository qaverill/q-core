const { q_logger } = require('./q-logger');

module.exports = {
  makeGetEndpoint: ({ routes, path }, action) => {
    console.log(`  GET    ${path}`);
    routes.get(path, (request, response) => {
      const start = new Date().getTime();
      action({ request, response, path }).then(() => {
        q_logger.apiOut(`GET ${request.originalUrl} returned in ${new Date().getTime() - start}ms ... ${response.statusCode}`);
      });
    });
  },
  makePutEndpoint: ({ routes, path }, action) => {
    console.log(`  PUT    ${path}`);
    routes.put(path, (request, response) => {
      const start = new Date().getTime();
      action({ request, response, path }).then(() => {
        q_logger.apiOut(`PUT ${request.originalUrl} returned in ${new Date().getTime() - start}ms ... ${response.statusCode}`);
      });
    });
  },
  makePostEndpoint: ({ routes, path }, action) => {
    console.log(`  POST   ${path}`);
    routes.post(path, (request, response) => {
      const start = new Date().getTime();
      action({ request, response, path }).then(() => {
        q_logger.apiOut(`POST ${request.originalUrl} returned in ${new Date().getTime() - start}ms ... ${response.statusCode}`);
      });
    });
  },
  makeDeleteEndpoint: ({ routes, path }, action) => {
    console.log(`  DELETE ${path}`);
    routes.delete(path, (request, response) => {
      const start = new Date().getTime();
      action({ request, response, path }).then(() => {
        q_logger.apiOut(`DELETE ${request.originalUrl} returned in ${new Date().getTime() - start}ms ... ${response.statusCode}`);
      });
    });
  },
};
