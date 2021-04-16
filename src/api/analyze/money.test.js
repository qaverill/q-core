const R = require('ramda');
const { apiGet } = require('@q/test-helpers');
const { round2Decimals } = require('@q/utils');
// ----------------------------------
// HELPERS
// ----------------------------------
const PATH = '/analyze/money';
// ----------------------------------
// TESTS
// ----------------------------------
describe(`GET ${PATH}`, () => {
  test('money analysis is correct with first year of data', async () => {
    const testStart = 1572566400;
    const testEnd = 1601510400;
    const analysis = await apiGet(`${PATH}?start=${testStart}&end=${testEnd}`);
    console.log(R.keys(analysis));
    expect(R.keys(analysis).length).toEqual(12);
    const yearDelta = round2Decimals(R.compose(
      R.reduce((acc, val) => acc + analysis[val].delta, 0),
      R.keys,
    )(analysis));
    expect(yearDelta).toEqual(20092.19);
  });
});
