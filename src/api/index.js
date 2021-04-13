const lights = require('./control/lights');
const outlets = require('./control/outlets');
const music = require('./music');
const paybacks = require('./money/paybacks');
const transactions = require('./money/transactions');
const moneyAnalysis = require('./money/analysis');
// ----------------------------------
// HELPERS
// ----------------------------------
const endpoints = [lights, outlets, music, paybacks, transactions, moneyAnalysis];
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = (socket, routes) => {
  endpoints.forEach((endpoint) => endpoint.createEndpoints(socket, routes));
};
