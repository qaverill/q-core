const config = require('config');
const routes = require('express').Router();
const { MongoClient } = require('mongodb');
const { q_api } = require('q-lib');
const { handleCommonPostEndpoint, handleCommonGetEndpoint } = require('../sharedEndpointHandlers');

q_api.makePostEndpoint(routes, '/', '/mongodb/transactions', (request, response, then) => {
  if (!Array.isArray(request.body)) {
    MongoClient.connect(config.mongo_uri, MongoClient.connectionParams, (connectError, db) => {
      if (connectError) throw connectError;
      const updateQuery = { $set: { amount: request.body.amount } };
      db.db('q-mongodb')
        .collection('transactions')
        .updateOne({ ordinal: request.body.ordinal }, updateQuery, updateError => {
          if (updateError) throw updateError;
          response.status(204).send();
          db.close();
          then();
        });
    });
  } else {
    handleCommonPostEndpoint(request.body, response, 'transactions', then);
  }
});

q_api.makeGetEndpoint(routes, '/', '/mongodb/transactions', (request, response, then) => {
  handleCommonGetEndpoint(request.query, response, 'transactions', then);
});

q_api.makeDeleteEndpoint(routes, '/:ordinal', '/mongodb/transactions/:ordinal', (request, response, then) => {
  MongoClient.connect(config.mongo_uri, MongoClient.connectionParams, (connectError, db) => {
    if (connectError) throw connectError;
    const { ordinal } = request.params;
    db.db('q-mongodb')
      .collection('transactions')
      .deleteOne({ ordinal: parseInt(ordinal, 10) }, (removeError, result) => {
        if (removeError) throw removeError;
        response.status(result.deletedCount === 1 ? 200 : 404).send();
        then();
      });
  });
});

module.exports = routes;
