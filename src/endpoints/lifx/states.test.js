const states = require('./states');
// ----------------------------------
// EXPECTED RESULTS
// ----------------------------------
const off = [
  {
    selector: 'id:d073d53ce830',
    power: 'off',
    duration: 0,
    fast: true
  },
  {
    selector: 'id:d073d53cf1d9',
    power: 'off',
    duration: 0,
    fast: true
  }
];
const on = [
  {
    selector: 'id:d073d53ce830',
    color: 'hue:120.9979 saturation:0 kelvin:3000',
    power: 'on',
    duration: 0,
    fast: true
  },
  {
    selector: 'id:d073d53cf1d9',
    color: 'hue:120.9979 saturation:0 kelvin:3000',
    power: 'on',
    duration: 0,
    fast: true
  }
];
const purpleGreen = [
  {
    selector: 'id:d073d53ce830',
    color: 'hue:98.8165 saturation:1 kelvin:3000',
    power: 'on',
    duration: 0,
    fast: true
  },
  {
    selector: 'id:d073d53cf1d9',
    color: 'hue:269.2255 saturation:1 kelvin:3000',
    power: 'on',
    duration: 0,
    fast: true
  }
];
// ----------------------------------
// TESTS
// ----------------------------------
test('state builders work correctly', () => {
  expect(states['on']).toEqual(on);
  expect(states['off']).toEqual(off);
  expect(states['purpleGreen']).toEqual(purpleGreen);
});
