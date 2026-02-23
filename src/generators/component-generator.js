const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ButtonGenerator = require('./components/button-generator');
const FormGenerator = require('./components/form-generator');
const NavigationGenerator = require('./components/navigation-generator');
const InteractiveGenerator = require('./components/interactive-generator');

class ComponentGenerator {
  constructor(projectPath) {
    this.projectPath = projectPath;
    this.componentsPath = path.join(projectPath, 'src', 'components');

    // Initialize specialized generators
    this.buttonGenerator = new ButtonGenerator();
    this.formGenerator = new FormGenerator();
    this.navigationGenerator = new NavigationGenerator();
    this.interactiveGenerator = new InteractiveGenerator();
  }

  async generate(components, tokens = {}, options = {}) {
    console.log(chalk.blue('🧩 Generating components...'));

    const guidance = options.guidance || {};
    const generatedComponents = [];

    for (const componentName of components) {
      const component = await this.generateComponent(componentName, tokens, { ...options, guidance });
      if (component) {
        generatedComponents.push(component);
      }
    }

    console.log(chalk.green(`✓ Generated ${generatedComponents.length} components`));
    return generatedComponents;
  }

  async generateComponent(name, tokens, options) {
    const normalizedName = name.toLowerCase();

    // Route to specialized generators
    if (normalizedName === 'button') {
      return await this.generateFromSpecialized(
        this.buttonGenerator.generate(tokens, options),
        'Button'
      );
    }

    if (['input', 'select', 'checkbox', 'radio', 'textarea'].includes(normalizedName)) {
      return await this.generateFormComponents(tokens, options);
    }

    if (['header', 'sidebar', 'breadcrumb'].includes(normalizedName)) {
      return await this.generateNavigationComponents(tokens, options);
    }

    if (['modal', 'dropdown', 'tooltip', 'tabs'].includes(normalizedName)) {
      return await this.generateInteractiveComponents(tokens, options);
    }

    // Fallback to basic component generation
    return await this.generateBasicComponent(name);
  }

  async generateFromSpecialized(generatorResult, componentName) {
    // Write component file
    const componentPath = path.join(this.componentsPath, `${componentName}.jsx`);
    await fs.writeFile(componentPath, generatorResult.component);

    // Write styles file
    const stylesPath = path.join(this.componentsPath, `${componentName}.css`);
    await fs.writeFile(stylesPath, generatorResult.styles);

    console.log(chalk.gray(`  - Created ${componentName}.jsx and ${componentName}.css`));

    return generatorResult;
  }

  async generateFormComponents(tokens, options) {
    const result = this.formGenerator.generate(tokens, options);

    // Write all form components
    for (const [componentName, componentCode] of Object.entries(result.components)) {
      const componentPath = path.join(this.componentsPath, `${componentName}.jsx`);
      await fs.writeFile(componentPath, componentCode);
      console.log(chalk.gray(`  - Created ${componentName}.jsx`));
    }

    // Write shared styles
    const stylesPath = path.join(this.componentsPath, 'Form.css');
    await fs.writeFile(stylesPath, result.styles);
    console.log(chalk.gray(`  - Created Form.css`));

    return result;
  }

  async generateNavigationComponents(tokens, options) {
    const result = this.navigationGenerator.generate(tokens, options);

    // Write all navigation components
    for (const [componentName, componentCode] of Object.entries(result.components)) {
      const componentPath = path.join(this.componentsPath, `${componentName}.jsx`);
      await fs.writeFile(componentPath, componentCode);
      console.log(chalk.gray(`  - Created ${componentName}.jsx`));
    }

    // Write shared styles
    const stylesPath = path.join(this.componentsPath, 'Navigation.css');
    await fs.writeFile(stylesPath, result.styles);
    console.log(chalk.gray(`  - Created Navigation.css`));

    return result;
  }

  async generateInteractiveComponents(tokens, options) {
    const result = this.interactiveGenerator.generate(tokens, options);

    // Write all interactive components
    for (const [componentName, componentCode] of Object.entries(result.components)) {
      const componentPath = path.join(this.componentsPath, `${componentName}.jsx`);
      await fs.writeFile(componentPath, componentCode);
      console.log(chalk.gray(`  - Created ${componentName}.jsx`));
    }

    // Write shared styles
    const stylesPath = path.join(this.componentsPath, 'Interactive.css');
    await fs.writeFile(stylesPath, result.styles);
    console.log(chalk.gray(`  - Created Interactive.css`));

    return result;
  }

  async generateBasicComponent(name) {
    const componentContent = this.getBasicComponentTemplate(name);
    const filePath = path.join(this.componentsPath, `${name}.jsx`);

    await fs.writeFile(filePath, componentContent);
    console.log(chalk.gray(`  - Created ${name}.jsx`));

    return { name, component: componentContent };
  }

  getBasicComponentTemplate(name) {
    // Basic templates for common components
    const templates = {
      Card: `import React from 'react';

export const Card = ({ title, children, className = '' }) => {
  return (
    <div className={\`card \${className}\`}>
      {title && <h3 className="card-title">{title}</h3>}
      <div className="card-body">
        {children}
      </div>
    </div>
  );
};`,
      Hero: `import React from 'react';
import { Button } from './Button';

export const Hero = ({ title, subtitle, ctaText, onCtaClick }) => {
  return (
    <section className="hero">
      <h1 className="hero-title">{title}</h1>
      <p className="hero-subtitle">{subtitle}</p>
      {ctaText && <Button onClick={onCtaClick}>{ctaText}</Button>}
    </section>
  );
};`,
      FeatureSection: `import React from 'react';
import { Card } from './Card';

export const FeatureSection = ({ features = [] }) => {
  return (
    <section className="features">
      <div className="features-grid">
        {features.map((feature, index) => (
          <Card key={index} title={feature.title}>
            <p>{feature.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
};`
    };

    return templates[name] || `import React from 'react';

export const ${name} = ({ children, ...props }) => {
  return (
    <div className="${name.toLowerCase()}" {...props}>
      {children}
    </div>
  );
};`;
  }
}

module.exports = ComponentGenerator;
