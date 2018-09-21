const routes = require('express').Router();
const auth = require('./auth');
const recentlyPlayed = require('./recently-played');

routes.use('/auth', auth);
routes.use('/recently-played', recentlyPlayed);

module.exports = routes;
