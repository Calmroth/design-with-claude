const {
  parseColor,
  relativeLuminance,
  contrastRatio,
  meetsWCAG,
  checkColorPair,
} = require('../../src/mcp/analyzers/contrast-checker');

describe('contrast-checker', () => {
  describe('parseColor', () => {
    test('parses 6-digit hex', () => {
      const result = parseColor('#FF0000');
      expect(result).toMatchObject({ r: 255, g: 0, b: 0 });
      expect(parseColor('#00ff00')).toMatchObject({ r: 0, g: 255, b: 0 });
      expect(parseColor('#0000FF')).toMatchObject({ r: 0, g: 0, b: 255 });
    });

    test('parses 3-digit hex', () => {
      expect(parseColor('#F00')).toMatchObject({ r: 255, g: 0, b: 0 });
      expect(parseColor('#fff')).toMatchObject({ r: 255, g: 255, b: 255 });
    });

    test('parses rgb()', () => {
      expect(parseColor('rgb(255, 0, 0)')).toMatchObject({ r: 255, g: 0, b: 0 });
      expect(parseColor('rgb(128, 128, 128)')).toMatchObject({ r: 128, g: 128, b: 128 });
    });

    test('parses rgba()', () => {
      const result = parseColor('rgba(255, 0, 0, 0.5)');
      expect(result).toMatchObject({ r: 255, g: 0, b: 0 });
      expect(result.a).toBeCloseTo(0.5);
    });

    test('parses named colors', () => {
      expect(parseColor('white')).toMatchObject({ r: 255, g: 255, b: 255 });
      expect(parseColor('black')).toMatchObject({ r: 0, g: 0, b: 0 });
      expect(parseColor('red')).toMatchObject({ r: 255, g: 0, b: 0 });
    });

    test('returns null for unparseable', () => {
      expect(parseColor('not-a-color')).toBeNull();
      expect(parseColor('var(--bg)')).toBeNull();
    });
  });

  describe('relativeLuminance', () => {
    test('white has luminance 1', () => {
      expect(relativeLuminance(255, 255, 255)).toBeCloseTo(1.0, 4);
    });

    test('black has luminance 0', () => {
      expect(relativeLuminance(0, 0, 0)).toBeCloseTo(0.0, 4);
    });

    test('mid-gray has expected luminance', () => {
      const lum = relativeLuminance(128, 128, 128);
      expect(lum).toBeGreaterThan(0.2);
      expect(lum).toBeLessThan(0.3);
    });
  });

  describe('contrastRatio', () => {
    test('black on white is 21:1', () => {
      const ratio = contrastRatio({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 });
      expect(ratio).toBeCloseTo(21, 0);
    });

    test('white on white is 1:1', () => {
      const ratio = contrastRatio({ r: 255, g: 255, b: 255 }, { r: 255, g: 255, b: 255 });
      expect(ratio).toBeCloseTo(1, 1);
    });

    test('order does not matter', () => {
      const r1 = contrastRatio({ r: 255, g: 0, b: 0 }, { r: 255, g: 255, b: 255 });
      const r2 = contrastRatio({ r: 255, g: 255, b: 255 }, { r: 255, g: 0, b: 0 });
      expect(r1).toBeCloseTo(r2, 4);
    });
  });

  describe('meetsWCAG', () => {
    test('21:1 ratio passes all levels', () => {
      const result = meetsWCAG(21, 'AA', 'normal');
      expect(result.AA).toBe(true);
      expect(result.AAA).toBe(true);
    });

    test('4.5:1 ratio passes AA normal but not AAA', () => {
      const result = meetsWCAG(4.5, 'AA', 'normal');
      expect(result.AA).toBe(true);
      expect(result.AAA).toBe(false);
    });

    test('3:1 ratio passes AA large but not AA normal', () => {
      const normal = meetsWCAG(3, 'AA', 'normal');
      expect(normal.AA).toBe(false);

      const large = meetsWCAG(3, 'AA', 'large');
      expect(large.AA).toBe(true);
    });

    test('2:1 ratio fails all', () => {
      const result = meetsWCAG(2, 'AA', 'normal');
      expect(result.AA).toBe(false);
      expect(result.AAA).toBe(false);
    });
  });

  describe('checkColorPair', () => {
    test('black on white passes AA', () => {
      const result = checkColorPair('#000000', '#FFFFFF');
      expect(result.AA).toBe(true);
      expect(result.AAA).toBe(true);
      expect(result.ratio).toBeCloseTo(21, 0);
    });

    test('light gray on white fails AA', () => {
      const result = checkColorPair('#CCCCCC', '#FFFFFF');
      expect(result.AA).toBe(false);
      expect(result.ratio).toBeLessThan(4.5);
    });

    test('returns null for unparseable colors', () => {
      expect(checkColorPair('var(--fg)', '#FFFFFF')).toBeNull();
    });
  });
});
