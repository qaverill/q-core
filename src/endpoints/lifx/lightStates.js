const R = require('ramda');
const { ids, colors } = require('./lights.json');
// ----------------------------------
// HELPERS
// ----------------------------------
const ON = 'on';
const OFF = 'off';
const randomColor = () => `hue:${Math.floor((Math.random() * 360) + 0)} saturation:1`;
const craftPayload = (state) => {
  const payload = { duration: 0, power: OFF };
  if (state === OFF) return payload;
  payload.power = ON;
  if (state === ON) return payload;
  payload.color = state;
  return payload;
};
const buildState = (I, II = I, III = I, IV = I) => [
  { selector: ids.TREE_LEFT, ...craftPayload(I) },
  { selector: ids.TREE_RIGHT, ...craftPayload(II) },
  { selector: ids.FLOWER_LAMP, ...craftPayload(III) },
  { selector: ids.LAMP, ...craftPayload(IV) },
];
// ----------------------------------
// EXPORTS
// ----------------------------------
module.exports = {
  buildStates: (state) => {
    switch (state) {
      case 'on':
        return buildState(ON);
      case 'off':
        return buildState(OFF);
      case 'default': // TODO: make this adjust with the time of day!
        return buildState(colors.default);
      case 'technicolor':
        return buildState(colors.green, colors.purple, colors.blue, colors.yellow);
      case 'random':
        return buildState(randomColor(), randomColor(), randomColor(), randomColor());
      default:
        return null;
    }
  },
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
