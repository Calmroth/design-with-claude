const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

class PlaceholderGenerator {
    constructor(projectPath) {
        this.projectPath = projectPath;
        this.placeholdersPath = path.join(projectPath, 'src', 'assets', 'placeholders');
    }

    async generate(type = 'all', options = {}) {
        console.log(chalk.blue(`🖼️  Generating ${type} placeholders...`));

        await fs.ensureDir(this.placeholdersPath);

        const sizes = options.sizes || ['sm', 'md', 'lg'];
        const generatedPlaceholders = [];

        if (type === 'all' || type === 'image') {
            for (const size of sizes) {
                const placeholder = this.generateImagePlaceholder(size);
                const filePath = path.join(this.placeholdersPath, `image-${size}.svg`);
                await fs.writeFile(filePath, placeholder.svg);
                generatedPlaceholders.push(`image-${size}`);
            }
        }

        if (type === 'all' || type === 'avatar') {
            for (const size of sizes) {
                const placeholder = this.generateAvatarPlaceholder(size);
                const filePath = path.join(this.placeholdersPath, `avatar-${size}.svg`);
                await fs.writeFile(filePath, placeholder.svg);
                generatedPlaceholders.push(`avatar-${size}`);
            }
        }

        if (type === 'all' || type === 'logo') {
            const placeholder = this.generateLogoPlaceholder();
            const filePath = path.join(this.placeholdersPath, 'logo.svg');
            await fs.writeFile(filePath, placeholder.svg);
            generatedPlaceholders.push('logo');
        }

        // Generate React placeholder components
        const placeholderComponents = this.generateReactComponents();
        const componentsPath = path.join(this.placeholdersPath, 'Placeholders.jsx');
        await fs.writeFile(componentsPath, placeholderComponents);

        console.log(chalk.green(`✓ Generated ${generatedPlaceholders.length} placeholders`));
        console.log(chalk.gray(`  - ${generatedPlaceholders.length} SVG files`));
        console.log(chalk.gray(`  - Placeholders.jsx (React components)`));

        return { placeholders: generatedPlaceholders, count: generatedPlaceholders.length };
    }

    generateImagePlaceholder(size) {
        const dimensions = this.getSizeDimensions(size);

        return {
            svg: `<svg width="${dimensions.width}" height="${dimensions.height}" viewBox="0 0 ${dimensions.width} ${dimensions.height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="${dimensions.width}" height="${dimensions.height}" fill="#E5E7EB"/>
  <path d="M${dimensions.width / 2 - 20} ${dimensions.height / 2 - 15}L${dimensions.width / 2 + 20} ${dimensions.height / 2 - 15}L${dimensions.width / 2 + 20} ${dimensions.height / 2 + 15}L${dimensions.width / 2 - 20} ${dimensions.height / 2 + 15}Z" fill="#9CA3AF"/>
  <circle cx="${dimensions.width / 2}" cy="${dimensions.height / 2 - 5}" r="5" fill="#6B7280"/>
  <path d="M${dimensions.width / 2 - 15} ${dimensions.height / 2 + 10}L${dimensions.width / 2 - 5} ${dimensions.height / 2}L${dimensions.width / 2 + 5} ${dimensions.height / 2 + 10}L${dimensions.width / 2 + 15} ${dimensions.height / 2 + 5}L${dimensions.width / 2 + 20} ${dimensions.height / 2 + 15}L${dimensions.width / 2 - 20} ${dimensions.height / 2 + 15}Z" fill="#6B7280"/>
</svg>`,
            width: dimensions.width,
            height: dimensions.height
        };
    }

    generateAvatarPlaceholder(size) {
        const dimensions = this.getAvatarDimensions(size);
        const radius = dimensions.size / 2;

        return {
            svg: `<svg width="${dimensions.size}" height="${dimensions.size}" viewBox="0 0 ${dimensions.size} ${dimensions.size}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="${radius}" cy="${radius}" r="${radius}" fill="#E5E7EB"/>
  <circle cx="${radius}" cy="${radius * 0.7}" r="${radius * 0.3}" fill="#9CA3AF"/>
  <path d="M${radius * 0.3} ${dimensions.size}Q${radius} ${radius * 1.5} ${radius * 1.7} ${dimensions.size}" fill="#9CA3AF"/>
</svg>`,
            size: dimensions.size
        };
    }

