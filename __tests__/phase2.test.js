const BriefParser = require('../src/ai-orchestrator/brief-parser');
const AIOrchestrator = require('../src/ai-orchestrator/orchestrator');

describe('Phase 2: AI Orchestration', () => {
    describe('BriefParser', () => {
        const parser = new BriefParser();

        test('should parse style keywords', () => {
            const result = parser.parse('Modern minimalist landing page');
            expect(result.style).toBe('modern');
        });

        test('should identify project type', () => {
            const result = parser.parse('Create a dashboard for analytics');
            expect(result.type).toBe('dashboard');
        });

        test('should extract features', () => {
            const result = parser.parse('Landing page with hero, pricing, and contact section');
            expect(result.features).toContain('hero');
            expect(result.features).toContain('pricing');
            expect(result.features).toContain('contact');
        });
    });

    describe('AIOrchestrator', () => {
        const orchestrator = new AIOrchestrator();

        test('should select appropriate agents', async () => {
            const result = await orchestrator.processBrief('Modern SaaS landing page');
            expect(result.agents).toContain('web-designer');
            expect(result.agents).toContain('brand-strategist');
        });

        test('should generate a valid plan', async () => {
            const result = await orchestrator.processBrief('Dark mode crypto dashboard');
            expect(result.plan.theme.mode).toBe('dark');
            expect(result.plan.layout.type).toBe('dashboard');
        });
    });
});
