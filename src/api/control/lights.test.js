/* eslint-disable jest/expect-expect */
const { apiGet, apiPut } = require('@q/test-helpers');
// ----------------------------------
// EXPECTED RESULTS
// ----------------------------------
const expectedResults = {
  random: {
    'Tree Left': 'unknown',
    'Tree Right': 'unknown',
    'Flower Lamp': 'unknown',
    Lamp: 'unknown',
  },
  technicolor: {
    'Tree Left': 'green',
    'Tree Right': 'purple',
    'Flower Lamp': 'blue',
    Lamp: 'yellow',
  },
  default: {
    'Tree Left': 'default',
    'Tree Right': 'default',
    'Flower Lamp': 'default',
    Lamp: 'default',
  },
};
// ----------------------------------
// HELPERS
// ----------------------------------
const PATH = '/control/lights';
const ON = 'on';
const OFF = 'off';
const setLights = async ({ preset, brightness }) => {
  const body = {};
  if (preset) body.preset = preset;
  if (brightness) body.brightness = brightness;
  await apiPut(PATH, body);
  await new Promise((r) => setTimeout(r, 1000));
  const results = await apiGet(PATH);
  return results;
};
const assertResults = (results, preset) => {
  results.forEach((light) => {
    expect(light.power).toEqual(preset === OFF ? OFF : ON);
    expect(light.preset).toEqual(preset);
    if (preset !== OFF) {
      expect(light.colorString).toEqual(expectedResults[preset][light.label]);
    }
  });
};
// ----------------------------------
// TESTS
// ----------------------------------
describe('lights', () => {
  describe(`GET ${PATH}`, () => {
    test('returns all the correct values and no more', async () => {
      const results = await apiGet(PATH);
      expect(results).toHaveLength(4);
      results.forEach((result) => {
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('uuid');
        expect(result).toHaveProperty('label');
        expect(result).toHaveProperty('connected');
        expect(result).toHaveProperty('power');
        expect(result).toHaveProperty('color');
        expect(result).toHaveProperty('brightness');
        expect(result).toHaveProperty('group.name', 'Q');
        expect(result).toHaveProperty('location.name', 'Q Palace');
        expect(result).toHaveProperty('product');
        expect(result).toHaveProperty('last_seen');
        expect(result).toHaveProperty('seconds_since_seen');
        expect(result).toHaveProperty('colorString');
        expect(result).toHaveProperty('preset');
        expect(Object.keys(result)).toHaveLength(14);
      });
    });
  });
  describe(`PUT ${PATH}`, () => {
    test('each light set to random', async () => {
      const preset = 'random';
      assertResults(await setLights({ preset }), preset);
    });
    test('each light set to its own', async () => {
      const preset = 'technicolor';
      assertResults(await setLights({ preset }), preset);
    });
    test('"off" turns them off', async () => {
      const preset = 'off';
      assertResults(await setLights({ preset }), preset);
    });
    test('each light set to the same', async () => {
      const preset = 'default';
      assertResults(await setLights({ preset }), preset);
    });
    test('invalid preset returns error', async () => {
      const result = await apiPut(PATH, { preset: 'invalid' });
      expect(result).toEqual('Invalid state, see lightStates.js::buildPayloads() for possible states');
    });
    test('can change only the brightness of them all', async () => {
      const brightness = 0.5;
      const results = await setLights({ brightness });
      assertResults(results, 'default');
      results.forEach((light) => expect(light.brightness).toEqual(brightness));
    });
    test('can change the brightness and color of them all', async () => {
      const brightness = 1;
      const preset = 'technicolor';
      const results = await setLights({ brightness, preset });
      assertResults(results, preset);
      results.forEach((light) => expect(light.brightness).toEqual(brightness));
    });
  });
});
