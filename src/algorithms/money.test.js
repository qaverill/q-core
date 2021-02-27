const { transactions } = require('@q/test-helpers');
const { createTransactions, deleteTransactions, readTransactions, readTransaction } = require('../crud/money/transactions');
const { processPayback } = require('./money');
// ----------------------------------
// HELPERS
// ----------------------------------

// ----------------------------------
// TESTS
// ----------------------------------
describe('Money algorithms', () => {
  beforeEach(async () => {
    await createTransactions(transactions);
  });
  afterEach(async () => {
    await deleteTransactions();
  });
  describe('processPayback', () => {
    describe('invalid input', () => {
      it('throws error when from does not exist', async () => {
        await expect(processPayback({ from: '69', to: '3' }))
          .rejects
          .toThrow(new Error('From transaction 69 does not exist!'));
        expect(await readTransactions()).toEqual(transactions);
      });
      it('throws error when from amount is negative', async () => {
        await expect(processPayback({ from: '1', to: '3' }))
          .rejects
          .toThrow(new Error('From transaction 1 must have a positive amount'));
        expect(await readTransactions()).toEqual(transactions);
      });
      it('throws error when to does not exist', async () => {
        await expect(processPayback({ from: '6', to: '69' }))
          .rejects
          .toThrow(new Error('To transaction 69 does not exist!'));
        expect(await readTransactions()).toEqual(transactions);
      });
      it('throws error when toAmount is positive', async () => {
        await expect(processPayback({ from: '6', to: '4' }))
          .rejects
          .toThrow(new Error('toAmount must be less than 0 ---- toAmount: 4'));
        expect(await readTransactions()).toEqual(transactions);
      });
      it('throws error when newAmount is positive', async () => {
        await expect(processPayback({ from: '6', to: '3' }))
          .rejects
          .toThrow(new Error('newAmount must be less than 0 ---- newAmount: 3'));
        expect(await readTransactions()).toEqual(transactions);
      });
    });
    it('deletes `from` and updates `to` accordingly', async () => {
      await processPayback({ from: '4', to: '7' });
      expect(await readTransaction('4')).toEqual(undefined);
      const updatedTransaction = await readTransaction('7');
      expect(updatedTransaction.amount).toEqual(-3);
    });
  });
});
