const { transactions, mockPaybacks } = require('@q/test-helpers');
const { processPaybacks } = require('./processPaybacks');
const {
  createTransactions,
  deleteTransactions,
  readTransactions,
  readTransaction,
} = require('../crud/money/transactions');
// ----------------------------------
// TESTS
// ----------------------------------
describe('Money algorithms', () => {
  describe('processPaybacks', () => {
    beforeEach(async () => {
      await createTransactions(transactions);
    });
    afterEach(async () => {
      await deleteTransactions();
    });
    describe('invalid input', () => {
      it('throws error when paybacks have a duplicated from', async () => {
        await expect(processPaybacks([
          { from: '2', to: '3' },
          { from: '2', to: '7' },
        ]))
          .rejects
          .toThrow(new Error('From 2 already exists, they cannot be used twice!'));
        expect(await readTransactions()).toEqual(transactions);
      });
      describe('null inputs', () => {
        it('throws error when from or to is null', async () => {
          await expect(processPaybacks({ from: null, to: '3' }))
            .rejects
            .toThrow(new Error('Must provide a from field!'));
          expect(await readTransactions()).toEqual(transactions);
          await expect(processPaybacks({ from: '69', to: null }))
            .rejects
            .toThrow(new Error('Must provide a to field!'));
          expect(await readTransactions()).toEqual(transactions);
        });
        it('throws error when from does not exist', async () => {
          await expect(processPaybacks({ from: '69', to: '3' }))
            .rejects
            .toThrow(new Error('From transaction 69 does not exist!'));
          expect(await readTransactions()).toEqual(transactions);
        });
      });
      describe('using incompatible transactions', () => {
        it('throws error when fromTransaction amount is negative', async () => {
          await expect(processPaybacks({ from: '1', to: '3' }))
            .rejects
            .toThrow(new Error('From transaction 1 must have a positive amount'));
          expect(await readTransactions()).toEqual(transactions);
        });
        it('throws error when toTransaction does not exist', async () => {
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
        it('throws error when newAmount is 0', async () => {
          await expect(processPaybacks({ from: '+1', to: '1' }))
            .rejects
            .toThrow(new Error('newAmount must be less than 0 ---- newAmount: 0'));
          expect(await readTransactions()).toEqual(transactions);
        });
      });
      describe('multiple inputs to create invalid situations', () => {
        it('multiple paybacks with one bad one throws error correctly', async () => {
          await expect(processPaybacks([
            { from: '4', to: '7' },
            { from: '6', to: '3' },
          ]))
            .rejects
            .toThrow(new Error('newAmount must be less than 0 ---- newAmount: 3'));
          expect(await readTransactions()).toEqual(transactions);
        });
        it('multiple paybacks with same to transaction leading to positive value throws error', async () => {
          await expect(processPaybacks([
            { from: '2', to: '7' },
            { from: '6', to: '7' },
          ]))
            .rejects
            .toThrow(new Error('newAmount must be less than 0 ---- newAmount: 1'));
          expect(await readTransactions()).toEqual(transactions);
        });
      });
    });
    it('single payback deletes `from` and updates `to` accordingly', async () => {
      await processPaybacks({ from: '4', to: '7' });
      expect(await readTransaction('4')).toEqual(undefined);
      expect((await readTransaction('7')).amount).toEqual(-3);
    });
    it('multiple paybacks deletes all `from`s and updates all `to`s accordingly', async () => {
      await processPaybacks(mockPaybacks);
      expect(await readTransaction('2')).toEqual(undefined);
      expect(await readTransaction('4')).toEqual(undefined);
      expect(await readTransaction('6')).toEqual(undefined);
      expect((await readTransaction('3')).amount).toEqual(-1);
      expect((await readTransaction('5')).amount).toEqual(-1);
      expect((await readTransaction('7')).amount).toEqual(-1);
    });
    it('multiple paybacks with same to transaction processes correctly', async () => {
      await processPaybacks([
        { from: '2', to: '7' },
        { from: '4', to: '7' },
      ]);
      expect(await readTransaction('2')).toEqual(undefined);
      expect(await readTransaction('4')).toEqual(undefined);
      expect((await readTransaction('7')).amount).toEqual(-1);
    });
  });
});
