const redis = require('redis');
const logger = require('@q/logger');
// ----------------------------------
// HELPERS
// ----------------------------------
const currentPresetKey = 'lights:currentPreset';
// ----------------------------------
// REDIS
// ----------------------------------
const redisClient = redis.createClient();
redisClient.on('error', logger.error);
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  setCurrentPreset: (preset) => new Promise((resolve) => {
    redisClient.set(currentPresetKey, preset, resolve);
  }),
  getCurrentPreset: () => new Promise((resolve) => {
    redisClient.get(currentPresetKey, (_, result) => {
      resolve(result);
    });
  }),
};
