const { MongoClient } = require('mongodb');
const logger = require('@q/logger');
const R = require('ramda');
const { MONGO_URI, MONGO_DB, MONGO_PARAMS } = require('../config');
// ----------------------------------
// HELPERS
// ----------------------------------
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  timeframeToQuery: ({ start, end }) => {
    if (end && R.isNil(start)) return 'Cannot provide end but no start!';
    if (end && start > end) return 'Start cannot be greater than end!';
    const timestamp = {};
    if (start) timestamp.$gte = start;
    if (end) timestamp.$lte = end;
    return { timestamp };
  },
  mongoFind: (query, collection) => new Promise((resolve) => {
    if (typeof query === 'string') resolve(query);
    else {
      MongoClient.connect(MONGO_URI, MONGO_PARAMS, (connectError, db) => {
        if (connectError) logger.error(`Failed connecting to mongo when finding in ${collection}`, connectError);
        db.db(MONGO_DB)
          .collection(collection)
          .find(query)
          .toArray((queryError, result) => {
            db.close();
            if (queryError) {
              logger.error(`Failed querying mongo when reading ${collection}`, queryError);
              resolve([]);
            } else resolve(result);
          });
      });
    }
  }),
  mongoInsert: (documents, collection) => new Promise((resolve) => {
    MongoClient.connect(MONGO_URI, MONGO_PARAMS, (connectError, db) => {
      if (connectError) logger.error(`Failed to connect to mongo when inserting to ${collection}`, connectError);
      else {
        const payload = Array.isArray(documents) ? documents : [documents];
        db.db(MONGO_DB)
          .collection(collection)
          .insertMany(payload, { ordered: false }, (insertError, result) => {
            db.close();
            if (insertError) logger.error(`Failed to insert ${collection} into mongo`, insertError);
            else resolve(result);
          });
      }
    });
  }),
  mongoReplace: (query, document, collection) => new Promise((resolve) => {
    MongoClient.connect(MONGO_URI, MONGO_PARAMS, (connectError, db) => {
      if (connectError) logger.error(`Failed to connect to mongo when replacing in ${collection}`, connectError);
      else {
        db.db(MONGO_DB)
          .collection(collection)
          .replaceOne(query, document, { upsert: true }, (replaceError, result) => {
            db.close();
            if (replaceError) logger.error(`Failed to put ${collection} into mongo`, replaceError);
            else resolve(result);
          });
      }
    });
  }),
  mongoDelete: (query, collection) => new Promise((resolve) => {
    MongoClient.connect(MONGO_URI, MONGO_PARAMS, (connectError, db) => {
      if (connectError) {
        logger.error('Failed to connect to mongo in deleteDocs', connectError);
      } else if (query && query !== {}) {
        db.db(MONGO_DB)
          .collection(collection)
          .deleteOne(query, (deleteError, result) => {
            db.close();
            if (deleteError) logger.error(`Failed to delete ${collection} in mongo`, deleteError);
            else resolve(result.deletedCount);
          });
      } else {
        db.db(MONGO_DB)
          .collection(collection)
          .deleteMany({}, (deleteError, result) => {
            db.close();
            if (deleteError) logger.error(`Failed to delete ${collection} in mongo`, deleteError);
            else resolve(result.deletedCount);
          });
      }
    });
  }),
};
