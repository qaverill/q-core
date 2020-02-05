const { mongo_uri } = require('../config');
const { q_logger } = require('../q-lib');
const { getData, postData } = require('../api-calls/internal');

const createQuery = request => {
  let query;
  if (request.params) {
    query = request.params;
    Object.keys(query).forEach(key => { query[key] = parseInt(query[key], 10) || query[key]; });
  } else {
    query = request.query;
    if (query.start) {
      query.timestamp.$gte = parseInt(query.start, 10);
      delete query.start;
    }
    if (query.end) {
      query.timestamp.$lte = parseInt(query.end, 10);
      delete query.end;
    }
  }
  return query;
};

module.exports = {
  handleInternalGetRequest: async ({ request, response }) => {
    const collection = request.path;
    const query = createQuery(request);
    getData({ collection, query })
      .then(data => response.status(200).json(data));
  },
  handleInternalPostRequest: async ({ request, response }) => {
    const { body: items } = request;
    const collection = request.path;
    postData({ collection, items })
      .then(() => response.status(204).send())
      .catch(() => response.send(400));
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
