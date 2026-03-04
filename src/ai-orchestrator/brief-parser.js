/**
 * Brief Parser - Parses project descriptions to extract structured context.
 *
 * Uses keyword matching (no AI) to extract style, type, industry,
 * concerns, features, and audience from a free-form project description.
 *
 * @module brief-parser
 */

// ---------------------------------------------------------------------------
// Keyword Maps
// ---------------------------------------------------------------------------

/**
 * Style keywords map.
 * Maps style identifiers to arrays of trigger keywords/phrases.
 * @type {Record<string, string[]>}
 */
const STYLE_KEYWORDS = {
  modern: [
    'modern', 'contemporary', 'sleek', 'cutting-edge', 'fresh', 'innovative',
    'current', 'trendy', 'up-to-date', 'forward-thinking', 'next-gen',
  ],
  minimal: [
    'minimal', 'minimalist', 'clean', 'simple', 'stripped-down', 'bare',
    'uncluttered', 'understated', 'whitespace', 'less is more', 'restrained',
    'sparse', 'streamlined', 'distilled',
  ],
  playful: [
    'playful', 'fun', 'whimsical', 'colorful', 'vibrant', 'energetic',
    'lively', 'bright', 'cheerful', 'animated', 'bouncy', 'quirky',
    'creative', 'delightful', 'joyful',
  ],
  corporate: [
    'corporate', 'professional', 'business', 'enterprise', 'formal',
    'traditional', 'conservative', 'polished', 'established', 'institutional',
    'authoritative', 'trustworthy',
  ],
  medical: [
    'medical', 'healthcare', 'clinical', 'health', 'hospital', 'patient',
    'pharma', 'pharmaceutical', 'wellness', 'therapeutic', 'diagnostic',
  ],
  luxury: [
    'luxury', 'premium', 'elegant', 'sophisticated', 'high-end', 'exclusive',
    'refined', 'upscale', 'lavish', 'opulent', 'artisan', 'bespoke',
    'boutique', 'prestige', 'deluxe',
  ],
  brutalist: [
    'brutalist', 'raw', 'bold', 'stark', 'harsh', 'industrial',
    'exposed', 'unpolished', 'confrontational',
  ],
  retro: [
    'retro', 'vintage', 'nostalgic', 'classic', 'throwback', 'old-school',
    'legacy', 'heritage', 'timeless',
  ],
  futuristic: [
    'futuristic', 'sci-fi', 'cyber', 'neon', 'tech', 'digital',
    'holographic', 'space', 'glitch', 'matrix',
  ],
  organic: [
    'organic', 'natural', 'earthy', 'warm', 'soft', 'rounded', 'flowing',
    'botanical', 'handcrafted', 'artisanal', 'gentle',
  ],
  geometric: [
    'geometric', 'angular', 'structured', 'grid', 'precise', 'mathematical',
    'systematic', 'modular', 'architectural',
  ],
  editorial: [
    'editorial', 'magazine', 'publishing', 'typographic', 'content-first',
    'longform', 'narrative', 'story', 'journalistic',
  ],
};

/**
 * Project type keywords map.
 * @type {Record<string, string[]>}
 */
const TYPE_KEYWORDS = {
  saas: [
    'saas', 'software as a service', 'subscription', 'platform', 'tool',
    'service', 'cloud', 'multi-tenant', 'b2b tool', 'productivity',
  ],
  ecommerce: [
    'ecommerce', 'e-commerce', 'online store', 'shop', 'marketplace',
    'shopping', 'cart', 'checkout', 'product listing', 'catalog',
    'storefront', 'retail', 'buy', 'purchase', 'payment',
  ],
  dashboard: [
    'dashboard', 'admin', 'analytics', 'metrics', 'reporting', 'data visualization',
    'control panel', 'monitor', 'overview', 'insights', 'kpi',
  ],
  'mobile-app': [
    'mobile app', 'mobile application', 'ios app', 'android app',
    'native app', 'react native', 'flutter', 'mobile-first',
    'app store', 'smartphone', 'touch', 'gesture',
  ],
  landing: [
    'landing page', 'landing', 'hero', 'conversion', 'cta',
    'lead generation', 'signup page', 'one-page', 'single page',
    'marketing page', 'launch page', 'coming soon',
  ],
  portal: [
    'portal', 'self-service', 'customer portal', 'user portal',
    'account management', 'member area', 'client area',
    'intranet', 'extranet',
  ],
  blog: [
    'blog', 'content management', 'cms', 'articles', 'posts',
    'editorial', 'magazine', 'news', 'publication',
  ],
  documentation: [
    'documentation', 'docs', 'api docs', 'developer docs', 'knowledge base',
    'help center', 'wiki', 'reference', 'guide', 'manual', 'tutorial',
  ],
  social: [
    'social network', 'social media', 'community', 'forum', 'feed',
    'messaging', 'chat', 'profile', 'social platform', 'networking',
  ],
  booking: [
    'booking', 'reservation', 'scheduling', 'appointment', 'calendar',
    'availability', 'event', 'ticketing',
  ],
};

