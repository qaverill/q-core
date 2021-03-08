const crypto = require('crypto');
const R = require('ramda');
const { dateStringToTimestamp } = require('@q/time');
const { roundNumber2Decimals } = require('@q/utils');
// ----------------------------------
// HELPERS
// ----------------------------------
const START_OF_SEPTEMBER_19 = 1567310400;
const unneededFactDescriptions = [
  'Withdrawal VENMO',
  'Online Transfer',
  'Transfer Withdrawal',
  'ACH Deposit VENMO',
  'ONLINE PAYMENT, THANK YOU',
  'PAYMENT THANK YOU',
  'Withdrawal CITI CARD ONLINE',
  'Transfer Deposit From Share',
  'VENMO TYPE',
  'CITI CARD ONLINE TYPE: PAYMENT',
];
// ----------------------------------
// LOGIC
// ----------------------------------
module.exports = {
  parseCiti: R.map(({ Date, Debit, Credit, Description }) => ({
    account: 'citi-credit',
    timestamp: dateStringToTimestamp(Date),
    amount: roundNumber2Decimals(Debit !== '' ? parseFloat(Debit) * -1 : parseFloat(Credit) * -1),
    description: Description.replace(/"/g, ''),
  })),
  parseMvcu: R.map((row) => ({
    account: 'mvcu',
    timestamp: dateStringToTimestamp(row['Posting Date']),
    amount: roundNumber2Decimals(parseFloat(row.Amount.replace(/"/g, '').slice(0, -3))),
    description: row.Description,
  })),
  parseMvcuOld: R.map(({ account, date, amount, description }) => ({
    account: account.indexOf('S0020') > -1 ? 'mvcu-checkings' : 'mvcu-savings',
    timestamp: dateStringToTimestamp(date),
    amount: roundNumber2Decimals(amount.indexOf('(') > -1 ? parseFloat(amount.replace(/[)$(]/g, '')) * -1 : parseFloat(amount.replace('$', ''))),
    description,
  })),
  parseVenmo: R.compose(
    R.reject(R.isNil),
    R.map((row) => {
      if (typeof parseInt(row.ID, 10) === 'number' && row.Type !== 'Standard Transfer' && row['Amount (total)'] != null) {
        const type = row['Amount (total)'].indexOf('+') > -1 ? 'from' : 'to';
        const description = `Venmo ${type} ${row.From === 'Quinn Averill' ? row.To : row.From}: ${row.Note}`;
        return ({
          account: 'venmo',
          timestamp: dateStringToTimestamp(row.Datetime),
          amount: roundNumber2Decimals(parseFloat(row['Amount (total)'].replace(/[ $+,]/g, ''))),
          description,
        });
      }
      return null;
    }),
  ),
  computeFactId: ({ account, timestamp, amount, description }) => (
    crypto.createHash('md5')
      .update(account + timestamp + amount + description)
      .digest('hex')
  ),
  factIsNeeded: ({ timestamp, amount, description }) => (
    timestamp >= START_OF_SEPTEMBER_19
      && amount !== 0
      && !new RegExp(R.join('|', R.map(R.toLower, unneededFactDescriptions)))
        .test(R.toLower(description))
  ),
};
