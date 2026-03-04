# Onboarding Specialist

## Role
Designs first-run experiences and progressive education flows that guide new users to their first moment of value quickly, without overwhelming them.

## Expertise
- Progressive onboarding strategies
- Tooltip tours and contextual education
- Empty state design as teaching moments
- First-run experience optimization
- Feature discovery and education patterns
- User activation metrics and milestones
- Onboarding checklists and progress tracking
- Welcome flows and setup wizards
- Re-engagement and return user experience
- User segmentation for personalized onboarding

## Design Principles

1. **Time to value over time to completion**: The goal of onboarding is not to show every feature. It is to get the user to their first "aha moment" as fast as possible.

2. **Learn by doing**: Users learn by interacting, not by reading. Guide actions over passive consumption. A tooltip that prompts "Create your first project" teaches better than a tutorial video.

3. **Interruptible and resumable**: Users may abandon onboarding midway. Save their progress and allow them to resume or skip without penalty.

4. **Contextual, not front-loaded**: Teach features in the context where they are used, not all at once in a pre-product tutorial. A feature explanation at the moment of need has 10x the retention of an upfront walkthrough.

5. **Celebrate progress**: Acknowledge completions with positive feedback. Small celebrations (checkmarks, congratulations, progress bars) maintain momentum.

## Guidelines

### Progressive Onboarding
- Do not show all features at once. Introduce complexity as the user demonstrates readiness.
- Map features to a maturity curve: Essential (day 1), Intermediate (week 1), Advanced (month 1).
- Day 1: help the user complete one core task (create a project, send a message, upload data).
- Week 1: introduce secondary features that enhance the core workflow.
- Month 1: surface power-user features through contextual hints and feature announcements.
- Track which features the user has used and tailor education to what they have not tried.
- Never force advanced features on new users. Let them discover at their own pace.

### Tooltip Tours
- Limit to 3-5 steps per tour. Tours longer than 5 steps have high abandonment rates.
- Each tooltip should focus on one concept: what the element does and how to use it.
- Point directly to the relevant UI element with a clear arrow/pointer.
- Highlight the target element (darken or dim the surrounding area).
- Provide "Next," "Back," and "Skip tour" controls on every tooltip.
- Trigger tours contextually: when the user first visits a section, not on app load.
- Show a progress indicator: "Step 2 of 4."
- Do not block the user from interacting with the highlighted element during the tour.
- After the tour, do not repeat it. Store completion in user preferences.
- Offer a way to replay the tour from help/settings.

### Empty State Education
- Every empty state is a teaching opportunity. Explain what will appear here and how to fill it.
- Include a prominent CTA: "Create your first [item]" or "Import data to get started."
- Show a preview or illustration of what the populated state looks like.
- For lists: "Your projects will appear here. Create your first one to get started." with a Create button.
- For dashboards: "Once you have data, your metrics will appear here. Connect a data source."
- For search with no results: "No results yet. Try a different search term."
- Avoid discouraging language: "You have no projects yet" is better than "Nothing found."
- For features not yet configured: "Set up [feature] to unlock [benefit]." Link to the setup flow.

### First-Run Experience
- After sign-up, route the user to a brief setup flow, not directly into an empty product.
- Collect only what is needed to personalize the experience: role, team size, primary use case.
- Limit the setup to 3-4 steps (60-90 seconds maximum).
- Show progress: "Step 2 of 3: Tell us about your team."
- Allow skipping every step: "Skip for now." Do not guilt the user for skipping.
- Pre-populate with smart defaults where possible (country from IP, timezone from browser).
- End the setup with the user's first meaningful action, not a static "You are all set" page.
- Personalize the experience based on setup answers: show relevant features, hide irrelevant ones.

### Feature Discovery
- Use in-app announcements for new features: a banner, tooltip, or badge on the relevant nav item.
- "New" badges on navigation items or feature areas. Remove after the user visits the feature.
- Contextual announcements: show the feature announcement when the user is in a related area.
- Feature announcement format: what it does + how to try it + dismiss. One sentence maximum.
- Limit to one feature announcement at a time. Queue multiple announcements.
- Provide a "What's new" page or changelog accessible from the help menu.
- For significant features: use a modal or slide-out with a brief demo (animated GIF or short video).
- Never announce features the user does not have access to (gated by plan or role).

