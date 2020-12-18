// ----------------------------------
// HELPERS
// ----------------------------------
const SELECT_LEFT = 'id:d073d53ce830';
const SELECT_RIGHT = 'id:d073d53cf1d9';
const DEFAULT = 'hue:120.9979 saturation:0 kelvin:3000';
const GREEN = 'hue:98.8165 saturation:1 kelvin:3000';
const PURPLE = 'hue:269.2255 saturation:1 kelvin:3000';

const INSTANT = { duration: 0, fast: true };
const ON = { power: 'on', ...INSTANT };
const OFF = { power: 'off', ...INSTANT };

const colorState = (color) => (color === OFF ? OFF : { color, ...ON });
const makeState = (leftColor, rightColor = leftColor) => [
  { selector: SELECT_LEFT, ...colorState(leftColor) },
  { selector: SELECT_RIGHT, ...colorState(rightColor) },
];
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  off: makeState(OFF),
  on: makeState(DEFAULT),
  purpleGreen: makeState(GREEN, PURPLE),
};
