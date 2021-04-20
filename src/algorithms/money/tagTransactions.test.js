const { tagTransactions } = require('./tagTransactions');
// ----------------------------------
// TESTS
// ----------------------------------
describe('tagTransactions', () => {
  describe('special cases', () => {
    it('tags a butnam rent check correctly', () => {
      const description = 'Check withdraWal';
      const amount = -1150;
      expect(tagTransactions([{ description, amount }])).toEqual([{ description, amount, tags: ['living', 'rent', 'butnam'] }]);
    });
    it('tags venmo froms as payBack', () => {
      const description = 'veNmo fRom venmo';
      const amount = 69;
      expect(tagTransactions([{ description, amount }])).toEqual([{ description, amount, tags: ['payBack'] }]);
    });
    it('tags a venmo from on ignore list correctly', () => {
      const description = 'xxxxvenmo from Customer Data Security Breachblaah';
      expect(tagTransactions([{ description }])).toEqual([{ description, tags: ['income', 'random'] }]);
    });
  });
  it('correctly tags multiple transactions at once', () => {
    const transaction1 = { description: 'xxtesT1' };
    const transaction2 = { description: 'tEst2 xxx' };
    const expectedResults = [{ ...transaction1, tags: ['fun', 'hobbies', 'computerParts'] }, { ...transaction2, tags: ['food', 'snacks', 'drinks', 'alcohol', 'unknownConvenienceStore'] }];
    expect(tagTransactions([transaction1, transaction2])).toEqual(expectedResults);
  });
  it('gives empty tags when no matches', () => {
    const description = '????';
    expect(tagTransactions([{ description }])).toEqual([{ description, tags: [] }]);
  });
});
