const { handler } = require('../../src/mcp/tools/get-component-spec');

describe('get_component_spec tool', () => {
  test('returns button spec', async () => {
    const result = await handler({ component_type: 'button' });
    const text = result.content[0].text;

    expect(text).toContain('Button');
    expect(text).toContain('Variants');
    expect(text).toContain('Primary');
    expect(text).toContain('States');
    expect(text).toContain('Hover');
    expect(text).toContain('Disabled');
    expect(text).toContain('Loading');
    expect(text).toContain('Accessibility');
    expect(text).toContain('aria-label');
    expect(text).toContain('Motion');
    expect(text).toContain('Responsive');
  });

  test('returns modal spec', async () => {
    const result = await handler({ component_type: 'modal' });
    const text = result.content[0].text;

    expect(text).toContain('Modal');
    expect(text).toContain('Focus trap');
    expect(text).toContain('Escape');
    expect(text).toContain('aria-modal');
  });

  test('returns form spec', async () => {
    const result = await handler({ component_type: 'form' });
    const text = result.content[0].text;

    expect(text).toContain('Form');
    expect(text).toContain('Validating');
    expect(text).toContain('label');
    expect(text).toContain('aria-invalid');
  });

  test('returns table spec', async () => {
    const result = await handler({ component_type: 'table' });
    const text = result.content[0].text;

    expect(text).toContain('Table');
    expect(text).toContain('Sorting');
    expect(text).toContain('aria-sort');
  });

  test('handles aliases (dialog → modal)', async () => {
    const result = await handler({ component_type: 'dialog' });
    const text = result.content[0].text;

    expect(text).toContain('Modal');
  });

  test('handles unknown component type', async () => {
    const result = await handler({ component_type: 'spaceship' });
    const text = result.content[0].text;

    expect(text).toContain('No built-in spec found');
    expect(text).toContain('Available types');
  });

  test('includes domain-specific recommendations with context', async () => {
    const result = await handler({
      component_type: 'form',
      context: 'healthcare patient intake',
    });
    const text = result.content[0].text;

    expect(text).toContain('Form');
    // With context, should include domain recommendations
    expect(text).toContain('Recommendations');
  });

  test('covers all registered component types', async () => {
    const types = ['button', 'modal', 'form', 'table', 'navigation', 'card', 'dropdown', 'toast', 'tabs', 'accordion', 'input', 'tooltip'];

    for (const type of types) {
      const result = await handler({ component_type: type });
      const text = result.content[0].text;
      expect(text).not.toContain('No built-in spec found');
    }
  });
});
