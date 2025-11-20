const chalk = require('chalk');

class NavigationGenerator {
    generate(tokens, options = {}) {
        const types = options.types || ['header', 'sidebar'];

        console.log(chalk.gray(`  - Generating Navigation components: ${types.join(', ')}`));

        return {
            name: 'NavigationComponents',
            components: {
                Header: this.generateHeaderComponent(),
                Sidebar: this.generateSidebarComponent(),
                Breadcrumb: this.generateBreadcrumbComponent()
            },
            styles: this.generateStyles(tokens),
            types
        };
    }

    generateHeaderComponent() {
        return `import React, { useState } from 'react';
import './Navigation.css';

export const Header = ({ 
  logo,
  navigation = [],
  cta,
  sticky = false
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className={\`header \${sticky ? 'header-sticky' : ''}\`}>
      <div className="header-container">
        <div className="header-logo">
          {logo}
        </div>

        {/* Desktop Navigation */}
        <nav className="header-nav">
          {navigation.map((item, index) => (
            <a 
              key={index} 
              href={item.href} 
              className="header-nav-link"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        {cta && (
          <div className="header-cta">
            {cta}
          </div>
        )}

        {/* Mobile Menu Toggle */}
        <button 
          className="header-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            {mobileMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="header-mobile-menu">
          {navigation.map((item, index) => (
            <a 
              key={index} 
              href={item.href} 
              className="header-mobile-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          {cta && (
            <div className="header-mobile-cta">
              {cta}
            </div>
          )}
        </div>
      )}
    </header>
  );
};`;
    }

    generateSidebarComponent() {
        return `import React, { useState } from 'react';
import './Navigation.css';

export const Sidebar = ({ 
  navigation = [],
  collapsed = false,
  onToggle
}) => {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);

  const handleToggle = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (onToggle) onToggle(newState);
  };

  return (
    <aside className={\`sidebar \${isCollapsed ? 'sidebar-collapsed' : ''}\`}>
      <button 
        className="sidebar-toggle"
        onClick={handleToggle}
        aria-label="Toggle sidebar"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d={isCollapsed ? "M9 18l6-6-6-6" : "M15 18l-6-6 6-6"} strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      <nav className="sidebar-nav">
        {navigation.map((item, index) => (
          <a 
            key={index} 
            href={item.href} 
            className={\`sidebar-link \${item.active ? 'sidebar-link-active' : ''}\`}
          >
            {item.icon && <span className="sidebar-icon">{item.icon}</span>}
            {!isCollapsed && <span className="sidebar-label">{item.label}</span>}
          </a>
        ))}
      </nav>
    </aside>
  );
};`;
    }

    generateBreadcrumbComponent() {
        return `import React from 'react';
import './Navigation.css';

export const Breadcrumb = ({ 
  items = [],
  separator = '/'
}) => {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {items.map((item, index) => (
          <li key={index} className="breadcrumb-item">
            {index < items.length - 1 ? (
              <>
                <a href={item.href} className="breadcrumb-link">
                  {item.label}
                </a>
                <span className="breadcrumb-separator">{separator}</span>
              </>
            ) : (
              <span className="breadcrumb-current">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};`;
    }

    generateStyles(tokens) {
        return `/* Header Styles */
.header {
  background-color: var(--color-neutral-50);
  border-bottom: 1px solid var(--color-neutral-200);
  padding: var(--spacing-4) 0;
}

.header-sticky {
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: var(--shadow-sm);
}

.header-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--spacing-4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-8);
}

.header-logo {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--color-neutral-900);
}

.header-nav {
  display: none;
  gap: var(--spacing-6);
}

@media (min-width: 768px) {
  .header-nav {
    display: flex;
  }
}

.header-nav-link {
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--color-neutral-700);
  text-decoration: none;
  transition: color 0.2s;
}

.header-nav-link:hover {
  color: var(--color-primary-500);
}

.header-cta {
  display: none;
}

@media (min-width: 768px) {
  .header-cta {
    display: block;
  }
}

.header-mobile-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2);
  background: none;
  border: none;
  color: var(--color-neutral-700);
  cursor: pointer;
}

@media (min-width: 768px) {
  .header-mobile-toggle {
    display: none;
  }
}

.header-mobile-menu {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  padding: var(--spacing-4);
  background-color: var(--color-neutral-50);
  border-top: 1px solid var(--color-neutral-200);
}

.header-mobile-link {
  padding: var(--spacing-3);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--color-neutral-700);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: background-color 0.2s;
}

.header-mobile-link:hover {
  background-color: var(--color-neutral-100);
}

.header-mobile-cta {
  margin-top: var(--spacing-2);
}

/* Sidebar Styles */
.sidebar {
  width: 256px;
  height: 100vh;
  background-color: var(--color-neutral-50);
  border-right: 1px solid var(--color-neutral-200);
  padding: var(--spacing-4);
  transition: width 0.3s ease;
  position: relative;
}

.sidebar-collapsed {
  width: 80px;
}

.sidebar-toggle {
  position: absolute;
  top: var(--spacing-4);
  right: var(--spacing-2);
  padding: var(--spacing-2);
  background: none;
  border: none;
  color: var(--color-neutral-600);
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: background-color 0.2s;
}

.sidebar-toggle:hover {
  background-color: var(--color-neutral-100);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  margin-top: var(--spacing-12);
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--color-neutral-700);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: all 0.2s;
  white-space: nowrap;
}

.sidebar-link:hover {
  background-color: var(--color-neutral-100);
  color: var(--color-primary-500);
}

.sidebar-link-active {
  background-color: var(--color-primary-50);
  color: var(--color-primary-600);
}

.sidebar-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
}

.sidebar-label {
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-collapsed .sidebar-label {
  display: none;
}

/* Breadcrumb Styles */
.breadcrumb {
  padding: var(--spacing-3) 0;
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  list-style: none;
  margin: 0;
  padding: 0;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.breadcrumb-link {
  font-size: var(--text-sm);
  color: var(--color-neutral-600);
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb-link:hover {
  color: var(--color-primary-500);
}

.breadcrumb-separator {
  color: var(--color-neutral-400);
  font-size: var(--text-sm);
}

.breadcrumb-current {
  font-size: var(--text-sm);
  color: var(--color-neutral-900);
  font-weight: var(--font-medium);
}`;
    }
}

module.exports = NavigationGenerator;
