const TemplateEngine = require('../src/utils/template-engine');
const fs = require('fs-extra');
const path = require('path');

jest.mock('fs-extra');

describe('TemplateEngine', () => {
    let engine;

    beforeEach(() => {
        engine = new TemplateEngine();
        jest.clearAllMocks();
    });

    test('should compile and render a simple string', () => {
        const template = 'Hello {{name}}!';
        const result = engine.render(template, { name: 'World' });
        expect(result).toBe('Hello World!');
    });

    test('should use helpers correctly', () => {
        const template = '{{uppercase name}}';
        const result = engine.render(template, { name: 'world' });
        expect(result).toBe('WORLD');
    });

    test('should render a file', async () => {
        const mockTemplate = 'Title: {{title}}';
        fs.readFile.mockResolvedValue(mockTemplate);

        const result = await engine.renderFile('/path/to/template.hbs', { title: 'Test' });

        expect(fs.readFile).toHaveBeenCalledWith('/path/to/template.hbs', 'utf-8');
        expect(result).toBe('Title: Test');
    });

    test('should throw error if file read fails', async () => {
        fs.readFile.mockRejectedValue(new Error('File not found'));

        await expect(engine.renderFile('/invalid/path', {}))
            .rejects
            .toThrow('Failed to render template');
    });
});