/**
 * Industry keywords map.
 * @type {Record<string, string[]>}
 */
const INDUSTRY_KEYWORDS = {
  healthcare: [
    'healthcare', 'health', 'medical', 'hospital', 'clinical', 'patient',
    'doctor', 'nurse', 'pharma', 'pharmaceutical', 'wellness', 'fitness',
    'therapy', 'telemedicine', 'telehealth', 'ehr', 'emr', 'hipaa',
    'diagnostic', 'lab', 'dental', 'mental health',
  ],
  finance: [
    'finance', 'financial', 'banking', 'bank', 'fintech', 'payment',
    'trading', 'investment', 'insurance', 'mortgage', 'loan', 'credit',
    'debit', 'wallet', 'crypto', 'blockchain', 'stock', 'portfolio',
    'accounting', 'invoicing', 'billing', 'tax',
  ],
  education: [
    'education', 'learning', 'school', 'university', 'student', 'teacher',
    'course', 'classroom', 'lms', 'e-learning', 'edtech', 'training',
    'curriculum', 'academic', 'grade', 'exam', 'quiz', 'tutorial',
    'tutoring', 'scholarship',
  ],
  retail: [
    'retail', 'store', 'merchandise', 'inventory', 'pos', 'point of sale',
    'supply chain', 'warehouse', 'fulfillment', 'shipping', 'delivery',
  ],
  technology: [
    'technology', 'tech', 'software', 'hardware', 'ai', 'machine learning',
    'data science', 'devops', 'developer', 'api', 'sdk', 'cloud computing',
    'cybersecurity', 'iot', 'startup',
  ],
  real_estate: [
    'real estate', 'property', 'listing', 'apartment', 'rental', 'housing',
    'mortgage', 'realtor', 'agent', 'home', 'commercial property',
  ],
  travel: [
    'travel', 'tourism', 'hotel', 'flight', 'airline', 'booking',
    'vacation', 'trip', 'destination', 'hospitality', 'restaurant',
    'resort', 'transportation',
  ],
  media: [
    'media', 'entertainment', 'streaming', 'video', 'music', 'podcast',
    'publishing', 'news', 'journalism', 'content creation', 'broadcast',
  ],
  food: [
    'food', 'restaurant', 'delivery', 'recipe', 'cooking', 'catering',
    'grocery', 'meal', 'nutrition', 'diet', 'menu', 'ordering',
  ],
  automotive: [
    'automotive', 'car', 'vehicle', 'auto', 'dealership', 'fleet',
    'ev', 'electric vehicle', 'driving', 'transportation',
  ],
  legal: [
    'legal', 'law', 'attorney', 'lawyer', 'court', 'compliance',
    'contract', 'litigation', 'regulatory',
  ],
  nonprofit: [
    'nonprofit', 'non-profit', 'charity', 'ngo', 'volunteer',
    'donation', 'cause', 'foundation', 'social impact',
  ],
  gaming: [
    'gaming', 'game', 'esports', 'play', 'player', 'level',
    'score', 'multiplayer', 'interactive entertainment',
  ],
};

/**
 * Design concern keywords.
 * @type {Record<string, string[]>}
 */
const CONCERN_KEYWORDS = {
  accessibility: [
    'accessibility', 'a11y', 'wcag', 'screen reader', 'assistive',
    'inclusive', 'ada', 'keyboard navigation', 'contrast', 'alt text',
    'aria', 'disability', 'impairment', 'accessible',
  ],
  'dark-mode': [
    'dark mode', 'dark theme', 'light mode', 'theme toggle', 'color scheme',
    'night mode', 'theming', 'dual theme', 'theme switching',
  ],
  performance: [
    'performance', 'speed', 'fast', 'optimize', 'lazy load', 'bundle size',
    'core web vitals', 'lcp', 'fid', 'cls', 'lighthouse', 'pagespeed',
    'caching', 'cdn', 'minify', 'code splitting',
  ],
  responsive: [
    'responsive', 'mobile', 'tablet', 'breakpoint', 'adaptive',
    'mobile-first', 'fluid', 'flexible', 'cross-device',
    'small screen', 'viewport', 'media query',
  ],
  internationalization: [
    'internationalization', 'i18n', 'localization', 'l10n', 'translation',
    'multi-language', 'rtl', 'right-to-left', 'multilingual',
    'locale', 'language support',
  ],
  animation: [
    'animation', 'motion', 'transition', 'micro-interaction',
    'scroll animation', 'parallax', 'gesture', 'kinetic',
    'lottie', 'framer motion', 'spring physics',
  ],
  'design-system': [
    'design system', 'component library', 'design tokens', 'style guide',
    'ui kit', 'pattern library', 'storybook', 'consistency',
    'reusable components', 'atomic design',
  ],
  security: [
    'security', 'authentication', 'authorization', 'oauth', 'sso',
    'encryption', 'privacy', 'gdpr', 'data protection', 'secure',
    'two-factor', '2fa', 'mfa',
  ],
  seo: [
    'seo', 'search engine', 'meta tags', 'structured data', 'schema',
    'sitemap', 'open graph', 'social sharing', 'indexing', 'crawl',
  ],
  realtime: [
    'realtime', 'real-time', 'live', 'websocket', 'streaming',
    'push notification', 'live update', 'collaborative', 'sync',
  ],
  offline: [
    'offline', 'pwa', 'progressive web app', 'service worker',
    'offline-first', 'cache', 'install', 'app-like',
  ],
};

