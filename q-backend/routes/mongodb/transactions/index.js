const config = require('config');
const routes = require('express').Router();
const { MongoClient } = require('mongodb');
const { q_logger } = require('q-lib');
const { q_api } = require('q-lib');
const { handleCommonPostEndpoint, handleCommonGetEndpoint } = require('../sharedEndpointHandlers');

q_api.makePostEndpoint(routes, '/', '/mongodb/transactions', (request, response) => {
  if (!Array.isArray(request.body)) {
    MongoClient.connect(config.mongo_uri, MongoClient.connectionParams, (connectError, db) => {
      if (connectError) return q_logger.error('Cannot connect to mongo', connectError);
      const updateQuery = { $set: { amount: request.body.amount } };
      console.log(updateQuery)
      db.db('q-mongodb').collection('transactions').updateOne({ ordinal: request.body.ordinal }, updateQuery, updateError => {
        if (updateError) throw updateError;
        response.status(204).send();
        db.close();
      });
    });
  } else {
    handleCommonPostEndpoint(request.body, response, 'transactions');
  }
});

q_api.makeGetEndpoint(routes, '/', '/mongodb/transactions', (request, response) => {
  handleCommonGetEndpoint(request.query, response, 'transactions');
});

module.exports = routes;
