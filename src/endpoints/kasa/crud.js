const R = require('ramda');
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  readOutlet: async (kasaClient, hosts) => R.prop(
    '_sysInfo',
    await kasaClient.getDevice({ host }),
  ),
  updateOutlet: async (kasaClient, host, powerState) => {
    const outlet = await kasaClient.getDevice({ host });
    return outlet.setPowerState(powerState === 'on');
  },
};
