const routes = require('express').Router();
const path = require('path');
const fs = require('fs');
const { q_api, q_logger } = require('q-lib');
const { parseAccountingData } = require('./assets');

q_api.makeGetEndpoint(routes, '/', '/accounting', (request, response) => {
  let facts = []
  fs.readdir(path.join(__dirname, 'data-dump'), (error, files) => {
    if (error) return q_logger.error('Cannot read files in data-dump dir');
    files.forEach(file => {
      fs.readFile(path.join(__dirname, `./data-dump/${file}`), 'UTF-8', (error, data) => {
        if (error) return q_logger.error(`Cannot read data in ${source}.csv`);
        facts.push(parseAccountingData(data, file.slice(0, -4)));
        if (facts.length === files.length) {
          facts = [].concat(...facts).sort((a, b) => (a.timestamp > b.timestamp) ? -1 : 1);
          console.log(facts[0].timestamp, facts[facts.length - 1].timestamp)
          response.status(200).json({ items: facts })
        }
      });
    });
  })
});

module.exports = routes;