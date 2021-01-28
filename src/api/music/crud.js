const { MongoClient } = require('mongodb');
const logger = require('@q/logger');
const { MONGO_URI, MONGO_DB, MONGO_PARAMS } = require('../../config');
// ----------------------------------
// HELPERS
// ----------------------------------
const COLLECTION = 'listens';
const makeQuery = ({ start, end }) => {
  const timestamp = {};
  if (start) timestamp.$gte = start;
  if (end) timestamp.$lte = end;
  return { timestamp };
};
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  readListens: (payload) => new Promise((resolve) => {
    const query = makeQuery(payload);
    console.log(query);
    MongoClient.connect(MONGO_URI, MONGO_PARAMS, (connectError, db) => {
      if (connectError) {
        logger.error('Failed connecting to mongo when reading listens', connectError);
        resolve([]);
      } else {
        db.db(MONGO_DB)
          .collection(COLLECTION)
          .find(query)
          .toArray((queryError, result) => {
            db.close();
            if (queryError) {
              logger.error('Failed querying mongo when reading listens', queryError);
              resolve([]);
            } else {
              resolve(result);
            }
          });
      }
    });
  }),
};
