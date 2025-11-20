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
    await tokenGenerator.generate(result.plan.theme);

    // 3. Generate Components
    const componentGenerator = new ComponentGenerator(projectPath);
    await componentGenerator.generate(result.plan.components);

    console.log(chalk.green('\n✨ Generation complete!'));
    console.log(chalk.gray('Run `npm start` to view your project (coming in Phase 3)'));

  } catch (error) {
    console.error(chalk.red('Error generating from brief:'), error);
    throw error;
  }
}

module.exports = { generateFromBrief };