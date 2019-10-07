const q_utils = require('q-utils')

const makeAccountingDTO = (account, timestamp, amount, description) => {
  return { account, timestamp, amount, description };
}

module.exports = { 
  parseAccountingData: (data, source) => {
    let splitData = data.split('\n');
    splitData.pop();
    splitData.shift();
    return splitData.map((line, i) => {
      const row = line.split(',');
      switch(source) {
        case 'mvcu':
          return makeAccountingDTO(
            row[0].indexOf('S0020') > -1 ? 'mvcu-checkings' : 'mvcu-savings',
            q_utils.dateToTimestamp(row[1]),
            row[2].indexOf('(') > -1 ? parseFloat(`-${row[2].replace('$', '')}`) : parseFloat(row[2].replace('$', '')),
            row[5]
          )
        case 'citi':
          return makeAccountingDTO(
            'citi-credit',
            q_utils.dateToTimestamp(row[1]),
            row[3] != '' ? parseFloat(row[3]) : parseFloat(row[4]),
            row[2]
          )
      }
    })
  }
}