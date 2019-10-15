const config = require('config');
const { MongoClient } = require('mongodb');
const { q_logger } = require('q-lib');

const isListOfStrings = list => (
  Array.isArray(list) && list.filter(item => typeof item === 'string').length === list.length
);

const validateDataForPost = (collection, items) => {
  switch (collection) {
    case 'listens':
      return items.length > 0 && items.filter(listen => (
        typeof listen.timestamp === 'number'
        && typeof listen.track === 'string'
        && typeof listen.album === 'string'
        && isListOfStrings(listen.artists)
        && typeof listen.popularity === 'number'
        && typeof listen.duration === 'number'
      )).length === items.length;
    case 'saves':
      return items.length > 0 && items.filter(save => (
        typeof save.timestamp === 'number'
        && typeof save.track === 'string'
        && typeof save.album === 'string'
        && isListOfStrings(save.artists)
        && typeof save.popularity === 'number'
        && typeof save.duration === 'number'
      )).length === items.length;
    default:
      q_logger.error('Tried to validate items in an unknown collection: ', collection);
      return false;
  }
};

const craftQueryForGet = (collection, requestQuery) => {
  switch (collection) {
    case 'listens': {
      const query = {};
      const { start, end, trackID, artistID, albumID } = requestQuery;
      if (typeof start === 'number') query._id.$gte = parseInt(start, 10);
      if (typeof end === 'number') query._id.$lte = parseInt(end, 10);
      if (trackID != null) query.track = trackID;
      if (artistID != null) query.artists = artistID;
      if (albumID != null) query.album = albumID;
      return query;
    }
    case 'saves':
      return null;
    default:
      q_logger.error('Tried to craft a query for an unknown collection: ', collection);
      return false;
  }
}

module.exports = {
  handleCommonPostEndpoint: (requestBody, response, collection) => {
    const items = Array.isArray(requestBody) ? requestBody : [requestBody];
    if (!validateDataForPost(collection, items)) {
      response.status(400).send();
    }

    items.map(item => ({ ...item, _id: item.timestamp }));
    MongoClient.connect(config.mongo_uri, MongoClient.connectionParams, (connectError, db) => {
      if (connectError) return q_logger.error('Cannot connect to mongo', connectError);
      db.db('q-mongodb').collection(collection).insertMany(items, { ordered: false }, (insertError) => {
        if (insertError) return q_logger.error(`Cannot insert ${collection} into mongo`);
        response.status(204).send();
        db.close();
      });
    });
  },
  handleCommonGetEndpoint: (requestQuery, response, collection) => {
    const query = craftQueryForGet(collection, requestQuery);
    MongoClient.connect(config.mongo_uri, MongoClient.connectionParams, (connectError, db) => {
      if (connectError) return q_logger.error('Cannot connect to mongo', connectError);
      const dbo = db.db('q-mongodb');
      dbo.collection('listens').find(query).toArray((findError, res) => {
        if (findError) throw q_logger.error('Cannot query mongo', findError);
        response.status(200).json(res);
        db.close();
      });
    });
  },
};
