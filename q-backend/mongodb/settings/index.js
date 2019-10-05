const routes = require('express').Router();
const MongoClient = require('mongodb').MongoClient;
const config = require('config');
const q_logger = require('q-logger');

routes.post('/', (request, response) => {
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

routes.get('/', (request, response) => {
  MongoClient.connect(config.mongo_uri, MongoClient.connectionParams, (err, db) => {
    if (err) throw err;
    const dbo = db.db('q-mongodb');
    dbo.collection('settings').findOne({}, (err, res) => {
      if (err) throw err;
      q_logger.debug("boutta return mongo/settings");
      response.status(200).json(res);
      db.close();
    });
  });
});

console.log('  POST /mongodb/settings');
console.log('  GET  /mongodb/settings');

module.exports = routes;