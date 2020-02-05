const { MongoClient } = require('mongodb');

const { q_logger } = require('../q-lib');
const { mongo_uri } = require('../config');

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
    new Promise(resolve => {
      MongoClient.connect(mongo_uri, MongoClient.connectionParams, (connectError, db) => {
        if (connectError) throw new Error(connectError);
        db.db('q-mongodb')
          .collection(collection)
          .find(query)
          .toArray((findError, result) => {
            db.close();
            if (findError) throw new Error(findError);
            resolve(result.length === 1 ? result[0] : result);
          });
      });
    })
  ),
  postData: ({ collection, items }) => (
    new Promise((resolve, reject) => {
      if (!validateDataForPost(collection, items)) {
        q_logger.error(`Failed to validate ${collection}`);
        reject();
      }
      const finalItems = collection !== 'transactions' ? items.map(i => ({ ...i, _id: i.timestamp })) : items;
      MongoClient.connect(mongo_uri, MongoClient.connectionParams, (connectError, db) => {
        if (connectError) return q_logger.error('Cannot connect to mongo', connectError);
        db.db('q-mongodb')
          .collection(collection)
          .insertMany(finalItems, { ordered: false }, (insertError, insertResponse) => {
            db.close();
            if (insertError) {
              q_logger.error(`Cannot insert ${collection} into mongo`, insertError.writeErrors[0].errmsg);
              reject();
            }
            q_logger.info(`Inserted ${insertResponse.insertedCount} ${collection} into mongo`);
            resolve();
          });
      });
    })
  ),
};
