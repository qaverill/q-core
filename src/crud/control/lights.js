const axios = require('axios');
const R = require('ramda');
const config = require('../../config');
const { determineColorString } = require('../../algorithms/lights');
const { getCurrentPreset, setCurrentPreset } = require('../../redis/lifx');
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
  readLights: () => new Promise((resolve) => {
    const url = `https://api.lifx.com/v1/lights/group:${group}`;
    axios.get(url, { headers }).then(({ data }) => {
      getCurrentPreset().then((preset) => {
        const results = R.map((light) => ({
          ...light,
          preset,
          colorString: determineColorString(light),
        }), data);
        resolve(results);
      });
    });
  }),
  updateLights: (states, preset) => new Promise((resolve) => {
    const url = 'https://api.lifx.com/v1/lights/states';
    axios.put(url, { states }, { headers }).then(({ data }) => {
      setCurrentPreset(preset);
      resolve(data);
    });
  }),
};
