const routes = require('express').Router();

routes.use('/listens', require('./listens'));
routes.use('/saves', require('./saves'));
routes.use('/settings', require('./settings'));

module.exports = routes;
