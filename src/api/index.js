const lights = require('./lights');
const outlets = require('./outlets');
const music = require('./music');
const money = require('./money');

const endpoints = [lights, outlets, music, money];
module.exports = (socket, routes) => {
  endpoints.forEach((endpoint) => endpoint.createEndpoints(socket, routes));
};
