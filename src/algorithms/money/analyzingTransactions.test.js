const { analyzeTransactions } = require('./analyzingTransactions');
// ----------------------------------
// HELPERS
// ----------------------------------
const FEBRUARY = 1612137600;
const MARCH = 1614556800;
const APRIL = 1617235200;
const transactions = [
  { timestamp: FEBRUARY, amount: 100, tags: ['income', 'paycheck'] },
  { timestamp: FEBRUARY, amount: 30.0, tags: ['income', 'refund'] },
  { timestamp: FEBRUARY + 1, amount: 10.0, tags: ['income', 'refund'] },
  { timestamp: FEBRUARY + 1, amount: -50.50, tags: ['living', 'rent'] },
  { timestamp: FEBRUARY + 2, amount: -10, tags: ['living', 'rent'] },
  { timestamp: MARCH, amount: -420, tags: ['fun', 'nice', 'random'] },
  { timestamp: APRIL, amount: -100.0, tags: ['living', 'rent'] },
  { timestamp: APRIL, amount: -50.0, tags: ['income', 'paycheck'] },
];
const tag = 'target';
const filteredTransactions = [
  { timestamp: FEBRUARY, amount: 100, tags: ['target'] },
  { timestamp: FEBRUARY + 1, amount: 10, tags: ['pre', 'target'] },
  { timestamp: MARCH, amount: 90, tags: ['target', 'second'] },
  { timestamp: MARCH + 1, amount: 80, tags: ['pre', 'target', 'next', 'third'] },
  { timestamp: MARCH + 2, amount: -40, tags: ['pre', 'target'] },
  { timestamp: APRIL, amount: 70, tags: ['target', 'post'] },
];
// ----------------------------------
// TESTS
// ----------------------------------
describe('analyzeTransactions()', () => {
  describe('monthlyTagSums', () => {
    it('calculates by first tag when not given filer', () => {
      const { monthlyTagSums } = analyzeTransactions(transactions);
      expect(monthlyTagSums).toEqual({
        1612137600: {
          income: 140.0,
          living: -60.50,
        },
        1614556800: {
          fun: -420.0,
        },
        1617235200: {
          living: -100.0,
          income: -50,
        },
      });
    });
    it('calculates by second tag when given filter', () => {
      const { monthlyTagSums } = analyzeTransactions(filteredTransactions, tag);
      expect(monthlyTagSums).toEqual({
        1612137600: {
          target: 110.0,
        },
        1614556800: {
          second: 90,
          next: 80,
          target: -40,
        },
        1617235200: {
          post: 70,
        },
      });
    });
  });
  it('monthlyDeltas are calculated correctly', () => {
    const { monthlyDeltas } = analyzeTransactions(transactions);
    expect(monthlyDeltas).toEqual({
      1612137600: 79.50,
      1614556800: -420.0,
      1617235200: -150.0,
    });
  });
});
