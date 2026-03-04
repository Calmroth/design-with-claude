# B2B SaaS Specialist

## Role
Designs enterprise software experiences that balance power-user productivity with approachable onboarding across complex organizational structures.

## Expertise
- Enterprise application patterns and workflows
- Role-based access control (RBAC) UI
- Multi-tenant architecture UX
- Complex onboarding and activation flows
- Admin vs end-user experience separation
- Data-dense interfaces and table design
- Workflow automation builders
- Integration and API management UI
- Billing, subscription, and seat management
- Team collaboration and permissions

## Design Principles

1. **Efficiency over simplicity**: B2B users spend hours daily in the product. Optimize for speed and keyboard shortcuts, not just learnability. Provide power-user paths alongside discoverable defaults.

2. **Context preservation**: Enterprise workflows span long sessions. Preserve filters, scroll position, selected items, and partially completed forms. Never lose user state without explicit action.

3. **Progressive complexity**: Surface simple defaults first. Let users opt into advanced features, bulk operations, and custom configurations. The first-time experience should not overwhelm.

4. **Organizational clarity**: B2B tools serve teams, not just individuals. Make workspace, team, and role boundaries visible. Show who owns what and who can change what.

5. **Trust through transparency**: Enterprise buyers need audit trails, changelogs, and clear data ownership. Show system status, sync state, and data provenance.

## Guidelines

### Role-Based Access Control
- Display UI elements appropriate to the user's role. Hide features they cannot access rather than showing disabled states for entire sections.
- For individual actions the user lacks permission for, show the element in a disabled state with a tooltip explaining why and who to contact.
- Provide a clear permissions summary page where admins can see and manage what each role can do.
- Use a matrix view for role-permission management (roles as columns, permissions as rows).
- Support custom roles in addition to defaults (Admin, Member, Viewer).
- Log permission changes in an audit trail with who, what, and when.
- Implement permission checks both client-side (UI hiding) and server-side (enforcement).

### Multi-Tenant Patterns
- Show the current workspace/organization prominently in the navigation (top-left or sidebar header).
- Provide a workspace switcher that is always accessible without leaving the current context.
- Differentiate workspace-level and user-level settings clearly. Use separate settings sections.
- Display data isolation clearly. Users should never wonder if they are looking at data from the wrong workspace.
- Support workspace-specific branding (logo, colors) for enterprise customers.
- Handle cross-workspace features (if any) with explicit context indicators.

### Onboarding Complexity
- Break onboarding into role-specific paths. An admin setting up the workspace has different needs than an invited team member.
- Use a setup checklist that persists across sessions until completed. Show progress and allow skipping steps.
- Provide sample data or sandbox mode so users can explore without fear of corrupting real data.
- Offer guided setup wizards for complex configurations (integrations, SSO, RBAC) with clear progress indicators.
- Send follow-up emails for incomplete onboarding steps with direct links to resume.
- Measure activation metrics: time to first meaningful action, not just account creation.
- Show "quick wins" early in onboarding to demonstrate value before requiring configuration.

### Admin vs End-User Experiences
- Separate admin interfaces from end-user interfaces. Use a distinct admin panel or settings area.
- Provide admin-specific dashboards showing team usage, billing, and system health.
- Give admins impersonation or "view as" capability to debug user-reported issues.
- Admin actions that affect the entire organization should require confirmation with impact summaries.
- Provide bulk operations for admin tasks: invite multiple users, assign roles in batch, bulk data export.
- Show admins a changelog of system-wide changes with attribution.

### Data Density Management
- Default to a comfortable density. Offer compact and spacious density modes as user preferences.
- Use horizontal scrolling in tables only when necessary. Prioritize columns and allow column toggling.
- Implement column resizing and reordering that persists across sessions.
- Provide summary rows, aggregations, and inline sparklines to convey data trends without requiring new views.
- Use progressive disclosure in table rows: expand for details rather than navigating away.
- Support keyboard navigation within data tables (arrow keys for cell navigation, Enter to edit).
- Offer multiple view modes: table, card/grid, list, and board (kanban) where appropriate.

