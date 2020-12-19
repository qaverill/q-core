/* eslint-disable no-console */
const logger = require('@q/logger');
// ----------------------------------
// HELPERS
// ----------------------------------
const GET = 'GET';
const PUT = 'PUT';
const POST = 'POST';
const DELETE = 'DELETE';
const printEndpoint = (method, path) => console.log(`  ${method}   ${path}`);
const handle = (method, request, response, action) => {
  const { originalUrl } = request;
  const { statusCode } = response;
  const start = new Date().getTime();
  action({ request, response }).then(() => {
    const totalTime = new Date().getTime() - start;
    logger.apiOut(`${method} ${originalUrl} returned in ${totalTime}ms ... ${statusCode}`);
  });
};
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  makeGetEndpoint: ({ routes, path }, action) => {
    printEndpoint(GET, path);
    routes.get(path, (request, response) => {
      handle(GET, request, response, action);
    });
  },
  makePutEndpoint: ({ routes, path }, action) => {
    printEndpoint(PUT, path);
    routes.put(path, (request, response) => {
      handle(PUT, request, response, action);
    });
  },
  makePostEndpoint: ({ routes, path }, action) => {
    printEndpoint(POST, path);
    routes.post(path, (request, response) => {
      handle(POST, request, response, action);
    });
  },
  makeDeleteEndpoint: ({ routes, path }, action) => {
    printEndpoint(DELETE, path);
    routes.delete(path, (request, response) => {
      handle(DELETE, request, response, action);
    });
  },
};
