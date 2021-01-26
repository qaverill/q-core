const { apiGet } = require('@q/test-helpers');
// ----------------------------------
// HELPERS
// ----------------------------------
const PATH = '/analyze/music';
// ----------------------------------
// EXPECTED RESULTS
// ----------------------------------
// ----------------------------------
// TESTS
// ----------------------------------
describe(`GET ${PATH}`, () => {
  test('end but no start results in error message', async () => {
    const results = await apiGet(`${PATH}?end=end`);
    expect(results).toEqual('Cannot provide end but no start!');
  });
  test('start but no end results in temporal analysis leading up to today', async () => {
    const results = await apiGet(`${PATH}?start=start`);
    expect(results).toEqual('temporal analysis...');
  });
  test('start and end results in temporal analysis with correct timeframe', async () => {
    const results = await apiGet(`${PATH}?start=start&end=end`);
    expect(results).toEqual('temporal analysis...');
  });
  test('no start or end results in current analysis (of past 3 days)', async () => {
    const results = await apiGet(PATH);
    expect(results).toEqual('current analysis...');
  });
});