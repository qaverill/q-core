const routes = require('express').Router();
const MongoClient = require('mongodb').MongoClient;
const validation = require('../validation');
const config = require('config');
const { q_api } = require('q-lib');

q_api.makePostEndpoint(routes, '/', '/mongodb/saves', (request, response) => {
  // Validate the request body and if OK, set (each) listen._id to it's timestamp
  let savesToInsert = [];
  if (Array.isArray(request.body)){
    request.body.forEach(save => {
      if (validation.save(save)){
        save._id = save.timestamp;
        savesToInsert.push(save)
      } else {
        console.log("Bad save:", save);
        response.status(400).send();
      }
    })
  } else {
    if (validation.listen(request.body)){
      request.body._id = request.body.timestamp;
      savesToInsert.push(request.body)
    } else {
      console.log("Bad save:", request.body);
      response.status(400).send();
    }
  }

  // Insert savesToInsert to mongodb if there are any
  if (savesToInsert.length > 0){
    MongoClient.connect(config.mongo_uri, {useUnifiedTopology: true}, (err, db) => {
      if (err) throw err;
      const dbo = db.db('q-mongodb');
      dbo.collection('saves').insertMany(savesToInsert, {ordered: false}, (err, res) => {
        response.status(204).send();
        db.close();
      });
    });
  } else {
    response.status(400).send()
  }
});

q_api.makeGetEndpoint(routes, '/', '/mongodb/saves', (request, response) => {
  let query = {};
  if (request.query.start != null || request.query.end != null){
    query._id = {};
    if (request.query.start != null){
      query._id.$gte = parseInt(request.query.start, 10)
    }
    if (request.query.end != null){
      query._id.$lte = parseInt(request.query.end, 10)
    }
  }
  if (request.query.trackID != null){
    query.track = request.query.trackID
  }
  if (request.query.artistID != null){
    query.artists = request.query.artistID
  }
  if (request.query.albumID != null){
    query.album = request.query.albumID
  }

  MongoClient.connect(config.mongo_uri, MongoClient.connectionParams, (err, db) => {
    if (err) throw err;
    const dbo = db.db('q-mongodb');
    dbo.collection('saves').find(query).toArray((err, res) => {
      if (err) throw err;
      response.status(200).json(res);
      db.close();
    });
  });
});

module.exports = routes;