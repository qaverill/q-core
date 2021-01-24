const lifx = require('./lifx');
const kasa = require('./kasa');

const endpoints = [lifx, kasa];
module.exports = (socket, routes) => {
  endpoints.forEach((endpoint) => endpoint.createEndpoints(socket, routes));
};
