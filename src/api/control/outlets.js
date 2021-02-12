const { Client } = require('tplink-smarthome-api');
const R = require('ramda');
const { makeGetEndpointAsync, makePutEndpointAsync } = require('../gates');
const { readOutlets, updateOutlets } = require('../../crud/control/outlets');
const { setOutletHost } = require('../../redis/kasa');
// ----------------------------------
// HELPERS
// ----------------------------------
const path = '/control/outlets';
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
  createEndpoints: (socket, routes) => {
    // GET /control/outlets?outlet={lavalamp, desk}
    makeGetEndpointAsync({ routes, path }, ({ request, respond }) => {
      const { outlet } = request.query;
      readOutlets(outlet).then(respond);
    });
    // PUT /control/outlets
    makePutEndpointAsync(({ routes, path }), ({ request, respond }) => {
      const { outlet } = request.query;
      const { state } = request.body;
      updateOutlets(outlet, state).then(async (result) => {
        respond(result);
        await new Promise((r) => setTimeout(r, 1000)); // TODO: remove this
        readOutlets().then((outlets) => socket.emit('/outlets', outlets));
      });
    });
  },
};
