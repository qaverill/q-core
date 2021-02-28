const { transactions } = require('@q/test-helpers');
const { apiPost } = require('@q/test-helpers');
const { createTransactions, readTransaction, readTransactions, deleteTransactions } = require('../../crud/money/transactions');
// ----------------------------------
// HELPERS
// ----------------------------------
const PATH = '/money/paybacks';
// ----------------------------------
// EXPECTED RESULTS
// ----------------------------------
// ----------------------------------
// TESTS
// ----------------------------------
describe('POST payback', () => {
  beforeEach(async () => {
    await createTransactions(transactions);
  });
  afterEach(async () => {
    await deleteTransactions();
  });
  it('internal errors are returned', async () => {
    const result = await apiPost(PATH, { from: null, to: '7' });
    expect(result).toEqual('Must provide a from field!');
    expect(await readTransactions()).toEqual(transactions);
    const result2 = await apiPost(PATH, { from: '6', to: '3' });
    expect(result2).toEqual('newAmount must be less than 0 ---- newAmount: 3');
    expect(await readTransactions()).toEqual(transactions);
  });
  it('correctly modifies associated transactions', async () => {
    const result = await apiPost(PATH, { from: '4', to: '7' });
    expect(result).toEqual([1]);
    expect(await readTransaction('4')).toEqual(undefined);
    expect((await readTransaction('7')).amount).toEqual(-3);
  });
  it('saves payback to data file', () => {

  });
});
