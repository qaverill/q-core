const saves = require('express').Router();

const AWS = require('aws-sdk');
AWS.config.loadFromPath('./routes/aws/config.json');
AWS.config.update({endpoint: "https://dynamodb.us-east-2.amazonaws.com"});
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

console.log('POST\t/aws/saves');
console.log('GET \t/aws/saves/:trackID');

module.exports = saves;