const { transactions } = require('@q/test-helpers');
const { createTransactions, deleteTransactions, readTransactions, readTransaction } = require('../crud/money/transactions');
const { processPaybacks, gatherTransactions } = require('./money');
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
  describe('processPaybacks', () => {
    describe('invalid input', () => {
      it('throws error when from does not exist', async () => {
        await expect(processPaybacks({ from: '69', to: '3' }))
          .rejects
          .toThrow(new Error('From transaction 69 does not exist!'));
        expect(await readTransactions()).toEqual(transactions);
      });
      it('throws error when from amount is negative', async () => {
        await expect(processPaybacks({ from: '1', to: '3' }))
          .rejects
          .toThrow(new Error('From transaction 1 must have a positive amount'));
        expect(await readTransactions()).toEqual(transactions);
      });
      it('throws error when to does not exist', async () => {
        await expect(processPaybacks({ from: '6', to: '69' }))
          .rejects
          .toThrow(new Error('To transaction 69 does not exist!'));
        expect(await readTransactions()).toEqual(transactions);
      });
      it('throws error when toAmount is positive', async () => {
        await expect(processPaybacks({ from: '6', to: '4' }))
          .rejects
          .toThrow(new Error('toAmount must be less than 0 ---- toAmount: 4'));
        expect(await readTransactions()).toEqual(transactions);
      });
      it('throws error when newAmount is positive', async () => {
        await expect(processPaybacks({ from: '6', to: '3' }))
          .rejects
          .toThrow(new Error('newAmount must be less than 0 ---- newAmount: 3'));
        expect(await readTransactions()).toEqual(transactions);
      });
      it('multiple paybacks with one bad one throws error correctly', async () => {
        await expect(processPaybacks([
          { from: '4', to: '7' },
          { from: '6', to: '3' },
        ]))
          .rejects
          .toThrow(new Error('newAmount must be less than 0 ---- newAmount: 3'));
        expect(await readTransactions()).toEqual(transactions);
      });
    });
    it('single payback deletes `from` and updates `to` accordingly', async () => {
      await processPaybacks({ from: '4', to: '7' });
      expect(await readTransaction('4')).toEqual(undefined);
      expect((await readTransaction('7')).amount).toEqual(-3);
    });
    it('multiple paybacks deletes all `from`s and updates all `to`s accordingly', async () => {
      await processPaybacks([
        { from: '2', to: '3' },
        { from: '4', to: '5' },
        { from: '6', to: '7' },
      ]);
      expect(await readTransaction('2')).toEqual(undefined);
      expect(await readTransaction('4')).toEqual(undefined);
      expect(await readTransaction('6')).toEqual(undefined);
      expect((await readTransaction('3')).amount).toEqual(-1);
      expect((await readTransaction('5')).amount).toEqual(-1);
      expect((await readTransaction('7')).amount).toEqual(-1);
    });
  });
});
