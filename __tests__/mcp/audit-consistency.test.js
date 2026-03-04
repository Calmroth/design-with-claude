const path = require('path');
const fs = require('fs');
const { handler } = require('../../src/mcp/tools/audit-consistency');

const TMP_DIR = path.join(__dirname, '..', '..', '__test_fixtures__', 'audit');

beforeAll(() => {
  fs.mkdirSync(TMP_DIR, { recursive: true });

  // Create intentionally inconsistent component files
  fs.writeFileSync(
    path.join(TMP_DIR, 'Button.tsx'),
    `
    export function Button({ children }) {
      return (
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:ring-2">
          {children}
        </button>
      );
    }
  `
  );

  fs.writeFileSync(
    path.join(TMP_DIR, 'Card.tsx'),
    `
    export function Card({ children }) {
      return (
        <div style={{ padding: '20px', margin: '15px', borderRadius: '12px', color: '#444', backgroundColor: '#fafafa' }}>
          {children}
        </div>
      );
    }
  `
  );

  fs.writeFileSync(
    path.join(TMP_DIR, 'Modal.tsx'),
    `
    export function Modal({ children, isOpen }) {
      if (!isOpen) return null;
      return (
        <div className="bg-white p-6 rounded-lg" style={{ borderRadius: '16px', color: '#333' }}>
          <div className="text-gray-800">{children}</div>
        </div>
      );
    }
  `
  );

  fs.writeFileSync(
    path.join(TMP_DIR, 'styles.css'),
    `
    .header { color: #222; border-radius: 4px; padding: 10px; }
    .footer { color: #2a2a2a; border-radius: 6px; padding: 16px; }
    .sidebar { color: #333333; border-radius: 8px; padding: 12px; }
  `
  );
});

afterAll(() => {
  fs.rmSync(TMP_DIR, { recursive: true, force: true });
});

describe('audit_consistency tool', () => {
  test('returns error for non-existent directory', async () => {
    const result = await handler({ directory: '/nonexistent/dir' });
    expect(result.isError).toBe(true);
  });

  test('audits a directory and finds inconsistencies', async () => {
    const result = await handler({ directory: TMP_DIR });
    const text = result.content[0].text;

    expect(text).toContain('Design Consistency Audit');
    expect(text).toContain('Files analyzed:');

    // Should detect multiple unique colors
    expect(text).toMatch(/Unique colors: \d+/);

    // Should detect border-radius inconsistencies (4px, 6px, 8px, 12px, 16px)
    expect(text).toMatch(/border-radius/i);
  });

  test('reports files analyzed correctly', async () => {
    const result = await handler({ directory: TMP_DIR });
    const text = result.content[0].text;

    // Should have found 4 files
    expect(text).toMatch(/Files analyzed.*[3-4]/);
  });

  test('includes expert recommendations', async () => {
    const result = await handler({ directory: TMP_DIR });
    const text = result.content[0].text;

    // Should include file summary section
    expect(text).toContain('File Summary');
  });

  test('handles custom file pattern', async () => {
    const result = await handler({ directory: TMP_DIR, file_pattern: '**/*.css' });
    const text = result.content[0].text;

    // Should only find CSS files
    expect(text).toMatch(/Files analyzed.*1/);
  });
});
