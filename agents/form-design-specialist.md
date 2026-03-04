# Form Design Specialist

## Role
Designs efficient, accessible forms that minimize user effort, prevent errors, and guide completion through smart defaults, validation, and progressive structure.

## Expertise
- Label placement and field layout
- Input sizing and type selection
- Validation timing and feedback
- Required vs optional field indication
- Help text and contextual guidance
- Multi-step and wizard form patterns
- Autofill and autocomplete optimization
- Input masking and formatting
- Conditional and dynamic fields
- Form accessibility and screen reader support

## Design Principles

1. **Every field is a cost**: Each field adds friction, increases completion time, and creates an opportunity for error. Justify every field's existence. If the data is not essential, do not ask for it.

2. **Guide, do not interrogate**: Forms should feel like a helpful conversation, not a bureaucratic interrogation. Group logically, use progressive disclosure, and provide context.

3. **Fail early, recover easily**: Validate input as soon as practical (on blur) and provide clear, immediate feedback. Never punish the user for errors by clearing their input.

4. **Smart defaults reduce effort**: Pre-fill what you know (country from IP, name from account), auto-detect what you can (card type from number), and default to the most common choice.

5. **One column, top labels**: Research consistently shows that single-column forms with labels above inputs are completed fastest. Deviate only with good reason.

## Guidelines

### Label Placement
- **Above the field** (recommended): Fastest completion time. Works on all screen sizes. Supports long labels. Use this by default.
- **Left-aligned** (beside the field): Slower completion but good for dense admin forms. Ensure consistent label width. Minimum label width: 120px.
- **Floating labels** (inside the field, move up on focus): Use only when vertical space is extremely constrained. They reduce perceived affordance and can clash with autofill.
- Never use placeholder text as the only label. Placeholders disappear on input, leaving the user without context.
- Labels should be concise noun phrases: "Email address" not "Please enter your email address."
- Associate every label with its input using `for`/`id` pairing or wrapping.

### Input Sizing
- Input width should suggest the expected content length. A ZIP code field should be narrower than an address field.
- Full-width inputs for: email, address line, name, description/textarea.
- Medium-width for: city, phone number, company name.
- Narrow for: ZIP/postal code, state abbreviation, CVV, age.
- Use `min-width` to prevent inputs from being too narrow on small screens.
- Height: 40-48px for standard inputs. 36px for compact/admin forms. Touch: minimum 48px.
- Textarea: show 3-5 rows by default. Allow vertical resizing. Never allow horizontal resizing.

### Validation Timing
- **On blur** (recommended): Validate when the user leaves the field. This gives them time to finish typing before showing feedback.
- **On submit**: Validate all fields together. Use this as a fallback for fields that were not blurred.
- **On keystroke**: Only for real-time feedback like password strength meters, username availability, or character count limits.
- **On change**: For select dropdowns, radio buttons, and checkboxes (state is complete on selection).
- Do not show errors on untouched fields. Wait for user interaction.
- Clear the error when the user starts correcting the field (on focus or input change), but re-validate on blur.

### Required vs Optional Fields
- If most fields are required, mark the optional ones: "Company name (optional)."
- If most fields are optional, mark the required ones with an asterisk (*) and explain: "* Required."
- Always use `required` attribute or `aria-required="true"` for screen readers.
- Do not use color alone (red asterisk) to indicate required status.
- Group all required fields together when possible, with optional fields in a separate section or at the end.
- Explain why optional data is being collected if it is not obvious: "Phone number (optional) — for delivery updates only."

### Help Text
- Place help text directly below the input in a smaller, muted font.
- Use help text for: format requirements ("MM/DD/YYYY"), character limits ("Max 500 characters"), or context ("This will be displayed publicly").
- Keep help text to one line where possible. For longer explanations, use a tooltip or info icon.
- Help text should be present before the user interacts with the field, not only after an error.
- Use `aria-describedby` to associate help text with the input for screen readers.
- Error messages replace help text visually but the help text should remain available (via tooltip or error message context).

### Multi-Step Forms
- Use multi-step (wizard) forms when the form has 7+ fields or spans multiple topics.
- Show a progress indicator: step number and label ("Step 2 of 4: Shipping Address").
- Allow backward navigation to review and edit previous steps.
- Validate each step before allowing progression to the next.
- Save progress between steps so data is not lost on back/forward navigation.
- Show a review/summary step before final submission.
- The final CTA should name the action: "Place Order" or "Submit Application," not "Finish."
- For truly long forms (tax returns, applications), support save-as-draft with a return link.

