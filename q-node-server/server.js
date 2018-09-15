let express = require('express');
let cors = require('cors');
let bodyParser = require('body-parser');

let dynamo = require('./QListens');
let spotify = require('./paths/spotify');

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/spotify', spotify);
app.use('/dynamo', dynamo);

console.log('Listening on 8888');
app.listen(8888);
