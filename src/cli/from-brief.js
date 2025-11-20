const chalk = require('chalk');
const path = require('path');
const AIOrchestrator = require('../ai-orchestrator/orchestrator');
const TokenGenerator = require('../generators/token-generator');
const ComponentGenerator = require('../generators/component-generator');

async function generateFromBrief(brief, options = {}) {
  console.log(chalk.blue(`🚀 Starting generation from brief: "${brief}"`));

  try {
    const projectPath = process.cwd();

    // 1. Initialize Orchestrator
    const orchestrator = new AIOrchestrator();
    const result = await orchestrator.processBrief(brief);

    console.log(chalk.yellow('\n📋 Generation Plan:'));
    console.log(chalk.gray(JSON.stringify(result.plan, null, 2)));

    // 2. Generate Tokens
    const tokenGenerator = new TokenGenerator(projectPath);
    const tokens = await tokenGenerator.generate(result.plan.theme);

    // 3. Generate Components (with tokens)
    const componentGenerator = new ComponentGenerator(projectPath);
    await componentGenerator.generate(result.plan.components, tokens, options);

    console.log(chalk.green('\n✨ Generation complete!'));
    console.log(chalk.gray('Files generated:'));
    console.log(chalk.gray('  - tokens/tokens.json'));
    console.log(chalk.gray('  - tokens/variables.css'));
    console.log(chalk.gray(`  - ${result.plan.components.length} components in src/components/`));

  } catch (error) {
    console.error(chalk.red('Error generating from brief:'), error);
    throw error;
  }
}

module.exports = { generateFromBrief };