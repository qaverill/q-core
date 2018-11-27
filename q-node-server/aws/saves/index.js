const saves = require('express').Router();

const AWS = require('aws-sdk');
AWS.config.update({region: "us-east-2"});
const docClient = new AWS.DynamoDB.DocumentClient();

saves.post('/saves', function(req, res) {
  const saves = req.body.saves;
  let totalAdded = 0;
  saves.forEach(save => {
    const QSave = {
      TableName: 'QSaves',
      Item: save,
      ReturnValues: 'ALL_OLD'
    };

    docClient.put(QSave, function(err, data) {
      if (err) {
        console.error("Unable to add save. Error JSON:", JSON.stringify(err, null, 2));
        throw new Error("Failed to add QSave")
      } else {
        console.log("Added save: ", JSON.stringify(data, null, 2));
        totalAdded += 1;
      }
    });
  })
  for (let i = 0; i < QSaves.length; i++){

  }
  res.send ("Successfully added " + totalAdded + " out of " + QSaves.length + " QSaves");
});

saves.get('/saves/:trackID', function(req, res){
  const params = {
    TableName : 'QSaves',
    KeyConditionExpression: '#tid = :trackID',
    ExpressionAttributeNames: {
      '#tid': 'trackID'
    },
    ExpressionAttributeValues: {
      ':trackID': req.params.trackID
    }
  };

  docClient.query(params, function(err, data) {
    if (err) {
      console.error('Unable to query QSaves. Error:', JSON.stringify(err, null, 2));
      throw new Error('Failed to get QSave');
    } else {
      res.send(data.Items[0]);
    }
  });
});

saves.get('/', function(req, res){
  const params = {
    TableName : 'QSaves'
  };

  let allSaves = [];
  docClient.scan(params, onScan);

  function onScan(err, data) {
    if (err) {
      console.error("Unable to scan QSaves. Error JSON:", JSON.stringify(err, null, 2));
    } else {
      data.Items.forEach(listen => {
        allSaves.push(listen)
      });

      if (data.LastEvaluatedKey != null) {
        params.ExclusiveStartKey = data.LastEvaluatedKey;
        docClient.scan(params, onScan);
      } else {
        res.send(allSaves)
      }
    }
  }
});

console.log('POST\t/aws/saves');
console.log('GET \t/aws/saves/:trackID');
console.log('GET \t/aws/saves');

module.exports = saves;