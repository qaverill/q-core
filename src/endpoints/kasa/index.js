const { Client } = require('tplink-smarthome-api');
const { makeGetEndpoint, makePutEndpoint } = require('../gates');
const { readOutlet, updateOutlet } = require('./crud');
const R = require('ramda');

// ----------------------------------
// HELPERS
// ----------------------------------
const path = '/kasa';
const myMacAddresses = {
  'B0:95:75:44:94:A8': 'lavaLamp',
  'B0:95:75:44:A5:D5': 'desk',
};
const kasaClient = new Client();
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  createEndpoints: (routes) => {
    const hosts = {};
    kasaClient.startDiscovery().on('plug-new', (plug) => {
      const { _sysInfo, host } = plug;
      if (myMacAddresses[_sysInfo.mac]) {
        hosts[myMacAddresses[_sysInfo.mac]] = host;
      }
      if (R.keys(hosts).length === R.keys(myMacAddresses).length) {
        // GET /kasa
        makeGetEndpoint({ routes, path }, async ({ response }) => {
          response.send(await readOutlet(kasaClient, hosts));
        });
        // PUT /kasa
        makePutEndpoint(({ routes, path }), async ({ request, response }) => {
          response.send(await updateOutlet(kasaClient, hosts, request.body.state));
        });
      }
    });
  },
};
