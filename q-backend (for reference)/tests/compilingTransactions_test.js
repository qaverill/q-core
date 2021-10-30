const { compileTransactions } = require('../resources/money');
const { transactions, paybacks, mockTransaction } = require('./mocks');
// ----------------------------------
// TESTS
// ----------------------------------
const expected = [
  transactions[11],
  transactions[10],
  transactions[8],
  mockTransaction(8, -200, 8, ['a']),
  transactions[6],
  transactions[5],
  transactions[4],
  transactions[2],
  mockTransaction(2, -10, 2, ['c']),
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
