const q_logger = require('q-logger');

module.exports = {
  makeGetEndpoint: (routes, path, title, action) => {
    const start = new Date().getTime();
    routes.get(path, (request, response) => {
      action(request, response);
      q_logger.debug(`Returned ${title} in ${new Date().getTime() - start}ms`);
    });
  },
  makePostEndpoint: (routes, path, title, action) => {
    const start = new Date().getTime();
    routes.post(path, (request, response) => {
      action(request, response);
      q_logger.debug(`Returned ${title} in ${new Date().getTime() - start}ms`);
    });
  }
};