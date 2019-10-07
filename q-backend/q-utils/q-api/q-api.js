const q_logger = require('q-logger');

module.exports = {
  makeGetEndpoint: (routes, path, title, action) => {
    console.log('  GET  ' + title);
    routes.get(path, (request, response) => {
      const start = new Date().getTime();
      action(request, response);
      q_logger.apiout(`${title} returned in ${new Date().getTime() - start}ms`);
    });
  },
  makePostEndpoint: (routes, path, title, action) => {
    console.log('  POST ' + title);
    routes.post(path, (request, response) => {
      const start = new Date().getTime();
      action(request, response);
      q_logger.apiout(`${title} returned in ${new Date().getTime() - start}ms`);
    });
  }
};