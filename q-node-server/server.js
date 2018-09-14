let express = require('express');
let cors = require('cors');
let bodyParser = require('body-parser');

let QSaves = require('./QSaves');
let QListens = require('./QListens');
let SpotifyAuth = require('./SpotifyAuth');

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/spotifyAuth', SpotifyAuth);
app.use('/QListens', QListens);
app.use('/QSaves', QSaves);

console.log('Listening on 8888');
app.listen(8888);
