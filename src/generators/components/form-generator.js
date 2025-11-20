const chalk = require('chalk');

class FormGenerator {
    generate(tokens, options = {}) {
        const types = options.types || ['text', 'email', 'password', 'select', 'checkbox', 'radio', 'textarea'];

        console.log(chalk.gray(`  - Generating Form components: ${types.join(', ')}`));

        return {
            name: 'FormComponents',
            components: {
                Input: this.generateInputComponent(),
                Select: this.generateSelectComponent(),
                Checkbox: this.generateCheckboxComponent(),
                Radio: this.generateRadioComponent(),
                Textarea: this.generateTextareaComponent()
            },
            styles: this.generateStyles(tokens),
            types
        };
    }

    generateInputComponent() {
        return `import React from 'react';
import './Form.css';

export const Input = ({ 
  label,
  type = 'text',
  error,
  success,
  helperText,
  required = false,
  disabled = false,
  ...props 
}) => {
  const stateClass = error ? 'input-error' : success ? 'input-success' : '';
  
  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="form-required">*</span>}
        </label>
      )}
      <input
        type={type}
        className={\`form-input \${stateClass}\`}
        disabled={disabled}
        {...props}
      />
      {helperText && (
        <span className={\`form-helper \${stateClass}\`}>
          {helperText}
        </span>
      )}
      {error && <span className="form-error-text">{error}</span>}
    </div>
  );
};`;
    }

    generateSelectComponent() {
        return `import React from 'react';
import './Form.css';

export const Select = ({ 
  label,
  options = [],
  error,
  helperText,
  required = false,
  disabled = false,
  ...props 
}) => {
  const stateClass = error ? 'input-error' : '';
  
  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="form-required">*</span>}
        </label>
      )}
      <select
        className={\`form-select \${stateClass}\`}
        disabled={disabled}
        {...props}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {helperText && <span className="form-helper">{helperText}</span>}
      {error && <span className="form-error-text">{error}</span>}
    </div>
  );
};`;
    }

    generateCheckboxComponent() {
        return `import React from 'react';
import './Form.css';

export const Checkbox = ({ 
  label,
  error,
  disabled = false,
  ...props 
}) => {
  return (
    <div className="form-group">
      <label className="form-checkbox-label">
        <input
          type="checkbox"
          className="form-checkbox"
          disabled={disabled}
          {...props}
        />
        <span className="form-checkbox-text">{label}</span>
      </label>
      {error && <span className="form-error-text">{error}</span>}
    </div>
  );
};`;
    }

    generateRadioComponent() {
        return `import React from 'react';
import './Form.css';

export const Radio = ({ 
  label,
  name,
  options = [],
  error,
  disabled = false,
  ...props 
}) => {
  return (
    <div className="form-group">
      {label && <div className="form-label">{label}</div>}
      <div className="form-radio-group">
        {options.map((option, index) => (
          <label key={index} className="form-radio-label">
            <input
              type="radio"
              name={name}
              value={option.value}
              className="form-radio"
              disabled={disabled}
              {...props}
            />
            <span className="form-radio-text">{option.label}</span>
          </label>
        ))}
      </div>
      {error && <span className="form-error-text">{error}</span>}
    </div>
  );
};`;
    }

    generateTextareaComponent() {
        return `import React from 'react';
import './Form.css';

export const Textarea = ({ 
  label,
  error,
  helperText,
  required = false,
  disabled = false,
  rows = 4,
  ...props 
}) => {
  const stateClass = error ? 'input-error' : '';
  
  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="form-required">*</span>}
        </label>
      )}
      <textarea
        className={\`form-textarea \${stateClass}\`}
        disabled={disabled}
        rows={rows}
        {...props}
      />
      {helperText && <span className="form-helper">{helperText}</span>}
      {error && <span className="form-error-text">{error}</span>}
    </div>
  );
};`;
    }

    generateStyles(tokens) {
        return `/* Form Base Styles */
.form-group {
  margin-bottom: var(--spacing-4);
}

.form-label {
  display: block;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-neutral-700);
  margin-bottom: var(--spacing-2);
}

.form-required {
  color: var(--color-error-500);
  margin-left: var(--spacing-1);
}

.form-helper {
  display: block;
  font-size: var(--text-sm);
  color: var(--color-neutral-500);
  margin-top: var(--spacing-1);
}

.form-error-text {
  display: block;
  font-size: var(--text-sm);
  color: var(--color-error-500);
  margin-top: var(--spacing-1);
}

/* Input Styles */
.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: var(--spacing-2) var(--spacing-3);
  font-size: var(--text-base);
  font-family: var(--font-body);
  color: var(--color-neutral-900);
  background-color: var(--color-neutral-50);
  border: 1px solid var(--color-neutral-300);
  border-radius: var(--radius-md);
  transition: all 0.2s ease-in-out;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input:disabled,
.form-select:disabled,
.form-textarea:disabled {
  background-color: var(--color-neutral-100);
  cursor: not-allowed;
  opacity: 0.6;
}

/* Input States */
.form-input.input-error,
.form-select.input-error,
.form-textarea.input-error {
  border-color: var(--color-error-500);
}

.form-input.input-error:focus,
.form-select.input-error:focus,
.form-textarea.input-error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-input.input-success,
.form-textarea.input-success {
  border-color: var(--color-success-500);
}

.form-input.input-success:focus,
.form-textarea.input-success:focus {
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

/* Checkbox Styles */
.form-checkbox-label {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.form-checkbox {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: var(--spacing-2);
  cursor: pointer;
  accent-color: var(--color-primary-500);
}

.form-checkbox-text {
  font-size: var(--text-base);
  color: var(--color-neutral-700);
}

/* Radio Styles */
.form-radio-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.form-radio-label {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.form-radio {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: var(--spacing-2);
  cursor: pointer;
  accent-color: var(--color-primary-500);
}

.form-radio-text {
  font-size: var(--text-base);
  color: var(--color-neutral-700);
}

/* Textarea Specific */
.form-textarea {
  resize: vertical;
  min-height: 100px;
}`;
    }
}

module.exports = FormGenerator;
