const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

class TokenGenerator {
    constructor(projectPath) {
        this.projectPath = projectPath;
        this.tokensPath = path.join(projectPath, 'tokens');
    }

    async generate(theme) {
        console.log(chalk.blue('🎨 Generating design tokens...'));

        const tokens = {
            colors: this.generateColorTokens(theme),
            typography: this.generateTypographyTokens(theme),
            spacing: this.generateSpacingTokens()
        };

        // Write JSON tokens
        await fs.writeJSON(path.join(this.tokensPath, 'tokens.json'), tokens, { spaces: 2 });

        // Write CSS variables
        const cssContent = this.generateCSS(tokens);
        await fs.writeFile(path.join(this.tokensPath, 'variables.css'), cssContent);

        console.log(chalk.green('✓ Design tokens generated'));
        return tokens;
    }

    generateColorTokens(theme) {
        return {
            primary: theme.primaryColor,
            background: theme.mode === 'dark' ? '#1f2937' : '#ffffff',
            text: theme.mode === 'dark' ? '#f9fafb' : '#111827',
            secondary: '#9ca3af',
            accent: '#f59e0b'
        };
    }

    generateTypographyTokens(theme) {
        const [heading, body] = theme.fontPairing.split('/');
        return {
            fontFamily: {
                heading: `"${heading}", sans-serif`,
                body: `"${body}", sans-serif`
            },
            fontSize: {
                sm: '0.875rem',
                base: '1rem',
                lg: '1.125rem',
                xl: '1.25rem',
                '2xl': '1.5rem',
                '3xl': '1.875rem'
            }
        };
    }

    generateSpacingTokens() {
        return {
            4: '1rem',
            8: '2rem',
            12: '3rem',
            16: '4rem'
        };
    }

    generateCSS(tokens) {
        return `:root {
  /* Colors */
  --color-primary: ${tokens.colors.primary};
  --color-background: ${tokens.colors.background};
  --color-text: ${tokens.colors.text};
  --color-secondary: ${tokens.colors.secondary};
  --color-accent: ${tokens.colors.accent};

  /* Typography */
  --font-heading: ${tokens.typography.fontFamily.heading};
  --font-body: ${tokens.typography.fontFamily.body};
  
  /* Spacing */
  --spacing-4: ${tokens.spacing[4]};
  --spacing-8: ${tokens.spacing[8]};
  --spacing-12: ${tokens.spacing[12]};
  --spacing-16: ${tokens.spacing[16]};
}
`;
    }
}

module.exports = TokenGenerator;
