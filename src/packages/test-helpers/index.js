const axios = require('axios');
const R = require('ramda');
// ----------------------------------
// HELPERS
// ----------------------------------
const makeFullPath = (path) => `http://localhost:4040/api${path}`;
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  apiGet: async (path, body) => R.prop('data', await axios.get(makeFullPath(path), { params: { ...body } })),
  apiPut: async (path, body) => R.prop('data', await axios.put(makeFullPath(path), body)),
};
