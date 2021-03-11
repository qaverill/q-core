/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
const R = require('ramda');
const { mockBankFacts } = require('@q/test-helpers');
const { mockImportBankFacts, mockExportBankFacts, mockImportExistingBankFacts, mockImportNewBankFacts } = require('./bankFacts');
// ----------------------------------
// HELPERS
// ----------------------------------
const START_OF_SEPTEMBER_19 = 1567310400;
const expectedNewBankFacts = [
  { account: 'mvcu', timestamp: 1614747600, amount: -1225.7, description: 'mvcu payment', id: '18d485ed12cae3ebccb09eca95097857' },
  { account: 'citi-credit', timestamp: 1614574800, amount: -25, description: 'mock citi payment', id: 'c8f5d25988fc56dbc54371c831b310b8' },
  { account: 'mvcu', timestamp: 1613019600, amount: 2225.54, description: 'mvcu income with long ass descriptionnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnalksdhfalksdfhalksdjfhalksdfasdh', id: '3dd0a8e52266162ec4bb81913e008c8b' },
  { account: 'venmo', timestamp: 1612920427, amount: 33, description: 'Venmo from Annie Averill: venmo income 2', id: '4400abb483c221ebf65901069277bbd6' },
  { account: 'venmo', timestamp: 1612920426, amount: -33, description: 'Venmo to Annie Averill: venmo payment 2', id: 'a675cb1abfc8715f02495e19f13bd3ca' },
  { account: 'venmo', timestamp: 1612398528, amount: 33, description: 'Venmo from David Averill: venmo income 1', id: 'd502b2089625c61f876265aaa32ab6a0' },
  { account: 'venmo', timestamp: 1612398527, amount: -33, description: 'Venmo to David Averill: venmo payment 1', id: '423a48a4e18557ba633913477bfe1eb8' },
  { account: 'citi-credit', timestamp: 1603080000, amount: 49.5, description: 'mock citi income', id: 'ff85427b0dbfd8e1aeb0f3fd905d4ee8' },
  { account: 'mvcu-savings', timestamp: 1599019200, amount: -115, description: 'mvcu_old payment', id: 'fffa684e67ded60e8f8e49a8c255673f' },
  { account: 'mvcu-savings', timestamp: 1598846400, amount: 1.77, description: 'mvcu_old income', id: '241c85ab49f466bea84226ef9059dbaa' },
];
// ----------------------------------
// TESTS
// ----------------------------------
describe('helpers', () => {
  describe('importExistingBankFacts()', () => {
    it('existing bank fact without id is given one', async () => {
      await mockExportBankFacts([...mockBankFacts, { timestamp: 99, amount: 99, description: 'missing id', account: 'a' }]);
      const results = await mockImportExistingBankFacts();
      expect(results.find(({ description }) => description === 'missing id').id).toEqual('a77832c93b41d31cb156997272688ccf');
    });
    it('existing bank fact with a duplicated id is not returned', async () => {
      await mockExportBankFacts([...mockBankFacts, { id: '3', timestamp: 3, amount: 3, description: '3', account: 'c' }]);
      const results = await mockImportExistingBankFacts();
      console.log("Don't worry, that error is good 👍");
      expect(results.filter(({ id }) => id === '3').length).toEqual(1);
    });
    it('returns expected data', async () => {
      await mockExportBankFacts(mockBankFacts);
      const results = await mockImportExistingBankFacts();
      expect(results).toEqual(mockBankFacts);
    });
    it('returns [] when there are no exisisting bank facts', async () => {
      await mockExportBankFacts([]);
      const results = await mockImportExistingBankFacts();
      expect(results).toEqual([]);
    });
  });
  describe('importNewBankFacts()', () => {
    it('contains no unneeded facts', async () => {
      const newBankFacts = await mockImportNewBankFacts();
      expect(newBankFacts.every(({ timestamp, amount }) => timestamp >= START_OF_SEPTEMBER_19 && amount !== 0)).toEqual(true);
    });
    it('gives all new transactions an id', async () => {
      const newBankFacts = await mockImportNewBankFacts();
      expect(newBankFacts.every(({ id }) => id != null)).toEqual(true);
    });
    it('has no facts with duplicate ids', async () => {
      const newBankFacts = await mockImportNewBankFacts();
      const existingIds = [];
      expect(newBankFacts.every(({ id }) => {
        const itExists = !existingIds.includes(id);
        existingIds.push(id);
        return itExists;
      })).toEqual(true);
    });
    it('returns expected data', async () => {
      const newBankFacts = await mockImportNewBankFacts();
      expect(newBankFacts).toEqual(expectedNewBankFacts);
    });
    it('truncates large descriptions AFTER assigning id', async () => {
      const newBankFacts = await mockImportNewBankFacts();
      expect(newBankFacts.find(({ id }) => id === '3dd0a8e52266162ec4bb81913e008c8b').description.length).toEqual(100);
    });
  });
  test('exportBankFacts()', async () => {
    await mockExportBankFacts(expectedNewBankFacts);
    const newBankFacts = await mockImportExistingBankFacts();
    expect(newBankFacts).toEqual(expectedNewBankFacts);
  });
});
describe('importBankFacts()', () => {
  beforeEach(async () => {
    await mockExportBankFacts(mockBankFacts);
  });
  afterEach(async () => {
    await mockExportBankFacts(mockBankFacts);
  });
  it('returns the correct information', async () => {
    const bankFacts = await mockImportBankFacts();
    expect(bankFacts.length).toEqual(13);
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
    let lastTimestamp = Infinity;
    bankFacts.forEach(({ timestamp }) => {
      expect(timestamp).toBeLessThanOrEqual(lastTimestamp);
      lastTimestamp = timestamp;
    });
  });
  it('does not include new transactions that existed already', async () => {
    const bankFacts = await mockImportBankFacts();
    expect(bankFacts.find(({ id }) => id === '241c85ab49f466bea84226ef9059dbaa').description).toEqual('this description should be it');
  });
  it('exports the newly combined transactions', async () => {
    await mockImportBankFacts();
    const afterImport = await mockImportExistingBankFacts();
    expect(afterImport).toEqual([...mockBankFacts.slice(0, mockBankFacts.length - 1), ...expectedNewBankFacts.slice(0, expectedNewBankFacts.length - 1), mockBankFacts[3]]);
  });
});
