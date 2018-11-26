const routes = require('express').Router();

routes.use('/listens', require('./listens'));

module.exports = routes;
