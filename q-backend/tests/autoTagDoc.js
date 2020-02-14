const { testAutoTagDoc } = require('../api-calls/banks');

const path = './api-calls/banks/autoTagDoc';

const tags = {
  bingo: ['bingo', 'lingo', 'dingo'],
  number: {
    even: ['2', '4', '6', '8'],
    odd: ['1', '3', '5', '7', '9'],
    negative: ['-'],
  },
  letters: {
    a: {
      ax1: ['a'],
      ax2: ['aa'],
      ax4: ['aaaa'],
    },
    b: {
      bx2: ['bb'],
      bx3: ['bbb'],
    },
  },
};

const tests = [
  { description: 'dingo21', expected: ['bingo', 'number', 'even'] },
  { description: '', expected: [] },
  { description: '', expected: [] },
  { description: '', expected: [] },
  { description: '', expected: [] },
  { description: '', expected: [] },
  { description: '', expected: [] },
  { description: '', expected: [] },
];

const algorithm = (i) => testAutoTagDoc(tests[i], tags, null);

module.exports = {
  path,
  tests,
  algorithm,
};
