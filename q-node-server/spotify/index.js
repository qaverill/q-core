const routes = require('express').Router();

routes.use('/auth', require('./auth'));
routes.use('/recently-played', require('./recently-played'));

module.exports = routes;
