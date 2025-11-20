const chalk = require('chalk');
const IconGenerator = require('../generators/assets/icon-generator');
const PlaceholderGenerator = require('../generators/assets/placeholder-generator');

async function generateAssets(assetType, options = {}) {
    console.log(chalk.blue(`🎨 Generating ${assetType} assets...`));

    try {
        const projectPath = process.cwd();

        if (assetType === 'icons') {
            const iconGenerator = new IconGenerator(projectPath);
            const iconSet = options.set || 'basic';
            await iconGenerator.generate(iconSet, options);
        } else if (assetType === 'placeholders') {
            const placeholderGenerator = new PlaceholderGenerator(projectPath);
            const placeholderType = options.type || 'all';
            await placeholderGenerator.generate(placeholderType, options);
        } else {
            throw new Error(`Unknown asset type: ${assetType}`);
        }

        console.log(chalk.green('\n✨ Assets generated successfully!'));
        console.log(chalk.gray(`Check src/assets/ for the generated files`));

    } catch (error) {
        console.error(chalk.red('Error generating assets:'), error.message);
        throw error;
    }
}

module.exports = { generateAssets };
