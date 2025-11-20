const chalk = require('chalk');
const TokenGenerator = require('../generators/token-generator');

async function generateTokens(options = {}) {
  console.log(chalk.blue('🎨 Generating design tokens...'));

  try {
    const projectPath = process.cwd();
    const generator = new TokenGenerator(projectPath);

    // Default theme if not specified
    const theme = {
      mode: options.mode || 'light',
      primaryColor: options.primary || '#3B82F6',
      fontPairing: options.fonts || 'Inter/Roboto'
    };

    await generator.generate(theme);

  } catch (error) {
    console.error(chalk.red('Error generating tokens:'), error);
    throw error;
  }
}

module.exports = { generateTokens };