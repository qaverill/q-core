const lifx = require('./lifx');
const kasa = require('./kasa');

const endpoints = [lifx, kasa];
module.exports = (routes) => {
  endpoints.forEach((endpoint) => endpoint.createEndpoints(routes));
};
