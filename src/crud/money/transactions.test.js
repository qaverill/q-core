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
  { _id: '1', account: 'a', timestamp: 1, amount: 1, description: '1', tags: ['1', '2', '3'] },
  { _id: '2', account: 'b', timestamp: 2, amount: 2, description: '2', tags: ['1', '2', '3'] },
  { _id: '3', account: 'c', timestamp: 3, amount: 3, description: '3', tags: ['1', '2', '3'] },
  { _id: '4', account: 'd', timestamp: 4, amount: 4, description: '4', tags: ['1', '2', '3'] },
  { _id: '5', account: 'e', timestamp: 5, amount: 5, description: '5', tags: ['1', '2', '3'] },
  { _id: '6', account: 'f', timestamp: 6, amount: 6, description: '6', tags: ['1', '2', '3'] },
  { _id: '7', account: 'g', timestamp: 7, amount: 7, description: '7', tags: ['1', '2', '3'] },
];
// ----------------------------------
// TESTS
// ----------------------------------
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
    await deleteTransactions();
    await createTransactions(data);
    const results = await readTransactions();
    expect(results).toEqual(data);
  });
  test('start and end return correct transactions', async () => {
    await deleteTransactions();
    await createTransactions(data);
    const results = await readTransactions({ start: 3, end: 4 });
    expect(results).toEqual([data[2], data[3]]);
  });
  test('start but no end return correct transactions', async () => {
    await deleteTransactions();
    await createTransactions(data);
    const results = await readTransactions({ start: 5 });
    expect(results).toEqual([data[4], data[5], data[6]]);
  });
  test('no start but end return all transactions', async () => {
    await deleteTransactions();
    await createTransactions(data);
    const results = await readTransactions({ end: 5 });
    expect(results).toEqual(data);
  });
});
describe('UPDATE', () => {
  test('you can not update transactions, only add payback or edit files', () => {
    const result = updateTransactions();
    expect(result).toEqual('YOU CANNOT UPDATE TRANSACTIONS, ONLY ADD PAYBACK OR EDIT FILES');
  });
});
describe('DELETE', () => {
  test('is callable', async () => {
    await deleteTransactions();
    await createTransactions(data);
    const afterCreate = await readTransactions();
    expect(afterCreate).toEqual(data);
    const results = await deleteTransactions();
    expect(results).toEqual([data.length]);
    const afterDelete = await readTransactions();
    expect(afterDelete).toEqual([]);
  });
});
