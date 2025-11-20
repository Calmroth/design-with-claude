const ConfigValidator = require('../src/utils/config-validator');

describe('Phase 1 Day 2: Enhanced Configuration', () => {
    const validator = new ConfigValidator();

    test('should validate a correct configuration', () => {
        const validConfig = {
            name: 'test-project',
            version: '1.0.0',
            framework: 'react',
            styling: 'css',
            typescript: false,
            tokens: {
                colorMode: 'hsl',
                spacing: '4px-base',
                typography: { scale: 'modular', baseSize: 16 }
            },
            components: { prefix: '', typescript: false },
            export: { formats: ['html', 'react'], figma: { enabled: false, token: null } },
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
        };

        const result = validator.validate(validConfig);
        expect(result).toEqual(validConfig);
    });

    test('should throw error for invalid framework', () => {
        const invalidConfig = {
            name: 'test-project',
            framework: 'angular' // Invalid
        };

        expect(() => validator.validate(invalidConfig)).toThrow('Invalid configuration');
    });

    test('should use default values', () => {
        const minimalConfig = {
            name: 'test-project'
        };

        const result = validator.validate(minimalConfig);
        expect(result.framework).toBe('react');
        expect(result.styling).toBe('css');
        expect(result.version).toBe('1.0.0');
    });
});
