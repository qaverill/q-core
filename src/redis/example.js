const redis = require('redis');

const redisClient = redis.createClient();

redisClient.on("error", function(error) {
  logger.error(error);
});
 
redisClient.set("key", "value", redis.print);
redisClient.get("key", redis.print);