/**
 * Feature/component detection keywords.
 * @type {Record<string, string[]>}
 */
const FEATURE_KEYWORDS = {
  authentication: [
    'login', 'signup', 'sign up', 'register', 'auth', 'password',
    'forgot password', 'reset password', 'sso', 'oauth', 'social login',
    'magic link', 'two-factor', 'onboarding',
  ],
  navigation: [
    'navigation', 'navbar', 'sidebar', 'header', 'footer', 'menu',
    'breadcrumb', 'tabs', 'pagination', 'drawer', 'hamburger',
  ],
  search: [
    'search', 'filter', 'sort', 'autocomplete', 'typeahead',
    'faceted search', 'search results', 'query',
  ],
  forms: [
    'form', 'input', 'textarea', 'select', 'dropdown', 'checkbox',
    'radio', 'validation', 'submit', 'file upload', 'date picker',
    'multi-step form', 'wizard',
  ],
  tables: [
    'table', 'data grid', 'data table', 'spreadsheet', 'column',
    'row', 'sortable', 'filterable', 'pagination', 'infinite scroll',
  ],
  modals: [
    'modal', 'dialog', 'popup', 'overlay', 'lightbox', 'drawer',
    'sheet', 'popover', 'confirm dialog',
  ],
  notifications: [
    'notification', 'toast', 'alert', 'banner', 'snackbar',
    'badge', 'indicator', 'announcement', 'message',
  ],
  media: [
    'image', 'gallery', 'carousel', 'slider', 'video', 'audio',
    'media player', 'thumbnail', 'lightbox', 'avatar',
  ],
  charts: [
    'chart', 'graph', 'visualization', 'pie chart', 'bar chart',
    'line chart', 'donut', 'sparkline', 'heatmap', 'map',
  ],
  settings: [
    'settings', 'preferences', 'configuration', 'profile',
    'account', 'billing', 'plan', 'subscription management',
  ],
  chat: [
    'chat', 'messaging', 'conversation', 'thread', 'comment',
    'reply', 'emoji', 'attachment', 'real-time chat',
  ],
  payments: [
    'payment', 'checkout', 'cart', 'pricing', 'subscription',
    'billing', 'invoice', 'stripe', 'credit card',
  ],
};

/**
 * Audience keywords map.
 * @type {Record<string, string[]>}
 */
const AUDIENCE_KEYWORDS = {
  consumer: [
    'consumer', 'user', 'customer', 'public', 'individual',
    'personal', 'b2c', 'end user', 'general audience', 'retail',
    'mainstream', 'everyday',
  ],
  enterprise: [
    'enterprise', 'b2b', 'business', 'corporate', 'organization',
    'team', 'company', 'workplace', 'professional', 'employee',
    'admin', 'manager', 'executive',
  ],
  developer: [
    'developer', 'engineer', 'programmer', 'coder', 'devops',
    'api', 'sdk', 'cli', 'technical', 'open source',
    'documentation', 'integration',
  ],
  medical: [
    'doctor', 'nurse', 'physician', 'clinician', 'patient',
    'healthcare professional', 'medical staff', 'therapist',
    'pharmacist', 'caregiver',
  ],
  student: [
    'student', 'learner', 'pupil', 'trainee', 'teacher',
    'instructor', 'educator', 'academic', 'researcher',
  ],
  elderly: [
    'elderly', 'senior', 'older adult', 'aging', 'retirement',
    'assisted', 'caregiver', 'large text', 'simplified',
  ],
  children: [
    'children', 'kids', 'child', 'young', 'teen', 'teenager',
    'youth', 'minor', 'juvenile', 'family',
  ],
  creative: [
    'designer', 'artist', 'creator', 'photographer', 'musician',
    'writer', 'filmmaker', 'creative professional', 'illustrator',
  ],
};

