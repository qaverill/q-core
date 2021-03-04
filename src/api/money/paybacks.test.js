const { transactions, mockPaybacks } = require('@q/test-helpers');
const { apiPost } = require('@q/test-helpers');
const {
  createTransactions,
  readTransaction,
  readTransactions,
  deleteTransactions,
} = require('../../crud/money/transactions');
const { mockImportPaybacks, mockExportPaybacks } = require('../../data/money/paybacks');
// ----------------------------------
// HELPERS
// ----------------------------------
const PATH = '/money/paybacks';
const mock = true;
// ----------------------------------
// EXPECTED RESULTS
// ----------------------------------
// ----------------------------------
// TESTS
// ----------------------------------
describe('POST payback', () => {
  beforeEach(async () => {
    await createTransactions(transactions);
    await mockExportPaybacks(mockPaybacks);
  });
  afterEach(async () => {
    await deleteTransactions();
  });
  it('internal errors are returned', async () => {
    const result = await apiPost(PATH, { from: null, to: '7', mock });
    expect(result).toEqual('Must provide a from field!');
    expect(await readTransactions()).toEqual(transactions);
  });
  it('payback is processed correctly', async () => {
    await apiPost(PATH, { from: '4', to: '7', mock });
    expect(await readTransaction('4')).toEqual(undefined);
    expect((await readTransaction('7')).amount).toEqual(-3);
  });
  it('payback is added to data file correctly, in correct order', async () => {
    await apiPost(PATH, { from: '+1', to: '3', mock });
    const data = await mockImportPaybacks();
    expect(data).toEqual([
      { from: '2', to: '3' },
      { from: '+1', to: '3' },
      { from: '4', to: '5' },
      { from: '6', to: '7' },
    ]);
  });
});
