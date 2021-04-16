const { apiGet } = require('@q/test-helpers');
const { getNDaysAgoTimestamp } = require('@q/time');
// ----------------------------------
// HELPERS
// ----------------------------------
const PATH = '/analyze/music';
// ----------------------------------
// TESTS
// ----------------------------------
describe(`GET ${PATH}`, () => {
  test('music analysis is correct', async () => {
    const testStart = 1611548291;
    const testEnd = 1611686919;
    const listens = await apiGet(`${PATH}?start=${testStart}&end=${testEnd}`);
    listens.forEach(({ timestamp }) => {
      expect(timestamp).toBeGreaterThanOrEqual(testStart);
      expect(timestamp).toBeLessThanOrEqual(testEnd);
    });
    expect(listens.length).toEqual(102);
  });
  test('no start or end results in current analysis (of past 3 days)', async () => {
    const threeDaysAgo = getNDaysAgoTimestamp(3); // 5 for buffer
    const listens = await apiGet(PATH);
    listens.forEach(({ timestamp }) => expect(timestamp).toBeGreaterThanOrEqual(threeDaysAgo))
  });
});
