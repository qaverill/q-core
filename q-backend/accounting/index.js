const routes = require('express').Router();
const path = require('path');
const q_api = require('q-api');
const fs = require('fs');
const { parseAccountingData } = require('./assets');

q_api.makeGetEndpoint(routes, '/', '/accounting', (req, res) => {
  let facts = [];
  fs.readFile(path.join(__dirname, './data-dump/mvcu.csv'), 'UTF-8', (error, data) => {
    if (error) throw error;
    facts = facts.concat(parseAccountingData(data, 'mvcu'))
    fs.readFile(path.join(__dirname, './data-dump/citi.csv'), 'UTF-8', (error, data) => {
      if (error) throw error;
      facts = facts.concat(parseAccountingData(data, 'citi'))
      console.log(facts)
    })
  })
})

module.exports = routes;