const { Client } = require('tplink-smarthome-api');
const R = require('ramda');
const { makeGetEndpoint, makePutEndpoint } = require('../gates');
const { readOutlets, updateOutlets } = require('./crud');
const { setOutletHost } = require('./redis');
// ----------------------------------
// HELPERS
// ----------------------------------
const path = '/kasa';
const myMacAddresses = {
  'B0:95:75:44:94:A8': 'lavalamp',
  'B0:95:75:44:A5:D5': 'desk',
};
// ----------------------------------
// KASA
// ----------------------------------
const kasaClient = new Client();
kasaClient.startDiscovery().on('plug-new', ({ _sysInfo, host }) => {
  const outlet = R.prop(_sysInfo.mac, myMacAddresses);
  if (outlet) setOutletHost(outlet, host);
});
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  createEndpoints: (routes) => {
    // GET /kasa?outlet={lavalamp, desk}
    makeGetEndpoint({ routes, path }, async ({ request, response }) => {
      const { outlet } = request.query;
      response.send(await readOutlets(outlet));
    });
    // PUT /kasa
    makePutEndpoint(({ routes, path }), async ({ request, response }) => {
      const { outlet } = request.query;
      const { state } = request.body;
      response.send(await updateOutlets(outlet, state));
    });
  },
};
