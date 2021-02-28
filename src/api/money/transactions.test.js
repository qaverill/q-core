const { transactions } = require('@q/test-helpers');
const { apiGet } = require('@q/test-helpers');
const { createTransactions, readTransaction, readTransactions, deleteTransactions } = require('../../crud/money/transactions');
// ----------------------------------
// HELPERS
// ----------------------------------
const PATH = '/money/transactions';
// ----------------------------------
// TESTS
// ----------------------------------
describe('GET transactions', () => {
  beforeEach(async () => {
    await createTransactions(transactions);
  });
  afterEach(async () => {
    await deleteTransactions();
  });
  it('returns all transactions when no start or end', async () => {
    expect(await apiGet(PATH)).toEqual(transactions);
  });
});
