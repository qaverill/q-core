const { Client } = require('tplink-smarthome-api');
const logger = require('@q/logger');
const { makeGetEndpointAsync, makePutEndpointAsync } = require('../gates');
const { readOutlets, updateOutlets } = require('../../crud/control/outlets');
const { setOutletHost } = require('../../redis/kasa');
// ----------------------------------
// HELPERS
// ----------------------------------
const path = '/control/outlets';
// ----------------------------------
// KASA
// ----------------------------------
const kasaClient = new Client();
kasaClient.startDiscovery().on('plug-new', ({ _sysInfo, host }) => {
  const outlet = _sysInfo.alias;
  logger.info(`Found plug... ${outlet} on ${host}`);
  if (outlet) setOutletHost(outlet, host);
});
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  createEndpoints: (socket, routes) => {
    // GET /control/outlets?outlet={Stereowall, Lavalamp}
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
        await new Promise((r) => setTimeout(r, 200));
        readOutlets().then((outlets) => socket.emit('/outlets', outlets));
      });
    });
  },
};
