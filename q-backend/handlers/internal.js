const { MongoClient } = require('mongodb');

const { createQuery, validateDataForPost } = require('./helpers');
const { mongo_uri } = require('../config');
const { q_logger } = require('../q-lib');

MongoClient.connectionParams = { useUnifiedTopology: true, useNewUrlParser: true };

// TODO: get the collection from the request or response obejct?
module.exports = {
  handleInternalGetRequest: async ({ request, response }) => {
    const collection = request.path;
    MongoClient.connect(mongo_uri, MongoClient.connectionParams, (connectError, db) => {
      if (connectError) throw connectError;
      db.db('q-mongodb')
        .collection(collection)
        .find(createQuery(request))
        .toArray((findError, result) => {
          if (findError) throw findError;
          response.status(200).json(result.length === 1 ? result[0] : result);
          db.close();
        });
    });
  },
  handleInternalPostRequest: async ({ request, response }) => {
    const { body } = request;
    const collection = request.path;
    let items = Array.isArray(body) ? body : [body];
    if (!validateDataForPost(collection, items)) response.status(400).send(`Failed to validate ${collection}`);
    if (collection !== 'transactions') items = items.map(item => ({ ...item, _id: item.timestamp }));
    MongoClient.connect(mongo_uri, MongoClient.connectionParams, (connectError, db) => {
      if (connectError) return q_logger.error('Cannot connect to mongo', connectError);
      db.db('q-mongodb')
        .collection(collection)
        .insertMany(items, { ordered: false }, (insertError, insertResponse) => {
          if (insertError) return q_logger.error(`Cannot insert ${collection} into mongo`, insertError.writeErrors[0].errmsg);
          q_logger.info(`Inserted ${insertResponse.insertedCount} ${collection} into mongo`);
          response.status(204).send();
          db.close();
        });
    });
  },
  handleInternalPutRequest: async ({ request, response }) => {
    const collection = request.path;
    MongoClient.connect(mongo_uri, MongoClient.connectionParams, (connectError, db) => {
      if (connectError) throw connectError;
      db.db('q-mongodb')
        .collection(collection)
        .replaceOne(createQuery(request), request.body, { upsert: true }, updateError => {
          if (updateError) throw updateError;
          response.status(204).send();
          db.close();
        });
    });
  },
  handleInternalDeleteRequest: async ({ request, response }) => {
    const collection = request.path;
    MongoClient.connect(mongo_uri, MongoClient.connectionParams, (connectError, db) => {
      if (connectError) throw connectError;
      db.db('q-mongodb')
        .collection(collection)
        .deleteOne(createQuery(request), (removeError, result) => {
          if (removeError) throw removeError;
          response.status(result.deletedCount === 1 ? 200 : 404).send();
        });
    });
  },
};
