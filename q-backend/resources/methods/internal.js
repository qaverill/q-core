const { MongoClient } = require('mongodb');

const { q_logger } = require('../../q-lib/q-logger');
const { mongo_uri } = require('../../config');

const database = 'q-mongodb';

MongoClient.connectionParams = { useUnifiedTopology: true, useNewUrlParser: true };

const validateDocsForPost = (collection, docs) => {
  const isListOfStrings = list => (
    Array.isArray(list) && list.filter(item => typeof item === 'string').length === list.length
  );
  switch (collection) {
    case 'listens':
    case 'saves':
      return docs.length > 0 && docs.filter(save => (
        typeof save.timestamp === 'number'
        && typeof save.track === 'string'
        && typeof save.album === 'string'
        && isListOfStrings(save.artists)
        && typeof save.popularity === 'number'
        && typeof save.duration === 'number'
      )).length === docs.length;
    case 'transactions':
      return docs.length > 0 && docs.filter(transaction => (
        typeof transaction.account === 'string'
        && typeof transaction.timestamp === 'number'
        && typeof transaction.amount === 'number'
        && typeof transaction.description === 'string'
        && Array.isArray(transaction.tags)
      )).length === docs.length;
    default:
      return false;
  }
};

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
              q_logger.error(`Failed to insert ${collection} into mongo`, insertError.writeErrors[0].errmsg);
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
      if (connectError) {
        q_logger.error('Failed to connect to mongo in putDocs', connectError);
        reject(connectError);
      } else {
        db.db(database)
          .collection(collection)
          .replaceOne(query, doc, { upsert: true }, (updateError, updateResponse) => {
            db.close();
            if (updateError) {
              q_logger(`Failed to put ${collection} into mongo`, updateError);
              reject(updateError);
            } else {
              resolve(updateResponse);
            }
          });
      }
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
};
