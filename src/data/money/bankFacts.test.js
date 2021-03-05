/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
const R = require('ramda');
const { mockBankFacts } = require('@q/test-helpers');
const { mockImportBankFacts, mockExportBankFacts } = require('./bankFacts');
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
describe('Mocked payback import/exports', () => {
  beforeEach(async () => {
    await mockExportBankFacts(mockBankFacts);
  });
  describe('importBankFacts (mocked)', () => {
    it('returns the correct information', async () => {
      const bankFacts = await mockImportBankFacts();
      expect(bankFacts.length).toEqual(4);
      expect(bankFacts.every(({
        id,
        timestamp,
        amount,
        description,
        account,
      }) => !R.isNil(id) && !R.isNil(timestamp) && !R.isNil(amount) && !R.isNil(description) && !R.isNil(account))).toEqual(true);
      expect(bankFacts.every((payback) => R.keys(payback).length === 5)).toEqual(true);
    });
    it('correctly combines existing and new raw bankFacts', async () => {
      const bankFacts = await mockImportBankFacts();
      expect(bankFacts).toEqual(expectedCombinedPaybacks);
    });
  });
  it('exportBankFacts (mocked)', async () => {
    const bankFacts = [expectedCombinedPaybacks[3], ...mockBankFacts];
    await mockExportBankFacts(bankFacts);
    const newBankFacts = await mockImportBankFacts();
    expect(newBankFacts).toEqual(expectedCombinedPaybacks);
  });
});
