const spotify = require('express').Router();
const auth = require('./auth');

spotify.get('/auth', auth);

module.exports = spotify;
