const chalk = require('chalk');

class ButtonGenerator {
    generate(tokens, options = {}) {
        const variants = options.variants || ['primary', 'secondary', 'ghost', 'outline'];
        const sizes = options.sizes || ['sm', 'md', 'lg'];

        console.log(chalk.gray(`  - Generating Button with ${variants.length} variants, ${sizes.length} sizes`));

        return {
            name: 'Button',
            component: this.generateReactComponent(),
            styles: this.generateStyles(tokens, variants, sizes),
            variants,
            sizes
        };
    }

    generateReactComponent() {
        return `import React from 'react';
import './Button.css';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  loading = false,
  icon = null,
  onClick,
  type = 'button',
  ...props 
}) => {
  return (
    <button
      className={\`btn btn-\${variant} btn-\${size} \${disabled ? 'btn-disabled' : ''} \${loading ? 'btn-loading' : ''}\`}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      {...props}
    >
      {loading && (
        <span className="btn-spinner">
          <svg className="spinner" viewBox="0 0 24 24">
            <circle className="spinner-circle" cx="12" cy="12" r="10" />
          </svg>
        </span>
      )}
      {icon && !loading && <span className="btn-icon">{icon}</span>}
      <span className="btn-content">{children}</span>
    </button>
  );
};`;
    }

    generateStyles(tokens, variants, sizes) {
        let css = `/* Button Base Styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  font-family: var(--font-body);
  font-weight: var(--font-medium);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  white-space: nowrap;
}

.btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

.btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.btn-loading {
  position: relative;
  color: transparent;
}

.btn-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.spinner {
  width: 1em;
  height: 1em;
  animation: spin 1s linear infinite;
}

.spinner-circle {
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-dasharray: 60;
  stroke-dashoffset: 15;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

`;

        // Generate variant styles
        css += `/* Button Variants */\n`;
        variants.forEach(variant => {
            css += this.getVariantStyles(variant, tokens);
        });

        // Generate size styles
        css += `\n/* Button Sizes */\n`;
        sizes.forEach(size => {
            css += this.getSizeStyles(size, tokens);
        });

        return css;
    }

    getVariantStyles(variant, tokens) {
        const styles = {
            primary: `
.btn-primary {
  background-color: var(--color-primary-500);
  color: var(--color-neutral-50);
  border-color: var(--color-primary-500);
}

.btn-primary:hover:not(.btn-disabled) {
  background-color: var(--color-primary-600);
  border-color: var(--color-primary-600);
}

.btn-primary:active:not(.btn-disabled) {
  background-color: var(--color-primary-700);
  border-color: var(--color-primary-700);
}
`,
            secondary: `
.btn-secondary {
  background-color: var(--color-secondary-500);
  color: var(--color-neutral-50);
  border-color: var(--color-secondary-500);
}

.btn-secondary:hover:not(.btn-disabled) {
  background-color: var(--color-secondary-600);
  border-color: var(--color-secondary-600);
}

.btn-secondary:active:not(.btn-disabled) {
  background-color: var(--color-secondary-700);
  border-color: var(--color-secondary-700);
}
`,
            ghost: `
.btn-ghost {
  background-color: transparent;
  color: var(--color-neutral-700);
  border-color: transparent;
}

.btn-ghost:hover:not(.btn-disabled) {
  background-color: var(--color-neutral-100);
}

.btn-ghost:active:not(.btn-disabled) {
  background-color: var(--color-neutral-200);
}
`,
            outline: `
.btn-outline {
  background-color: transparent;
  color: var(--color-primary-500);
  border-color: var(--color-primary-500);
}

.btn-outline:hover:not(.btn-disabled) {
  background-color: var(--color-primary-50);
}

.btn-outline:active:not(.btn-disabled) {
  background-color: var(--color-primary-100);
}
`
        };

        return styles[variant] || '';
    }

    getSizeStyles(size, tokens) {
        const styles = {
            sm: `
.btn-sm {
  padding: var(--spacing-1) var(--spacing-3);
  font-size: var(--text-sm);
  border-radius: var(--radius-md);
}
`,
            md: `
.btn-md {
  padding: var(--spacing-2) var(--spacing-4);
  font-size: var(--text-base);
  border-radius: var(--radius-md);
}
`,
            lg: `
.btn-lg {
  padding: var(--spacing-3) var(--spacing-6);
  font-size: var(--text-lg);
  border-radius: var(--radius-lg);
}
`,
            xl: `
.btn-xl {
  padding: var(--spacing-4) var(--spacing-8);
  font-size: var(--text-xl);
  border-radius: var(--radius-lg);
}
`
        };

        return styles[size] || '';
    }
}

module.exports = ButtonGenerator;
