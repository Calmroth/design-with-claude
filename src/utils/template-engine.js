const fs = require('fs-extra');
const path = require('path');
const handlebars = require('handlebars');

class TemplateEngine {
    constructor() {
        this.handlebars = handlebars;
        this.registerHelpers();
    }

    registerHelpers() {
        this.handlebars.registerHelper('lowercase', (str) => str.toLowerCase());
        this.handlebars.registerHelper('uppercase', (str) => str.toUpperCase());
        this.handlebars.registerHelper('capitalize', (str) => {
            if (!str) return '';
            return str.charAt(0).toUpperCase() + str.slice(1);
        });
        this.handlebars.registerHelper('json', (context) => JSON.stringify(context, null, 2));
    }

    /**
     * Compile a template string
     * @param {string} templateString 
     * @returns {Function} Compiled template
     */
    compile(templateString) {
        return this.handlebars.compile(templateString);
    }

    /**
     * Render a template string with data
     * @param {string} templateString 
     * @param {Object} data 
     * @returns {string} Rendered content
     */
    render(templateString, data) {
        const template = this.compile(templateString);
        return template(data);
    }

    /**
     * Read a template file and render it
     * @param {string} templatePath - Absolute path to template file
     * @param {Object} data - Data to render
     * @returns {Promise<string>} Rendered content
     */
    async renderFile(templatePath, data) {
        try {
            const templateContent = await fs.readFile(templatePath, 'utf-8');
            return this.render(templateContent, data);
        } catch (error) {
            throw new Error(`Failed to render template at ${templatePath}: ${error.message}`);
        }
    }
}

module.exports = TemplateEngine;
