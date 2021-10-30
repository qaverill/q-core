const { q_logger } = require('../q-lib/q-logger');
const { ingestData } = require('../ingesting');

// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  ingest: ({ collection, interval, attempts }) => {
    if (!attempts || attempts < 3) {
      ingestData({ collection })
        .then(() => {
          if (interval) setTimeout(() => module.exports.ingest({ collection, interval }), interval);
        })
        .catch((e) => {
          q_logger.error(e);
          q_logger.warn(`Failed to mine ${collection}... trying again in 1 hour`);
          setTimeout(() => module.exports.ingest({
            collection,
            interval,
            attempts: !attempts ? 1 : attempts + 1,
          }), 3.6e6);
        });
    } else {
      throw new Error(`Failed to mine ${collection} 3 times in a row... ABORT`);
    }
  },
};
