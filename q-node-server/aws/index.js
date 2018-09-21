const aws = require('express').Router();
const listens = require('./listens/index');
const saves = require('./saves/index');

aws.use('/listens', listens);
aws.use('/saves', saves);

module.exports = aws;
