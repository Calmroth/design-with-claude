const path = require('path');
const fs = require('fs');
const { analyzeFile, aggregateAnalysis } = require('../../src/mcp/analyzers/code-analyzer');

// Create temp files for testing
const TMP_DIR = path.join(__dirname, '..', '..', '__test_fixtures__', 'analyzer');

beforeAll(() => {
  fs.mkdirSync(TMP_DIR, { recursive: true });
});

afterAll(() => {
  fs.rmSync(TMP_DIR, { recursive: true, force: true });
  // Clean up parent if empty
  try {
    const parent = path.join(TMP_DIR, '..');
    if (fs.readdirSync(parent).length === 0) fs.rmdirSync(parent);
  } catch (e) { /* ignore */ }
});

function writeTempFile(name, content) {
  const filePath = path.join(TMP_DIR, name);
  fs.writeFileSync(filePath, content);
  return filePath;
}

describe('code-analyzer', () => {
  describe('extractColors', () => {
    test('finds hex colors in CSS', () => {
      const file = writeTempFile('colors.css', `
        .btn { color: #333333; background-color: #FF6600; }
        .link { color: #0066cc; }
      `);
      const result = analyzeFile(file);
      expect(result.colors.length).toBeGreaterThanOrEqual(3);
      expect(result.colors.some(c => c.value === '#333333')).toBe(true);
      expect(result.colors.some(c => c.value === '#FF6600')).toBe(true);
    });

    test('finds rgb colors', () => {
      const file = writeTempFile('rgb.css', `
        .box { color: rgb(255, 0, 0); background: rgba(0, 0, 0, 0.5); }
      `);
      const result = analyzeFile(file);
      expect(result.colors.some(c => /rgb/.test(c.value))).toBe(true);
    });

    test('detects Tailwind color classes', () => {
      const file = writeTempFile('tw.tsx', `
        <div className="bg-blue-500 text-white hover:bg-blue-600">Hello</div>
      `);
      const result = analyzeFile(file);
      expect(result.colors.some(c => /blue-500/.test(c.value))).toBe(true);
    });

    test('detects token vs hardcoded colors', () => {
      const file = writeTempFile('tokens.css', `
        .a { color: var(--text-primary); }
        .b { color: #ff0000; }
      `);
      const result = analyzeFile(file);
      const tokenColor = result.colors.find(c => /var\(--/.test(c.value));
      const hardcoded = result.colors.find(c => c.value === '#ff0000');
      if (tokenColor) expect(tokenColor.isToken).toBe(true);
      if (hardcoded) expect(hardcoded.isToken).toBe(false);
    });
  });

  describe('extractStates', () => {
    test('detects CSS pseudo-classes', () => {
      const file = writeTempFile('states.css', `
        .btn:hover { background: blue; }
        .btn:focus-visible { outline: 2px solid blue; }
        .btn:disabled { opacity: 0.5; }
        .btn:active { transform: scale(0.98); }
      `);
      const result = analyzeFile(file);
      expect(result.states.hover).toBe(true);
      expect(result.states.focusVisible).toBe(true);
      expect(result.states.disabled).toBe(true);
      expect(result.states.active).toBe(true);
    });

    test('detects Tailwind state prefixes', () => {
      const file = writeTempFile('tw-states.tsx', `
        <button className="hover:bg-blue-600 focus:ring-2 disabled:opacity-50">Click</button>
      `);
      const result = analyzeFile(file);
      expect(result.states.hover).toBe(true);
      expect(result.states.focus).toBe(true);
      expect(result.states.disabled).toBe(true);
    });
  });

  describe('extractAriaAttributes', () => {
    test('finds aria attributes in JSX', () => {
      const file = writeTempFile('aria.tsx', `
        <button aria-label="Close dialog" aria-expanded={isOpen} role="tab">
          <span aria-hidden="true">×</span>
        </button>
      `);
      const result = analyzeFile(file);
      expect(result.ariaAttributes.length).toBeGreaterThanOrEqual(3);
      expect(result.ariaAttributes.some(a => a.attribute === 'aria-label')).toBe(true);
      expect(result.ariaAttributes.some(a => a.attribute === 'role')).toBe(true);
    });
  });

  describe('extractComponents', () => {
    test('finds React components', () => {
      const file = writeTempFile('components.tsx', `
        import { Button } from './ui';
        export function Card({ children }) {
          return <div><Button variant="primary">Click</Button><Icon name="star" />{children}</div>;
        }
      `);
      const result = analyzeFile(file);
      expect(result.components.some(c => c.name === 'Button')).toBe(true);
      expect(result.components.some(c => c.name === 'Icon')).toBe(true);
    });
  });

  describe('extractSpacing', () => {
    test('finds CSS spacing values', () => {
      const file = writeTempFile('spacing.css', `
        .card { padding: 16px; margin: 24px 0; gap: 8px; }
      `);
      const result = analyzeFile(file);
      expect(result.spacing.length).toBeGreaterThanOrEqual(2);
    });

    test('finds Tailwind spacing classes', () => {
      const file = writeTempFile('tw-spacing.tsx', `
        <div className="p-4 mx-2 gap-3 mt-8">Content</div>
      `);
      const result = analyzeFile(file);
      expect(result.spacing.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('extractTypography', () => {
    test('finds font properties', () => {
      const file = writeTempFile('type.css', `
        .heading { font-size: 24px; font-weight: 700; font-family: 'Inter', sans-serif; line-height: 1.5; }
        .body { font-size: 16px; font-weight: 400; }
      `);
      const result = analyzeFile(file);
      expect(result.typography.fontSizes.length).toBeGreaterThanOrEqual(2);
      expect(result.typography.fontWeights.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('extractAnimations', () => {
    test('finds transitions', () => {
      const file = writeTempFile('motion.css', `
        .btn { transition: background-color 200ms ease-in-out; }
        .card { transition: transform 300ms ease-out, opacity 200ms; }
      `);
      const result = analyzeFile(file);
      expect(result.animations.transitions.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('extractImages', () => {
    test('finds images with and without alt text', () => {
      const file = writeTempFile('images.tsx', `
        <img src="/hero.jpg" alt="Hero banner" />
        <img src="/logo.png" />
        <Image src="/photo.webp" alt="" />
      `);
      const result = analyzeFile(file);
      expect(result.images.length).toBeGreaterThanOrEqual(2);
      const withAlt = result.images.filter(i => i.hasAlt);
      const withoutAlt = result.images.filter(i => !i.hasAlt);
      expect(withAlt.length).toBeGreaterThanOrEqual(1);
      expect(withoutAlt.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('extractFormElements', () => {
    test('finds form inputs with and without labels', () => {
      const file = writeTempFile('form.tsx', `
        <label htmlFor="email">Email</label>
        <input id="email" type="email" />
        <input type="text" placeholder="Name" />
        <input type="password" aria-label="Password" />
      `);
      const result = analyzeFile(file);
      expect(result.formElements.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('extractHeadings', () => {
    test('finds heading elements', () => {
      const file = writeTempFile('headings.tsx', `
        <h1>Title</h1>
        <h2>Subtitle</h2>
        <h3>Section</h3>
      `);
      const result = analyzeFile(file);
      expect(result.headings.length).toBe(3);
      expect(result.headings[0].level).toBe(1);
      expect(result.headings[1].level).toBe(2);
      expect(result.headings[2].level).toBe(3);
    });
  });

  describe('extractEventHandlers', () => {
    test('finds React event handlers', () => {
      const file = writeTempFile('handlers.tsx', `
        <button onClick={handleClick} onKeyDown={handleKey}>
          <input onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} />
        </button>
      `);
      const result = analyzeFile(file);
      expect(result.eventHandlers.length).toBeGreaterThanOrEqual(3);
      expect(result.eventHandlers.some(h => /onClick/.test(h.handler))).toBe(true);
      expect(result.eventHandlers.some(h => /onKeyDown/.test(h.handler))).toBe(true);
    });
  });

  describe('tokenUsage', () => {
    test('calculates token percentage', () => {
      const file = writeTempFile('mixed.css', `
        .a { color: var(--text); background: var(--bg); border: 1px solid var(--border); }
        .b { color: #ff0000; margin: 16px; }
      `);
      const result = analyzeFile(file);
      expect(result.tokenUsage.tokenPercentage).toBeGreaterThan(0);
      expect(result.tokenUsage.tokenPercentage).toBeLessThan(100);
      expect(result.tokenUsage.tokenRefs.length).toBeGreaterThanOrEqual(1);
      expect(result.tokenUsage.hardcodedValues.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('aggregateAnalysis', () => {
    test('aggregates values across multiple files', () => {
      const file1 = writeTempFile('a.css', `
        .a { color: #333; border-radius: 4px; }
      `);
      const file2 = writeTempFile('b.css', `
        .b { color: #666; border-radius: 8px; }
      `);
      const analyses = [analyzeFile(file1), analyzeFile(file2)];
      const agg = aggregateAnalysis(analyses);

      expect(agg.uniqueColors.length).toBeGreaterThanOrEqual(2);
      expect(agg.uniqueBorderRadius.length).toBeGreaterThanOrEqual(2);
    });

    test('detects files with and without focus styles', () => {
      const withFocus = writeTempFile('focused.css', `
        .btn:focus { outline: 2px solid blue; }
      `);
      const withoutFocus = writeTempFile('unfocused.css', `
        .btn { background: red; }
      `);
      const analyses = [analyzeFile(withFocus), analyzeFile(withoutFocus)];
      const agg = aggregateAnalysis(analyses);

      expect(agg.filesWithFocusStyles.length).toBeGreaterThanOrEqual(1);
      expect(agg.filesWithoutFocusStyles.length).toBeGreaterThanOrEqual(1);
    });
  });
});
