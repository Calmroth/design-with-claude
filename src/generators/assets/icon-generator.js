const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

class IconGenerator {
    constructor(projectPath) {
        this.projectPath = projectPath;
        this.iconsPath = path.join(projectPath, 'src', 'assets', 'icons');
    }

    async generate(iconSet = 'basic', options = {}) {
        console.log(chalk.blue(`🎨 Generating ${iconSet} icon set...`));

        await fs.ensureDir(this.iconsPath);

        const icons = this.getIconSet(iconSet);
        const size = options.size || 24;
        const strokeWidth = options.strokeWidth || 2;

        const generatedIcons = [];

        for (const [iconName, iconPath] of Object.entries(icons)) {
            const svg = this.generateSVG(iconName, iconPath, size, strokeWidth);
            const filePath = path.join(this.iconsPath, `${iconName}.svg`);

            await fs.writeFile(filePath, svg);
            generatedIcons.push(iconName);
        }

        // Generate React icon components
        const iconComponents = this.generateReactIconComponents(icons, size, strokeWidth);
        const componentsPath = path.join(this.iconsPath, 'Icons.jsx');
        await fs.writeFile(componentsPath, iconComponents);

        console.log(chalk.green(`✓ Generated ${generatedIcons.length} icons`));
        console.log(chalk.gray(`  - ${generatedIcons.length} SVG files`));
        console.log(chalk.gray(`  - Icons.jsx (React components)`));

        return { icons: generatedIcons, count: generatedIcons.length };
    }

    getIconSet(setName) {
        const iconSets = {
            basic: {
                'chevron-right': 'M9 18l6-6-6-6',
                'chevron-left': 'M15 18l-6-6 6-6',
                'chevron-down': 'M6 9l6 6 6-6',
                'chevron-up': 'M18 15l-6-6-6 6',
                'check': 'M20 6L9 17l-5-5',
                'x': 'M18 6L6 18M6 6l12 12',
                'plus': 'M12 5v14M5 12h14',
                'minus': 'M5 12h14',
                'search': 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
                'menu': 'M4 6h16M4 12h16M4 18h16',
                'home': 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z',
                'user': 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z',
                'settings': 'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z',
                'mail': 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6',
                'bell': 'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0',
                'heart': 'M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z',
                'star': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
                'trash': 'M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2',
                'edit': 'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z',
                'download': 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3'
            },
            social: {
                'github': 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22',
                'twitter': 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z',
                'linkedin': 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z',
                'facebook': 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z'
            }
        };

        return iconSets[setName] || iconSets.basic;
    }

    generateSVG(name, pathData, size, strokeWidth) {
        return `<svg
  width="${size}"
  height="${size}"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="${strokeWidth}"
  stroke-linecap="round"
  stroke-linejoin="round"
  xmlns="http://www.w3.org/2000/svg"
>
  <path d="${pathData}" />
</svg>`;
    }

    generateReactIconComponents(icons, size, strokeWidth) {
        const iconComponents = Object.keys(icons).map(iconName => {
            const componentName = this.toPascalCase(iconName);
            const pathData = icons[iconName];

            return `export const ${componentName}Icon = ({ size = ${size}, color = "currentColor", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="${strokeWidth}"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="${pathData}" />
  </svg>
);`;
        }).join('\n\n');

        return `import React from 'react';

// Auto-generated icon components

${iconComponents}

// Export all icons as an object
export const Icons = {
${Object.keys(icons).map(iconName => `  ${this.toPascalCase(iconName)}: ${this.toPascalCase(iconName)}Icon`).join(',\n')}
};`;
    }

    toPascalCase(str) {
        return str
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join('');
    }
}

module.exports = IconGenerator;
