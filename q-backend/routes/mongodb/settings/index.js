const routes = require('express').Router();
const MongoClient = require('mongodb').MongoClient;
const config = require('config');
const q_logger = require('q-logger');
const q_api = require('q-api');

q_api.makePostEndpoint(routes, '/', '/mongodb/settings', (request, response) => {
  MongoClient.connect(config.mongo_uri, MongoClient.connectionParams, (err, db) => {
    if (err) throw err;
    const dbo = db.db('q-mongodb');
    dbo.collection("settings").drop((err, delOK) => {
      if (err) throw err;
      if (delOK) {
        dbo.collection('settings').insertOne(request.body, (err, res) => {
          response.status(204).send();
        });
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