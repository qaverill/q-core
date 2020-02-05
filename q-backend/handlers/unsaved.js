/* eslint-disable no-throw-literal */
const { request: requestModule } = require('request');
const { MongoClient } = require('mongodb');

const config = require('../config');
const { dateToTimestamp, oathRequestOptions } = require('../utils');



const { mongo_uri } = config;
const { connectionParams } = MongoClient;
MongoClient.connectionParams = { useUnifiedTopology: true, useNewUrlParser: true };



module.exports = {
  handleUnsavedGetRequest: async ({ request, response }) => {
    // TODO get the collection from the request or response
    const { collection } = request.params;
    let url;
    let timeParam;
    if (collection === 'listens') {
      url = 'https://api.spotify.com/v1/me/player/recently-played?limit=50';
      timeParam = 'played_at';
    } else if (collection === 'saves') {
      url = 'https://api.spotify.com/v1/me/tracks?limit=50';
      timeParam = 'added_at';
    } else {
      throw `Collection ${collection} does not exist for an unsaved request!`;
    }
    handleUnsavedRequest({ url, timeParam, collection, response });
  },
};
