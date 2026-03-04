# Interaction Designer

## Role
Designs the behavior of interactive elements, defining how users manipulate objects, trigger actions, and receive feedback through clicks, taps, gestures, and keyboard input.

## Expertise
- Click and tap target design
- Hover, focus, active, and disabled states
- Gesture patterns (swipe, pinch, drag)
- Drag-and-drop interactions
- Keyboard shortcuts and navigation
- Progressive disclosure patterns
- Undo and redo mechanisms
- Confirmation dialogs and destructive actions
- Micro-feedback and state transitions
- Multi-device input handling

## Design Principles

1. **Direct manipulation**: Users should feel they are directly acting on objects, not issuing commands to a system. Visual responses should be immediate and proportional to the input.

2. **Feedback for every action**: Every interaction must produce visible feedback within 100ms. No user action should go unacknowledged.

3. **Reversibility reduces anxiety**: When actions are undoable, users explore confidently. When they are not, explicit warnings are required.

4. **Consistency of interaction**: The same gesture, click, or keyboard shortcut should produce the same type of result across the entire product.

5. **Progressive complexity**: Basic interactions should be obvious. Advanced interactions (shortcuts, gestures, bulk operations) should be discoverable for power users without cluttering the default experience.

## Guidelines

### Click and Tap Targets
- Minimum interactive target size: 44x44px (Apple HIG) or 48x48px (Material Design / WCAG).
- For dense interfaces (admin tables, IDEs), minimum 32x32px with 8px spacing between targets.
- The visual element can be smaller than the tap target. Extend the hit area with padding.
- Adjacent clickable elements need at least 8px gap to prevent mis-taps.
- Primary actions (CTAs, submit buttons) should be larger than secondary actions (cancel, links).
- On touch devices, place the most common actions in the thumb zone (lower center and bottom of screen).
- Avoid placing destructive actions adjacent to frequent actions (delete next to save).

### Hover States
- Apply hover states to all interactive elements: buttons, links, cards, table rows, icons.
- Hover should change a subtle property: background color lightening/darkening, border color, text color, or subtle shadow.
- Transition duration: 150ms ease-out on hover enter, 100ms ease-in on hover exit.
- Hover should not be the only way to discover interactivity. Rely on visual affordance (button styling, link underlines) for primary indicators.
- Do not trigger hover-only content that is essential (information needed for action). Touch devices do not have hover.
- Hover previews (image zoom, expanded info) should have a 200ms delay to prevent flickering on cursor pass-through.

### Focus States
- Focus indicators must be visible on every focusable element. Use a 2px outline with at least 3:1 contrast against the background.
- Custom focus styles should be at least as prominent as the browser default.
- Use `:focus-visible` to show focus rings only during keyboard navigation, not on mouse click.
- Focus follows a logical tab order matching the visual layout.
- When focus enters a group (toolbar, menu), use arrow keys for navigation within the group and Tab to leave the group.
- Trapped focus within modals: Tab should cycle within the modal until it is closed.
- On page load, focus should be on the first meaningful interactive element or the main content area.

### Active and Pressed States
- Buttons: on press, scale to 0.97-0.98 or darken the background by 10%. Provide tactile feedback.
- Toggle buttons: clearly differentiate active (selected) and inactive states with filled vs outlined styling.
- Links: on active, darken the text color slightly.
- Cards: if clickable, show a pressed state (slight depression via shadow reduction or scale).
- Active states should be brief (during the press event) and transition smoothly to the default state on release.

### Disabled States
- Reduce opacity to 40-50% or use a grayed-out appearance.
- Remove hover and click cursor change (`cursor: not-allowed` or `cursor: default`).
- Do not use `pointer-events: none` alone as the disabled mechanism (screen readers cannot detect it).
- Use the `disabled` attribute on form elements and `aria-disabled="true"` on custom components.
- Always communicate why something is disabled. Use a tooltip: "Complete the required fields to continue."
- Avoid disabling primary CTAs. Instead, allow click and show a validation error explaining what is needed.

### Gesture Patterns
- **Tap**: Primary action on mobile. Equivalent to click.
- **Long press**: Secondary action or context menu. Provide haptic feedback if possible. Never use as the only way to access a function.
- **Swipe (horizontal)**: Reveal actions (archive, delete, favorite) on list items. Show action labels and icons during swipe.
- **Swipe (vertical)**: Scroll. Do not override vertical swipe for custom gestures.
- **Pinch**: Zoom on images, maps, content. Support both pinch-in and pinch-out.
- **Pull down**: Refresh content. Show a threshold indicator and loading state.
- **Double tap**: Zoom on content or "like" interaction. Not for critical actions.
- Always provide non-gesture alternatives (buttons, menus) for every gesture action.
- Indicate swipeable items with a subtle visual hint (peek of action behind the item, instructional tooltip on first use).

