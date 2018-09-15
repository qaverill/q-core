let express = require('express');
let cors = require('cors');
let bodyParser = require('body-parser');

let AWS = require('aws-sdk');
AWS.config.loadFromPath('./config/aws.json');
AWS.config.update({endpoint: "https://dynamodb.us-east-2.amazonaws.com"});
global.docClient = new AWS.DynamoDB.DocumentClient();

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/spotify', require('./paths/spotify/auth'));
app.use('/aws', require('./paths/aws/saves'));
app.use('/aws', require('./paths/aws/listens'));

console.log('\nListening on port 8888');
app.listen(8888);
