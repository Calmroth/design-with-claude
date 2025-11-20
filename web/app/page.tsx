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
        Specialized AI agents for every design challenge + CLI tool that generates real code. From guidance to implementation, powered by Claude AI.
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
          <span className="prompt">$</span>
          <span className="command">git clone github.com/design-with-claude</span>
        </div>
        <div className="code-line">
          <span className="prompt">$</span>
          <span className="command">@ui-designer Create a modern dashboard</span>
        </div>
        <div className="code-line">
          <span className="prompt">$</span>
          <span className="command">design-create init my-project</span>
        </div>
        <div className="code-line">
          <span className="prompt">$</span>
          <span className="command">design-create component button --variants</span>
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
          <h3 className="install-section-title">Clone and Use</h3>
          <div className="code-example">
            <div className="code-line">
              <span className="prompt">$</span>
              <span className="command">git clone https://github.com/imsaif/design-with-claude.git</span>
            </div>
            <div className="code-line">
              <span className="prompt">$</span>
              <span className="command">cd design-with-claude</span>
            </div>
          </div>
        </div>

        <div className="install-section">
          <h3 className="install-section-title">User-wide Installation</h3>
          <div className="code-example">
            <div className="code-line">
              <span className="prompt">$</span>
              <span className="command">git clone https://github.com/imsaif/design-with-claude.git</span>
            </div>
            <div className="code-line">
              <span className="prompt">$</span>
              <span className="command">cd design-with-claude</span>
            </div>
            <div className="code-line">
              <span className="prompt">$</span>
              <span className="command">cp -r agents/* ~/.claude/agents/</span>
            </div>
          </div>
        </div>

        <div className="install-section">
          <h3 className="install-section-title">Project-specific Installation</h3>
          <div className="code-example">
            <div className="code-line">
              <span className="prompt">$</span>
              <span className="command">cd your-project</span>
            </div>
            <div className="code-line">
              <span className="prompt">$</span>
              <span className="command">cp -r path/to/design-with-claude/agents/* .claude/agents/</span>
            </div>
          </div>
        </div>

        <div className="install-section">
          <h3 className="install-section-title">Web Interface</h3>
          <p className="install-description">
            Simply copy the content of any agent file and paste it at the beginning of your Claude conversation.
          </p>
        </div>

        <div className="install-section">
          <h3 className="install-section-title">CLI Tool Setup (NEW!)</h3>
          <div className="code-example">
            <div className="code-line">
              <span className="prompt">$</span>
              <span className="command">npm install</span>
            </div>
            <div className="code-line">
              <span className="prompt">$</span>
              <span className="command">node bin/design-create.js init my-project</span>
            </div>
            <div className="code-line">
              <span className="prompt">$</span>
              <span className="command">cd my-project</span>
            </div>
          </div>
          <p className="install-description">
            The CLI tool generates actual code files, components, and design tokens using agent intelligence.
          </p>
        </div>

        <div className="install-section">
          <h3 className="install-section-title">Verify Installation</h3>
          <div className="code-example">
            <div className="code-line">
              <span className="prompt">$</span>
              <span className="command">ls ~/.claude/agents/</span>
            </div>
          </div>
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
      <h2 className="install-title">How Agent Intelligence Powers Generation</h2>

      {/* How It Works sections */}
      <div className="install-sections">
        <div className="install-section">
          <h3 className="install-section-title">Dual System Overview</h3>
          <div className="code-example">
            <pre style={{ fontSize: '12px', lineHeight: '1.4', margin: 0, color: '#FFFFFF' }}>
              {`┌────────────────────────┬─────────────────────────┐
│   28 DESIGN AGENTS     │   CLI GENERATOR         │
│   Provide Expertise    │   Creates Real Code     │
│   Give Guidance        │   Builds Components     │
└────────────────────────┴─────────────────────────┘
              ↓                    ↓
         Guidance              Implementation`}
            </pre>
          </div>
        </div>

        <div className="install-section">
          <h3 className="install-section-title">Intelligent Flow</h3>
          <p className="install-description">
            When you run a command, agents analyze your brief → select expert agents → guide generation → produce quality code with best practices built-in.
          </p>
          <div className="code-example">
            <pre style={{ fontSize: '11px', lineHeight: '1.4', margin: 0, color: '#FFFFFF' }}>
              {`Input: design-create from-brief "Modern SaaS landing"
                    ↓
              Brief Parser
                    ↓
            Agent Selection
        web-designer + ui-designer + brand-strategist
                    ↓
           Expert Guidance Applied
                    ↓
        Generated: Hero.jsx + Button.css + tokens.json`}
            </pre>
          </div>
        </div>

        <div className="install-section">
          <h3 className="install-section-title">Agent Selection Examples</h3>
          <div className="code-example">
            <div className="code-line" style={{ marginBottom: '8px' }}>
              <span className="prompt">$</span>
              <span className="command">design-create component button</span>
            </div>
            <div className="install-description" style={{ marginLeft: '20px', marginBottom: '12px', fontSize: '13px', color: '#A0A0A0' }}>
              → Uses: ui-designer + accessibility-specialist
            </div>
            <div className="code-line" style={{ marginBottom: '8px' }}>
              <span className="prompt">$</span>
              <span className="command">design-create from-brief &quot;Healthcare dashboard&quot;</span>
            </div>
            <div className="install-description" style={{ marginLeft: '20px', fontSize: '13px', color: '#A0A0A0' }}>
              → Uses: dashboard-designer + healthcare-ux + accessibility-specialist
            </div>
          </div>
        </div>

        <div className="install-section">
          <h3 className="install-section-title">Development Status</h3>
          <div className="code-example">
            <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
              <div style={{ color: '#00FF88' }}>✅ Phase 1: CLI Foundation - Complete</div>
              <div style={{ color: '#00FF88' }}>✅ Phase 2: Agent Integration - Complete</div>
              <div style={{ color: '#0099FF' }}>🔄 Phase 3: Export System - In Progress</div>
              <div style={{ color: '#888888' }}>⏳ Phase 4: Figma Integration - Coming Soon</div>
            </div>
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