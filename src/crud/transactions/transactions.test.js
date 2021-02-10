const {
  createTransactions,
  readTransactions,
  updateTransactions,
  deleteTransactions,
} = require('.');

describe('CREATE', () => {
  test('is callable', async () => {
    const result = await createTransactions();
    expect(result).toEqual(true);
  });
});
describe('READ', () => {
  test('returns data from mssql', async () => {
    const results = await readTransactions();
    expect(results[0].amount).toEqual(-2.2);
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
    const result = await deleteTransactions();
    expect(result).toEqual(true);
  });
});
