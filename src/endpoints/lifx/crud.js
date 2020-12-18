const axios = require('axios');
const R = require('ramda');
const config = require('../../config');

const headers = {
  Authorization: `Bearer ${config.lifx.access_token}`,
};

module.exports = {
  readLights: async () => {
    const url = 'https://api.lifx.com/v1/lights/group:Q';
    return R.prop('data', await axios.get(url, { headers }));
  },
  updateLights: async (states) => {
    const url = 'https://api.lifx.com/v1/lights/states';
    const body = { states, fast: true };
    return R.prop('data', await axios.put(url, body, { headers }));
  },
};
