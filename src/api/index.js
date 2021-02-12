const lights = require('./control/lights');
const outlets = require('./control/outlets');
const music = require('./music');
const money = require('./money/paybacks');

const endpoints = [lights, outlets, music, money];
module.exports = (socket, routes) => {
  endpoints.forEach((endpoint) => endpoint.createEndpoints(socket, routes));
};
