const { ingestTransactions } = require('../resources/money/ingestingTransactions');
// ----------------------------------
// MOCKERS
// ----------------------------------
function mockTransaction(_id, amount) {
  return ({ _id, amount, timestamp: parseInt(new Date().getTime() / 1000, 10) });
}
function mockPayback(from, to, amount) {
  return ({ from, to, amount });
}
// ----------------------------------
// DATA
// ----------------------------------
const transactions = [
  mockTransaction(1, 100),
  mockTransaction(2, -30),
  mockTransaction(3, -20),
  mockTransaction(4, 200),
  mockTransaction(5, 50),
  mockTransaction(6, -5),
  mockTransaction(7, -2),
  mockTransaction(8, -500),
  mockTransaction(9, -300),
  mockTransaction(10, 20),
  mockTransaction(11, -20),
  mockTransaction(12, -40),
];
const paybacks = [
  mockPayback(1, 8, 100),
  mockPayback(4, 8, 200),
  mockPayback(10, 2, 20),
];
// ----------------------------------
// TESTS
// ----------------------------------
const expected = [
  mockTransaction(12, -40),
  mockTransaction(11, -20),
  mockTransaction(9, -300),
  mockTransaction(8, -200),
  mockTransaction(7, -2),
  mockTransaction(6, -5),
  mockTransaction(5, 50),
  mockTransaction(3, -20),
  mockTransaction(2, -10),
];
const tests = [
  { transactions, paybacks, expected },
];
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  path: './resources/banks/autoTagDoc',
  algorithm: () => ingestTransactions(transactions, paybacks),
  tests,
};
