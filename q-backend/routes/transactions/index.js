const routes = require('express').Router();
const path = require('path');
const fs = require('fs');
const { q_api, q_logger } = require('q-lib');
const { parseTransactionsData } = require('./functions');

const START_OF_SEPTEMBER = 1567310400;

const unneededFactDescriptions = [
  'Withdrawal VENMO',
  'Online Transfer',
  'Transfer Withdrawal',
];

const isFactNeeded = fact => (
  fact.timestamp >= START_OF_SEPTEMBER
  && !new RegExp(unneededFactDescriptions
    .map(d => d.toLowerCase())
    .join('|'))
    .test(fact.description.toLowerCase())
);

q_api.makeGetEndpoint(routes, '/', '/transactions', (request, response) => {
  let facts = [];
  fs.readdir(path.join(__dirname, 'data-dump'), (readdirError, files) => {
    if (readdirError) return q_logger.error('Cannot read files in data-dump dir');
    files.forEach(file => {
      fs.readFile(path.join(__dirname, `./data-dump/${file}`), 'UTF-8', (readFileError, data) => {
        if (readFileError) return q_logger.error(`Cannot read data in ${file}.csv`);
        facts.push(parseTransactionsData(data, file.slice(0, -4)));
        if (facts.length === files.length) {
          facts = [].concat(...facts).filter(fact => isFactNeeded(fact));
          response.status(200)
            .json({ items: facts.sort((a, b) => ((a.timestamp > b.timestamp) ? -1 : 1)) });
        }
      });
    });
  });
});

module.exports = routes;
