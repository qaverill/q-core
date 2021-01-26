const lifx = require('./lifx');
const kasa = require('./kasa');
const music = require('./music');

const endpoints = [lifx, kasa, music];
module.exports = (socket, routes) => {
  endpoints.forEach((endpoint) => endpoint.createEndpoints(socket, routes));
};
