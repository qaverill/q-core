/* eslint-disable no-throw-literal */
const { request: requestModule } = require('request');
const { MongoClient } = require('mongodb');

const config = require('../config');
const { dateToTimestamp, oathRequestOptions } = require('../utils');

const { mongo_uri } = config;
const { connectionParams } = MongoClient;
MongoClient.connectionParams = { useUnifiedTopology: true, useNewUrlParser: true };

const handleUnsavedRequest = async ({
  url,
  collection,
  timeParam,
  response,
}) => {
  requestModule.get(oathRequestOptions({ url }), (spotifyError, spotifyResponse, data) => {
    const { items } = JSON.parse(data);
    MongoClient.connect(mongo_uri, connectionParams, (connectError, db) => {
      db.db('q-mongodb')
        .collection(collection)
        .find({ timestamp: { $gte: dateToTimestamp(items[items.length - 1][timeParam]) } })
        .toArray((findError, mongoResults) => {
          const maxSavedTimestamp = Math.max(...mongoResults.map(result => result.timestamp));
          const unsavedListens = items.filter(i => dateToTimestamp(i[timeParam]) > maxSavedTimestamp);
          response.status(200).json(unsavedListens);
          db.close();
        });
    });
  });
};

module.exports = {
  handleUnsavedGetRequest: async ({ request, response }) => {
    // TODO get the collection from the request or response
    const collection = 'listens';
    let url;
    let timeParam;
    if (collection === 'listens') {
      url = 'https://api.spotify.com/v1/me/player/recently-played?limit=50';
      timeParam = 'played_at'
    } else if (collection === 'saves') {
      url = 'https://api.spotify.com/v1/me/tracks?limit=50';
      timeParam = 'added_at';
    } else {
      throw `Collection ${collection} does not exist for an unsaved request!`;
    }
    handleUnsavedRequest({ url, timeParam, collection, response });
  },
};
