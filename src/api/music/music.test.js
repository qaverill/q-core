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
describe('CRUD tests', () => {
  describe('read listens', () => {
    // TODO?
  });
})
describe(`GET ${PATH}`, () => {
  test('end but no start results in error message', async () => {
    const testEnd = 1611548291;
    const results = await apiGet(`${PATH}?end=${testEnd}`);
    expect(results).toEqual('Cannot provide end but no start!');
  });
  test('start greater than end results in error message', async () => {
    const testStart = 1611686919;
    const testEnd = 1611548291;
    const results = await apiGet(`${PATH}?start=${testStart}&end=${testEnd}`);
    expect(results).toEqual('Start cannot be greater than end!');
  });
  test('start but no end results in temporal analysis leading up to today', async () => {
    const testStart = 1611548291;
    const listens = await apiGet(`${PATH}?start=${testStart}`);
    listens.forEach(({ timestamp }) => expect(timestamp).toBeGreaterThanOrEqual(testStart))
  });
  test('start and end results in temporal analysis with correct timeframe', async () => {
    const testStart = 1611548291;
    const testEnd = 1611686919;
    const listens = await apiGet(`${PATH}?start=${testStart}&end=${testEnd}`);
    listens.forEach(({ timestamp }) => { 
      expect(timestamp).toBeGreaterThanOrEqual(testStart);
      expect(timestamp).toBeLessThanOrEqual(testEnd);
    });
    expect(listens.length).toEqual(102)
  });
  test('no start or end results in current analysis (of past 3 days)', async () => {
    const threeDaysAgo = getNDaysAgoTimestamp(3); // 5 for buffer
    const listens = await apiGet(PATH);
    listens.forEach(({ timestamp }) => expect(timestamp).toBeGreaterThanOrEqual(threeDaysAgo))
  });
});