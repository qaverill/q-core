const routes = require('express').Router();

routes.use('/listens', require('./listens'));
routes.use('/saves', require('./saves'));

module.exports = routes;
