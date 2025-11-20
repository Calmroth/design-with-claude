const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

class LayoutGenerator {
    constructor(projectPath) {
        this.projectPath = projectPath;
        this.layoutsPath = path.join(projectPath, 'src', 'layouts');
    }

    async generate(layoutType, tokens = {}, options = {}) {
        console.log(chalk.blue(`📐 Generating ${layoutType} layout...`));

        await fs.ensureDir(this.layoutsPath);

        let layout;
        switch (layoutType.toLowerCase()) {
            case 'landing':
            case 'landing-page':
                layout = this.generateLandingPage(tokens, options);
                break;
            case 'dashboard':
                layout = this.generateDashboard(tokens, options);
                break;
            case 'docs':
            case 'documentation':
                layout = this.generateDocumentation(tokens, options);
                break;
            default:
                throw new Error(`Unknown layout type: ${layoutType}`);
        }

        // Write layout file
        const layoutPath = path.join(this.layoutsPath, `${layout.name}.jsx`);
        await fs.writeFile(layoutPath, layout.component);

        // Write layout styles
        const stylesPath = path.join(this.layoutsPath, `${layout.name}.css`);
        await fs.writeFile(stylesPath, layout.styles);

        console.log(chalk.green(`✓ Generated ${layout.name} layout`));
        console.log(chalk.gray(`  - ${layout.name}.jsx`));
        console.log(chalk.gray(`  - ${layout.name}.css`));

        return layout;
    }

