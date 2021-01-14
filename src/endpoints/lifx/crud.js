const axios = require('axios');
const R = require('ramda');
const config = require('../../config');
const { determineColorString } = require('./lightStates');
const { getCurrentPreset, setCurrentPreset } = require('./redis');
// ----------------------------------
// HELPERS
// ----------------------------------
const group = 'Q';
const headers = {
  Authorization: `Bearer ${config.lifx.access_token}`,
};
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  readLights: async () => {
    const url = `https://api.lifx.com/v1/lights/group:${group}`;
    const { data } = await axios.get(url, { headers });
    const preset = await getCurrentPreset();
    const results = R.map((light) => ({
      ...light,
      preset,
      colorString: determineColorString(light),
    }), data);
    return results;
  },
  updateLights: async (states, preset) => {
    const url = 'https://api.lifx.com/v1/lights/states';
    const { data } = await axios.put(url, { states }, { headers });
    if (preset && preset !== 'on' && preset !== 'off') setCurrentPreset(preset);
    return data;
  },
};