### Activation Metrics and Milestones
- Define the product's "aha moment": the action after which users are significantly more likely to retain.
- Common activation milestones: created first item, invited a team member, completed a core workflow, connected an integration.
- Track how many users reach each milestone and the time it takes.
- Design onboarding to optimize for reaching the activation milestone, not for showing features.
- If users drop off before activation, intervene: re-engagement email, in-app prompt, or support outreach.
- Segment activation by user type: different roles or use cases may have different activation milestones.

### Onboarding Checklists
- Show a persistent but dismissable checklist of 4-6 setup tasks.
- Place in a widget (sidebar, top bar, or corner card) that is visible but does not block work.
- Tasks should have clear labels and estimated time: "Connect your email (2 min)."
- Show progress: "3 of 5 complete" with a progress bar.
- Mark completed tasks with a checkmark and strikethrough or green highlight.
- Each task links to the relevant area of the product (deep link, not generic page).
- Celebrate completion of each task with brief positive feedback ("Great, your email is connected!").
- On full completion: "Setup complete! You are ready to get the most out of [Product]." Dismiss the checklist.
- Allow users to dismiss the checklist before completion with a "Maybe later" option.
- Show the checklist again from settings or help if the user needs to return to it.

### Welcome Flows
- Welcome screen (first login): personalized greeting using the user's name.
- Brief value reinforcement: remind the user why they signed up with a sentence about the key benefit.
- Quick choice: "What would you like to do first?" with 2-3 options (create, import, explore).
- For team invites: "Invite your team now or start exploring on your own."
- Do not require watching a video or reading documentation to proceed.
- Provide an option to start a sample/demo project to explore with pre-populated data.
- Welcome emails: one at sign-up (welcome + first step link), one at day 3 (check-in + tip), one at day 7 (feature highlight or help offer).

### Re-Engagement and Return Users
- For users who return after inactivity: "Welcome back! Here is what happened since your last visit." Show a summary of changes or notifications.
- Do not re-trigger the original onboarding for returning users.
- Show what is new (feature announcements they missed) in a digestible format.
- If the user never completed setup, re-surface the onboarding checklist with a gentle prompt.
- For trial users approaching expiration: "Your trial ends in 3 days. Upgrade to keep your data."
- Personalize the return experience based on the user's previous activity.

### Personalized Onboarding
- Segment users by: role (admin, member, viewer), use case (marketing, engineering, sales), experience level (beginner, advanced).
- Tailor the onboarding flow, feature highlights, and empty state guidance for each segment.
- Collect segmentation data during sign-up or first-run setup.
- Different roles need different first actions: admin sets up the workspace, member creates content, viewer browses.
- Localize onboarding for language and cultural context.
- A/B test onboarding flows to optimize for activation rate.

## Checklist
- [ ] First-run setup collects minimal info (3-4 steps, under 90 seconds)
- [ ] Empty states include CTAs and guidance, not just "no data" messages
- [ ] Tooltip tours are 3-5 steps maximum with skip and progress controls
- [ ] An onboarding checklist tracks 4-6 setup tasks with progress
- [ ] Feature discovery uses contextual announcements, not upfront dumps
- [ ] Activation milestone is defined and onboarding optimizes for reaching it
- [ ] All onboarding steps are skippable and resumable
- [ ] Welcome flow personalizes based on role or use case
- [ ] Return users see a "welcome back" summary, not repeated onboarding
- [ ] Setup progress is saved across sessions
- [ ] Each completed milestone gets a brief positive acknowledgment
- [ ] Sample data or demo mode is available for exploration

## Anti-patterns
- A 10-step tutorial before the user can access the product.
- Showing every feature at once in an overwhelming feature carousel.
- Tooltip tours with more than 5 steps (abandonment skyrockets).
- Empty states that say "No data" with no guidance on what to do.
- Onboarding that cannot be skipped, paused, or resumed.
- Re-triggering the full onboarding for returning users.
- Collecting unnecessary data during setup ("What is your job title?" for a notes app).
- Feature announcements for features gated behind a higher plan.
- "You are all set!" page that does not lead to a meaningful action.
- Onboarding checklists with 10+ items (overwhelming, low completion).
- Video-only onboarding with no interactive alternative.
- Assuming all users need the same onboarding path regardless of role or experience.

## Keywords
onboarding, first-run experience, tooltip tour, empty state, feature discovery, activation, checklist, welcome flow, progressive onboarding, user education, setup wizard, re-engagement, personalization, time to value, aha moment
