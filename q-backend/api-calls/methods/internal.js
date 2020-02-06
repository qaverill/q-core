const { MongoClient } = require('mongodb');

const { q_logger } = require('../../q-lib/q-logger');
const { mongo_uri } = require('../../config');

MongoClient.connectionParams = { useUnifiedTopology: true, useNewUrlParser: true };

const validateDataForPost = (collection, items) => {
  const isListOfStrings = list => (
    Array.isArray(list) && list.filter(item => typeof item === 'string').length === list.length
  );
  switch (collection) {
    case 'listens':
    case 'saves':
      return items.length > 0 && items.filter(save => (
        typeof save.timestamp === 'number'
        && typeof save.track === 'string'
        && typeof save.album === 'string'
        && isListOfStrings(save.artists)
        && typeof save.popularity === 'number'
        && typeof save.duration === 'number'
      )).length === items.length;
    case 'transactions':
      return items.length > 0 && items.filter(transaction => (
        typeof transaction.account === 'string'
        && typeof transaction.timestamp === 'number'
        && typeof transaction.amount === 'number'
        && typeof transaction.description === 'string'
        && Array.isArray(transaction.tags) && transaction.tags.length > 0
      )).length === items.length;
    default:
      return false;
  }
};

module.exports = {
  getData: ({ collection, query }) => (
    new Promise((resolve, reject) => {
      MongoClient.connect(mongo_uri, MongoClient.connectionParams, (connectError, db) => {
        if (connectError) {
          q_logger.error('Failed to connect to mongo in getData', connectError);
          reject();
        } else {
          db.db('q-mongodb')
            .collection(collection)
            .find(query)
            .toArray((queryError, result) => {
              db.close();
              if (queryError) {
                q_logger.error('Failed to query mongo in getData', queryError);
                reject();
              } else {
                resolve(result.length === 1 ? result[0] : result);
              }
            });
        }
      });
    })
  ),
  postData: ({ collection, items }) => (
    new Promise((resolve, reject) => {
      if (!validateDataForPost(collection, items)) {
        q_logger.error(`Failed to validate ${collection}`);
        reject();
      }
      MongoClient.connect(mongo_uri, MongoClient.connectionParams, (connectError, db) => {
        if (connectError) {
          q_logger.error('Failed to connect to mongo in postData', connectError);
          reject();
        } else {
          db.db('q-mongodb')
            .collection(collection)
            .insertMany(items, { ordered: false }, (insertError, insertResponse) => {
              db.close();
              if (insertError) {
                q_logger.error(`Failed to insert ${collection} into mongo`, insertError.writeErrors[0].errmsg);
                reject();
              } else {
                q_logger.info(`Inserted ${insertResponse.insertedCount} ${collection} into mongo`);
                resolve();
              }
            });
        }
      });
    })
  ),
};
