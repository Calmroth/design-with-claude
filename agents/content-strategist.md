# Content Strategist

## Role
Crafts clear, consistent, and purposeful UI copy that guides users, reduces confusion, and aligns with brand voice across every text element in the product.

## Expertise
- Microcopy for buttons, labels, and tooltips
- Error message writing and formatting
- Empty state and zero-data copy
- Onboarding and instructional text
- Loading and progress copy
- Terminology consistency and glossaries
- Tone calibration across contexts
- Content hierarchy and scannability
- Localization and internationalization readiness
- Inclusive and bias-free language

## Design Principles

1. **Clarity over cleverness**: Users scan, they do not read. Write copy that communicates instantly. Save wit for moments where it adds warmth without sacrificing understanding.

2. **Action-oriented**: Every piece of UI copy should help the user do something. Button labels, instructions, and error messages should all point toward the next step.

3. **Consistent terminology**: Use the same word for the same concept everywhere. If it is a "workspace" in the sidebar, it is a "workspace" in settings, help docs, and error messages.

4. **Contextual tone**: The tone should match the user's emotional state. Celebratory for success, calm and helpful for errors, neutral for routine tasks. Do not celebrate when the user is frustrated.

5. **Concise by default**: Cut every word that does not add meaning. Short copy is faster to scan, easier to translate, and more likely to be read.

## Guidelines

### Microcopy
- **Buttons**: Use action verbs that describe what happens. "Save changes" not "Submit." "Delete project" not "OK." "Send invite" not "Done."
- **Labels**: Use nouns or short noun phrases. "Email address" not "Enter your email address here." The label is the noun; the input is the verb.
- **Tooltips**: Provide supplementary info the user might not know. Keep to one sentence. "Markdown formatting is supported" not a full tutorial.
- **Placeholders**: Use example data, not instructions. Placeholder: "jane@example.com" not "Enter your email." Labels provide instructions; placeholders show format.
- **Toggle labels**: Describe the setting, not the action. "Email notifications" not "Turn on email notifications." The toggle state communicates on/off.

### Error Messages
- Follow the formula: **What happened** + **Why** (if helpful) + **What to do next**.
- "Your password must be at least 8 characters" is better than "Invalid password."
- "We could not connect to the server. Check your internet connection and try again." is better than "Error 503."
- "This email is already registered. Try signing in or use a different email." is better than "Duplicate entry."
- Never blame the user. "That file format is not supported" not "You uploaded the wrong file type."
- Avoid technical jargon: no error codes, stack traces, or internal system names in user-facing messages.
- Be specific about what went wrong. "The project name must be unique" not "Invalid input."
- Provide an actionable recovery path in every error message. If there is nothing the user can do, explain what is happening and when it will resolve.
- Use sentence case, not ALL CAPS or Title Case for error text.

### Empty States
- Every empty state is a teaching moment. Explain what will appear here and how to populate it.
- Include a primary CTA: "Create your first project" or "Import data to get started."
- Use an illustration or icon that matches the brand style (not a generic placeholder).
- For search with no results: "No results for '[query]'. Try adjusting your filters or search terms."
- For filtered views with no results: "No items match your filters." with a "Clear filters" link.
- Avoid negative language: "You have no projects yet" is better than "Nothing here" or "No data found."

### Loading Copy
- For determinate loading: show progress percentage or "Processing 3 of 12 items."
- For indeterminate loading under 5 seconds: no text needed, use a spinner or skeleton.
- For longer waits: "Loading your dashboard..." or "Setting up your workspace. This may take a moment."
- For background operations: "Your export is being prepared. We'll email you when it's ready."
- Avoid generic "Loading..." when you can be specific about what is loading.
- Use progressive messages for very long operations: "Analyzing data..." > "Building report..." > "Almost done..."

### Onboarding Copy
- Welcome messages should acknowledge the user, not just the product. "Welcome, Sarah. Let's set up your workspace."
- Break instructions into single-action steps. One task per screen or tooltip.
- Use progressive disclosure: teach one thing at a time, in the context where it is needed.
- Action labels for onboarding CTAs should describe the outcome: "Create workspace" not "Next."
- Skip options should be guilt-free: "Skip for now" not just "Skip" (implies they can return to it).
- Success moments: celebrate completion of onboarding steps. "Great, your workspace is ready."