    generateLandingPage(tokens, options) {
        const sections = options.sections || ['hero', 'features', 'pricing', 'cta'];

        return {
            name: 'LandingPage',
            component: `import React from 'react';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { FeatureSection } from '../components/FeatureSection';
import { Button } from '../components/Button';
import './LandingPage.css';

export const LandingPage = ({ 
  logo,
  navigation = [],
  heroTitle = "Welcome to Our Product",
  heroSubtitle = "The best solution for your needs",
  heroCta = "Get Started",
  features = [],
  pricingPlans = [],
  ctaTitle = "Ready to get started?",
  ctaButton = "Sign Up Now"
}) => {
  return (
    <div className="landing-page">
      {/* Header */}
      <Header 
        logo={logo}
        navigation={navigation}
        cta={<Button variant="primary">Sign Up</Button>}
        sticky={true}
      />

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="container">
          <Hero 
            title={heroTitle}
            subtitle={heroSubtitle}
            ctaText={heroCta}
          />
        </div>
      </section>

      {/* Features Section */}
      ${sections.includes('features') ? `<section className="landing-features">
        <div className="container">
          <h2 className="section-title">Features</h2>
          <FeatureSection features={features} />
        </div>
      </section>` : ''}

      {/* Pricing Section */}
      ${sections.includes('pricing') ? `<section className="landing-pricing">
        <div className="container">
          <h2 className="section-title">Pricing</h2>
          <div className="pricing-grid">
            {pricingPlans.map((plan, index) => (
              <div key={index} className="pricing-card">
                <h3>{plan.name}</h3>
                <div className="pricing-price">{plan.price}</div>
                <ul className="pricing-features">
                  {plan.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
                <Button variant={plan.featured ? 'primary' : 'outline'}>
                  {plan.cta || 'Choose Plan'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>` : ''}

      {/* CTA Section */}
      ${sections.includes('cta') ? `<section className="landing-cta">
        <div className="container">
          <h2>{ctaTitle}</h2>
          <Button variant="primary" size="lg">{ctaButton}</Button>
        </div>
      </section>` : ''}

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <p>&copy; 2025 Your Company. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};`,
            styles: `.landing-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--spacing-4);
}

/* Hero Section */
.landing-hero {
  padding: var(--spacing-24) 0;
  background: linear-gradient(135deg, var(--color-primary-50) 0%, var(--color-secondary-50) 100%);
}

/* Features Section */
.landing-features {
  padding: var(--spacing-24) 0;
  background-color: var(--color-neutral-50);
}

.section-title {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  text-align: center;
  margin-bottom: var(--spacing-12);
  color: var(--color-neutral-900);
}

/* Pricing Section */
.landing-pricing {
  padding: var(--spacing-24) 0;
  background-color: var(--color-neutral-100);
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-8);
  margin-top: var(--spacing-12);
}

.pricing-card {
  background-color: var(--color-neutral-50);
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-lg);
  padding: var(--spacing-8);
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
}

.pricing-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.pricing-price {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  color: var(--color-primary-600);
  margin: var(--spacing-4) 0;
}

.pricing-features {
  list-style: none;
  padding: 0;
  margin: var(--spacing-6) 0;
}

.pricing-features li {
  padding: var(--spacing-2) 0;
  color: var(--color-neutral-700);
}

/* CTA Section */
.landing-cta {
  padding: var(--spacing-24) 0;
  background: linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-secondary-600) 100%);
  color: var(--color-neutral-50);
  text-align: center;
}

.landing-cta h2 {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--spacing-6);
}

/* Footer */
.landing-footer {
  padding: var(--spacing-12) 0;
  background-color: var(--color-neutral-900);
  color: var(--color-neutral-400);
  text-align: center;
  margin-top: auto;
}`,
            sections
        };
    }

    generateDashboard(tokens, options) {
        const hasSidebar = options.sidebar !== false;

        return {
            name: 'Dashboard',
            component: `import React from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import './Dashboard.css';

export const Dashboard = ({ 
  logo,
  navigation = [],
  sidebarNavigation = [],
  children
}) => {
  return (
    <div className="dashboard">
      {/* Header */}
      <Header 
        logo={logo}
        navigation={navigation}
        sticky={true}
      />

      <div className="dashboard-container">
        ${hasSidebar ? `{/* Sidebar */}
        <Sidebar navigation={sidebarNavigation} />` : ''}

        {/* Main Content */}
        <main className="dashboard-main">
          <div className="dashboard-content">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};`,
            styles: `.dashboard {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-neutral-100);
}

.dashboard-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.dashboard-main {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-6);
}

.dashboard-content {
  max-width: 1400px;
  margin: 0 auto;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-main {
    padding: var(--spacing-4);
  }
}`,
            hasSidebar
        };
    }

    generateDocumentation(tokens, options) {
        return {
            name: 'Documentation',
            component: `import React from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Breadcrumb } from '../components/Breadcrumb';
import './Documentation.css';

export const Documentation = ({ 
  logo,
  navigation = [],
  sidebarNavigation = [],
  breadcrumbs = [],
  children,
  tableOfContents = []
}) => {
  return (
    <div className="documentation">
      {/* Header */}
      <Header 
        logo={logo}
        navigation={navigation}
        sticky={true}
      />

      <div className="docs-container">
        {/* Sidebar Navigation */}
        <Sidebar navigation={sidebarNavigation} />

        {/* Main Content */}
        <main className="docs-main">
          <Breadcrumb items={breadcrumbs} />
          
          <div className="docs-content">
            {children}
          </div>
        </main>

        {/* Table of Contents */}
        {tableOfContents.length > 0 && (
          <aside className="docs-toc">
            <h3>On This Page</h3>
            <ul>
              {tableOfContents.map((item, index) => (
                <li key={index}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>
    </div>
  );
};`,
            styles: `.documentation {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.docs-container {
  display: grid;
  grid-template-columns: 256px 1fr 200px;
  flex: 1;
  overflow: hidden;
}

.docs-main {
  overflow-y: auto;
  padding: var(--spacing-6);
}

.docs-content {
  max-width: 800px;
  margin: 0 auto;
}

.docs-toc {
  padding: var(--spacing-6);
  border-left: 1px solid var(--color-neutral-200);
  overflow-y: auto;
}

.docs-toc h3 {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-neutral-900);
  margin-bottom: var(--spacing-3);
  text-transform: uppercase;
  letter-spacing: var(--letter-spacing-wide);
}

.docs-toc ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.docs-toc li {
  margin-bottom: var(--spacing-2);
}

.docs-toc a {
  font-size: var(--text-sm);
  color: var(--color-neutral-600);
  text-decoration: none;
  transition: color 0.2s;
}

.docs-toc a:hover {
  color: var(--color-primary-600);
}

/* Responsive */
@media (max-width: 1024px) {
  .docs-container {
    grid-template-columns: 256px 1fr;
  }
  
  .docs-toc {
    display: none;
  }
}

@media (max-width: 768px) {
  .docs-container {
    grid-template-columns: 1fr;
  }
  
  .docs-main {
    padding: var(--spacing-4);
  }
}`
        };
    }
}

module.exports = LayoutGenerator;
