const crypto = require('crypto');
const R = require('ramda');
const { dateStringToTimestamp } = require('@q/time');
const { round2Decimals } = require('@q/utils');
// ----------------------------------
// HELPERS
// ----------------------------------
const START_OF_SEPTEMBER_19 = 1567310400;
const stringDoesNotContainSubstrings = (string, substrings) => (
  !new RegExp(R.join('|', R.map(R.toLower, substrings))).test(R.toLower(string))
);
const citiIgnoredSubstrings = ['PAYMENT THANK YOU', 'ONLINE PAYMENT, THANK YOU'];
const mvcuIgnoredSubstrings = ['VENMO TYPE', 'CITI CARD ONLINE TYPE: PAYMENT', 'From Share', 'To Share'];
const mvcuOldIgnoredSubstrings = ['Withdrawal VENMO', 'Online Transfer', 'Transfer Withdrawal', 'ACH Deposit VENMO', 'Withdrawal CITI CARD ONLINE', 'From Share', 'To Share'];
// ----------------------------------
// LOGIC
// ----------------------------------
module.exports = {
  parseCiti: R.pipe(
    R.filter(({ Description, Debit, Credit }) => (
      stringDoesNotContainSubstrings(Description, citiIgnoredSubstrings)
      && (Debit > 0 || Debit < 0 || Credit > 0 || Credit < 0)
    )),
    R.map(({
      Date, Debit, Credit, Description,
    }) => ({
      account: 'citi-credit',
      timestamp: dateStringToTimestamp(Date),
      amount: round2Decimals(parseFloat(Debit) * -1 || parseFloat(Credit) * -1),
      description: Description.replace(/"/g, ''),
    })),
  ),
  parseMvcu: R.pipe(
    R.filter(({ Description }) => (
      stringDoesNotContainSubstrings(Description, mvcuIgnoredSubstrings)
    )),
    R.map((row) => ({
      account: 'mvcu',
      timestamp: dateStringToTimestamp(row['Posting Date']),
      amount: round2Decimals(parseFloat(row.Amount.replace(/"/g, '').slice(0, -3))),
      description: row.Description,
    })),
  ),
  parseMvcuOld: R.pipe(
    R.filter(({ description }) => (
      stringDoesNotContainSubstrings(description, mvcuOldIgnoredSubstrings)
    )),
    R.map(({
      account, date, amount, description,
    }) => ({
      account: account.indexOf('S0020') > -1 ? 'mvcu-checkings' : 'mvcu-savings',
      timestamp: dateStringToTimestamp(date),
      amount: round2Decimals(amount.indexOf('(') > -1 ? parseFloat(amount.replace(/[)$(]/g, '')) * -1 : parseFloat(amount.replace('$', ''))),
      description,
    })),
  ),
  parseVenmo: R.pipe(
    R.map((row) => {
      if (typeof parseInt(row.ID, 10) === 'number' && row.Type !== 'Standard Transfer' && row['Amount (total)'] != null) {
        const type = row['Amount (total)'].indexOf('+') > -1 ? 'from' : 'to';
        const description = `Venmo ${type} ${row.From === 'Quinn Averill' ? row.To : row.From}: ${row.Note}`;
        return ({
          account: 'venmo',
          timestamp: dateStringToTimestamp(row.Datetime),
          amount: round2Decimals(parseFloat(row['Amount (total)'].replace(/[ $+,]/g, ''))),
          description,
        });
      }
      return null;
    }),
    R.reject(R.isNil),
  ),
  computeFactId: ({
    account, timestamp, amount, description,
  }) => (
    crypto.createHash('md5')
      .update(account + timestamp + amount + description)
      .digest('hex')
  ),
  factIsNeeded: ({ timestamp, amount }) => timestamp >= START_OF_SEPTEMBER_19 && amount !== 0,
};
