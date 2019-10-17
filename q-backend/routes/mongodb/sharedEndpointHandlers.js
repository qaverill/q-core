const config = require('config');
const { MongoClient } = require('mongodb');
const { q_logger } = require('q-lib');
const { validateDataForPost } = require('./validation');
const { craftQueryForGet } = require('./queryCrafter');

module.exports = {
  handleCommonPostEndpoint: (requestBody, response, collection) => {
    let items = Array.isArray(requestBody) ? requestBody : [requestBody];
    if (!validateDataForPost(collection, items)) response.status(400).send(`Failed to validate ${collection}`);

    items = items.map(item => ({ ...item, _id: item.timestamp }));
    MongoClient.connect(config.mongo_uri, MongoClient.connectionParams, (connectError, db) => {
      if (connectError) return q_logger.error('Cannot connect to mongo', connectError);
      db.db('q-mongodb').collection(collection).insertMany(items, { ordered: false }, (insertError, insertResponse) => {
        if (insertError) return q_logger.error(`Cannot insert ${collection} into mongo`);
        q_logger.info(`Inserted ${insertResponse.insertedCount} ${collection} into mongo`);
        response.status(204).send();
        db.close();
      });
    });
  },
  handleCommonGetEndpoint: (requestQuery, response, collection) => {
    const query = craftQueryForGet(collection, requestQuery);
    MongoClient.connect(config.mongo_uri, MongoClient.connectionParams, (connectError, db) => {
      if (connectError) return q_logger.error('Cannot connect to mongo', connectError);
      db.db('q-mongodb').collection(collection).find(query).toArray((findError, res) => {
        if (findError) throw q_logger.error(`Cannot query mongo ${collection}`, findError);
        response.status(200).json(res);
        db.close();
      });
    });
  },
};
