const { apiGet } = require('@q/test-helpers');
const { getNDaysAgoTimestamp } = require('@q/time');
const { readListens } = require('../../crud/music');
// ----------------------------------
// HELPERS
// ----------------------------------
const PATH = '/analyze/music';
// ----------------------------------
// TESTS
// ----------------------------------
describe('CRUD tests', () => {
  describe('FINAL read listens', () => {
    describe('Invalid cases', () => {
      test('end but no start results in error message', async () => {
        const end = 1611548291;
        const results = await readListens({ end });
        expect(results).toEqual('Cannot provide end but no start!');
      });
      test('start greater than end results in error message', async () => {
        const start = 1611686919;
        const end = 1611548291;
        const results = await readListens({ start, end });
        expect(results).toEqual('Start cannot be greater than end!');
      });
    });
    test('start but no end results in listens leading up to today', async () => {
      const start = 1611548291;
      const listens = await readListens({ start });
      listens.forEach(({ timestamp }) => expect(timestamp).toBeGreaterThanOrEqual(start));
    });
    test('start and end results in temporal analysis with correct timeframe', async () => {
      const start = 1611548291;
      const end = 1611686919;
      const listens = await readListens({ start, end });
      listens.forEach(({ timestamp }) => {
        expect(timestamp).toBeGreaterThanOrEqual(start);
        expect(timestamp).toBeLessThanOrEqual(end);
      });
      expect(listens.length).toEqual(102);
    });
  });
});
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
