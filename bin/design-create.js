#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const program = new Command();

const ErrorHandler = require('../src/utils/error-handler');

program
  .name('design-create')
  .description('AI-powered design implementation tool that generates actual code, components, and Figma files from design briefs')
  .version('1.0.0');

// Init command
program
  .command('init')
  .description('Initialize a new design project')
  .argument('[project-name]', 'name of the project', 'my-design-project')
  .option('-f, --framework <framework>', 'target framework (html, react, vue)', 'react')
  .option('-s, --styling <styling>', 'styling approach (css, scss, tailwind)', 'css')
  .option('--typescript', 'enable typescript support', false)
  .action(async (projectName, options) => {
    try {
      console.log(chalk.blue('🎨 Initializing design project...'));
      const { initProject } = require('../src/cli/init');
      await initProject(projectName, options);
      console.log(chalk.green(`✅ Project "${projectName}" initialized successfully!`));
    } catch (error) {
      ErrorHandler.handle(error);
    }
  });

// From-brief command
program
  .command('from-brief')
  .description('Generate design from a brief description')
  .argument('<brief>', 'design brief or description')
  .option('-o, --output <path>', 'output directory', '.')
  .option('-f, --framework <framework>', 'target framework (html, react, vue)', 'react')
  .action(async (brief, options) => {
    try {
      console.log(chalk.blue('🤖 Generating design from brief...'));
      console.log(chalk.yellow(`Brief: "${brief}"`));
      const { generateFromBrief } = require('../src/cli/from-brief');
      await generateFromBrief(brief, options);
      console.log(chalk.green('✅ Design generated successfully!'));
    } catch (error) {
      console.error(chalk.red('❌ Error generating from brief:'), error.message);
      process.exit(1);
    }
  });

// Component command
program
  .command('component')
  .description('Generate a specific component')
  .argument('<name>', 'component name')
  .option('-t, --type <type>', 'component type (button, input, card, etc.)')
  .option('-v, --variants <variants>', 'component variants (comma-separated)')
  .option('-f, --framework <framework>', 'target framework (html, react, vue)', 'react')
  .action(async (name, options) => {
    try {
      console.log(chalk.blue(`🧩 Generating ${name} component...`));
      const { generateComponent } = require('../src/cli/component');
      await generateComponent(name, options);
      console.log(chalk.green(`✅ Component "${name}" generated successfully!`));
    } catch (error) {
      console.error(chalk.red('❌ Error generating component:'), error.message);
      process.exit(1);
    }
  });

// Export command
program
  .command('export')
  .description('Export project to different formats')
  .argument('<format>', 'export format (html, react, vue, figma)')
  .option('-o, --output <path>', 'output directory', './exports')
  .option('--figma-token <token>', 'Figma API token (required for figma export)')
  .action(async (format, options) => {
    try {
      console.log(chalk.blue(`📦 Exporting to ${format}...`));
      const { exportProject } = require('../src/cli/export');
      await exportProject(format, options);
      console.log(chalk.green(`✅ Exported to ${format} successfully!`));
    } catch (error) {
      console.error(chalk.red('❌ Error exporting project:'), error.message);
      process.exit(1);
    }
  });

// Tokens command
program
  .command('tokens')
  .description('Generate design tokens')
  .option('-s, --style <style>', 'design style (modern-minimal, classic, bold)', 'modern-minimal')
  .option('-c, --colors <colors>', 'color palette preference')
  .option('-o, --output <path>', 'output directory', './tokens')
  .action(async (options) => {
    try {
      console.log(chalk.blue('🎨 Generating design tokens...'));
      const { generateTokens } = require('../src/cli/tokens');
      await generateTokens(options);
      console.log(chalk.green('✅ Design tokens generated successfully!'));
    } catch (error) {
      console.error(chalk.red('❌ Error generating tokens:'), error.message);
      process.exit(1);
    }
  });

// Layout command
program
  .command('layout')
  .description('Generate a layout (landing-page, dashboard, documentation)')
  .argument('<type>', 'layout type')
  .option('-s, --sections <sections>', 'sections to include (comma-separated)')
  .option('--sidebar', 'include sidebar (for dashboard)', true)
  .action(async (type, options) => {
    try {
      console.log(chalk.blue(`📐 Generating ${type} layout...`));
      const { generateLayout } = require('../src/cli/layout');
      await generateLayout(type, options);
      console.log(chalk.green(`✅ Layout "${type}" generated successfully!`));
    } catch (error) {
      console.error(chalk.red('❌ Error generating layout:'), error.message);
      process.exit(1);
    }
  });

// Generate command (for icons and placeholders)
program
  .command('generate')
  .description('Generate assets (icons, placeholders)')
  .argument('<type>', 'asset type (icons, placeholders)')
  .option('--set <set>', 'icon set (basic, social)', 'basic')
  .option('--type <type>', 'placeholder type (image, avatar, logo, all)', 'all')
  .option('--sizes <sizes>', 'sizes to generate (comma-separated)', 'sm,md,lg')
  .action(async (type, options) => {
    try {
      console.log(chalk.blue(`🎨 Generating ${type}...`));
      const { generateAssets } = require('../src/cli/generate');
      await generateAssets(type, options);
      console.log(chalk.green(`✅ ${type} generated successfully!`));
    } catch (error) {
      console.error(chalk.red(`❌ Error generating ${type}:`), error.message);
      process.exit(1);
    }
  });

// Global error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error(chalk.red('❌ Unhandled Rejection at:'), promise, chalk.red('reason:'), reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error(chalk.red('❌ Uncaught Exception:'), error);
  process.exit(1);
});

// Parse command line arguments
program.parse();

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}