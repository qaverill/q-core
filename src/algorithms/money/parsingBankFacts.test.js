const { computeFactId, factIsNeeded } = require('./parsingBankFacts');

describe('computeFactId()', () => {
  it('works properly on negative amount', () => {
    expect(computeFactId({
      account: 'citi-credit',
      timestamp: 1605070800,
      amount: -13.99,
      description: 'H MART - CAMBRIDGE CAMBRIDGE MA',
    })).toEqual('bad514b1de9f944dbd677451f33abfb6');
  });
  it('works properly on positive amount', () => {
    expect(computeFactId({
      account: 'mvcu-checkings',
      timestamp: 1586836800,
      amount: 1200,
      description: 'ACH Deposit IRS TREAS 310 stimulus',
    })).toEqual('afd6afd3d99e7bc7e7321366160dacbc');
  });
});
describe('factIsNeeded()', () => {
  it('fails for transactions earlier than september 2019', () => {
    expect(factIsNeeded({ timestamp: 1567310399 })).toEqual(false);
    expect(factIsNeeded({ timestamp: 1567310400, amount: 1, description: 'good' })).toEqual(true);
    expect(factIsNeeded({ timestamp: 1567310401, amount: 1, description: 'good' })).toEqual(true);
  });
  it('fails for transactions with an amount of 0', () => {
    expect(factIsNeeded({ timestamp: 1567310401, amount: -1, description: 'good' })).toEqual(true);
    expect(factIsNeeded({ timestamp: 1567310401, amount: 0 })).toEqual(false);
    expect(factIsNeeded({ timestamp: 1567310401, amount: 1, description: 'good' })).toEqual(true);
  });
  it('fails for transactions with unneeded description', () => {
    expect(factIsNeeded({ timestamp: 1567310401, amount: 1, description: 'ACH Deposit VENMO' })).toEqual(false);
    expect(factIsNeeded({ timestamp: 1567310401, amount: 1, description: 'ach Deposit venmo' })).toEqual(false);
    expect(factIsNeeded({ timestamp: 1567310401, amount: 1, description: 'ach deposit venmo' })).toEqual(false);
    expect(factIsNeeded({ timestamp: 1567310401, amount: 1, description: 'ach dep||osit venmo' })).toEqual(true);
  });
});
