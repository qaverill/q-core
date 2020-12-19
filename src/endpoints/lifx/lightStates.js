const R = require('ramda');
// ----------------------------------
// HELPERS
// ----------------------------------
const SELECT_LEFT = 'id:d073d53ce830';
const SELECT_RIGHT = 'id:d073d53cf1d9';
const ON = 'on'
const OFF = 'off';
const UNKNOWN = 'unknown';
const DEFAULT = 'default';
const GREEN = 'green';
const PURPLE = 'purple';
const colors = {
  default: 'saturation:0 kelvin:3000',
  green: 'hue:98.82 saturation:1',
  purple: 'hue:269.23 saturation:1',
}
// ----------------------------------
// BUILDERS
// ----------------------------------
const craftPayload = (state) => {
  const payload = { duration: 0, power: OFF };
  if (state === OFF) return payload;
  payload.power = ON;
  if (state === ON) return payload;
  payload.color = colors[state];
  return payload;
};
const buildState = (leftColor, rightColor = leftColor) => [
  { selector: SELECT_LEFT, ...craftPayload(leftColor) },
  { selector: SELECT_RIGHT, ...craftPayload(rightColor) },
];
const states = {
  on: buildState(ON),
  off: buildState(OFF),
  default: buildState(DEFAULT),
  purpleGreen: buildState(GREEN, PURPLE),
};
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  buildStates: (state) => R.prop(state, states),
  possibleStates: R.keys(states),
  determinePreset: (light) => {
    const { power, color } = light;
    if (power === OFF) return OFF;
    const { hue, saturation, kelvin } = color;
    if (saturation === 0) return DEFAULT;
    const colorString = `hue:${hue} saturation:${saturation}`;
    const matchedColor = R.find(
      (key) => R.equals(colorString, colors[key]),
      R.keys(colors),
    )
    return matchedColor || UNKNOWN;
  },
};
