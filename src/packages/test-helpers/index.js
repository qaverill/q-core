const axios = require('axios');
const R = require('ramda');
const mocks = require('./mock-data');
// ----------------------------------
// HELPERS
// ----------------------------------
const makeFullPath = (path) => `http://localhost:4040/api${path}`;
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  ...mocks,
  apiGet: async (path, body) => R.prop('data', await axios.get(makeFullPath(path), { params: { ...body } })),
  apiPut: async (path, body) => R.prop('data', await axios.put(makeFullPath(path), body)),
};
