const request = require('request');
const config = require('config');
const { MongoClient } = require('mongodb');
const { q_logger } = require('q-lib');

const { dateToTimestamp, oathRequestOptions } = require('./utils');

module.exports = {
  handleUnsavedRequest: ({
    url,
    collection,
    timeParam,
    responseToUi,
    then,
  }) => {
    request.get(oathRequestOptions({ url }), (spotifyError, spotifyResponse, data) => {
      const { items } = JSON.parse(data);
      MongoClient.connect(config.mongo_uri, MongoClient.connectionParams, (connectError, db) => {
        db.db('q-mongodb')
          .collection(collection)
          .find({ timestamp: { $gte: dateToTimestamp(items[items.length - 1][timeParam]) } })
          .toArray((findError, mongoResults) => {
            const maxSavedTimestamp = Math.max(...mongoResults.map(result => result.timestamp));
            const unsavedListens = items.filter(i => dateToTimestamp(i[timeParam]) > maxSavedTimestamp);
            responseToUi.status(200).json(unsavedListens);
            db.close();
            then();
          });
      });
    });
  },
  handleGetWrapperRequest: ({ req, res, then }) => {
    const { url } = req.query;
    request.get(oathRequestOptions({ url }), (error, response) => {
      if (!error && (response.statusCode === 200 || response.statusCode === 201)) {
        res.send(response.body);
      } else {
        q_logger.error(`Error while sending GET to ${url}`, response);
        res.send({ error });
      }
      then();
    });
  },
  handlePostWrappedRequest: ({ req, res, then }) => {
    const { url, body } = req.body;
    request.post(oathRequestOptions({ url, body }), (error, response) => {
      if (!error && response.statusCode === 201) {
        res.send(response.body);
      } else {
        q_logger.error(`Error while sending POST to ${url}`, response);
        res.send({ error });
      }
      then();
    });
  }
};
