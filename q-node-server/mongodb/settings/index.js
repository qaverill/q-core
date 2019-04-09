const routes = require('express').Router();
const MongoClient = require('mongodb').MongoClient;

routes.post('/', (request, response) => {
  MongoClient.connect(process.env.MONGO_URI, {useNewUrlParser: true}, (err, db) => {
    if (err) throw err;
    const dbo = db.db('q-mongodb');
    dbo.collection("serttings").drop((err, delOK) => {
      if (err) throw err;
      if (delOK) {
        dbo.collection('settings').insertOne(request.body, (err, res) => {
          response.status(204).send();
        });
      }
      db.close();
    });
  });
});

routes.get('/', (request, response) => {
  MongoClient.connect(process.env.MONGO_URI, {useNewUrlParser: true}, (err, db) => {
    if (err) throw err;
    const dbo = db.db('q-mongodb');
    dbo.collection('settings').findOne({}, (err, res) => {
      if (err) throw err;
      response.status(200).json(res);
      db.close();
    });
  });
});

console.log('POST \t/mongodb/settings');
console.log('GET \t/mongodb/settings');

module.exports = routes;