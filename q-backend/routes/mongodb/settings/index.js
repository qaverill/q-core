const routes = require('express').Router();
const { MongoClient } = require('mongodb');
const config = require('config');
const { q_api } = require('q-lib');

q_api.makePostEndpoint(routes, '/', '/mongodb/settings', (request, response) => {
  MongoClient.connect(config.mongo_uri, MongoClient.connectionParams, (connectError, db) => {
    if (connectError) throw connectError;
    const dbo = db.db('q-mongodb');
    dbo.collection('settings').drop((dropError, delOK) => {
      if (dropError) throw dropError;
      if (delOK) {
        dbo.collection('settings').insertOne(request.body, () => response.status(204).send());
      }
      db.close();
    });
  });
});

q_api.makeGetEndpoint(routes, '/', '/mongodb/settings', (request, response) => {
  MongoClient.connect(config.mongo_uri, MongoClient.connectionParams, (err, db) => {
    if (err) throw err;
    const dbo = db.db('q-mongodb');
    dbo.collection('settings').findOne({}, (err, res) => {
      if (err) throw err;
      response.status(200).json(res);
      db.close();
    });
  });
});

module.exports = routes;