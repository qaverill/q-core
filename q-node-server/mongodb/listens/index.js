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

console.log('POST \t/mongodb/listens');

module.exports = routes;