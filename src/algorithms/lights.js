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
const lifxColors = {
  default: 'saturation:0 kelvin:3000',
  green: 'hue:98.82 saturation:1',
  purple: 'hue:269.23 saturation:1',
  blue: 'hue:219 saturation:1',
  yellow: 'hue:50.6 saturation:1',
  candle: 'saturation:0 kelvin:1500',
};
const presets = {
  off: { },
  default: { colors: lifxColors.default, brightness: 1 },
  technicolor: {
    colors: [lifxColors.green, lifxColors.purple, lifxColors.blue, lifxColors.yellow],
    brightness: 1,
  },
  candle: {
    colors: lifxColors.candle,
    brightness: 0.2,
  },
};
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  buildPayloads: ({ preset, brightness }) => R.keys(ids).map((selector, idx) => {
    const state = {
      selector: ids[selector],
      duration: 0,
      power: preset === OFF ? OFF : ON,
    };
    if (brightness) return { ...state, brightness };
    if (preset === 'random') return { ...state, color: randomColor(), brightness: 1 };
    if (R.isNil(preset) || R.isNil(presets[preset])) return null;
    const { colors, brightness: presetBrightness } = presets[preset];
    return {
      ...state,
      color: Array.isArray(colors) ? colors[idx] : colors,
      brightness: presetBrightness,
    };
  }),
  determineColorString: (light) => {
    const { power, color } = light;
    if (power === OFF) return OFF;
    const { hue, saturation, kelvin } = color;
    const knownColors = R.reduce((acc, key) => {
      acc[lifxColors[key]] = key;
      return acc;
    }, {}, R.keys(lifxColors));
    const tempDefinition = `saturation:${saturation} kelvin:${kelvin}`;
    if (knownColors[tempDefinition]) return knownColors[tempDefinition];
    const colorDefinition = `hue:${hue} saturation:${saturation}`;
    if (knownColors[colorDefinition]) return knownColors[colorDefinition];
    return 'unknown';
  },
};
// ***THIS IS ALL TESTED IN crud.test.js
