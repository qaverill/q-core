const routes = require('express').Router();
const path = require('path');
const fs = require('fs');
const { q_api, q_logger } = require('q-lib');
const { parseAccountingData } = require('./assets');

const sources = ['mvcu', 'citi'];

const readDataFile = source => {
  fs.readFile(path.join(__dirname, `./data-dump/${source}.csv`), 'UTF-8', (error, data) => {
    if (error) {
      q_logger.error('Cannot read file', `${file}.csv`);
      return;
    }
    return parseAccountingData(data, source)
  })
}

q_api.makeGetEndpoint(routes, '/', '/accounting', (req, res) => {
  let facts = [];
  readDataFile('mvcu', (data) => {
    facts = facts.concat(data);
    readDataFile('citi', (data) => {
      facts = facts.concat(data);
      console.log(data)
    })
  })
})

module.exports = routes;