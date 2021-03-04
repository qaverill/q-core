const { buildPayloads } = require('./lights');
// ----------------------------------
// TESTS
// ----------------------------------
describe('light algorithms', () => {
  describe('buildPayloads', () => {
    it('given nothing, payload is just the default state', () => {
      expect(
        buildPayloads({}).every(({ power, color, brightness }) => power === 'on' && color == null && brightness == null),
      ).toEqual(true);
    });
    it('when given only brightness, payload contains no color change', () => {
      expect(
        buildPayloads({ brightness: 0.2 }).every(({ power, color, brightness }) => power === 'on' && color == null && brightness === 0.2),
      ).toEqual(true);
    });
    it('when given preset sets preset and brightness, payload contains color and brightness changes', () => {
      expect(
        buildPayloads({ preset: 'candle' }).every(({ power, color, brightness }) => power === 'on' && color === 'saturation:0 kelvin:1500' && brightness === 0.2),
      ).toEqual(true);
    });
  });
});
