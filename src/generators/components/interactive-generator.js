const chalk = require('chalk');

class InteractiveGenerator {
    generate(tokens, options = {}) {
        const types = options.types || ['modal', 'dropdown', 'tooltip', 'tabs'];

        console.log(chalk.gray(`  - Generating Interactive components: ${types.join(', ')}`));

        return {
            name: 'InteractiveComponents',
            components: {
                Modal: this.generateModalComponent(),
                Dropdown: this.generateDropdownComponent(),
                Tooltip: this.generateTooltipComponent(),
                Tabs: this.generateTabsComponent()
            },
            styles: this.generateStyles(tokens),
            types
        };
    }

    generateModalComponent() {
        return `import React, { useEffect } from 'react';
import './Interactive.css';

export const Modal = ({ 
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md'
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className={\`modal modal-\${size}\`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button 
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};`;
    }

    generateDropdownComponent() {
        return `import React, { useState, useRef, useEffect } from 'react';
import './Interactive.css';

export const Dropdown = ({ 
  trigger,
  items = [],
  align = 'left'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button 
        className="dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        {trigger}
      </button>
      {isOpen && (
        <div className={\`dropdown-menu dropdown-\${align}\`}>
          {items.map((item, index) => (
            <button
              key={index}
              className="dropdown-item"
              onClick={() => {
                if (item.onClick) item.onClick();
                setIsOpen(false);
              }}
            >
              {item.icon && <span className="dropdown-icon">{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};`;
    }

    generateTooltipComponent() {
        return `import React, { useState } from 'react';
import './Interactive.css';

export const Tooltip = ({ 
  children,
  content,
  position = 'top'
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="tooltip-wrapper"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={\`tooltip tooltip-\${position}\`}>
          {content}
        </div>
      )}
    </div>
  );
};`;
    }

    generateTabsComponent() {
        return `import React, { useState } from 'react';
import './Interactive.css';

export const Tabs = ({ 
  tabs = [],
  defaultTab = 0
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div className="tabs">
      <div className="tabs-header">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={\`tab-button \${activeTab === index ? 'tab-active' : ''}\`}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tabs-content">
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
};`;
    }

    generateStyles(tokens) {
        return `/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-4);
}

.modal {
  background-color: var(--color-neutral-50);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-2xl);
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-sm { width: 100%; max-width: 400px; }
.modal-md { width: 100%; max-width: 600px; }
.modal-lg { width: 100%; max-width: 800px; }
.modal-xl { width: 100%; max-width: 1200px; }

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-6);
  border-bottom: 1px solid var(--color-neutral-200);
}

.modal-title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--color-neutral-900);
  margin: 0;
}

.modal-close {
  padding: var(--spacing-2);
  background: none;
  border: none;
  color: var(--color-neutral-500);
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all 0.2s;
}

.modal-close:hover {
  background-color: var(--color-neutral-100);
  color: var(--color-neutral-700);
}

.modal-body {
  padding: var(--spacing-6);
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: var(--spacing-6);
  border-top: 1px solid var(--color-neutral-200);
  display: flex;
  gap: var(--spacing-3);
  justify-content: flex-end;
}

/* Dropdown Styles */
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-trigger {
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-2);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  margin-top: var(--spacing-2);
  background-color: var(--color-neutral-50);
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  min-width: 200px;
  z-index: 100;
  padding: var(--spacing-2);
}

.dropdown-left { left: 0; }
.dropdown-right { right: 0; }

.dropdown-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-3);
  font-size: var(--text-base);
  color: var(--color-neutral-700);
  background: none;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  text-align: left;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: var(--color-neutral-100);
}

.dropdown-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

/* Tooltip Styles */
.tooltip-wrapper {
  position: relative;
  display: inline-block;
}

.tooltip {
  position: absolute;
  background-color: var(--color-neutral-900);
  color: var(--color-neutral-50);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  white-space: nowrap;
  z-index: 100;
  pointer-events: none;
}

.tooltip-top {
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: var(--spacing-2);
}

.tooltip-bottom {
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: var(--spacing-2);
}

.tooltip-left {
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-right: var(--spacing-2);
}

.tooltip-right {
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: var(--spacing-2);
}

/* Tabs Styles */
.tabs {
  width: 100%;
}

.tabs-header {
  display: flex;
  gap: var(--spacing-1);
  border-bottom: 2px solid var(--color-neutral-200);
}

.tab-button {
  padding: var(--spacing-3) var(--spacing-4);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--color-neutral-600);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-button:hover {
  color: var(--color-neutral-900);
}

.tab-active {
  color: var(--color-primary-600);
  border-bottom-color: var(--color-primary-600);
}

.tabs-content {
  padding: var(--spacing-6) 0;
}`;
    }
}

module.exports = InteractiveGenerator;
