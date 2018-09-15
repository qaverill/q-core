let express = require('express')
let router = express.Router()

let AWS = require("aws-sdk");
AWS.config.update(require('../q-config/config').aws);

let docClient = new AWS.DynamoDB.DocumentClient();

router.use(function timeLog (req, res, next) {
  next();
});

router.post('/listens', function(req, res) {
  console.log("POST /dynamo/listens");

  let listens = req.body.listens;
  let totalAdded = 0;
  listens.forEach(listen => {
    let qListen = {
      TableName: 'QListens',
      Item: listen,
      ReturnValues: 'ALL_OLD'
    };

    docClient.put(qListen, function(err, data) {
      if (err) {
        console.error("Unable to add listen. Error JSON:", JSON.stringify(err, null, 2));
      } else {
        console.log("Added listen: ", JSON.stringify(data, null, 2));
        totalAdded += 1;
      }
    });
  });
});