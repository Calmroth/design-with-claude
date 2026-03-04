const path = require('path');
const fs = require('fs');
const { handler } = require('../../src/mcp/tools/review-design');

const TMP_DIR = path.join(__dirname, '..', '..', '__test_fixtures__', 'review');

beforeAll(() => {
  fs.mkdirSync(TMP_DIR, { recursive: true });
});

afterAll(() => {
  fs.rmSync(TMP_DIR, { recursive: true, force: true });
});

function writeTempFile(name, content) {
  const filePath = path.join(TMP_DIR, name);
  fs.writeFileSync(filePath, content);
  return filePath;
}

describe('review_design tool', () => {
  test('returns error for non-existent file', async () => {
    const result = await handler({ file_path: '/nonexistent/file.tsx' });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain('not found');
  });

  test('reviews a React component and returns findings', async () => {
    const file = writeTempFile('Button.tsx', `
      import React from 'react';

      export function Button({ children, onClick, disabled }) {
        return (
          <div
            onClick={onClick}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            style={{ color: '#ffffff', fontSize: '14px' }}
          >
            {children}
          </div>
        );
      }
    `);

    const result = await handler({ file_path: file });
    expect(result.isError).toBeUndefined();

    const text = result.content[0].text;
    expect(text).toContain('Design Review');
    // Should flag accessibility issues (using div with onClick instead of button)
    expect(text).toContain('Accessibility');
    // Should include agent attribution
    expect(text).toMatch(/Reviewed by:/);
  });

  test('reviews with project context', async () => {
    const file = writeTempFile('PatientCard.tsx', `
      import React from 'react';

      export function PatientCard({ name, age }) {
        return (
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold">{name}</h3>
            <p className="text-gray-500">Age: {age}</p>
          </div>
        );
      }
    `);

    const result = await handler({ file_path: file, context: 'healthcare patient portal' });
    const text = result.content[0].text;
    expect(text).toContain('Design Review');
  });

  test('detects missing focus styles', async () => {
    const file = writeTempFile('Link.tsx', `
      import React from 'react';

      export function Link({ href, children }) {
        return (
          <a href={href} className="text-blue-500 hover:text-blue-700 underline">
            {children}
          </a>
        );
      }
    `);

    const result = await handler({ file_path: file });
    const text = result.content[0].text;
    // Should note missing focus states
    expect(text).toContain('focus');
  });

  test('reviews a CSS file', async () => {
    const file = writeTempFile('styles.css', `
      .card {
        padding: 16px;
        margin: 24px;
        border-radius: 8px;
        background: #ffffff;
        color: #333333;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        transition: transform 200ms ease-out;
      }
      .card:hover {
        transform: translateY(-2px);
      }
    `);

    const result = await handler({ file_path: file });
    expect(result.isError).toBeUndefined();
    const text = result.content[0].text;
    expect(text).toContain('Design Review');
  });
});
