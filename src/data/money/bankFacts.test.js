/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
const R = require('ramda');
const { mockBankFacts } = require('@q/test-helpers');
const { mockImportBankFacts, mockExportBankFacts, mockImportExistingBankFacts } = require('./bankFacts');
// ----------------------------------
// HELPERS
// ----------------------------------
const expectedCombinedPaybacks = [
  { id: '1', timestamp: 1, amount: 1, description: '1', account: 'a' },
  { id: '2', timestamp: 2, amount: 2, description: '2', account: 'b' },
  { id: '3', timestamp: 3, amount: 3, description: '3', account: 'c' },
  { id: '4', timestamp: 4, amount: 4, description: '4', account: 'd' },
];
// ----------------------------------
// TESTS
// ----------------------------------
describe('helpers', () => {
  describe('importExistingBankFacts()', () => {
    it('existing bank fact without id is given one', async () => {

    });
    it('existing bank fact with a duplicated id is not returned', async () => {

    });
    it('returns expected data', async () => {

    });
  });
  describe('importNewBankFacts()', () => {
    it('does not contain facts that are not needed', async () => {

    });
    it('gives all new transactions an id', async () => {

    });
    it('has no facts with duplicate ids', async () => {

    });
    it('returns expected data', async () => {

    });
  });
  test('exportBankFacts()', async () => {
    const bankFacts = [expectedCombinedPaybacks[3], ...mockBankFacts];
    await mockExportBankFacts(bankFacts);
    const newBankFacts = await mockImportBankFacts();
    expect(newBankFacts).toEqual(expectedCombinedPaybacks);
  });
});
describe('importBankFacts()', () => {
  beforeEach(async () => {
    await mockExportBankFacts(mockBankFacts);
  });
  it('returns the correct information', async () => {
    const bankFacts = await mockImportBankFacts();
    expect(bankFacts.length).toEqual(4);
    expect(bankFacts.every(({
      id,
      timestamp,
      amount,
      description,
      account,
    }) => (
      !R.isNil(id) && !R.isNil(timestamp) && !R.isNil(amount) && !R.isNil(description) && !R.isNil(account)
      && typeof id === 'string' && typeof timestamp === 'number' && typeof amount === 'number' && typeof description === 'string' && typeof account === 'string'
    ))).toEqual(true);
    expect(bankFacts.every((payback) => R.keys(payback).length === 5)).toEqual(true);
  });
  it('is sorted newest -> oldest', async () => {
    const bankFacts = await mockImportBankFacts();
    let lastTimestamp = 0;
    bankFacts.forEach(({ timestamp }) => {
      expect(timestamp).toBeGreaterThan(lastTimestamp);
      lastTimestamp = timestamp;
    });
  });
  it('does not include new transactions that existed already', async () => {
    const bankFacts = await mockImportBankFacts();
    expect(bankFacts).toEqual(expectedCombinedPaybacks);
  });
  it('exports the newly combined transactions', async () => {
    await mockImportBankFacts();
    const afterImport = await mockImportExistingBankFacts();
    expect(expectedCombinedPaybacks).toEqual(afterImport);
  });
});