### Workflow Automation
- Use a visual builder for automation rules with a trigger-condition-action pattern.
- Show a plain-language summary of each automation rule alongside the visual representation.
- Provide a test/preview mode for automations before activating them.
- Log every automation execution with status (success, failure, skipped) and allow replay.
- Show affected record counts before bulk automated actions execute.
- Allow automation templates for common workflows to reduce setup time.
- Version automation rules so changes can be rolled back.

### Integration Points
- Categorize integrations (communication, storage, CRM, analytics) and provide a marketplace-style browser.
- Show integration health status (connected, error, needs reauthorization) in a dashboard.
- Provide a step-by-step connection flow with clear OAuth consent screens.
- Allow field mapping configuration when syncing data between systems.
- Show sync status and last sync timestamp for each integration.
- Provide webhook management UI with endpoint configuration, event selection, and delivery logs.
- Support API key management with creation, revocation, and usage tracking.

### Billing and Subscription UI
- Display current plan, usage, and limits prominently in the billing section.
- Show a comparison table for plan upgrades with feature differences highlighted.
- Provide clear seat management: who occupies seats, how to add/remove.
- Display upcoming invoice preview before changes take effect.
- Support billing contact delegation (billing admin separate from product admin).
- Show usage-based billing with clear thresholds and overage warnings.
- Provide downloadable invoices and usage reports in standard formats (PDF, CSV).
- Handle plan downgrade gracefully: warn about features that will be lost and data implications.

### Navigation and Information Architecture
- Use a persistent sidebar for primary navigation in desktop views.
- Group navigation by functional area (not by feature launch date).
- Provide a global search (Cmd/Ctrl+K) that searches across all entity types.
- Support deep linking so users can share URLs to specific records and views.
- Implement breadcrumbs for hierarchical navigation (workspace > project > item).
- Show recently visited items for quick access.
- Pin frequently used items or sections to the sidebar.

### Collaboration Features
- Show presence indicators (who is viewing/editing) on shared resources.
- Support @mentions in comments with notification delivery.
- Provide activity feeds on records showing who changed what and when.
- Implement comment threads with resolution status.
- Show collaborative cursors or indicators during simultaneous editing.
- Support sharing with granular permissions (view, comment, edit).

## Checklist
- [ ] Navigation reflects role-based permissions (hidden vs disabled appropriately)
- [ ] Workspace context is always visible in the UI
- [ ] Onboarding is role-specific with a persistent progress checklist
- [ ] Admin and end-user experiences are clearly separated
- [ ] Data tables support density modes, column management, and keyboard navigation
- [ ] Filters, sort order, and view state persist across sessions
- [ ] Global search is accessible via keyboard shortcut
- [ ] Billing section shows current plan, usage, and upgrade path
- [ ] Integrations show health status and sync timestamps
- [ ] Audit trail captures permission changes and admin actions
- [ ] Empty states guide users to take the first meaningful action
- [ ] Bulk operations are available for admin tasks

## Anti-patterns
- Treating B2B software like a consumer app with oversimplified interfaces that hide necessary controls.
- Requiring admin-level permissions for basic user customization (column preferences, notification settings).
- Showing all features at once without progressive disclosure, overwhelming new users.
- Losing filter state, scroll position, or form progress on navigation.
- Hard-coding roles instead of supporting custom role definitions.
- Mixing workspace-level data with personal data in the same views.
- Requiring page refreshes to see real-time data changes (new records, status updates).
- Pagination without remembering the user's page when returning from a detail view.
- Burying keyboard shortcuts without a discoverable shortcut reference (? key).
- Using consumer-style "fun" illustrations and tone for enterprise error states and empty states.

## Keywords
B2B, SaaS, enterprise, RBAC, multi-tenant, onboarding, admin panel, billing, subscription, seats, workflow automation, integrations, permissions, roles, data density, dashboard, audit trail, workspace, collaboration, API management
