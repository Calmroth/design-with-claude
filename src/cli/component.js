const chalk = require('chalk');
const ComponentGenerator = require('../generators/component-generator');

async function generateComponent(name, options = {}) {
  console.log(chalk.blue(`🧩 Generating component: ${name}`));

  try {
    const projectPath = process.cwd();
    const generator = new ComponentGenerator(projectPath);

    // Generate single component
    await generator.generate([name]);

  } catch (error) {
    console.error(chalk.red('Error generating component:'), error);
    throw error;
  }
}

module.exports = { generateComponent };