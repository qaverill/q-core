const listens = require('express').Router();

const AWS = require('aws-sdk');
AWS.config.update({region: "us-east-2"});
const docClient = new AWS.DynamoDB.DocumentClient();

listens.post('/', function(req, res) {
  const listens = req.body.listens;
  listens.forEach(listen => {
    let qListen = {
      TableName: 'QListens',
      Item: listen,
      ReturnValues: 'ALL_OLD'
    };

    docClient.put(qListen, function(err) {
      if (err) {
        console.error('Unable to add listen. Error JSON:', JSON.stringify(err, null, 2));
        throw new Error('Failed to add QListen')
      }
    });
  });

  res.end()
});
listens.get('/:timestamp', function(req, res){
  const params = {
    TableName : 'QListens',
    KeyConditionExpression: '#tstmp = :timestamp',
    ExpressionAttributeNames:{
      '#tstmp': 'timestamp'
    },
    ExpressionAttributeValues: {
      ':timestamp': parseInt(req.params.timestamp)
    }
  };

  docClient.query(params, function(err, data) {
    if (err) {
      console.error('Unable to get QListens. Error:', JSON.stringify(err, null, 2));
      throw new Error('Failed to get QListen')
    } else {
      res.send(data.Items[0]);
    }
  });
});

console.log('POST\t/aws/listens');
console.log('GET \t/aws/listens/:timestamp');

module.exports = listens;