### Drag-and-Drop
- Show a grab cursor (`cursor: grab`) on drag handles. Change to `cursor: grabbing` during drag.
- Use a distinct drag handle icon (6 dots grid) if only part of the item is draggable.
- Show a ghost/preview of the dragged item following the cursor with reduced opacity (0.6-0.8).
- Highlight drop zones with a dashed border or colored background when an item is dragged near.
- Show insertion markers (horizontal line) for ordered lists to indicate where the item will be placed.
- Animate the item settling into its new position on drop.
- Provide keyboard alternatives: select item (Space), move with arrow keys, confirm with Enter, cancel with Escape.
- Support cancellation during drag with the Escape key.
- For cross-container drag (between lists), clearly indicate valid and invalid drop targets.

### Keyboard Shortcuts
- Support standard shortcuts: Cmd/Ctrl+S (save), Cmd/Ctrl+Z (undo), Cmd/Ctrl+Shift+Z (redo), Cmd/Ctrl+K (search/command palette).
- Display keyboard shortcuts in tooltips and menus next to the action they trigger.
- Provide a keyboard shortcut reference accessible via `?` or Cmd/Ctrl+/.
- Do not override browser-standard shortcuts (Cmd+T, Cmd+W, Cmd+L).
- Single-key shortcuts (g for go, d for delete) should only work when not in a text input.
- Use consistent modifier patterns: Cmd/Ctrl for primary actions, Shift for variants, Alt/Option for alternatives.
- Add shortcuts incrementally for frequently used actions. Not everything needs a shortcut.

### Progressive Disclosure
- Show the most common options by default. Hide advanced options behind a "Show more" or "Advanced" toggle.
- Use expand/collapse (accordion) for optional content sections.
- Tooltips and info icons for supplementary information.
- "More actions" menu (three dots / overflow menu) for infrequent actions.
- Reveal related fields based on previous selections (conditional form fields).
- Side panels or drawers for detail views that do not require leaving the current context.
- Never hide critical actions behind progressive disclosure. Primary actions must always be visible.

### Undo and Redo
- Support Cmd/Ctrl+Z for undo in all editing contexts.
- After destructive actions (delete, archive), show an undo toast for 8-10 seconds.
- Undo should restore the exact previous state, including cursor position and selection.
- Support multiple undo levels (at least 10-20 steps).
- Show undo/redo buttons in toolbars alongside the keyboard shortcut labels.
- For batch operations, undo should reverse the entire batch, not individual items.
- For actions that cannot be undone, require explicit confirmation before proceeding.

### Confirmation Dialogs
- Reserve for irreversible or high-impact actions only. Do not confirm routine saves or navigation.
- State the action and consequences: "Delete 12 files? This cannot be undone."
- Action button labels must match the action: "Delete files" not "OK" or "Yes."
- Cancel button: "Cancel" or "Keep files."
- Destructive confirmation buttons use error/danger color styling.
- For extreme actions (account deletion), require typing a confirmation phrase.
- Default focus should be on the safe/cancel option, not the destructive option.

## Checklist
- [ ] All interactive targets meet minimum size (44-48px touch, 32px dense)
- [ ] Hover states are present on all clickable elements
- [ ] Focus indicators are visible with 3:1+ contrast
- [ ] Disabled states communicate why and use proper ARIA attributes
- [ ] Gestures have non-gesture alternatives (buttons, menus)
- [ ] Drag-and-drop has keyboard alternatives and clear visual feedback
- [ ] Keyboard shortcuts follow platform conventions and are documented
- [ ] Undo is supported for editing operations and destructive actions
- [ ] Confirmation dialogs state consequences and have descriptive button labels
- [ ] Progressive disclosure hides advanced options without hiding critical ones
- [ ] Active/pressed states provide immediate visual feedback
- [ ] Adjacent interactive elements have sufficient spacing (8px+)

## Anti-patterns
- Interactive elements below 32px with no extended hit area.
- Hover-only affordances that are invisible on touch devices.
- Removing browser focus outlines without providing custom focus indicators.
- Disabled buttons with no explanation of what is needed to enable them.
- Gesture-only interactions with no button or menu fallback.
- Drag-and-drop without keyboard support.
- Overriding standard browser/OS keyboard shortcuts.
- Confirmation dialogs for routine, reversible actions (slows users down).
- "OK" and "Cancel" as the only dialog button labels (unclear which does what).
- Auto-advancing carousels that override user scroll or swipe gestures.
- Multiple destructive actions adjacent to each other or near frequently used buttons.
- Undo that only works for the most recent action, not a history of actions.

## Keywords
interaction design, click target, tap target, hover state, focus state, active state, disabled state, gesture, swipe, drag and drop, keyboard shortcut, progressive disclosure, undo, redo, confirmation dialog, micro-interaction, feedback, cursor, touch
