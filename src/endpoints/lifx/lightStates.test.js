const { buildStates } = require('./lightStates');
// ----------------------------------
// EXPECTED RESULTS
// ----------------------------------
const off = [
  {
    selector: 'id:d073d53ce830',
    power: 'off',
    duration: 0,
  },
  {
    selector: 'id:d073d53cf1d9',
    power: 'off',
    duration: 0,
  }
];
const on = [
  {
    selector: 'id:d073d53ce830',
    power: 'on',
    duration: 0,
  },
  {
    selector: 'id:d073d53cf1d9',
    power: 'on',
    duration: 0,
  }
];
const _default = [
  {
    selector: 'id:d073d53ce830',
    color: 'saturation:0 kelvin:3000',
    power: 'on',
    duration: 0,
  },
  {
    selector: 'id:d073d53cf1d9',
    color: 'saturation:0 kelvin:3000',
    power: 'on',
    duration: 0,
  }
];
const purpleGreen = [
  {
    selector: 'id:d073d53ce830',
    color: 'hue:98.82 saturation:1',
    power: 'on',
    duration: 0,
  },
  {
    selector: 'id:d073d53cf1d9',
    color: 'hue:269.23 saturation:1',
    power: 'on',
    duration: 0,
  }
];
// ----------------------------------
// TESTS
// ----------------------------------
test('state builders work correctly', () => {
  expect(buildStates('on')).toEqual(on);
  expect(buildStates('off')).toEqual(off);
  expect(buildStates('default')).toEqual(_default);
  expect(buildStates('purpleGreen')).toEqual(purpleGreen);
});
