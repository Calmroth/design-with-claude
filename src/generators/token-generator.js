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
            spacing: this.generateSpacingTokens(),
            shadows: this.generateShadowTokens(),
            borderRadius: this.generateBorderRadiusTokens()
        };

        // Write JSON tokens
        await fs.writeJSON(path.join(this.tokensPath, 'tokens.json'), tokens, { spaces: 2 });

        // Write CSS variables
        const cssContent = this.generateCSS(tokens);
        await fs.writeFile(path.join(this.tokensPath, 'variables.css'), cssContent);

        console.log(chalk.green('✓ Design tokens generated'));
        console.log(chalk.gray(`  - Color scales: primary, secondary, neutral, semantic`));
        console.log(chalk.gray(`  - Typography: ${Object.keys(tokens.typography.fontSize).length} sizes`));
        console.log(chalk.gray(`  - Spacing: ${Object.keys(tokens.spacing).length} values`));
        console.log(chalk.gray(`  - Shadows: ${Object.keys(tokens.shadows).length} levels`));

        return tokens;
    }

    generateColorTokens(theme) {
        const primaryColor = theme.primaryColor || '#3B82F6';
        const mode = theme.mode || 'light';

        return {
            primary: this.generateColorScale(primaryColor),
            secondary: this.generateColorScale('#8B5CF6'),
            neutral: this.generateNeutralScale(mode),
            semantic: {
                success: this.generateColorScale('#22C55E'),
                warning: this.generateColorScale('#F59E0B'),
                error: this.generateColorScale('#EF4444'),
                info: this.generateColorScale('#3B82F6')
            },
            white: '#FFFFFF',
            black: '#000000'
        };
    }

    generateColorScale(baseColor) {
        // Generate a full 50-900 color scale from a base color
        // This is a simplified version - in production, use a color library like chroma-js
        return {
            50: this.lighten(baseColor, 0.95),
            100: this.lighten(baseColor, 0.9),
            200: this.lighten(baseColor, 0.75),
            300: this.lighten(baseColor, 0.6),
            400: this.lighten(baseColor, 0.3),
            500: baseColor,
            600: this.darken(baseColor, 0.2),
            700: this.darken(baseColor, 0.4),
            800: this.darken(baseColor, 0.6),
            900: this.darken(baseColor, 0.8)
        };
    }

    generateNeutralScale(mode) {
        if (mode === 'dark') {
            return {
                50: '#F9FAFB',
                100: '#F3F4F6',
                200: '#E5E7EB',
                300: '#D1D5DB',
                400: '#9CA3AF',
                500: '#6B7280',
                600: '#4B5563',
                700: '#374151',
                800: '#1F2937',
                900: '#111827'
            };
        }
        return {
            50: '#F9FAFB',
            100: '#F3F4F6',
            200: '#E5E7EB',
            300: '#D1D5DB',
            400: '#9CA3AF',
            500: '#6B7280',
            600: '#4B5563',
            700: '#374151',
            800: '#1F2937',
            900: '#111827'
        };
    }

    lighten(color, amount) {
        // Simple lighten function - mix with white
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        const newR = Math.round(r + (255 - r) * amount);
        const newG = Math.round(g + (255 - g) * amount);
        const newB = Math.round(b + (255 - b) * amount);

        return `#${this.toHex(newR)}${this.toHex(newG)}${this.toHex(newB)}`;
    }

    darken(color, amount) {
        // Simple darken function - mix with black
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        const newR = Math.round(r * (1 - amount));
        const newG = Math.round(g * (1 - amount));
        const newB = Math.round(b * (1 - amount));

        return `#${this.toHex(newR)}${this.toHex(newG)}${this.toHex(newB)}`;
    }

    toHex(n) {
        const hex = n.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }

    generateTypographyTokens(theme) {
        const [heading, body] = (theme.fontPairing || 'Inter/Roboto').split('/');
        return {
            fontFamily: {
                heading: `"${heading}", sans-serif`,
                body: `"${body}", sans-serif`,
                mono: '"JetBrains Mono", "Courier New", monospace'
            },
            fontSize: {
                xs: { size: '0.75rem', lineHeight: '1rem' },
                sm: { size: '0.875rem', lineHeight: '1.25rem' },
                base: { size: '1rem', lineHeight: '1.5rem' },
                lg: { size: '1.125rem', lineHeight: '1.75rem' },
                xl: { size: '1.25rem', lineHeight: '1.75rem' },
                '2xl': { size: '1.5rem', lineHeight: '2rem' },
                '3xl': { size: '1.875rem', lineHeight: '2.25rem' },
                '4xl': { size: '2.25rem', lineHeight: '2.5rem' },
                '5xl': { size: '3rem', lineHeight: '1' },
                '6xl': { size: '3.75rem', lineHeight: '1' }
            },
            fontWeight: {
                thin: 100,
                light: 300,
                normal: 400,
                medium: 500,
                semibold: 600,
                bold: 700,
                extrabold: 800,
                black: 900
            },
            letterSpacing: {
                tighter: '-0.05em',
                tight: '-0.025em',
                normal: '0em',
                wide: '0.025em',
                wider: '0.05em',
                widest: '0.1em'
            }
        };
    }

    generateSpacingTokens() {
        return {
            0: '0',
            1: '0.25rem',   // 4px
            2: '0.5rem',    // 8px
            3: '0.75rem',   // 12px
            4: '1rem',      // 16px
            5: '1.25rem',   // 20px
            6: '1.5rem',    // 24px
            8: '2rem',      // 32px
            10: '2.5rem',   // 40px
            12: '3rem',     // 48px
            16: '4rem',     // 64px
            20: '5rem',     // 80px
            24: '6rem',     // 96px
            32: '8rem',     // 128px
            40: '10rem',    // 160px
            48: '12rem',    // 192px
            56: '14rem',    // 224px
            64: '16rem'     // 256px
        };
    }

    generateShadowTokens() {
        return {
            none: 'none',
            sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
        };
    }

    generateBorderRadiusTokens() {
        return {
            none: '0',
            sm: '0.125rem',
            base: '0.25rem',
            md: '0.375rem',
            lg: '0.5rem',
            xl: '0.75rem',
            '2xl': '1rem',
            '3xl': '1.5rem',
            full: '9999px'
        };
    }

    generateCSS(tokens) {
        let css = ':root {\n';

        // Colors - Primary
        css += '  /* Primary Colors */\n';
        Object.entries(tokens.colors.primary).forEach(([key, value]) => {
            css += `  --color-primary-${key}: ${value};\n`;
        });

        // Colors - Secondary
        css += '\n  /* Secondary Colors */\n';
        Object.entries(tokens.colors.secondary).forEach(([key, value]) => {
            css += `  --color-secondary-${key}: ${value};\n`;
        });

        // Colors - Neutral
        css += '\n  /* Neutral Colors */\n';
        Object.entries(tokens.colors.neutral).forEach(([key, value]) => {
            css += `  --color-neutral-${key}: ${value};\n`;
        });

        // Colors - Semantic
        css += '\n  /* Semantic Colors */\n';
        ['success', 'warning', 'error', 'info'].forEach(semantic => {
            Object.entries(tokens.colors.semantic[semantic]).forEach(([key, value]) => {
                css += `  --color-${semantic}-${key}: ${value};\n`;
            });
        });

        // Typography
        css += '\n  /* Typography - Font Families */\n';
        Object.entries(tokens.typography.fontFamily).forEach(([key, value]) => {
            css += `  --font-${key}: ${value};\n`;
        });

        css += '\n  /* Typography - Font Sizes */\n';
        Object.entries(tokens.typography.fontSize).forEach(([key, value]) => {
            css += `  --text-${key}: ${value.size};\n`;
            css += `  --text-${key}-line-height: ${value.lineHeight};\n`;
        });

        css += '\n  /* Typography - Font Weights */\n';
        Object.entries(tokens.typography.fontWeight).forEach(([key, value]) => {
            css += `  --font-${key}: ${value};\n`;
        });

        // Spacing
        css += '\n  /* Spacing */\n';
        Object.entries(tokens.spacing).forEach(([key, value]) => {
            css += `  --spacing-${key}: ${value};\n`;
        });

        // Shadows
        css += '\n  /* Shadows */\n';
        Object.entries(tokens.shadows).forEach(([key, value]) => {
            css += `  --shadow-${key}: ${value};\n`;
        });

        // Border Radius
        css += '\n  /* Border Radius */\n';
        Object.entries(tokens.borderRadius).forEach(([key, value]) => {
            css += `  --radius-${key}: ${value};\n`;
        });

        css += '}\n';
        return css;
    }
}

module.exports = TokenGenerator;
