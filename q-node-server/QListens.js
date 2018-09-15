let express = require('express')
let router = express.Router()

let AWS = require("aws-sdk");
AWS.config.update(require('../q-config/config').aws);

let docClient = new AWS.DynamoDB.DocumentClient();

router.use(function timeLog (req, res, next) {
  next();
});

router.post('/', function(req, res) {
  console.log("POST /QListens/");
  var listens = req.body.listens;

  let totalAdded = 0;
  for(let i = 0; i < listens.length; i++){
    var listen = {
      TableName: 'QListens',
      Item: listens[i],
      ReturnValues: 'ALL_OLD'
    }

    docClient.put(listen, function(err, data) {
      if (err) {
        console.error("Unable to add listen. Error JSON:", JSON.stringify(err, null, 2));
      } else {
        console.log("Added listen: ", JSON.stringify(data, null, 2));
        totalAdded += 1;
      }
    });
  }

  res.end("Successfully added " + totalAdded + " out of " + listens.length + " listens");
});

router.get('/:timestamp', function(req, res){
  const timestamp = parseInt(req.params.timestamp);
  console.log("GET /QListens/" + timestamp);

  var params = {
    TableName : "QListens",
    KeyConditionExpression: "#tstmp = :timestamp",
    ExpressionAttributeNames:{
        "#tstmp": "timestamp"
    },
    ExpressionAttributeValues: {
        ":timestamp": timestamp
    }
  };

  docClient.query(params, function(err, data) {
    if (err) {
        console.error("Unable to query QListens. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("GET /QListens/" + timestamp + " succeeded");
        res.send(data.Items[0]);
    }
  });
});

module.exports = router