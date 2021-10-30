const { getBiMonthlyAnalysis } = require('../resources/money/analyzingTransactions');
const { transactions, mockBiMonthlyAnalysis } = require('./mocks');
// ----------------------------------
// TESTS
// ----------------------------------
const expected = [
  mockBiMonthlyAnalysis(250, 1, { paycheck: 100, booya: 200}, { c: -30, a: -20 }),
  mockBiMonthlyAnalysis(-757, 5, { paycheck: 50 }, { c: -7, a: -500, b: -300 }),
  mockBiMonthlyAnalysis(-40.50, 10, { paycheck: 20 }, { b: -20, a: -40.5 }),
];
const tests = [
  { transactions, expected },
];
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  path: '/resources/money::getBiMonthlyAnalysis',
  algorithm: () => getBiMonthlyAnalysis(transactions),
  tests,
};
