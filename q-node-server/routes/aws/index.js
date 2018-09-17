const aws = require('express').Router();
const listens = require('./listens');
const saves = require('./saves');

aws.get('/listens', listens);
aws.get('/saves', saves);

module.exports = aws;
