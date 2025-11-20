const chalk = require('chalk');
const LayoutGenerator = require('../generators/layouts/layout-generator');

async function generateLayout(layoutType, options = {}) {
    console.log(chalk.blue(`📐 Generating ${layoutType} layout...`));

    try {
        const projectPath = process.cwd();
        const generator = new LayoutGenerator(projectPath);

        // Load tokens if they exist
        const fs = require('fs-extra');
        const path = require('path');
        const tokensPath = path.join(projectPath, 'tokens', 'tokens.json');

        let tokens = {};
        if (await fs.pathExists(tokensPath)) {
            tokens = await fs.readJSON(tokensPath);
        }

        await generator.generate(layoutType, tokens, options);

        console.log(chalk.green('\n✨ Layout generated successfully!'));
        console.log(chalk.gray(`Check src/layouts/ for the generated files`));

    } catch (error) {
        console.error(chalk.red('Error generating layout:'), error.message);
        throw error;
    }
}

module.exports = { generateLayout };
