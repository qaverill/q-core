const aws = require('express').Router();
const listens = require('./listens');
const saves = require('./saves');

aws.use('/listens', listens);
aws.use('/saves', saves);

module.exports = aws;
