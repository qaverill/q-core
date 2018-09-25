const routes = require('express').Router();
const MongoClient = require('mongodb').MongoClient;
const validation = require('../validation');

routes.post('/', (request, response) => {
  // Validate the request body and if OK, set (each) listen._id to it's timestamp
  let listensToInsert = [];
  if (Array.isArray(request.body)){
    request.body.forEach(listen => {
      if (validation.listen(listen)){
        listen._id = listen.timestamp;
        listensToInsert.push(listen)
      } else {
        response.status(400).send()
      }
    })
  } else {
    if (validation.listen(request.body)){
      request.body._id = request.body.timestamp;
      listensToInsert.push(request.body)
    } else {
      response.status(400).send()
    }
  }

  // Insert listensToInsert to mongodb if there are any
  if (listensToInsert.length > 0){
    MongoClient.connect(process.env.MONGO_URI, {useNewUrlParser: true}, (err, db) => {
      if (err) throw err;
      const dbo = db.db('q-mongodb');
      dbo.collection('listens').insertMany(listensToInsert, {ordered: false}, (err, res) => {
        response.status(204).send();
        db.close();
      });
    });
  } else {
    response.status(400).send()
  }
});

routes.get('/', (request, response) => {
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

  console.log(query);
  MongoClient.connect(process.env.MONGO_URI, {useNewUrlParser: true}, (err, db) => {
    if (err) throw err;
    const dbo = db.db('q-mongodb');
    dbo.collection('listens').find(query).toArray((err, res) => {
      if (err) throw err;
      response.status(200).json(res);
      db.close();
    });
  });
});

console.log('POST \t/mongodb/listens');
console.log('GET \t/mongodb/listens');

module.exports = routes;