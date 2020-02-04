/* eslint-disable no-throw-literal */
const { request: requestModule } = require('request');
const { MongoClient } = require('mongodb');

const config = require('../config');
const { dateToTimestamp, oathRequestOptions } = require('../utils');

const { getRecentlyPlayed, getMyTracks, getTransactions } = require('../api-calls/external');
const { getListens, getSaves, readDataDump } = require('../api-calls/internal');

const { mongo_uri } = config;
const { connectionParams } = MongoClient;
MongoClient.connectionParams = { useUnifiedTopology: true, useNewUrlParser: true };

const getNewAvailableData = async ({ collection }) => {
  switch (collection) {
    case 'listens':
      return getRecentlyPlayed();
    case 'saves':
      return getMyTracks();
    case 'transactions':
      return readDataDump();
    default:
      throw new Error(`Unknown collection in getNewAvailableData: ${collection}`);
  }
};

const getExistingData = async ({ collection, start }) => {
  switch (collection) {
    case 'listens':
      return getListens({ start });
    case 'saves':
      return getSaves({ start });
    case 'transactions':
      return getTransactions({ start });
    default:
      throw new Error(`Unknown collection in getExistingData: ${collection}`);
  }
};

module.exports = {
  handleUnsavedRequest: async ({ request, response }) => {
    const { collection } = request.params;
    getNewAvailableData({ collection }).then(newData => {
      const youngestItem = Math.min(...newData.map(item => item.timestamp));
      getExistingData({ collection, start: youngestItem }).then(existingData => {
        response.status(200).json(newData.filter(newItem => !existingData.includes(newItem)));
      });
    });
  },
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
