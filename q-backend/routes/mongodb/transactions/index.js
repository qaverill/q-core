const config = require('config');
const routes = require('express').Router();
const { MongoClient } = require('mongodb');
const { q_logger } = require('q-lib');
const { q_api } = require('q-lib');
const { handleCommonPostEndpoint, handleCommonGetEndpoint } = require('../sharedEndpointHandlers');

q_api.makePostEndpoint(routes, '/', '/mongodb/transactions', (request, response) => {
  // if (!Array.isArray(request.body)) {
  //   MongoClient.connect(config.mongo_uri, MongoClient.connectionParams, (connectError, db) => {
  //     if (connectError) return q_logger.error('Cannot connect to mongo', connectError);
  //     db.db('q-mongodb').collection('transactions').find({ ordinal: request.body.ordinal }).toArray((findError, res) => {
  //       if (findError) throw q_logger.error(`Cannot query mongo ${collection}`, findError);
  //       response.status(200).json(res);
  //       db.close();
  //     });
  //   });
  // }
  handleCommonPostEndpoint(request.body, response, 'transactions');
});

q_api.makeGetEndpoint(routes, '/', '/mongodb/transactions', (request, response) => {
  handleCommonGetEndpoint(request.query, response, 'transactions');
});

module.exports = routes;
