const chalk = require('chalk');

class BriefParser {
  constructor() {
    this.keywords = {
      style: ['modern', 'minimal', 'clean', 'brutalist', 'corporate', 'playful', 'dark', 'light'],
      type: ['landing', 'dashboard', 'ecommerce', 'blog', 'portfolio', 'marketing'],
      industry: ['saas', 'fintech', 'health', 'education', 'crypto', 'fashion', 'food']
    };
  }

  /**
   * Parse a natural language brief into structured data
   * @param {string} brief - The user's design brief
   * @returns {Object} Structured brief data
   */
  parse(brief) {
    console.log(chalk.blue('🧠 Parsing brief...'));
    
    const normalizedBrief = brief.toLowerCase();
    
    const result = {
      originalBrief: brief,
      style: this.extractKeyword(normalizedBrief, 'style') || 'modern', // Default to modern
      type: this.extractKeyword(normalizedBrief, 'type') || 'landing', // Default to landing page
      industry: this.extractKeyword(normalizedBrief, 'industry') || 'general',
      features: this.extractFeatures(normalizedBrief),
      complexity: this.calculateComplexity(normalizedBrief)
    };

    console.log(chalk.green('✓ Brief parsed successfully'));
    return result;
  }

  extractKeyword(text, category) {
    return this.keywords[category].find(keyword => text.includes(keyword));
  }

  extractFeatures(text) {
    const commonFeatures = ['hero', 'pricing', 'testimonials', 'contact', 'footer', 'nav', 'gallery', 'features'];
    return commonFeatures.filter(feature => text.includes(feature));
  }

  calculateComplexity(text) {
    if (text.length > 200 || text.includes('complex') || text.includes('platform')) return 'high';
    if (text.length > 100 || text.includes('dashboard')) return 'medium';
    return 'low';
  }
}

module.exports = BriefParser;
