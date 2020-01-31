const { MongoClient } = require('mongodb');

const config = require('../config');
const { createQuery, validateDataForPost } = require('./helpers');
const { q_logger } = require('../q-lib');

const { mongo_uri } = config;
const { connectionParams } = MongoClient;

module.exports = {
  handleInternalPostRequest: ({ req, res, then }, collection) => {
    const { body } = req;
    let items = Array.isArray(body) ? body : [body];
    if (!validateDataForPost(collection, items)) res.status(400).send(`Failed to validate ${collection}`);
    if (collection !== 'transactions') items = items.map(item => ({ ...item, _id: item.timestamp }));
    MongoClient.connect(mongo_uri, connectionParams, (connectError, db) => {
      if (connectError) return q_logger.error('Cannot connect to mongo', connectError);
      db.db('q-mongodb')
        .collection(collection)
        .insertMany(items, { ordered: false }, (insertError, insertResponse) => {
          if (insertError) return q_logger.error(`Cannot insert ${collection} into mongo`, insertError.writeErrors[0].errmsg);
          q_logger.info(`Inserted ${insertResponse.insertedCount} ${collection} into mongo`);
          res.status(204).send();
          db.close();
          then();
        });
    });
  },
  handleInternalGetRequest: ({ req, res, then }, collection) => {
    MongoClient.connect(mongo_uri, connectionParams, (connectError, db) => {
      if (connectError) throw connectError;
      db.db('q-mongodb')
        .collection(collection)
        .find(createQuery(req))
        .toArray((findError, result) => {
          if (findError) throw findError;
          res.status(200).json(result.length === 1 ? result[0] : result);
          db.close();
          then();
        });
    });
  },
  handleInternalPutRequest: ({ req, res, then }, collection) => {
    MongoClient.connect(mongo_uri, connectionParams, (connectError, db) => {
      if (connectError) throw connectError;
      db.db('q-mongodb')
        .collection(collection)
        .replaceOne(createQuery(req), req.body, { upsert: true }, updateError => {
          if (updateError) throw updateError;
          res.status(204).send();
          db.close();
          then();
        });
    });
  },
  handleInternalDeleteRequest: ({ req, res, then }, collection) => {
    MongoClient.connect(mongo_uri, connectionParams, (connectError, db) => {
      if (connectError) throw connectError;
      db.db('q-mongodb')
        .collection(collection)
        .deleteOne(createQuery(req), (removeError, result) => {
          if (removeError) throw removeError;
          res.status(result.deletedCount === 1 ? 200 : 404).send();
          then();
        });
    });
  },
};
