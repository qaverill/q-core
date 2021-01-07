const R = require('ramda');
const { Client } = require('tplink-smarthome-api');
const { getOutletHost } = require('./redis');
// ----------------------------------
// HELPERS
// ----------------------------------
const myOutlets = ['lavalamp', 'desk'];
// ----------------------------------
// KASA
// ----------------------------------
const kasaClient = new Client();
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  readOutlets: async (outlet) => {
    const outlets = outlet ? [outlet] : myOutlets;
    return Promise.all(R.map(async (o) => {
      const host = await getOutletHost(o);
      return R.prop('_sysInfo', await kasaClient.getDevice({ host }));
    }, outlets));
  },
  updateOutlets: async (outlet, powerState) => {
    const outlets = outlet ? [outlet] : myOutlets;
    return Promise.all(R.map(async (o) => {
      const host = await getOutletHost(o);
      const device = await kasaClient.getDevice({ host });
      return device.setPowerState(powerState === 'on');
    }, outlets));
  },
};