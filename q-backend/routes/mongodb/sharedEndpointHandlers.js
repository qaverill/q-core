const config = require('config');
const { MongoClient } = require('mongodb');
const { q_logger } = require('q-lib');

const isListOfStrings = list => (
  Array.isArray(list) && list.filter(item => typeof item === 'string').length === list.length
);

const validateDataForPost = (collection, items) => {
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
      )).length === items.length;
    default:
      q_logger.error('Tried to validate items in an unknown collection: ', collection);
      return false;
  }
};

const craftQueryForGet = (collection, requestQuery) => {
  const query = {};
  switch (collection) {
    case 'listens':
    case 'saves':
      if (requestQuery.trackID) query.track = requestQuery.trackID;
      if (requestQuery.artistID) query.artists = requestQuery.artistID;
      if (requestQuery.albumID) query.album = requestQuery.albumID;
      break;
    case 'transactions':
      // No other query params for this... yet
      break;
    default:
      q_logger.error('Tried to craft a query for an unknown collection: ', collection);
      return null;
  }
  if (requestQuery.start || requestQuery.end) {
    query._id = {};
    if (requestQuery.start) query._id.$gte = parseInt(requestQuery.start, 10);
    if (requestQuery.end) query._id.$lte = parseInt(requestQuery.end, 10);
  }
  return query;
};

module.exports = {
  handleCommonPostEndpoint: (requestBody, response, collection) => {
    let items = Array.isArray(requestBody) ? requestBody : [requestBody];
    if (!validateDataForPost(collection, items)) response.status(400).send();

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
