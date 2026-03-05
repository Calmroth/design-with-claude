'use client';

import { useState } from 'react';

export default function Home() {
  const [currentView, setCurrentView] = useState('home');

  const HomeView = () => (
    <>
      {/* Terminal-style title */}
      <h1 className="terminal-title">
        <span className="prompt">&gt;</span> Design with Claude<span className="blinking-cursor"></span>
      </h1>

      {/* Subtitle */}
      <p className="hero-subtitle">
        29 specialist agents + 1 master command — available as a Claude Code plugin. Deep domain knowledge for every design challenge.
      </p>

      {/* CTA Buttons */}
      <div className="cta-buttons">
        <button
          onClick={() => setCurrentView('install')}
          className="btn-primary"
        >
          Install Instructions
        </button>
        <button
          onClick={() => setCurrentView('how-it-works')}
          className="btn-secondary"
        >
          How It Works
        </button>
      </div>

      {/* Code Example */}
      <div className="code-example">
        <div className="code-line">
          <span className="prompt">&gt;</span>
          <span className="command">/plugin marketplace add imsaif/design-with-claude</span>
        </div>
        <div className="code-line">
          <span className="prompt">&gt;</span>
          <span className="command">/design-brief SaaS analytics dashboard with dark mode</span>
        </div>
        <div className="code-line">
          <span className="prompt">&gt;</span>
          <span className="command">/accessibility-specialist Audit this login form for WCAG AA</span>
        </div>
        <div className="code-line">
          <span className="prompt">&gt;</span>
          <span className="command">/motion-designer Transition specs for modal and dropdown</span>
        </div>
      </div>
    </>
  );

  const InstallView = () => (
    <>
      {/* Back button */}
      <div className="install-header">
        <button
          onClick={() => setCurrentView('home')}
          className="btn-back"
        >
          ← Back to Terminal
        </button>
      </div>

      {/* Installation title */}
      <h2 className="install-title">Installation Instructions</h2>

      {/* Installation sections */}
      <div className="install-sections">
        <div className="install-section">
          <h3 className="install-section-title">As a Plugin (recommended)</h3>
          <div className="code-example">
            <div className="code-line">
              <span className="prompt">&gt;</span>
              <span className="command">/plugin marketplace add imsaif/design-with-claude</span>
            </div>
            <div className="code-line">
              <span className="prompt">&gt;</span>
              <span className="command">/plugin install design-with-claude@design-with-claude</span>
            </div>
          </div>
          <p className="install-description">
            Commands are namespaced: <code style={{ color: '#00FF88' }}>/design-with-claude:design-brief</code>, <code style={{ color: '#00FF88' }}>/design-with-claude:accessibility-specialist</code>, etc.
          </p>
        </div>

        <div className="install-section">
          <h3 className="install-section-title">As Standalone Commands</h3>
          <div className="code-example">
            <div className="code-line">
              <span className="prompt">$</span>
              <span className="command">git clone https://github.com/imsaif/design-with-claude.git ~/.design-with-claude</span>
            </div>
            <div className="code-line">
              <span className="prompt">$</span>
              <span className="command">cp -r ~/.design-with-claude/commands/ ~/.claude/commands/</span>
            </div>
          </div>
          <p className="install-description">
            Gives shorter names: <code style={{ color: '#00FF88' }}>/design-brief</code>, <code style={{ color: '#00FF88' }}>/accessibility-specialist</code>, etc.
          </p>
        </div>

        <div className="install-section">
          <h3 className="install-section-title">Project-Local</h3>
          <div className="code-example">
            <div className="code-line">
              <span className="prompt">$</span>
              <span className="command">cp -r ~/.design-with-claude/commands/ your-project/.claude/commands/</span>
            </div>
          </div>
          <p className="install-description">
            Commands available only within this project.
          </p>
        </div>
      </div>
    </>
  );

  const HowItWorksView = () => (
    <>
      {/* Back button */}
      <div className="install-header">
        <button
          onClick={() => setCurrentView('home')}
          className="btn-back"
        >
          ← Back to Terminal
        </button>
      </div>

      {/* How It Works title */}
      <h2 className="install-title">How It Works</h2>

      {/* How It Works sections */}
      <div className="install-sections">
        <div className="install-section">
          <h3 className="install-section-title">What You Get</h3>
          <div className="code-example">
            <pre style={{ fontSize: '12px', lineHeight: '1.4', margin: 0, color: '#FFFFFF' }}>
              {`┌─────────────────────────────────────────────┐
│         30 SLASH COMMANDS                   │
│                                             │
│   Each one a design specialist              │
│   Deep domain knowledge, not generic prompts│
│   No runtime · No dependencies · Just .md   │
└─────────────────────────────────────────────┘`}
            </pre>
          </div>
        </div>

        <div className="install-section">
          <h3 className="install-section-title">Example: /design-brief</h3>
          <div className="code-example">
            <div className="code-line" style={{ marginBottom: '8px' }}>
              <span className="prompt">&gt;</span>
              <span className="command">/design-brief SaaS analytics dashboard with dark mode</span>
            </div>
          </div>
          <div className="code-example" style={{ marginTop: '8px' }}>
            <pre style={{ fontSize: '11px', lineHeight: '1.5', margin: 0, color: '#A0A0A0' }}>
              {`📋 DESIGN BRIEF ANALYSIS

Relevant domains identified:
  → dashboard-designer (primary)
  → dark-mode-specialist
  → data-visualization-designer
  → typography-specialist

Token recommendations:
  Color: Dark neutral base, accent palette for data
  Spacing: 8px grid, dense information layout
  Typography: System font stack, tabular numbers

Component specs:
  → Sidebar navigation with collapsible sections
  → Metric cards with sparkline charts
  → Data table with sort/filter/pagination
  → Chart containers with responsive breakpoints

Suggested workflow:
  1. /dark-mode-specialist  — color system + contrast
  2. /dashboard-designer    — layout + component specs
  3. /data-visualization-designer — chart guidelines`}
            </pre>
          </div>
        </div>

        <div className="install-section">
          <h3 className="install-section-title">All 29 Specialists</h3>
          <div className="code-example">
            <pre style={{ fontSize: '11px', lineHeight: '1.6', margin: 0, color: '#FFFFFF' }}>
              {`CORE
  visual-hierarchy · interaction · design-system
  accessibility

VISUAL
  typography · color · spacing-layout

INTERACTION
  motion · form · navigation

PRODUCT
  dashboard · mobile · responsive · landing-page

SPECIALIZED
  dark-mode · error-handling · onboarding
  performance · data-viz · table · search
  healthcare · b2b-saas · ecommerce · checkout
  brand · content · information-architecture
  conversational-ui`}
            </pre>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="hero-section">
      <div className="terminal-window">
        {/* Terminal Header */}
        <div className="terminal-header">
          <div className="terminal-header-left">
            <div className="terminal-dots">
              <div className="terminal-dot red"></div>
              <div className="terminal-dot yellow"></div>
              <div className="terminal-dot green"></div>
            </div>
            <div className="terminal-window-title">design-with-claude — ~/terminal</div>
          </div>
          <a href="https://github.com/imsaif/design-with-claude" className="btn-secondary terminal-github-link" target="_blank" rel="noopener noreferrer">
            View on GitHub
          </a>
        </div>

        {/* Terminal Content - Switches between views */}
        <div className={`terminal-content ${currentView !== 'home' ? 'install-view' : ''}`}>
          {currentView === 'home' && <HomeView />}
          {currentView === 'install' && <InstallView />}
          {currentView === 'how-it-works' && <HowItWorksView />}
        </div>
      </div>
    </div>
  );
}
