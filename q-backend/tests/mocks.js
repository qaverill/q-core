// ----------------------------------
// MOCKERS
// ----------------------------------
function mockTransaction(_id, amount, timestamp, tags) {
  return ({ _id, amount, timestamp, tags });
}
function mockPayback(from, to, amount) {
  return ({ from, to, amount });
}
function mockBiMonthlyAnalysis(delta, timestamp, incomes, expenses) {
  return ({ timestamp, delta, incomes, expenses })
}
// ----------------------------------
// DATA
// ----------------------------------
const transaction1 = mockTransaction(1, 100, 1, ['income', 'paycheck']);
const transaction2 = mockTransaction(2, -30, 2, ['c']);
const transaction3 = mockTransaction(3, -20, 3, ['a']);
const transaction4 = mockTransaction(4, 200, 4, ['a', 'booya']);
const transaction5 = mockTransaction(5, 50, 5, ['income', 'paycheck']);
const transaction6 = mockTransaction(6, -5, 6, ['c']);
const transaction7 = mockTransaction(7, -2, 7, ['c']);
const transaction8 = mockTransaction(8, -500, 8, ['a']);
const transaction9 = mockTransaction(9, -300, 9, ['b']);
const transaction10 = mockTransaction(10, 20, 10, ['income', 'paycheck']);
const transaction11 = mockTransaction(11, -20, 11, ['b']);
const transaction12 = mockTransaction(12, -40.50, 12, ['a']);

const transactions = [
  transaction1,
  transaction2,
  transaction3,
  transaction4,
  transaction5,
  transaction6,
  transaction7,
  transaction8,
  transaction9,
  transaction10,
  transaction11,
  transaction12,
]

const paybacks = [
  mockPayback(1, 8, 100),
  mockPayback(4, 8, 200),
  mockPayback(10, 2, 20),
];
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  mockTransaction,
  mockPayback,
  mockBiMonthlyAnalysis,
  transactions,
  paybacks,
}