const routes = require('express').Router();
const { MongoClient } = require('mongodb');
const config = require('config');
const { q_api } = require('q-lib');
const validation = require('../validation');

module.exports = routes;
