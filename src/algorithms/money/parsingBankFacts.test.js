/* eslint-disable object-curly-newline */
const {
  parseCiti,
  parseMvcu,
  parseMvcuOld,
  parseVenmo,
  computeFactId,
  factIsNeeded,
} = require('./parsingBankFacts');
// ----------------------------------
// HELPERS
// ----------------------------------
const unneededCitiFields = { Status: null, Credit: null, Debit: null };
const unneededMvcuFields = { 'Transaction ID': null, 'Effective Date': null, 'Transaction Type': null, 'Check Number': null, 'Reference Number': null, 'Transaction Category': null, Type: null, Balance: null, Memo: null, 'Extended Description': null };
const unneededMvcuOldFields = { account: 'maa', balance: null, type: null, blaah: null };
const unneededVenmoFields = { Username: null, ID: null, Type: null, Status: null, From: null, To: null, 'Amount (total)': null, 'Amount (fee)': null, 'Funding Source': null, Destination: null, 'Beginning Balance': null, 'Ending Balance': null, 'Statement Period Venmo Fees': null, 'Terminal Location': null, 'Year to Date Venmo Fees': null, Disclaimer: null };
// ----------------------------------
// TESTS
// ----------------------------------
describe('Parsers', () => {
  describe('parseCiti()', () => {
    it('parses payments correctly', () => {
      expect(parseCiti([
        { ...unneededCitiFields, Date: '03/01/2021', Description: 'mock citi payment', Debit: '25.00' },
      ])).toEqual([
        { timestamp: 1614574800, amount: 25.00, description: 'mock citi payment', account: 'citi-credit' },
      ]);
    });
    it('parses returns correctly', async () => {
      expect(parseCiti([
        { ...unneededCitiFields, Date: '10/19/2020', Description: 'GUIDEBOAT/TERRITORY AH 855-8720868 OH', Credit: '-49.50' },
      ])).toEqual([
        { timestamp: 1603080000, amount: -49.50, description: 'GUIDEBOAT/TERRITORY AH 855-8720868 OH', account: 'citi-credit' },
      ]);
    });
    it('ignores credit card bill payments', () => {
      expect(parseCiti([
        { ...unneededCitiFields, Date: '11/02/2020', Description: 'ONLINE PAYMENT, THANK YOU', Credit: '-1848.87' },
      ])).toEqual([
        { timestamp: 1604293200, amount: -1848.87, description: 'ONLINE PAYMENT, THANK YOU', account: 'citi-credit' },
      ]);
    });
  });
  describe('parseMvcu()', () => {
    it('parses payment correctly', () => {
      expect(parseMvcu([
        { ...unneededMvcuFields, 'Posting Date': '3/3/2021', Amount: '-1225.70000', Description: 'mvcu payment' },
      ])).toEqual([
        { timestamp: 1614747600, amount: -1225.70, description: 'mvcu payment', account: 'mvcu' },
      ]);
    });
    it('parses income correctly', () => {
      expect(parseMvcu([
        { ...unneededMvcuFields, 'Posting Date': '2/11/2021', Amount: '2225.54000', Description: 'mvcu income' },
      ])).toEqual([
        { timestamp: 1613019600, amount: 2225.54, description: 'mvcu income', account: 'mvcu' },
      ]);
    });
  });
  describe('parseMvcuOld()', () => {
    it('parses payments correctly', () => {
      expect(parseMvcuOld([
        { ...unneededMvcuOldFields, date: '9/2/2020', amount: '($115.00)', description: 'mvcu_old payment' },
      ])).toEqual([
        { timestamp: 1599019200, amount: -115.00, description: 'mvcu_old payment', account: 'mvcu-savings' },
      ]);
    });
    it('parses income correctly', () => {
      expect(parseMvcuOld([
        { ...unneededMvcuOldFields, date: '8/31/2020', amount: '$1.77', description: 'mvcu_old income' },
      ])).toEqual([
        { timestamp: 1598846400, amount: 1.77, description: 'mvcu_old income', account: 'mvcu-savings' },
      ]);
    });
    it('parses mvcu checking / savings correctly', () => {
      expect(parseMvcuOld([
        { ...unneededMvcuOldFields, date: '8/31/2020', amount: '$1.77', description: 'mvcu_old income', account: 'S0020' },
      ])).toEqual([
        { timestamp: 1598846400, amount: 1.77, description: 'mvcu_old income', account: 'mvcu-checkings' },
      ]);
    });
  });
  describe('parseVenmo()', () => {
    it('parses payments correctly', () => {
      expect(parseVenmo([
        { ...unneededVenmoFields, Datetime: '2021-02-03T19:28:47', 'Amount (total)': '- $33.00', Note: 'venmo payment 1', From: 'Quinn Averill', To: 'David Averill' },
        { ...unneededVenmoFields, Datetime: '2021-02-09T20:27:06', 'Amount (total)': '- $33.00', Note: 'venmo payment 2', From: 'Annie Averill', To: 'Quinn Averill' },
      ])).toEqual([
        { timestamp: 1612398527, amount: -33.00, description: 'Venmo to David Averill: venmo payment 1', account: 'venmo' },
        { timestamp: 1612920426, amount: -33.00, description: 'Venmo to Annie Averill: venmo payment 2', account: 'venmo' },
      ]);
    });
    it('parses incomes correctly', () => {
      expect(parseVenmo([
        { ...unneededVenmoFields, Datetime: '2021-02-03T19:28:47', 'Amount (total)': '+ $33.00', Note: 'venmo income 1', From: 'Quinn Averill', To: 'David Averill' },
        { ...unneededVenmoFields, Datetime: '2021-02-09T20:27:06', 'Amount (total)': '+ $33.00', Note: 'venmo income 2', From: 'Annie Averill', To: 'Quinn Averill' },
      ])).toEqual([
        { timestamp: 1612398527, amount: 33.00, description: 'Venmo from David Averill: venmo income 1', account: 'venmo' },
        { timestamp: 1612920426, amount: 33.00, description: 'Venmo from Annie Averill: venmo income 2', account: 'venmo' },
      ]);
    });
    it('ignores transfers', () => {
      expect(parseVenmo([
        { ...unneededVenmoFields, Datetime: '2020-06-07T14:44:42', 'Amount (total)': '- $1,222.10', Note: 'this should be ignored', From: '', To: '', Type: 'Standard Transfer' },
      ])).toEqual([]);
    });
  });
});
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
