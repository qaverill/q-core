const { MongoClient } = require('mongodb');
const logger = require('@q/logger');
const R = require('ramda');
const { MONGO_URI, MONGO_DB, MONGO_PARAMS } = require('../config');
// ----------------------------------
// HELPERS
// ----------------------------------
const makeQuery = ({ start, end }) => {
  if (end && R.isNil(start)) return 'Cannot provide end but no start!';
  if (end && start > end) return 'Start cannot be greater than end!';
  const timestamp = {};
  if (start) timestamp.$gte = start;
  if (end) timestamp.$lte = end;
  return { timestamp };
};
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  timeframeRead: ({ timeframe, collection }) => new Promise((resolve) => {
    const query = makeQuery(timeframe);
    if (typeof query === 'string') resolve(query);
    else {
      MongoClient.connect(MONGO_URI, MONGO_PARAMS, (connectError, db) => {
        if (connectError) logger.error(`Failed connecting to mongo when reading ${collection}`, connectError);
        db.db(MONGO_DB)
          .collection(collection)
          .find(query)
          .toArray((queryError, result) => {
            db.close();
            if (queryError) {
              logger.error(`Failed querying mongo when reading ${collection}`, queryError);
              resolve([]);
            } else {
              resolve(result);
            }
          });
      });
    }
  }),
};
