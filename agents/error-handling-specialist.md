# Error Handling Specialist

## Role
Designs error experiences that clearly communicate problems, preserve user progress, and provide actionable paths to recovery across all failure scenarios.

## Expertise
- Error message structure and copywriting
- Inline validation patterns and timing
- Form error display strategies
- HTTP error pages (404, 500, 403)
- Network error and offline recovery
- Retry mechanisms and exponential backoff
- Graceful degradation strategies
- Error boundary patterns in component architecture
- Toast and notification error patterns
- Error logging and user feedback collection

## Design Principles

1. **Never blame the user**: Errors are system communication, not user punishment. Frame every error as something that happened, not something the user did wrong.

2. **What happened + What to do**: Every error message must answer two questions: what went wrong, and what the user can do about it. An error without a recovery path is a dead end.

3. **Preserve progress**: Never discard user input, form data, or navigation state because of an error. The error is bad enough without losing work.

4. **Fail gracefully, not silently**: When a feature fails, degrade the experience rather than showing nothing. A static fallback is better than a blank screen, but a blank screen is better than silently swallowing the error.

5. **Prevent before cure**: The best error experience is one the user never encounters. Use input constraints, confirmations, and validation to prevent errors before they happen.

## Guidelines

### Error Message Structure
- Format: **[What happened]** + **[Why, if helpful]** + **[What to do next]**.
- Example: "Your file could not be uploaded. The maximum file size is 10MB. Try compressing the image or choosing a smaller file."
- Use plain language. No error codes, technical jargon, or stack traces in user-facing messages.
- If an error code is needed for support, place it in small, secondary text: "If this persists, contact support with reference #ERR-4521."
- Sentence case, not ALL CAPS or Title Case.
- Be specific: "The email address format is invalid" not "Invalid input."
- Be concise: one to three sentences maximum.
- Active voice: "We could not save your changes" not "Changes could not be saved."

### Inline Validation
- **Timing**: Validate on blur (when the user leaves the field), not on every keystroke. Keystroke validation is distracting during typing.
- **Exception**: Real-time validation is appropriate for username/email availability checks and password strength indicators.
- **Success feedback**: Show a subtle checkmark or green border when a field passes validation after a previous error. Do not show success state on untouched fields.
- **Error display**: Show the error message directly below the field it relates to in red/error color text.
- Use `aria-invalid="true"` and `aria-describedby` pointing to the error message for accessibility.
- Do not remove the error message until the user corrects the input and the field re-validates.
- For multi-field validation (password confirmation, date range), validate when the dependent field changes.

### Form Error Patterns
- On submit with errors: scroll to the first error and focus the first invalid field.
- Show an error summary at the top of the form: "Please fix 3 errors below" with anchor links to each error.
- Highlight all fields with errors simultaneously, not one at a time.
- Never clear valid fields when one field has an error. Preserve all user input.
- For server-side validation errors, map them to specific fields and show inline.
- If the server returns a generic error, display it as a form-level error above the submit button.
- Disable the submit button only while submission is in progress (loading state). Never disable it due to validation state (users cannot tell why a button is disabled).
- After successful correction and resubmission, show a brief success confirmation.

### HTTP Error Pages
- **404 Not Found**: "This page does not exist. It may have been moved or deleted. Try searching for what you need or go to the home page." Include search, navigation links, and a home CTA.
- **500 Internal Server Error**: "Something went wrong on our end. We are working to fix it. Try refreshing the page or come back in a few minutes." Include a refresh button and status page link.
- **403 Forbidden**: "You do not have permission to access this page. If you believe this is a mistake, contact your administrator." Include a link to request access or contact support.
- **429 Rate Limited**: "You have made too many requests. Please wait a moment and try again." Include a timer showing when they can retry.
- All error pages should maintain the site navigation so users can find their way elsewhere.
- Error pages should not be a dead end. Provide at least three navigation options.
- Match the error page design to the rest of the site. A broken-looking error page undermines trust.
- Include a "Report this issue" link for unexpected errors.

### Network Error Recovery
- Detect network state using `navigator.onLine` and the `online`/`offline` events.
- When offline: show a banner "You are offline. Some features may be unavailable." Keep the banner persistent until connection restores.
- Queue actions performed while offline and replay them on reconnection.
- For failed API calls: retry automatically with exponential backoff (1s, 2s, 4s, 8s, max 30s).
- Show retry status: "Reconnecting..." with a spinner, then "Connected" on success.
- If automatic retry fails after 3-5 attempts, show a manual "Retry" button.
- For real-time features (chat, collaboration), show a disconnected state indicator and attempt reconnection.
- Never show a network error if the user did not initiate the action (background sync failures should be silent unless they affect visible data).

