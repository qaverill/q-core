const routes = require('express').Router();
const MongoClient = require('mongodb').MongoClient;

MongoClient.connectionParams = { useUnifiedTopology: true, useNewUrlParser: true };

routes.use('/listens', require('./listens'));
routes.use('/saves', require('./saves'));
routes.use('/settings', require('./settings'));

module.exports = routes;
