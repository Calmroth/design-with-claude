const Joi = require('joi');
const chalk = require('chalk');

class ConfigValidator {
    constructor() {
        this.schema = Joi.object({
            name: Joi.string().required().min(1).max(100),
            version: Joi.string().pattern(/^\d+\.\d+\.\d+$/).default('1.0.0'),
            framework: Joi.string().valid('react', 'vue', 'html').default('react'),
            styling: Joi.string().valid('css', 'scss', 'tailwind').default('css'),
            typescript: Joi.boolean().default(false),
            tokens: Joi.object({
                colorMode: Joi.string().valid('hsl', 'rgb', 'hex').default('hsl'),
                spacing: Joi.string().default('4px-base'),
                typography: Joi.object({
                    scale: Joi.string().default('modular'),
                    baseSize: Joi.number().default(16)
                }).default()
            }).default(),
            components: Joi.object({
                prefix: Joi.string().allow('').default(''),
                typescript: Joi.boolean().default(false)
            }).default(),
            export: Joi.object({
                formats: Joi.array().items(Joi.string().valid('html', 'react', 'vue')).default(['html', 'react']),
                figma: Joi.object({
                    enabled: Joi.boolean().default(false),
                    token: Joi.string().allow(null).default(null)
                }).default()
            }).default(),
            createdAt: Joi.string().isoDate(),
            lastUpdated: Joi.string().isoDate()
        });
    }

    validate(config) {
        const { error, value } = this.schema.validate(config, { abortEarly: false, stripUnknown: true });

        if (error) {
            const errorMessages = error.details.map(detail => detail.message).join('\n');
            throw new Error(`Invalid configuration:\n${errorMessages}`);
        }

        return value;
    }
}

module.exports = ConfigValidator;
