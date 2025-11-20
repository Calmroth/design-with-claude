const chalk = require('chalk');
const BriefParser = require('./brief-parser');

class AIOrchestrator {
    constructor() {
        this.briefParser = new BriefParser();
        this.agents = {
            'web-designer': { role: 'primary', expertise: 'layout' },
            'ui-designer': { role: 'supporting', expertise: 'components' },
            'brand-strategist': { role: 'supporting', expertise: 'style' },
            'design-system-architect': { role: 'specialist', expertise: 'tokens' }
        };
    }

    /**
     * Process a design brief and return a generation plan
     * @param {string} brief - The user's design brief
     * @returns {Object} The generation plan
     */
    async processBrief(brief) {
        // 1. Parse the brief
        const parsedBrief = this.briefParser.parse(brief);

        // 2. Select agents
        const selectedAgents = this.selectAgents(parsedBrief);

        console.log(chalk.blue('🤖 AI Orchestrator: Agents selected'));
        selectedAgents.forEach(agent => console.log(chalk.gray(`  - ${agent}`)));

        // 3. Simulate agent consultation (returning structured plan)
        const plan = await this.consultAgents(selectedAgents, parsedBrief);

        return {
            brief: parsedBrief,
            agents: selectedAgents,
            plan: plan
        };
    }

    selectAgents(parsedBrief) {
        const agents = ['web-designer', 'ui-designer']; // Always needed

        if (parsedBrief.style) agents.push('brand-strategist');
        if (parsedBrief.complexity === 'high') agents.push('design-system-architect');

        return [...new Set(agents)];
    }

    async consultAgents(agents, brief) {
        console.log(chalk.blue('💬 Consulting agents...'));

        // Simulate AI processing delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Generate a plan based on the parsed brief
        return {
            theme: {
                mode: brief.style === 'dark' ? 'dark' : 'light',
                primaryColor: this.suggestColor(brief.industry),
                fontPairing: brief.style === 'modern' ? 'Inter/Roboto' : 'Playfair/Lato'
            },
            layout: {
                type: brief.type,
                sections: ['hero', ...brief.features, 'footer']
            },
            components: this.suggestComponents(brief)
        };
    }

    suggestColor(industry) {
        const colors = {
            saas: '#3B82F6', // Blue
            fintech: '#10B981', // Emerald
            health: '#EF4444', // Red
            crypto: '#8B5CF6', // Violet
            fashion: '#18181B', // Zinc-900
            food: '#F59E0B', // Amber
            general: '#6366F1' // Indigo
        };
        return colors[industry] || colors.general;
    }

    suggestComponents(brief) {
        const base = ['Button', 'Card', 'Input'];
        if (brief.type === 'landing') return [...base, 'Hero', 'FeatureSection', 'PricingTable'];
        if (brief.type === 'dashboard') return [...base, 'Sidebar', 'StatsCard', 'Chart'];
        return base;
    }
}

module.exports = AIOrchestrator;
