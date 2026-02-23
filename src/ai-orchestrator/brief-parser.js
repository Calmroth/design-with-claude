const chalk = require('chalk');

class BriefParser {
  constructor() {
    this.keywords = {
      style: [
        'modern', 'minimal', 'clean', 'brutalist', 'corporate', 'playful',
        'dark', 'light', 'elegant', 'bold', 'retro', 'futuristic',
        'organic', 'geometric', 'flat', 'skeuomorphic', 'glassmorphism',
        'neumorphism', 'vibrant', 'muted', 'luxury', 'casual'
      ],
      type: [
        'landing', 'dashboard', 'ecommerce', 'blog', 'portfolio',
        'marketing', 'webapp', 'admin', 'saas', 'mobile', 'app',
        'website', 'platform', 'marketplace', 'social', 'cms'
      ],
      industry: [
        'saas', 'fintech', 'health', 'healthcare', 'education', 'crypto',
        'fashion', 'food', 'gaming', 'automotive', 'travel', 'media',
        'entertainment', 'real-estate', 'legal', 'insurance', 'retail',
        'logistics', 'manufacturing', 'government', 'nonprofit'
      ]
    };

    this.concernKeywords = [
      'accessible', 'accessibility', 'wcag', 'screen reader',
      'responsive', 'mobile-first', 'mobile first',
      'animation', 'animated', 'motion', 'transition', 'micro-interaction',
      'brand', 'branding', 'identity',
      'dark mode', 'dark-mode', 'theming',
      'design system', 'tokens', 'components',
      'performance', 'fast', 'lightweight',
      'seo', 'internationalization', 'i18n', 'rtl',
      'real-time', 'realtime', 'live',
      'data visualization', 'charts', 'graphs', 'analytics',
      'voice', 'gesture', 'touch',
      'ar', 'vr', 'immersive', '3d'
    ];
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
      style: this.extractKeyword(normalizedBrief, 'style') || 'modern',
      type: this.extractKeyword(normalizedBrief, 'type') || 'landing',
      industry: this.extractKeyword(normalizedBrief, 'industry') || 'general',
      features: this.extractFeatures(normalizedBrief),
      complexity: this.calculateComplexity(normalizedBrief),
      concerns: this.extractConcerns(normalizedBrief),
      briefWords: this.extractBriefWords(brief)
    };

    console.log(chalk.green('✓ Brief parsed successfully'));
    return result;
  }

  extractKeyword(text, category) {
    return this.keywords[category].find(keyword => text.includes(keyword));
  }

  extractFeatures(text) {
    const commonFeatures = [
      'hero', 'pricing', 'testimonials', 'contact', 'footer', 'nav',
      'gallery', 'features', 'sidebar', 'header', 'search', 'filter',
      'table', 'chart', 'form', 'modal', 'notification', 'profile',
      'settings', 'onboarding', 'checkout', 'cart', 'reviews'
    ];
    return commonFeatures.filter(feature => text.includes(feature));
  }

  /**
   * Extract concern keywords that inform agent selection.
   */
  extractConcerns(text) {
    return this.concernKeywords.filter(concern => text.includes(concern));
  }

  /**
   * Split brief into individual words for agent matching.
   */
  extractBriefWords(brief) {
    return [...new Set(
      brief.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length >= 3)
    )];
  }

  calculateComplexity(text) {
    if (text.length > 200 || text.includes('complex') || text.includes('platform')) return 'high';
    if (text.length > 100 || text.includes('dashboard')) return 'medium';
    return 'low';
  }
}

module.exports = BriefParser;
