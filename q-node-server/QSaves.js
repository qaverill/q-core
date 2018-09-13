let express = require('express')
let router = express.Router()

let AWS = require("aws-sdk");
AWS.config.loadFromPath('../q-config/aws-config.json');
AWS.config.update({endpoint: "https://dynamodb.us-east-2.amazonaws.com"});

let docClient = new AWS.DynamoDB.DocumentClient();

router.use(function timeLog (req, res, next) {
  next();
});

router.post('/', function(req, res) {
  console.log("POST /QSaves/");

  const QSaves = req.body.saves

  let totalAdded = 0;
    for(let i = 0; i < QSaves.length; i++){
      var QSave = {
        TableName: 'QSaves',
        Item: QSaves[i],
        ReturnValues: 'ALL_OLD'
      }

      docClient.put(QSave, function(err, data) {
        if (err) {
          console.error("Unable to add save. Error JSON:", JSON.stringify(err, null, 2));
          throw new Error("Failed to add QSaves")
        } else {
          console.log("Added save: ", JSON.stringify(data, null, 2));
          totalAdded += 1;
        }
      });
    }
    res.send ("Successfully added " + totalAdded + " out of " + QSaves.length + " QSaves");
});

router.get('/:trackID', function(req, res){
  console.log("GET /QSaves/" + req.params.trackID);
  const trackID = req.params.trackID;

  var params = {
    TableName : "QSaves",
    KeyConditionExpression: "#tid = :trackID",
    ExpressionAttributeNames: {
        "#tid": "trackID"
    },
    ExpressionAttributeValues: {
        ":trackID": trackID
    }
  };

  docClient.query(params, function(err, data) {
    if (err) {
        console.error("Unable to query QSaves. Error:", JSON.stringify(err, null, 2));
        throw new Error("Failed to get QSave");
    } else {
        console.log("GET /QSaves/" + trackID + " succeeded");
        res.send(data.Items[0]);
    }
  });
});

module.exports = router
