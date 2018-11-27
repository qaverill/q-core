const routes = require('express').Router();

routes.use('/auth', require('./auth'));
routes.use('/recently-played', require('./recently-played'));
routes.use('/saved-tracks', require('./saved-tracks'));

module.exports = routes;
