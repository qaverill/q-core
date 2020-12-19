const axios = require('axios');
const R = require('ramda');
// ----------------------------------
// HELPERS
// ----------------------------------
const makeFullPath = (path) => `http://localhost:4040${path}`;
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  apiGet: async (path) => R.prop('data', await axios.get(makeFullPath(path))),
  apiPut: async (path, body) => R.prop('data', await axios.put(makeFullPath(path), body)),
};
