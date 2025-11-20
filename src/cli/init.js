const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ConfigValidator = require('../utils/config-validator');

async function initProject(projectName = 'my-design-project', options = {}) {
  const projectPath = path.resolve(projectName);

  console.log(chalk.gray(`Creating project at: ${projectPath}`));

  try {
    // Create project structure
    await fs.ensureDir(projectPath);
    await fs.ensureDir(path.join(projectPath, '.design-project'));
    await fs.ensureDir(path.join(projectPath, '.design-project', 'templates'));
    await fs.ensureDir(path.join(projectPath, 'src', 'components'));
    await fs.ensureDir(path.join(projectPath, 'src', 'layouts'));
    await fs.ensureDir(path.join(projectPath, 'src', 'assets'));
    await fs.ensureDir(path.join(projectPath, 'tokens'));
    await fs.ensureDir(path.join(projectPath, 'exports', 'html'));
    await fs.ensureDir(path.join(projectPath, 'exports', 'react'));
    await fs.ensureDir(path.join(projectPath, 'exports', 'vue'));
    await fs.ensureDir(path.join(projectPath, 'exports', 'figma'));

    // Generate project configuration
    const initialConfig = {
      name: projectName,
      version: '1.0.0',
      framework: options.framework || 'react',
      styling: options.styling || 'css',
      typescript: options.typescript || false,
      tokens: {
        colorMode: 'hsl',
        spacing: '4px-base',
        typography: {
          scale: 'modular',
          baseSize: 16
        }
      },
      components: {
        prefix: '',
        typescript: options.typescript || false
      },
      export: {
        formats: ['html', options.framework || 'react'],
        figma: {
          enabled: false,
          token: null
        }
      },
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    // Validate configuration
    const validator = new ConfigValidator();
    const config = validator.validate(initialConfig);

    await fs.writeJSON(
      path.join(projectPath, '.design-project', 'config.json'),
      config,
      { spaces: 2 }
    );

    // Generate initial state file
    const state = {
      initialized: true,
      version: '1.0.0',
      tokens: {
        generated: false,
        lastGenerated: null
      },
      components: {
        generated: [],
        lastGenerated: null
      },
      layouts: {
        generated: [],
        lastGenerated: null
      },
      exports: {
        lastExported: {}
      }
    };

    await fs.writeJSON(
      path.join(projectPath, '.design-project', 'state.json'),
      state,
      { spaces: 2 }
    );

    // Generate README
    const TemplateEngine = require('../utils/template-engine');
    const templateEngine = new TemplateEngine();

    const readmeContent = await templateEngine.renderFile(
      path.join(__dirname, '../templates/readme.hbs'),
      {
        name: projectName,
        framework: config.framework,
        styling: config.styling,
        generatedDate: new Date().toLocaleDateString()
      }
    );

    await fs.writeFile(path.join(projectPath, 'README.md'), readmeContent);

    // Create gitignore
    const gitignore = `# Dependencies
node_modules/

# Environment files
.env
.env.local

# Build outputs
dist/
build/

# Design tool cache
.design-project/cache/

# Logs
*.log
`;

    await fs.writeFile(path.join(projectPath, '.gitignore'), gitignore);

    console.log(chalk.green('📁 Project structure created'));
    console.log(chalk.green('⚙️  Configuration files generated'));
    console.log(chalk.green('📝 README.md created'));

    console.log(chalk.blue('\nNext steps:'));
    console.log(chalk.gray(`  cd ${projectName}`));
    console.log(chalk.gray('  design-create from-brief "your design brief"'));

  } catch (error) {
    console.error(chalk.red('Error creating project:'), error);
    throw error;
  }
}

module.exports = { initProject };