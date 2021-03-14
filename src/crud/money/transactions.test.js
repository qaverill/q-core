/* eslint-disable no-plusplus */
/* eslint-disable object-curly-newline */
const { transactions } = require('@q/test-helpers');
const R = require('ramda');
const {
  createTransactions,
  readTransaction,
  readTransactions,
  updateTransaction,
  deleteTransaction,
  deleteTransactions,
} = require('./transactions');
// ----------------------------------
// DATA
// ----------------------------------
const sortedTransactions = R.sortBy(R.prop('timestamp'), transactions);
// ----------------------------------
// TESTS
// ----------------------------------
describe('Transactions CRUD', () => {
  beforeEach(async () => {
    await createTransactions(transactions);
  });
  afterEach(async () => {
    await deleteTransactions();
  });
  describe('CREATE', () => {
    test('successfully creates all transactions', async () => {
      await deleteTransactions();
      const results = await createTransactions(transactions);
      expect(results).toEqual(transactions.length);
      const afterRead = await readTransactions();
      expect(afterRead).toEqual(sortedTransactions);
    });
    it('excapes single quotes correclty', async () => {
      await deleteTransactions();
      await createTransactions(transactions);
      const results = await readTransactions();
      expect(results.find(({ id }) => id === '0').description).toEqual("0's");
    });
    it('chunks when > 1000 transactions', async () => {
      await deleteTransactions();
      const numTransactions = 1420;
      const manyTransactions = [];
      for (let i = 0; i < numTransactions; i++) {
        manyTransactions.push({ id: `${i}`, account: '0', timestamp: 0 + i, amount: 0 + i, description: `${i}`, tags: ['0', `${i}`] });
      }
      const createResults = await createTransactions(manyTransactions);
      expect(createResults).toEqual(numTransactions);
      const results = await readTransactions();
      expect(results).toEqual(manyTransactions);
    });
  });
  describe('READ', () => {
    describe('readTransaction', () => {
      test('invalid id returns null', async () => {
        const result = await readTransaction('invalid');
        expect(result).toEqual(undefined);
      });
      test('valid id returns correct transaction', async () => {
        const result = await readTransaction('3');
        expect(result).toEqual({ id: '3', account: 'c', timestamp: 3, amount: -3, description: '3', tags: ['1', '2', '3'] });
      });
    });
    describe('readTransactions', () => {
      test('no timeframe returns all transactions', async () => {
        const results = await readTransactions();
        expect(results).toEqual(sortedTransactions);
      });
      test('start and end return correct transactions', async () => {
        const results = await readTransactions({ start: 3, end: 4 });
        expect(results).toEqual([transactions[4], transactions[5]]);
      });
      test('start but no end return correct transactions', async () => {
        const results = await readTransactions({ start: 5 });
        expect(results).toEqual([transactions[6], transactions[7], transactions[8]]);
      });
      test('no start but end return all transactions', async () => {
        const results = await readTransactions({ end: 5 });
        expect(results).toEqual(R.sortBy(R.prop('timestamp'), transactions));
      });
    });
  });
  describe('UPDATE', () => {
    test('updateTransaction updates the amount of transaction specified by id', async () => {
      const AMOUNT = -420.69;
      const result = await updateTransaction({ id: '4', amount: AMOUNT });
      expect(result).toEqual([1]);
      const afterUpdate = await readTransactions();
      expect(afterUpdate.find(({ id }) => (id === '4')).amount).toEqual(AMOUNT);
    });
  });
  describe('DELETE', () => {
    test('deleteTransactions deletes all transactions', async () => {
      const results = await deleteTransactions();
      expect(results).toEqual([transactions.length]);
      const afterDelete = await readTransactions();
      expect(afterDelete).toEqual([]);
    });
    test('deleteTransaction only deletes the transaction specified by id', async () => {
      const results = await deleteTransaction('4');
      expect(results).toEqual([1]);
      const afterDelete = await readTransactions();
      expect(afterDelete.length).toEqual(transactions.length - 1);
      expect(afterDelete.filter(({ id }) => (id === '4')).length).toEqual(0);
    });
  });
});
