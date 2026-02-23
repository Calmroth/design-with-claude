const chalk = require('chalk');
const BriefParser = require('./brief-parser');
const AgentLoader = require('../agents/agent-loader');
const AgentSelector = require('../agents/agent-selector');
const AgentKnowledge = require('../agents/agent-knowledge');

class AIOrchestrator {
    constructor() {
        this.briefParser = new BriefParser();
        this.agentLoader = new AgentLoader();
        this.agentSelector = new AgentSelector({ loader: this.agentLoader });
        this.agentKnowledge = new AgentKnowledge();
    }

    /**
     * Process a design brief and return a generation plan.
     * @param {string} brief - The user's design brief
     * @returns {Object} The generation plan with guidance from agents
     */
    async processBrief(brief) {
        // 1. Parse the brief
        const parsedBrief = this.briefParser.parse(brief);

        // 2. Select agents dynamically from all 29
        const selectedAgents = await this.agentSelector.select(parsedBrief);

        console.log(chalk.blue('🤖 AI Orchestrator: Agents selected'));
        selectedAgents.forEach(({ agent, score, role }) =>
            console.log(chalk.gray(`  - ${agent.name} (${role}, score: ${score})`))
        );

        // 3. Extract structured guidance from selected agents
        const guidance = this.agentKnowledge.extract(selectedAgents);

        // 4. Generate plan — use Claude API if available, otherwise local
        let plan;
        if (this._hasApiKey()) {
            try {
                plan = await this._generatePlanWithApi(parsedBrief, selectedAgents, guidance);
                console.log(chalk.green('✓ Plan generated via Claude API'));
            } catch (err) {
                console.log(chalk.yellow('⚠ API call failed, falling back to local generation'));
                plan = this._generateLocalPlan(parsedBrief, guidance);
            }
        } else {
            plan = this._generateLocalPlan(parsedBrief, guidance);
        }

        return {
            brief: parsedBrief,
            agents: selectedAgents.map(s => s.agent.name),
            selectedAgents,
            guidance,
            plan
        };
    }

    /**
     * Generate a plan locally using parsed brief + agent guidance.
     */
    _generateLocalPlan(parsedBrief, guidance) {
        return {
            theme: {
                mode: parsedBrief.style === 'dark' ? 'dark' : 'light',
                primaryColor: this._suggestColor(parsedBrief.industry),
                fontPairing: this._suggestFontPairing(parsedBrief, guidance)
            },
            layout: {
                type: parsedBrief.type,
                sections: ['hero', ...parsedBrief.features, 'footer']
            },
            components: this._suggestComponents(parsedBrief)
        };
    }

    /**
     * Generate a richer plan using the Claude API.
     * Primary agent's rawMarkdown becomes the system prompt.
     * Supporting agents' intros are injected as context.
     */
    async _generatePlanWithApi(parsedBrief, selectedAgents, guidance) {
        let Anthropic;
        try {
            Anthropic = require('@anthropic-ai/sdk');
        } catch {
            throw new Error('Anthropic SDK not installed');
        }

        const client = new Anthropic();
        const primary = selectedAgents[0];
        const supporting = selectedAgents.slice(1);

        const systemPrompt = [
            primary.agent.rawMarkdown,
            '',
            '## Supporting Agent Context',
            ...supporting.map(s =>
                `### ${s.agent.name} (${s.role})\n${s.agent.intro}`
            ),
            '',
            '## Current Guidance Summary',
            JSON.stringify(guidance, null, 2)
        ].join('\n');

        const userMessage = [
            `Design brief: "${parsedBrief.originalBrief}"`,
            '',
            `Parsed context:`,
            `- Style: ${parsedBrief.style}`,
            `- Type: ${parsedBrief.type}`,
            `- Industry: ${parsedBrief.industry}`,
            `- Features: ${parsedBrief.features.join(', ') || 'none specified'}`,
            `- Complexity: ${parsedBrief.complexity}`,
            `- Concerns: ${(parsedBrief.concerns || []).join(', ') || 'none'}`,
            '',
            'Generate a JSON design plan with this structure:',
            '{',
            '  "theme": { "mode": "light|dark", "primaryColor": "#hex", "fontPairing": "Heading/Body" },',
            '  "layout": { "type": "string", "sections": ["string"] },',
            '  "components": ["ComponentName"],',
            '  "designNotes": "Brief design rationale"',
            '}'
        ].join('\n');

        const response = await client.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 2048,
            system: systemPrompt,
            messages: [{ role: 'user', content: userMessage }]
        });

        const text = response.content[0].text;

        // Try to extract JSON from the response
        try {
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const plan = JSON.parse(jsonMatch[0]);
                // Ensure required fields exist
                return {
                    theme: plan.theme || this._generateLocalPlan(parsedBrief, guidance).theme,
                    layout: plan.layout || { type: parsedBrief.type, sections: ['hero', 'footer'] },
                    components: plan.components || this._suggestComponents(parsedBrief),
                    designNotes: plan.designNotes || ''
                };
            }
        } catch {
            // JSON parsing failed — fall through
        }

        // Fallback if we can't parse the API response
        return this._generateLocalPlan(parsedBrief, guidance);
    }

    _hasApiKey() {
        return !!process.env.ANTHROPIC_API_KEY;
    }

    _suggestColor(industry) {
        const colors = {
            saas: '#3B82F6',
            fintech: '#10B981',
            health: '#EF4444',
            healthcare: '#EF4444',
            crypto: '#8B5CF6',
            fashion: '#18181B',
            food: '#F59E0B',
            gaming: '#EC4899',
            automotive: '#0EA5E9',
            education: '#6366F1',
            travel: '#14B8A6',
            media: '#F97316',
            general: '#6366F1'
        };
        return colors[industry] || colors.general;
    }

    _suggestFontPairing(parsedBrief, guidance) {
        const typStyle = (guidance.typographyGuidance || {}).style;
        if (typStyle === 'expressive') return 'Playfair Display/Source Sans Pro';
        if (typStyle === 'distinctive') return 'Space Grotesk/Inter';
        if (parsedBrief.style === 'modern') return 'Inter/Roboto';
        if (parsedBrief.style === 'elegant' || parsedBrief.style === 'luxury') return 'Playfair Display/Lato';
        if (parsedBrief.style === 'playful') return 'Poppins/Nunito';
        if (parsedBrief.style === 'corporate') return 'IBM Plex Sans/IBM Plex Serif';
        return 'Inter/Roboto';
    }

    _suggestComponents(brief) {
        const base = ['Button', 'Card', 'Input'];
        if (brief.type === 'landing') return [...base, 'Hero', 'FeatureSection', 'PricingTable'];
        if (brief.type === 'dashboard') return [...base, 'Sidebar', 'StatsCard', 'Chart'];
        if (brief.type === 'ecommerce') return [...base, 'ProductCard', 'Cart', 'Checkout'];
        if (brief.type === 'blog') return [...base, 'ArticleCard', 'Pagination'];
        return base;
    }
}

module.exports = AIOrchestrator;
