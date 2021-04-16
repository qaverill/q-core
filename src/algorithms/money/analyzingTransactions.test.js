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
const filteredTransactions = [
  { timestamp: FEBRUARY, amount: 100, tags: ['target'] },
  { timestamp: FEBRUARY + 1, amount: 10, tags: ['pre', 'target'] },
  { timestamp: MARCH, amount: 90, tags: ['target', 'second'] },
  { timestamp: MARCH + 1, amount: 80, tags: ['pre', 'target', 'next', 'third'] },
  { timestamp: MARCH + 2, amount: -40, tags: ['pre', 'target'] },
  { timestamp: APRIL, amount: 70, tags: ['target', 'post'] },
];
const singleTagFilteredTransactions = [
  { timestamp: FEBRUARY, amount: 100, tags: ['loans'] },
  { timestamp: FEBRUARY + 1, amount: 100, tags: ['loans'] },
  { timestamp: MARCH, amount: -100, tags: ['loans'] },
  { timestamp: MARCH + 1, amount: -200, tags: ['loans'] },
];
// ----------------------------------
// TESTS
// ----------------------------------
describe('analyzeTransactions()', () => {
  describe('monthlyTagSums', () => {
    it('calculates by first tag when not given filer', () => {
      const analysis = analyzeTransactions(transactions);
      expect(analysis).toEqual({
        1612137600: {
          byTag: {
            income: 140.0,
            living: -60.50,
          },
          delta: 79.50,
        },
        1614556800: {
          byTag: {
            fun: -420.0,
          },
          delta: -420.0,
        },
        1617235200: {
          byTag: {
            living: -100.0,
            income: -50,
          },
          delta: -150.0,
        },
      });
    });
    it('calculates by second tag when given filter', () => {
      const analysis = analyzeTransactions(filteredTransactions, 'target');
      expect(analysis).toEqual({
        1612137600: {
          byTag: {
            target: 110.0,
          },
          delta: 110.0,
        },
        1614556800: {
          byTag: {
            second: 90,
            next: 80,
            target: -40,
          },
          delta: 130.0,
        },
        1617235200: {
          byTag: {
            post: 70,
          },
          delta: 70,
        },
      });
    });
    it('when filter has no second tag, calculates by filter', () => {
      const analysis = analyzeTransactions(singleTagFilteredTransactions, 'loans');
      expect(analysis).toEqual({
        1612137600: {
          byTag: {
            loans: 200.0,
          },
          delta: 200.0,
        },
        1614556800: {
          byTag: {
            loans: -300.0,
          },
          delta: -300.0,
        },
      });
    });
  });
});
