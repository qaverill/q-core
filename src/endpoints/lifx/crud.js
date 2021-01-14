const axios = require('axios');
const R = require('ramda');
const config = require('../../config');
const { determinePreset } = require('./lightStates');
// ----------------------------------
// HELPERS
// ----------------------------------
const group = 'Q';
const headers = {
  Authorization: `Bearer ${config.lifx.access_token}`,
};
const attachMetadata = R.map((light) => R.assoc('preset', determinePreset(light), light));
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  readLights: async () => {
    const url = `https://api.lifx.com/v1/lights/group:${group}`;
    const { data } = await axios.get(url, { headers });
    return attachMetadata(data);
  },
  updateLights: async (states) => {
    const url = 'https://api.lifx.com/v1/lights/states';
    const { data } = await axios.put(url, { states }, { headers });
    return data;
  },
};
