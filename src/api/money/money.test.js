const { readTransactions } = require('./crud');
// ----------------------------------
// HELPERS
// ----------------------------------
const PATH = '/analyze/music';
// ----------------------------------
// EXPECTED RESULTS
// ----------------------------------
// ----------------------------------
// TESTS
// ----------------------------------
describe('CRUD tests', () => {
  describe('read transactions', () => {
    test('works', async () => {
      const results = await readTransactions();
      expect(results).toEqual([
        {
            "_id": "123",
            "account": "account",
            "timestamp": 1,
            "amount": -2.2,
            "description": "3333",
            "tags": "[1, 2, 3]"
        }
      ]);
    })
  });
})