const { apiGet, apiPut } = require('@q/test-helpers');
// ----------------------------------
// HELPERS
// ----------------------------------
const PATH = '/lifx';
const ON = 'on';
const OFF = 'off';
const PURPLEGREEN = 'purpleGreen';
const DEFAULT = 'default';
const setLights = async (preset) => {
  await apiPut(PATH, { preset });
  await new Promise(r => setTimeout(r, 1000));
  return await apiGet(PATH);
};
const assertResults = (results, expected) => {
  results.forEach((light) => {
    expect(light.power).toEqual(expected === OFF ? OFF : ON);
    if (expected !== OFF) {
      expect(light.preset).toEqual(expected[light.label])
    }
  });
}
// ----------------------------------
// TESTS
// ----------------------------------
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
      expect(result).toHaveProperty('preset');
      expect(Object.keys(result)).toHaveLength(13);
    })
  })
});
describe(`PUT ${PATH}`, () => {
  test('each light set to random', async () => {
    const results = await setLights('random');
    const expectedColors = {
      'Tree Left': 'unknown',
      'Tree Right': 'unknown',
      'Flower Lamp': 'unknown',
      'Lamp': 'unknown'
    };
    assertResults(results, expectedColors);
  });
  test('each light set to the same', async () => {
    const results = await setLights('default');
    const expectedColors = {
      'Tree Left': 'default',
      'Tree Right': 'default',
      'Flower Lamp': 'default',
      'Lamp': 'default'
    };
    assertResults(results, expectedColors);
  });
  test('each light set to its own', async () => {
    const results = await setLights('technicolor');
    const expectedColors = {
      'Tree Left': 'green',
      'Tree Right': 'purple',
      'Flower Lamp': 'blue',
      'Lamp': 'yellow'
    };
    assertResults(results, expectedColors);
  });
  test('"off" turns them off', async () => {
    const results = await setLights('off');
    assertResults(results, OFF);
  });
  test('"on" turns them on but does not change color', async () => {
    const results = await setLights('on');
    const expectedColors = {
      'Tree Left': 'green',
      'Tree Right': 'purple',
      'Flower Lamp': 'blue',
      'Lamp': 'yellow'
    };
    assertResults(results, expectedColors);
  });
  test('invalid preset returns error', async () => {
    const result = await apiPut(PATH, { preset: 'invalid' });
    expect(result).toEqual('Invalid state, see lightStates.js::buildStates() for possible states');
  });
  test.skip('can change the brightness of them all', async () => {
    // TODO: add ability to change brightness of all light at once
  });
});