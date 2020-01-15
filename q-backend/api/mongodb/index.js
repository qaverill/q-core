const routes = require('express').Router();
const { MongoClient } = require('mongodb');

MongoClient.connectionParams = { useUnifiedTopology: true, useNewUrlParser: true };

routes.use('/listens', require('./listens'));
routes.use('/saves', require('./saves'));
routes.use('/settings', require('./settings'));
routes.use('/transactions', require('./transactions'));

module.exports = routes;
