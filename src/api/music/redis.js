const redis = require('redis');
const logger = require('@q/logger');
// ----------------------------------
// HELPERS
// ----------------------------------
const hostKey = (outlet) => `kasa:${outlet}:host`;
// ----------------------------------
// REDIS
// ----------------------------------
const redisClient = redis.createClient();
redisClient.on('error', logger.error);
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  setOutletHost: (outlet, host) => new Promise((resolve) => {
    redisClient.set(hostKey(outlet), host, resolve);
  }),
  getOutletHost: (outlet) => new Promise((resolve) => {
    redisClient.get(hostKey(outlet), (_, result) => {
      resolve(result);
    });
  }),
};
