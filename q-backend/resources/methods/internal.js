const { MongoClient } = require('mongodb');

const { q_logger } = require('../../q-lib/q-logger');
const { mongo_uri } = require('../../config');
// ----------------------------------
// HELPERS
// ----------------------------------
const database = 'q-mongodb';
MongoClient.connectionParams = { useUnifiedTopology: true, useNewUrlParser: true };
const isNumber = potentialNumber => typeof potentialNumber === 'number';
const isString = potentialString => typeof potentialString === 'string';
const isListOfStrings = list => (
  Array.isArray(list) && list.filter(item => typeof item === 'string').length === list.length
);
// ----------------------------------
// Logic
// ----------------------------------
const validateDocsForPost = (collection, docs) => {
  switch (collection) {
    case 'listens':
    case 'saves':
      return docs.length > 0 && docs.filter(save => (
        isNumber(save.timestamp)
        && isString(save.track)
        && isString(save.album)
        && isListOfStrings(save.artists)
        && isNumber(save.popularity)
        && isNumber(save.duration)
      )).length === docs.length;
    case 'transactions':
      return docs.length > 0 && docs.filter(transaction => (
        isString(transaction.account)
        && isNumber(transaction.timestamp)
        && isNumber(transaction.amount)
        && isString(transaction.description)
        && Array.isArray(transaction.tags)
      )).length === docs.length;
    case 'paybacks':
      return docs.length > 0 && docs.filter(payback => (
        isString(payback.from) && isString(payback.to) && isNumber(payback.amount)
      ));
    default:
      return false;
  }
};
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  getDocs: ({ collection, query }) => new Promise((resolve, reject) => {
    MongoClient.connect(mongo_uri, MongoClient.connectionParams, (connectError, db) => {
      if (connectError) {
        q_logger.error('Failed to connect to mongo in getDocs', connectError);
        reject(connectError);
      } else {
        db.db(database)
          .collection(collection)
          .find(query)
          .toArray((queryError, result) => {
            db.close();
            if (queryError) {
              q_logger.error('Failed to query mongo in getDocs', queryError);
              reject(queryError);
            } else {
              result.map(r => ({ ...r, collection }));
              resolve(result.length === 1 ? result[0] : result);
            }
          });
      }
    });
  }),
  postDocs: ({ collection, docs }) => new Promise((resolve, reject) => {
    if (!validateDocsForPost(collection, docs)) {
      q_logger.error(`Failed to validate ${collection}`);
      reject(new Error(`Failed to validate ${collection}`));
    }
    MongoClient.connect(mongo_uri, MongoClient.connectionParams, (connectError, db) => {
      if (connectError) {
        q_logger.error('Failed to connect to mongo in postDocs', connectError);
        reject(connectError);
      } else {
        db.db(database)
          .collection(collection)
          .insertMany(docs, { ordered: false }, (insertError, insertResponse) => {
            db.close();
            if (insertError) {
              q_logger.error(`Failed to insert ${collection} into mongo`, insertError);
              reject(insertResponse);
            } else {
              q_logger.info(`Inserted ${insertResponse.insertedCount} ${collection} into mongo`);
              resolve();
            }
          });
      }
    });
  }),
  putDoc: ({ collection, query, doc }) => new Promise((resolve, reject) => {
    MongoClient.connect(mongo_uri, MongoClient.connectionParams, (connectError, db) => {
      db.db(database)
        .collection(collection)
        .replaceOne(query, doc, { upsert: true }, (updateError, updateResponse) => {
          db.close();
          if (updateError) {
            q_logger.error(`Failed to put ${collection} into mongo`, updateError);
            reject(updateError);
          } else {
            resolve(updateResponse);
          }
        });
    });
  }),
  deleteDoc: ({ collection, query }) => new Promise((resolve, reject) => {
    MongoClient.connect(mongo_uri, MongoClient.connectionParams, (connectError, db) => {
      if (connectError) {
        q_logger.error('Failed to connect to mongo in deleteDocs', connectError);
        reject(connectError);
      } else {
        db.db(database)
          .collection(collection)
          .deleteOne(query, (removeError, result) => {
            db.close();
            if (removeError) {
              q_logger.error(`Failed to delete ${collection} in mongo`, removeError);
              reject(removeError);
            } else {
              resolve(result.deletedCount);
            }
          });
      }
    });
  }),
  dropCollection: collection => new Promise((resolve, reject) => {
    MongoClient.connect(mongo_uri, MongoClient.connectionParams, (connectError, db) => {
      if (connectError) {
        q_logger.error('Failed to connect to mongo in dropCollection', connectError);
        reject(connectError);
      } else {
        db.db(database)
          .collection(collection)
          .deleteMany({}, (dropError, result) => {
            db.close();
            if (dropError) {
              q_logger.error(`Failed to delete ${collection} in mongo`, dropError);
              reject(dropError);
            } else {
              resolve(result.deletedCount);
            }
          });
      }
    });
  }),
};
