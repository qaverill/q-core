const redis = require('redis');
const logger = require('@q/logger');
// ----------------------------------
// HELPERS
// ----------------------------------
const craftOutletKey = (outlet) => `outlets:${outlet}:host`;
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
    const outletKey = craftOutletKey(outlet);
    redisClient.set(outletKey, host, resolve);
  }),
  getOutletHost: (outlet) => new Promise((resolve) => {
    const outletKey = craftOutletKey(outlet);
    redisClient.get(outletKey, (_, result) => {
      resolve(result);
    });
  }),
};
