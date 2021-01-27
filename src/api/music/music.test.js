const { apiGet } = require('@q/test-helpers');
const { getNDaysAgoTimestamp } = require('@q/time');
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
    const { start, end } = await apiGet(`${PATH}?start=start`);
    expect(start).toEqual('start');
    expect(end).toBeUndefined();
  });
  test('start and end results in temporal analysis with correct timeframe', async () => {
    const { start, end } = await apiGet(`${PATH}?start=start&end=end`);
    expect(start).toEqual('start');
    expect(end).toEqual('end');
  });
  test('no start or end results in current analysis (of past 3 days)', async () => {
    const threeDaysAgo = getNDaysAgoTimestamp(3); // 5 for buffer
    const { start, end } = await apiGet(PATH);
    expect(start).toBeGreaterThanOrEqual(threeDaysAgo);
    expect(end).toBeNull();
  });
});