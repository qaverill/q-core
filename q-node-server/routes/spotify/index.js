const spotify = require('express').Router();
const auth = require('./auth');
const recentlyPlayed = require('./recently-played');

spotify.use('/auth', auth);
spotify.use('/recently-played', recentlyPlayed);

module.exports = spotify;
