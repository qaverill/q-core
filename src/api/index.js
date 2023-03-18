// const lights = require('./control/lights');
// const outlets = require('./control/outlets');
const paybacks = require('./money/paybacks');
const transactions = require('./money/transactions');
const analyzeMoney = require('./analyze/money');
const analyzeMusic = require('./analyze/music');
// ----------------------------------
// HELPERS
// ----------------------------------
const endpoints = [
  // lights,
  // outlets,
  paybacks,
  transactions,
  analyzeMoney,
  analyzeMusic,
];
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = (socket, routes) => {
  endpoints.forEach((endpoint) => endpoint.createEndpoints(socket, routes));
};
