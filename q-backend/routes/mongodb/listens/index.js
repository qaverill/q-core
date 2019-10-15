const routes = require('express').Router();
const { MongoClient } = require('mongodb');
const config = require('config');
const { q_api, q_logger } = require('q-lib');
const { validateListens } = require('../validation');

q_api.makePostEndpoint(routes, '/', '/mongodb/listens', (request, response) => {
  const listens = Array.isArray(request.body) ? request.body : [request.body];
  if (!validateListens(listens)) {
    response.status(400).send();
  }

  listens.map(listen => ({ ...listen, _id: listen.timestamp }));
  MongoClient.connect(config.mongo_uri, MongoClient.connectionParams, (connectError, db) => {
    if (connectError) return q_logger.error('Cannot connect to mongo');
    db.db('q-mongodb').collection('listens').insertMany(listens, { ordered: false }, (insertError) => {
      if (insertError) return q_logger.error('Cannot insert listens into mongo');
      response.status(204).send();
      db.close();
    });
  });
});

q_api.makeGetEndpoint(routes, '/', '/mongodb/listens', (request, response) => {
  const query = {};
  if ((request.query.start != null && !isNaN(request.query.start)) || (request.query.end != null && !isNaN(request.query.end))) {
    query._id = {};
    if (request.query.start != null && !isNaN(request.query.start)) {
      query._id.$gte = parseInt(request.query.start, 10);
    }
    if (request.query.end != null && !isNaN(request.query.end)) {
      query._id.$lte = parseInt(request.query.end, 10);
    }
  }
  if (request.query.trackID != null) {
    query.track = request.query.trackID;
  }
  if (request.query.artistID != null) {
    query.artists = request.query.artistID;
  }
  if (request.query.albumID != null) {
    query.album = request.query.albumID;
  }

  MongoClient.connect(config.mongo_uri, MongoClient.connectionParams, (err, db) => {
    if (err) throw err;
    const dbo = db.db('q-mongodb');
    dbo.collection('listens').find(query).toArray((err, res) => {
      if (err) throw err;
      response.status(200).json(res);
      db.close();
    });
  });
});

module.exports = routes;
