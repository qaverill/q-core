/* eslint-disable object-curly-newline */
const {
  createTransactions,
  readTransactions,
  updateTransactions,
  deleteTransactions,
} = require('./transactions');
// ----------------------------------
// DATA
// ----------------------------------
const data = [
  { id: '1', account: 'a', timestamp: 1, amount: 1, description: '1', tags: ['1', '2', '3'] },
  { id: '2', account: 'b', timestamp: 2, amount: 2, description: '2', tags: ['1', '2', '3'] },
  { id: '3', account: 'c', timestamp: 3, amount: 3, description: '3', tags: ['1', '2', '3'] },
  { id: '4', account: 'd', timestamp: 4, amount: 4, description: '4', tags: ['1', '2', '3'] },
  { id: '5', account: 'e', timestamp: 5, amount: 5, description: '5', tags: ['1', '2', '3'] },
  { id: '6', account: 'f', timestamp: 6, amount: 6, description: '6', tags: ['1', '2', '3'] },
  { id: '7', account: 'g', timestamp: 7, amount: 7, description: '7', tags: ['1', '2', '3'] },
];
// ----------------------------------
// TESTS
// ----------------------------------
describe('Transactions CRUD', () => {
  beforeEach(async () => {
    await createTransactions(data);
  });
  afterEach(async () => {
    await deleteTransactions();
  });
  describe('CREATE', () => {
    test('successfully creates all transactions', async () => {
      await deleteTransactions();
      const results = await createTransactions(data);
      expect(results).toEqual([data.length]);
      const afterRead = await readTransactions();
      expect(afterRead).toEqual(data);
    });
  });
  describe('READ', () => {
    test('no timeframe returns all transactions', async () => {
      const results = await readTransactions();
      expect(results).toEqual(data);
    });
    test('start and end return correct transactions', async () => {
      const results = await readTransactions({ start: 3, end: 4 });
      expect(results).toEqual([data[2], data[3]]);
    });
    test('start but no end return correct transactions', async () => {
      const results = await readTransactions({ start: 5 });
      expect(results).toEqual([data[4], data[5], data[6]]);
    });
    test('no start but end return all transactions', async () => {
      const results = await readTransactions({ end: 5 });
      expect(results).toEqual(data);
    });
  });
  describe('UPDATE', () => {
    test('can update the amount of one transaction', async () => {
      const AMOUNT = -420.69;
      const result = await updateTransactions({ id: '4', amount: AMOUNT });
      expect(result).toEqual([1]);
      const afterUpdate = await readTransactions();
      expect(afterUpdate.find(({ id }) => (id === '4')).amount).toEqual(AMOUNT);
    });
  });
  describe('DELETE', () => {
    test('deletes all transactions in db when no id is provided', async () => {
      const results = await deleteTransactions();
      expect(results).toEqual([data.length]);
      const afterDelete = await readTransactions();
      expect(afterDelete).toEqual([]);
    });
    test('deletes just the transaction specified when given an id', async () => {
      const results = await deleteTransactions('4');
      expect(results).toEqual([1]);
      const afterDelete = await readTransactions();
      expect(afterDelete.length).toEqual(data.length - 1);
      expect(afterDelete.filter(({ id }) => (id === '4')).length).toEqual(0);
    });
  });
});
