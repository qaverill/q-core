const server = require('express')();
const routes = require('./routes');
const PORT = 8888;

server.use(require('cors')());

// body-parser
const bodyParser = require('body-parser');
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

// AWS
let AWS = require('aws-sdk');
AWS.config.loadFromPath('./config/aws.json');
AWS.config.update({endpoint: "https://dynamodb.us-east-2.amazonaws.com"});
global.docClient = new AWS.DynamoDB.DocumentClient();

// Spotify
global.stateKey = 'spotify_auth_state';
global.spotifyConfig = require('./config/spotify');

// Roots
server.use('/', routes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
});
