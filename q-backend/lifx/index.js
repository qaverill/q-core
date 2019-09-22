const routes = require('express').Router();

routes.use('/auth', require('./auth'));

module.exports = routes;

