const { compileTransactions } = require('../resources/money');
const { transactions, paybacks, mockTransaction } = require('./mocks');
// ----------------------------------
// TESTS
// ----------------------------------
const expected = [
  mockTransaction(2, -10, 2, ['c']),
  transactions[2],
  transactions[4],
  transactions[5],
  transactions[6],
  mockTransaction(8, -200, 8, ['a']),
  transactions[8],
  transactions[10],
  transactions[11],
];
const tests = [
  { transactions, paybacks, expected },
];
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  path: '/resources/money::compileTransactions',
  algorithm: () => compileTransactions(transactions, paybacks),
  tests,
};
