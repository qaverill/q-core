const aws = require('express').Router();

aws.use('/listens', require('./listens/index'));
aws.use('/saves', require('./saves/index'));

module.exports = aws;
