const request = require('request');
const config = require('config');
const { MongoClient } = require('mongodb');
const { q_utils } = require('q-lib');

const { dateToTimestamp } = q_utils;

module.exports = {
  handleUnsavedCall: ({
    url,
    collection,
    timeParam,
    responseToUi,
    then,
  }) => {
    const requestOptions = {
      headers: { Authorization: `Bearer ${config.spotify.access_token}` },
      url,
    };
    request.get(requestOptions, (spotifyError, spotifyResponse, data) => {
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
};