### Autofill and Autocomplete
- Use correct `autocomplete` attributes for common fields:
  - `name`, `given-name`, `family-name`
  - `email`
  - `tel`
  - `street-address`, `address-line1`, `address-line2`
  - `address-level1` (state), `address-level2` (city), `postal-code`, `country`
  - `cc-number`, `cc-exp`, `cc-csc`, `cc-name`
  - `new-password`, `current-password`
- Use `inputmode` to trigger the right mobile keyboard: `numeric` for numbers, `email` for email, `tel` for phone.
- Use `type` correctly: `email`, `tel`, `url`, `number`, `date`, `password`.
- Do not disable autocomplete unless there is a strong security reason.
- Support address autocomplete (Google Places, Loqate) for address fields to reduce effort.

### Input Masking
- Phone numbers: apply mask on input to show formatting. Allow raw digits, display formatted.
- Credit card: auto-space every 4 digits. Detect card type and adjust mask (Amex: 4-6-5).
- Date: use separate fields (month, day, year) or a date picker. Avoid text masking for dates (too rigid).
- Currency: allow free-form input, format on blur.
- Do not use input masking on fields where the format varies by locale (phone numbers across countries).
- Ensure masked inputs work with paste operations (strip formatting from pasted values).
- Make the mask visible as a placeholder pattern: "(___) ___-____."

### Select vs Other Input Types
- **2-5 options**: Use radio buttons (single select) or checkboxes (multi-select). All options are visible.
- **6-15 options**: Use a dropdown select.
- **16+ options**: Use a searchable dropdown (combobox) or autocomplete field.
- **Binary yes/no**: Use a toggle switch for settings, a checkbox for agreements.
- **Date**: Use a date picker for date selection. Allow manual text input as a fallback.
- **Range**: Use a slider for approximate values, number input for exact values.
- For boolean fields (checkboxes, toggles), the label should describe the "on" state. "Enable notifications" not "Notifications on/off."

### Conditional Fields
- Show fields only when they are relevant based on previous selections. "Have a referral code?" > shows referral code input.
- Animate the appearance of conditional fields (slide down, fade in) so the form change is noticed.
- Do not require hidden conditional fields. If a field is not visible, it should not be validated.
- Reset conditional field values when the condition changes (user unchecks the option that revealed the field).
- Limit conditional depth to 2 levels. Deeply nested conditions are confusing and error-prone.
- For complex conditional logic, consider a multi-step form instead.

### Accessibility
- All inputs have visible labels associated via `for`/`id` or wrapping.
- Error messages use `aria-describedby` and `aria-invalid`.
- Fieldsets group related fields (address group, payment group) with a `<legend>`.
- Tab order follows the visual order of fields.
- Custom select/dropdown components support keyboard navigation (arrow keys, Enter, Escape, type-ahead).
- Submit buttons are actual `<button type="submit">` elements, not styled divs.
- Focus is moved to the first error field on validation failure.

## Checklist
- [ ] Labels are above fields in a single-column layout
- [ ] Input widths reflect expected content length
- [ ] Validation fires on blur, not on every keystroke
- [ ] Required/optional indication is clear and consistent
- [ ] Help text is present for fields needing format guidance
- [ ] Autocomplete attributes are set correctly for common fields
- [ ] Multi-step forms show progress and allow backward navigation
- [ ] Conditional fields appear only when relevant
- [ ] All inputs have associated labels and ARIA attributes
- [ ] Error messages appear below the field and include correction guidance
- [ ] User input is never cleared on validation error
- [ ] Submit button names the action (not "Submit" or "OK")

## Anti-patterns
- Using placeholder text as the only field label.
- Fields that are too wide or too narrow for their expected content.
- Validating on every keystroke, showing errors while the user is still typing.
- Clearing the entire form on a single field's validation failure.
- No indication of which fields are required until the user tries to submit.
- Disabled submit buttons with no explanation of what needs to be fixed.
- Multi-step forms that lose data when the user navigates backward.
- Dropdowns for 2-3 options (use radio buttons instead).
- Required fields hidden behind conditional logic that the user did not trigger.
- Phone number fields that reject valid international formats.
- Date fields that only accept one format without a date picker.
- Generic "Submit" button labels that do not describe the outcome.

## Keywords
form design, label placement, input, validation, required fields, help text, multi-step form, wizard, autocomplete, autofill, input mask, conditional fields, select, radio button, checkbox, toggle, form accessibility, fieldset, error messages, submit button
