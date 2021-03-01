const { percentageStringToFloat } = require('./index');

describe('percentageStringToFloat()', () => {
  describe('invalid cases', () => {
    it('missing % in percentage string returns null', () => {
      expect(percentageStringToFloat('20')).toEqual(null);
    });
    it('there is no number string in percentage string', () => {
      expect(percentageStringToFloat('%')).toEqual(null);
    });
    it('number in percentage string is not a number', () => {
      expect(percentageStringToFloat('hey%')).toEqual(null);
    });
    it('number larger than 100 returns null', () => {
      expect(percentageStringToFloat('101%')).toEqual(null);
    });
    it('number smaller than 0 returns null', () => {
      expect(percentageStringToFloat('.1%')).toEqual(null);
    });
  });
  it('returns percentage string in form of float', () => {
    expect(percentageStringToFloat('20%')).toEqual(0.2);
  });
});
