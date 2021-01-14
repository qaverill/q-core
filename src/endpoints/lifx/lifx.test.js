const { apiGet, apiPut } = require('@q/test-helpers');
// ----------------------------------
// HELPERS
// ----------------------------------
const PATH = '/lifx';
const ON = 'on';
const OFF = 'off';
const setLights = async ({ preset, brightness }) => {
  const body = {};
  if (preset) body.preset = preset;
  if (brightness) body.brightness = brightness;
  await apiPut(PATH, body);
  await new Promise(r => setTimeout(r, 1000));
  return await apiGet(PATH);
};
const assertResults = (results, preset) => {
  const expected = expectedResults[preset];
  results.forEach((light) => {
    expect(light.power).toEqual(expected ? ON : OFF);
    if (preset) {
      expect(light.preset).toEqual(preset);
      expect(light.colorString).toEqual(expected[light.label]);
    }
  });
}
// ----------------------------------
// EXPECTED RESULTS
// ----------------------------------
const expectedResults = {
  random: {
    'Tree Left': 'unknown',
    'Tree Right': 'unknown',
    'Flower Lamp': 'unknown',
    'Lamp': 'unknown'
  },
  technicolor: {
    'Tree Left': 'green',
    'Tree Right': 'purple',
    'Flower Lamp': 'blue',
    'Lamp': 'yellow'
  },
  default: {
    'Tree Left': 'default',
    'Tree Right': 'default',
    'Flower Lamp': 'default',
    'Lamp': 'default'
  }
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
      expect(result).toHaveProperty('colorString');
      expect(result).toHaveProperty('preset');
      expect(Object.keys(result)).toHaveLength(14);
    })
  })
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
  test('each light set to the same', async () => {
    const preset = 'default';
    assertResults(await setLights({ preset }), preset);
  });
  test('"off" turns them off', async () => {
    const results = await setLights({ preset: 'off' });
    assertResults(results);
  });
  test('"on" turns them on but does not change color', async () => {
    const results = await setLights({ preset: 'on' });
    assertResults(results, 'default');
  });
  test('invalid preset returns error', async () => {
    const result = await apiPut(PATH, { preset: 'invalid' });
    expect(result).toEqual('Invalid state, see lightStates.js::buildPayload() for possible states');
  });
  test('can change only the brightness of them all', async () => {
    const brightness = 0.5
    const results = await setLights({ brightness });
    assertResults(results, 'default');
    results.forEach((light) => expect(light.brightness).toEqual(brightness));
  });
  test('can change the brightness and color of them all', async () => {
    const brightness = 1
    const preset = 'technicolor';
    const results = await setLights({ brightness, preset });
    assertResults(results, preset);
    results.forEach((light) => expect(light.brightness).toEqual(brightness));
  });
});