### Retry Mechanisms
- **Automatic retry**: For transient errors (network timeout, 503 Service Unavailable). Use exponential backoff.
- **Manual retry**: For user-initiated actions that failed. Show a clear "Try again" button next to the error message.
- **Idempotent operations**: Ensure retried actions do not create duplicates. Use idempotency keys for payment and creation operations.
- Show a loading state during retry: "Trying again..." not just the original loading state.
- After multiple failed retries, suggest alternative actions: "We are having trouble connecting. Try again later or download your data as a backup."
- For file uploads: support resumable uploads so users do not restart large uploads from scratch.

### Graceful Degradation
- If a non-critical feature fails (analytics, recommendations), hide it silently and proceed with the core experience.
- If a critical feature fails (authentication, data loading), show the error clearly with recovery options.
- Serve cached content when fresh data is unavailable: "Showing data from 2 hours ago. Refresh to try loading the latest."
- For failed image loads: show a placeholder with the product name, not a broken image icon.
- For failed third-party widgets: show a fallback UI or "Feature temporarily unavailable" message, not a blank space.
- Degrade feature richness progressively: real-time > polling > cached > static fallback.

### Error Boundaries (Component Architecture)
- Wrap major UI sections in error boundaries so a failure in one section does not crash the entire page.
- The error boundary fallback should match the size and layout of the component it replaces.
- Show a "Something went wrong in this section. Try reloading." message with a reload button for the section (not the page).
- Log error boundary catches to an error tracking service with component stack traces.
- Reset the error boundary state on navigation or when the user clicks retry.
- Critical paths (checkout, authentication) should have dedicated error boundaries with tailored recovery messages.

### Toast and Notification Errors
- Use toasts for errors from background operations or actions the user initiated from a different area.
- Toast format: brief description + action ("Upload failed. Retry").
- Auto-dismiss informational toasts after 5-8 seconds. Error toasts should persist until the user dismisses them or takes action.
- Stack multiple toasts vertically without overlapping.
- Position: bottom-left or bottom-right to avoid blocking primary content and navigation.
- For critical errors, use an inline alert or modal instead of a toast (toasts can be missed).
- Limit to 3 visible toasts simultaneously. Queue additional ones.

### Confirmation and Destructive Action Prevention
- For destructive actions (delete, remove, cancel subscription): require explicit confirmation with a dialog.
- Confirmation dialog should state the action and its consequences: "Delete this project? All files and data will be permanently removed. This cannot be undone."
- Primary action label should name the action: "Delete project" not "OK" or "Yes."
- For high-stakes actions, require typing a confirmation phrase: "Type 'delete my account' to confirm."
- Provide undo where possible instead of confirmation. Undo is faster and less disruptive.
- Show a "undo" toast for 10 seconds after soft-delete actions: "Project deleted. Undo."

## Checklist
- [ ] All error messages include what happened and what to do next
- [ ] Inline validation fires on blur, not on every keystroke
- [ ] Form errors show both a summary and per-field messages
- [ ] User input is never cleared due to validation errors
- [ ] 404, 500, and 403 pages maintain navigation and offer recovery paths
- [ ] Network errors are detected and displayed with automatic retry
- [ ] Retry uses exponential backoff with a fallback to manual retry
- [ ] Error boundaries prevent section failures from crashing the page
- [ ] Toast errors for background operations persist until dismissed
- [ ] Destructive actions require confirmation with consequence statement
- [ ] Error messages use plain language without technical jargon
- [ ] Undo is offered for reversible destructive actions

## Anti-patterns
- Displaying raw error codes or stack traces to users.
- "An error occurred" with no details or recovery path.
- Clearing the entire form when one field fails validation.
- Validating on every keystroke, showing errors before the user finishes typing.
- Disabling the submit button based on validation state without indicating why it is disabled.
- Generic 404 pages with no navigation or search.
- Silent failures that leave the user wondering if their action worked.
- Network error messages that appear for background operations the user did not initiate.
- Toasts for critical errors that auto-dismiss before the user reads them.
- "Are you sure?" dialogs without stating what the user is confirming or the consequences.
- Retrying non-idempotent operations (creating duplicate records).
- Error pages that look completely different from the rest of the application.

## Keywords
error handling, error messages, validation, inline validation, form errors, 404, 500, network error, offline, retry, exponential backoff, graceful degradation, error boundary, toast, notification, destructive action, confirmation dialog, undo, recovery
