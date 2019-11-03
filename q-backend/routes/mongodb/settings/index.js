const routes = require('express').Router();
const { MongoClient } = require('mongodb');
const config = require('config');
const { q_api } = require('q-lib');

const SETTINGS_COLLECTION = 'metadata';

q_api.makePostEndpoint(routes, '/', '/mongodb/settings', (request, response) => {
  MongoClient.connect(config.mongo_uri, MongoClient.connectionParams, (connectError, db) => {
    if (connectError) throw connectError;
    const dbo = db.db('q-mongodb');
    const settingsQuery = { _id: 'settings' };
    const updateQuery = { $set: request.body };
    dbo.collection(SETTINGS_COLLECTION).updateOne(settingsQuery, updateQuery, updateError => {
      if (updateError) throw updateError;
      response.status(204).send();
      db.close();
    });
  });
});

q_api.makeGetEndpoint(routes, '/', '/mongodb/settings', (request, response) => {
  MongoClient.connect(config.mongo_uri, MongoClient.connectionParams, (connectError, db) => {
    if (connectError) throw connectError;
    const dbo = db.db('q-mongodb');
    dbo.collection(SETTINGS_COLLECTION).findOne({}, (findError, res) => {
      if (findError) throw findError;
      response.status(200).json(res);
      db.close();
    });
  });
});

module.exports = routes;