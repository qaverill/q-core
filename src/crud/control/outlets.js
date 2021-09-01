const R = require('ramda');
const { Client } = require('tplink-smarthome-api');
const { getOutletHost } = require('../../redis/kasa');
// ----------------------------------
// HELPERS
// ----------------------------------
const myOutlets = ['Stereowall', 'Lavalamp'];
// ----------------------------------
// KASA
// ----------------------------------
const kasaClient = new Client();
// ----------------------------------
// CRUD external api
// ----------------------------------
module.exports = {
  readOutlets: (outlet) => new Promise((resolve) => {
    const outlets = outlet ? [outlet] : myOutlets;
    resolve(Promise.all(R.map(async (o) => {
      const host = await getOutletHost(o);
      return R.prop('_sysInfo', await kasaClient.getDevice({ host }));
    }, outlets)));
  }),
  updateOutlets: (outlet, powerState) => new Promise((resolve) => {
    const outlets = outlet ? [outlet] : myOutlets;
    resolve(Promise.all(R.map(async (o) => {
      const host = await getOutletHost(o);
      const device = await kasaClient.getDevice({ host });
      const newPowerState = powerState === 'on';
      device.setPowerState(newPowerState);
      return newPowerState;
    }, outlets)));
  }),
};
