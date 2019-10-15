const { q_utils, q_logger } = require('q-lib');

const makeAccountingDTO = (account, timestamp, amount, description) => (
  {
    account,
    timestamp,
    amount,
    description,
  }
);

module.exports = {
  parseAccountingData: (data, source) => {
    try {
      return data.split('\n').slice(1, -1).map(line => {
        const row = line.split(',');
        switch (source) {
          case 'mvcu':
            return makeAccountingDTO(
              row[0].indexOf('S0020') > -1 ? 'mvcu-checkings' : 'mvcu-savings',
              q_utils.dateToTimestamp(row[1]),
              row[2].indexOf('(') > -1 ? parseFloat(`-${row[2].replace(/[)$(]/g, '')}`) : parseFloat(row[2].replace('$', '')),
              row[5],
            );
          case 'citi':
            return makeAccountingDTO(
              'citi-credit',
              q_utils.dateToTimestamp(row[1]),
              row[3] !== '' ? parseFloat(row[3]) : parseFloat(row[4]),
              row[2],
            );
          default:
            throw new Error(`Unknown data source found in accounting data: ${source}`);
        }
      });
    } catch (error) {
      q_logger.error(error);
      return [];
    }
  },
};
