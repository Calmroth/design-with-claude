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

        test('should extract concerns', () => {
            const result = parser.parse('Accessible dashboard with animation and dark mode');
            expect(result.concerns).toContain('accessible');
            expect(result.concerns).toContain('animation');
            expect(result.concerns).toContain('dark mode');
        });

        test('should extract brief words', () => {
            const result = parser.parse('Modern SaaS landing page');
            expect(result.briefWords).toContain('modern');
            expect(result.briefWords).toContain('saas');
            expect(result.briefWords).toContain('landing');
        });
    });

    describe('AIOrchestrator', () => {
        const orchestrator = new AIOrchestrator();

        test('should select agents dynamically', async () => {
            const result = await orchestrator.processBrief('Modern SaaS landing page');
            // Should have dynamically selected agents (not just the old hardcoded 4)
            expect(result.agents.length).toBeGreaterThan(0);
            expect(result.agents.length).toBeLessThanOrEqual(5);
            // Always-include agents should be present
            expect(result.agents).toContain('ui-designer');
            expect(result.agents).toContain('design-system-architect');
        });

        test('should generate a valid plan', async () => {
            const result = await orchestrator.processBrief('Dark mode crypto dashboard');
            expect(result.plan.theme.mode).toBe('dark');
            expect(result.plan.layout.type).toBe('dashboard');
        });

        test('should include guidance in result', async () => {
            const result = await orchestrator.processBrief('Modern SaaS landing page');
            expect(result.guidance).toBeDefined();
            expect(result.guidance.colorGuidance).toBeDefined();
            expect(result.guidance.typographyGuidance).toBeDefined();
            expect(result.guidance.componentGuidance).toBeDefined();
            expect(result.guidance.layoutGuidance).toBeDefined();
            expect(result.guidance.agentNotes.length).toBeGreaterThan(0);
        });

        test('should include selectedAgents with scores and roles', async () => {
            const result = await orchestrator.processBrief('Modern SaaS landing page');
            expect(result.selectedAgents).toBeDefined();
            expect(result.selectedAgents.length).toBeGreaterThan(0);
            result.selectedAgents.forEach(sa => {
                expect(sa.agent).toBeDefined();
                expect(sa.score).toBeGreaterThanOrEqual(0);
                expect(['primary', 'supporting', 'specialist']).toContain(sa.role);
            });
        });

        test('should select healthcare-ux for health briefs', async () => {
            const result = await orchestrator.processBrief('Healthcare dashboard with accessibility');
            expect(result.agents).toContain('healthcare-ux');
        });
    });
});