    generateLogoPlaceholder() {
        return {
            svg: `<svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="120" height="40" rx="4" fill="#3B82F6"/>
  <text x="60" y="25" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="white" text-anchor="middle">LOGO</text>
</svg>`
        };
    }

    getSizeDimensions(size) {
        const sizes = {
            sm: { width: 200, height: 150 },
            md: { width: 400, height: 300 },
            lg: { width: 800, height: 600 },
            xl: { width: 1200, height: 900 }
        };
        return sizes[size] || sizes.md;
    }

    getAvatarDimensions(size) {
        const sizes = {
            sm: { size: 40 },
            md: { size: 80 },
            lg: { size: 120 },
            xl: { size: 160 }
        };
        return sizes[size] || sizes.md;
    }

    generateReactComponents() {
        return `import React from 'react';

export const ImagePlaceholder = ({ size = 'md', className = '', ...props }) => {
  const dimensions = {
    sm: { width: 200, height: 150 },
    md: { width: 400, height: 300 },
    lg: { width: 800, height: 600 },
    xl: { width: 1200, height: 900 }
  };

  const { width, height } = dimensions[size] || dimensions.md;

  return (
    <svg 
      width={width} 
      height={height} 
      viewBox={\`0 0 \${width} \${height}\`} 
      fill="none" 
      className={className}
      {...props}
    >
      <rect width={width} height={height} fill="#E5E7EB"/>
      <path d={\`M\${width/2 - 20} \${height/2 - 15}L\${width/2 + 20} \${height/2 - 15}L\${width/2 + 20} \${height/2 + 15}L\${width/2 - 20} \${height/2 + 15}Z\`} fill="#9CA3AF"/>
      <circle cx={width/2} cy={height/2 - 5} r="5" fill="#6B7280"/>
      <path d={\`M\${width/2 - 15} \${height/2 + 10}L\${width/2 - 5} \${height/2}L\${width/2 + 5} \${height/2 + 10}L\${width/2 + 15} \${height/2 + 5}L\${width/2 + 20} \${height/2 + 15}L\${width/2 - 20} \${height/2 + 15}Z\`} fill="#6B7280"/>
    </svg>
  );
};

export const AvatarPlaceholder = ({ size = 'md', className = '', ...props }) => {
  const sizes = {
    sm: 40,
    md: 80,
    lg: 120,
    xl: 160
  };

  const avatarSize = sizes[size] || sizes.md;
  const radius = avatarSize / 2;

  return (
    <svg 
      width={avatarSize} 
      height={avatarSize} 
      viewBox={\`0 0 \${avatarSize} \${avatarSize}\`} 
      fill="none"
      className={className}
      {...props}
    >
      <circle cx={radius} cy={radius} r={radius} fill="#E5E7EB"/>
      <circle cx={radius} cy={radius * 0.7} r={radius * 0.3} fill="#9CA3AF"/>
      <path d={\`M\${radius * 0.3} \${avatarSize}Q\${radius} \${radius * 1.5} \${radius * 1.7} \${avatarSize}\`} fill="#9CA3AF"/>
    </svg>
  );
};

export const LogoPlaceholder = ({ className = '', ...props }) => {
  return (
    <svg 
      width="120" 
      height="40" 
      viewBox="0 0 120 40" 
      fill="none"
      className={className}
      {...props}
    >
      <rect width="120" height="40" rx="4" fill="#3B82F6"/>
      <text x="60" y="25" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="bold" fill="white" textAnchor="middle">LOGO</text>
    </svg>
  );
};

export const Placeholders = {
  Image: ImagePlaceholder,
  Avatar: AvatarPlaceholder,
  Logo: LogoPlaceholder
};`;
    }
}

module.exports = PlaceholderGenerator;
