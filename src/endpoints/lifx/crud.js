const axios = require('axios');
const R = require('ramda');
const config = require('../../config');
const { determinePreset } = require('./lightStates');
// ----------------------------------
// HELPERS
// ----------------------------------
const headers = {
  Authorization: `Bearer ${config.lifx.access_token}`,
};
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  readLights: async () => {
    const url = 'https://api.lifx.com/v1/lights/group:Q';
    return R.map(
      light => R.assoc('preset', determinePreset(light), light),
      R.prop('data', await axios.get(url, { headers }))
    );
  },
  updateLights: async (states) => {
    const url = 'https://api.lifx.com/v1/lights/states';
    return R.prop('data', await axios.put(url, { states }, { headers }));
  },
};
