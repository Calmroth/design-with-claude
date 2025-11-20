const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

class ComponentGenerator {
    constructor(projectPath) {
        this.projectPath = projectPath;
        this.componentsPath = path.join(projectPath, 'src', 'components');
    }

    async generate(components) {
        console.log(chalk.blue('🧩 Generating components...'));

        for (const componentName of components) {
            await this.generateComponent(componentName);
        }

        console.log(chalk.green(`✓ Generated ${components.length} components`));
    }

    async generateComponent(name) {
        const componentContent = this.getComponentTemplate(name);
        const filePath = path.join(this.componentsPath, `${name}.jsx`);

        await fs.writeFile(filePath, componentContent);
        console.log(chalk.gray(`  - Created ${name}.jsx`));
    }

    getComponentTemplate(name) {
        // Basic templates for demonstration
        const templates = {
            Button: `import React from 'react';
import './Button.css';

export const Button = ({ children, variant = 'primary', onClick }) => {
  return (
    <button className={\`btn btn-\${variant}\`} onClick={onClick}>
      {children}
    </button>
  );
};`,
            Card: `import React from 'react';

export const Card = ({ title, children }) => {
  return (
    <div className="card">
      {title && <h3 className="card-title">{title}</h3>}
      <div className="card-body">
        {children}
      </div>
    </div>
  );
};`,
            Hero: `import React from 'react';
import { Button } from './Button';

export const Hero = ({ title, subtitle, ctaText }) => {
  return (
    <section className="hero">
      <h1 className="hero-title">{title}</h1>
      <p className="hero-subtitle">{subtitle}</p>
      <Button>{ctaText}</Button>
    </section>
  );
};`
        };

        return templates[name] || `import React from 'react';

export const ${name} = () => {
  return (
    <div className="${name.toLowerCase()}">
      {/* ${name} component */}
      <h2>${name}</h2>
    </div>
  );
};`;
    }
}

module.exports = ComponentGenerator;