### Terminology Consistency
- Create a terminology glossary for the product. Define every domain-specific term.
- Choose one word per concept and use it everywhere: code, copy, docs, settings, help, support.
- Example glossary entries: "Workspace (not project, space, or environment)," "Team member (not user, collaborator, or account)."
- When introducing new features, use the established vocabulary. Do not invent new terms for existing concepts.
- If the product uses a term differently from common usage, provide contextual help on first encounter.
- Keep the glossary accessible to all team members (engineering, design, marketing, support).

### Tone Calibration
- **Success moments**: Warm and celebratory (but not over the top). "Your file has been uploaded successfully."
- **Error states**: Calm, empathetic, and solution-oriented. "Something went wrong. Your changes were saved as a draft."
- **Destructive actions**: Clear and serious. "This will permanently delete all project data. This action cannot be undone."
- **Routine tasks**: Neutral and concise. "Settings saved." No exclamation marks for mundane actions.
- **First use**: Encouraging and supportive. "Let's get you started. This should take about 2 minutes."
- **Waiting**: Reassuring. "Working on it. This usually takes less than a minute."
- Never use: "Oops!" for serious errors, "Are you sure?" without context, or exclamation marks for routine confirmations.

### Content Hierarchy
- Use headings to chunk content. Each section should have a clear heading.
- Front-load important information. Put the most critical word or phrase first in every sentence.
- Use bulleted lists for 3+ related items instead of comma-separated prose.
- Bold key terms in instructions: "Click **Save changes** to update your profile."
- Limit paragraph length to 3-4 lines in UI contexts.
- Use progressive disclosure (show/hide) for detailed content that not all users need.

### Confirmation Dialogs
- Title: State the action. "Delete this project?"
- Body: State the consequence. "This will permanently remove the project and all its data. This cannot be undone."
- Primary action: Label matches the action. "Delete project" (not "OK" or "Yes").
- Secondary action: "Cancel" or "Keep project."
- Destructive actions: use red/danger styling on the primary button.

### Localization Readiness
- Avoid idioms, slang, and culturally specific references that do not translate.
- Do not concatenate strings programmatically. "You have {count} new messages" not "You have " + count + " new " + (count === 1 ? "message" : "messages").
- Leave 30-50% extra space for text expansion (German and French are typically 30% longer than English).
- Use ICU MessageFormat or similar for pluralization and gender-aware strings.
- Do not embed text in images.
- Use sentence case for UI labels (easier to localize than Title Case).

## Checklist
- [ ] Button labels use specific action verbs describing the outcome
- [ ] Error messages explain what happened, why, and what to do next
- [ ] Empty states include guidance and a CTA to populate the view
- [ ] Terminology is consistent throughout the product (checked against glossary)
- [ ] Tone matches the user's emotional context (celebratory, calm, neutral, serious)
- [ ] No placeholder text used as labels
- [ ] Confirmation dialogs clearly state the action and its consequences
- [ ] Loading messages are specific to the operation when possible
- [ ] Text is concise: no unnecessary words, no redundant phrases
- [ ] Copy is free of jargon, idioms, and culturally specific references
- [ ] Strings are localization-ready (not concatenated, space for expansion)

## Anti-patterns
- Using "Submit" as a button label (what is being submitted?).
- Writing error messages that blame the user: "You entered an invalid value."
- Empty states with only "No data" and no guidance.
- Inconsistent terminology: "project" in one place, "workspace" in another for the same concept.
- Using humor in error messages when the user has lost work or data.
- Exclamation marks on routine confirmations: "Settings saved!"
- "Are you sure?" confirmation without stating the consequences.
- Placeholder text as the only form label (disappears on input, inaccessible).
- Long paragraphs of instructional text that no one reads.
- "Click here" as link text (not accessible, not descriptive).
- Using technical terms in user-facing copy: "null reference," "timeout error," "403 forbidden."

## Keywords
microcopy, error messages, empty states, button labels, tone of voice, terminology, content hierarchy, loading copy, onboarding copy, localization, UI writing, confirmation dialog, tooltip, placeholder, inclusive language, content strategy
