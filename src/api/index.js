const lifx = require('./lifx');
const kasa = require('./kasa');
const music = require('./music');
const money = require('./money');

const endpoints = [lifx, kasa, music, money];
module.exports = (socket, routes) => {
  endpoints.forEach((endpoint) => endpoint.createEndpoints(socket, routes));
};