// ---------------------------------------------------------------------------
// Matching Utilities
// ---------------------------------------------------------------------------

/**
 * Find the best matching category from a keyword map.
 * Returns the category with the highest keyword match count.
 *
 * @param {string} text - Text to match against
 * @param {Record<string, string[]>} keywordMap - Category -> keywords mapping
 * @returns {{ match: string|null, score: number, matches: Record<string, number> }}
 */
function findBestMatch(text, keywordMap) {
  const lowerText = text.toLowerCase();
  const scores = {};

  for (const [category, keywords] of Object.entries(keywordMap)) {
    let score = 0;
    for (const keyword of keywords) {
      // Use word boundary-aware matching for single words, substring for phrases
      if (keyword.includes(' ')) {
        // Phrase matching
        if (lowerText.includes(keyword)) {
          score += 2; // Phrases are more specific, so weight higher
        }
      } else {
        // Word matching with word boundary
        const re = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (re.test(text)) {
          score += 1;
        }
      }
    }
    if (score > 0) {
      scores[category] = score;
    }
  }

  // Find the top match
  let bestMatch = null;
  let bestScore = 0;
  for (const [category, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestMatch = category;
      bestScore = score;
    }
  }

  return { match: bestMatch, score: bestScore, matches: scores };
}

/**
 * Find all matching categories above a minimum score threshold.
 * @param {string} text - Text to match against
 * @param {Record<string, string[]>} keywordMap - Category -> keywords mapping
 * @param {number} [minScore=1] - Minimum score to include
 * @returns {string[]} Matching categories sorted by score (descending)
 */
function findAllMatches(text, keywordMap, minScore) {
  const threshold = minScore || 1;
  const { matches } = findBestMatch(text, keywordMap);

  return Object.entries(matches)
    .filter(([, score]) => score >= threshold)
    .sort((a, b) => b[1] - a[1])
    .map(([category]) => category);
}

// ---------------------------------------------------------------------------
// Main Parser
// ---------------------------------------------------------------------------

/**
 * Parse a project description into structured context.
 *
 * Uses keyword matching (not AI) to extract:
 * - style: visual design style (modern, minimal, playful, corporate, etc.)
 * - type: project type (saas, ecommerce, dashboard, mobile-app, landing, portal, etc.)
 * - industry: target industry (healthcare, finance, education, retail, etc.)
 * - concerns: design concerns (accessibility, dark-mode, performance, responsive, etc.)
 * - features: detected component/feature mentions
 * - audience: target audience (consumer, enterprise, developer, medical, etc.)
 *
 * @param {string} description - Free-form project description text
 * @returns {{ style: string|null, type: string|null, industry: string|null, concerns: string[], features: string[], audience: string|null }}
 */
function parseBrief(description) {
  if (!description || typeof description !== 'string') {
    return {
      style: null,
      type: null,
      industry: null,
      concerns: [],
      features: [],
      audience: null,
    };
  }

  const text = description.trim();

  // Extract style
  const styleResult = findBestMatch(text, STYLE_KEYWORDS);

  // Extract project type
  const typeResult = findBestMatch(text, TYPE_KEYWORDS);

  // Extract industry
  const industryResult = findBestMatch(text, INDUSTRY_KEYWORDS);

  // Extract concerns (can have multiple)
  const concerns = findAllMatches(text, CONCERN_KEYWORDS);

  // Extract features (can have multiple)
  const features = findAllMatches(text, FEATURE_KEYWORDS);

  // Extract audience
  const audienceResult = findBestMatch(text, AUDIENCE_KEYWORDS);

  // Apply cross-referencing heuristics
  // If industry is healthcare and no style detected, default to medical
  let style = styleResult.match;
  if (!style && industryResult.match === 'healthcare') {
    style = 'medical';
  }

  // If audience is elderly and accessibility not in concerns, add it
  if (audienceResult.match === 'elderly' && !concerns.includes('accessibility')) {
    concerns.unshift('accessibility');
  }

  // If audience is children and no style, default to playful
  if (!style && audienceResult.match === 'children') {
    style = 'playful';
  }

  // If type is mobile-app and responsive not in concerns, add it
  if (typeResult.match === 'mobile-app' && !concerns.includes('responsive')) {
    concerns.push('responsive');
  }

  return {
    style: style || null,
    type: typeResult.match || null,
    industry: industryResult.match || null,
    concerns,
    features,
    audience: audienceResult.match || null,
  };
}

module.exports = {
  parseBrief,
  // Export keyword maps for extensibility
  STYLE_KEYWORDS,
  TYPE_KEYWORDS,
  INDUSTRY_KEYWORDS,
  CONCERN_KEYWORDS,
  FEATURE_KEYWORDS,
  AUDIENCE_KEYWORDS,
  // Export utilities for testing
  findBestMatch,
  findAllMatches,
};
