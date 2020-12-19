const { apiGet, apiPut } = require('@q/test-helpers');
// ----------------------------------
// HELPERS
// ----------------------------------
const PATH = '/kasa';
// ----------------------------------
// TESTS
// ----------------------------------
test(`GET ${PATH}`, async () => {
  const results = await apiGet(PATH);
  const { alias, mac } = results;
  expect(alias).toEqual('Desk');
  expect(mac).toEqual('B0:95:75:44:A5:D5');
  expect(results).toHaveProperty('on_time');
});

test(`PUT ${PATH}`, async () => {
   const results = await apiPut(PATH, { state: 'on' });
   expect(results).toEqual(true);
});