const routes = require('express').Router();
const listens = require('./listens');

routes.use('/listens', listens);

module.exports = routes;
