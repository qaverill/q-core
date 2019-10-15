const routes = require('express').Router();
const path = require('path');
const fs = require('fs');
const { q_api, q_logger } = require('q-lib');
const { parseAccountingData } = require('./assets');

q_api.makeGetEndpoint(routes, '/', '/accounting', (request, response) => {
  let facts = [];
  fs.readdir(path.join(__dirname, 'data-dump'), (readdirError, files) => {
    if (readdirError) return q_logger.error('Cannot read files in data-dump dir');
    files.forEach(file => {
      fs.readFile(path.join(__dirname, `./data-dump/${file}`), 'UTF-8', (readFileError, data) => {
        if (readFileError) return q_logger.error(`Cannot read data in ${file}.csv`);
        facts.push(parseAccountingData(data, file.slice(0, -4)));
        if (facts.length === files.length) {
          facts = [].concat(...facts).sort((a, b) => ((a.timestamp > b.timestamp) ? -1 : 1));
          response.status(200).json({ items: facts.filter(f => f.timestamp >= 1567310400) });
        }
      });
    });
  });
});

module.exports = routes;
