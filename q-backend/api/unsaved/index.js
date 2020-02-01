const routes = require('express').Router();
const request = require('request');
const { MongoClient } = require('mongodb');

const config = require('../../config');
const { q_api } = require('../../q-lib');
const { dateToTimestamp, oathRequestOptions } = require('../../utils');

const { mongo_uri } = config;
const { connectionParams } = MongoClient;

const handleUnsavedRequest = ({
  url,
  collection,
  timeParam,
  res,
  then,
}) => {
  request.get(oathRequestOptions({ url }), (spotifyError, spotifyResponse, data) => {
    const { items } = JSON.parse(data);
    MongoClient.connect(mongo_uri, connectionParams, (connectError, db) => {
      db.db('q-mongodb')
        .collection(collection)
        .find({ timestamp: { $gte: dateToTimestamp(items[items.length - 1][timeParam]) } })
        .toArray((findError, mongoResults) => {
          const maxSavedTimestamp = Math.max(...mongoResults.map(result => result.timestamp));
          const unsavedListens = items.filter(i => dateToTimestamp(i[timeParam]) > maxSavedTimestamp);
          res.status(200).json(unsavedListens);
          db.close();
          then();
        });
    });
  });
};

q_api.makeGetEndpoint(routes, '/listens', '/unsaved/listens', (req, res, then) => {
  handleUnsavedRequest({
    url: 'https://api.spotify.com/v1/me/player/recently-played?limit=50',
    timeParam: 'played_at',
    collection: 'listens',
    res,
    then,
  });
});

q_api.makeGetEndpoint(routes, '/saves', '/unsaved/saves', (req, res, then) => {
  handleUnsavedRequest({
    url: 'https://api.spotify.com/v1/me/tracks?limit=50',
    timeParam: 'added_at',
    collection: 'saves',
    res,
    then,
  });
});

module.exports = routes;
