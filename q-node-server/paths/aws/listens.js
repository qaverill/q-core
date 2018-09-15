let express = require('express');
let router = express.Router();

router.use(function timeLog (req, res, next) {
  next();
});

router.post('/listens', function(req, res) {
  console.log('POST\t/aws/listens');

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
router.get('/listens/:timestamp', function(req, res){
  console.log(`GET\t/dynamo/listens/${parseInt(req.params.timestamp)}`);

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
console.log('GET\t/aws/listens/:timestamp');

module.exports = router;