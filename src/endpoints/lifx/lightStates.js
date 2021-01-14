const R = require('ramda');
// ----------------------------------
// LIGHT INFO
// ----------------------------------
const ON = 'on';
const OFF = 'off';
const randomColor = () => `hue:${Math.floor((Math.random() * 360) + 0)} saturation:1`;
const ids = {
  TREE_LEFT: 'id:d073d53ce830',
  TREE_RIGHT: 'id:d073d53cf1d9',
  FLOWER_LAMP: 'id:d073d562d356',
  LAMP: 'id:d073d563aba5',
};
const colors = {
  default: 'saturation:0 kelvin:3000',
  green: 'hue:98.82 saturation:1',
  purple: 'hue:269.23 saturation:1',
  blue: 'hue:219 saturation:1',
  yellow: 'hue:50.6 saturation:1',
};
const presets = {
  on: ON,
  off: OFF,
  default: colors.default,
  technicolor: [colors.green, colors.purple, colors.blue, colors.yellow],
};
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  buildPayload: ({ preset, brightness }) => R.keys(ids).map((selector, idx) => {
    const state = {
      selector: ids[selector],
      duration: 0,
      power: preset === OFF ? OFF : ON,
    };
    if (preset !== ON && preset !== OFF) {
      if (brightness) state.brightness = brightness;
      if (preset === 'random') {
        state.color = randomColor();
      } else if (preset) {
        const colorStates = presets[preset];
        if (colorStates == null) return null;
        state.color = Array.isArray(colorStates) ? colorStates[idx] : colorStates;
      }
    }
    return state;
  }),
  determinePreset: (light) => {
    const { power, color } = light;
    if (power === OFF) return OFF;
    const { hue, saturation, kelvin } = color;
    const knownColors = R.reduce((acc, key) => {
      acc[colors[key]] = key;
      return acc;
    }, {}, R.keys(colors));
    const tempString = `saturation:${saturation} kelvin:${kelvin}`;
    if (knownColors[tempString]) return knownColors[tempString];
    const colorString = `hue:${hue} saturation:${saturation}`;
    if (knownColors[colorString]) return knownColors[colorString];
    return 'unknown';
  },
};
// ***THIS IS ALL TESTED IN crud.test.js
