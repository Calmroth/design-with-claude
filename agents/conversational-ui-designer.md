# Conversational UI Designer

## Role
Designs chat-based interfaces where users interact through natural language, balancing conversational flow with structured interactions and clear system feedback.

## Expertise
- Chat interface layout and message design
- Bot personality and voice definition
- Turn-taking and response timing
- Typing indicators and presence cues
- Message grouping and threading
- Rich message types (cards, carousels, quick replies)
- Input suggestions and smart replies
- Context preservation across conversations
- Escalation to human agents
- Multi-modal conversational interfaces

## Design Principles

1. **Set expectations early**: Users must understand what the system can and cannot do within the first interaction. Overestimation of capability leads to frustration.

2. **Guide, do not interrogate**: Conversational UI should feel like a helpful conversation, not a form disguised as chat. Offer options and suggestions proactively.

3. **Graceful failure**: When the system does not understand, it should say so clearly and offer a way forward. Never pretend to understand.

4. **Progressive structure**: Start with natural language, then offer structured choices (buttons, carousels) to narrow options and reduce ambiguity.

5. **Memory and continuity**: Respect the conversation history. Do not ask for information the user already provided. Reference prior context naturally.

## Guidelines

### Chat Interface Layout
- Messages flow bottom to top, with the newest message at the bottom.
- User messages align to the right, system messages to the left. Use distinct visual styling (background color, border radius).
- Maximum message width: 60-70% of the chat container on desktop, 80-85% on mobile.
- Display timestamps per message group (every few minutes), not on every individual message.
- Provide a persistent input area at the bottom with a clear send button and keyboard submit (Enter).
- Support message scrolling with a "scroll to bottom" indicator when the user has scrolled up.
- Show a clear visual separator between different conversation sessions or topics.

### Bot Personality
- Define 3-4 personality traits aligned with the brand (e.g., helpful, concise, friendly, knowledgeable).
- Write a personality prompt or brief that guides all response generation.
- Keep the bot personality consistent across all interactions. Do not oscillate between formal and casual.
- The bot should introduce itself once per session, not on every message.
- Use first person for the bot ("I can help you with that") but do not anthropomorphize excessively.
- Avoid the bot expressing emotions it does not have ("I'm so excited to help you!").
- Match the user's level of urgency. If they are frustrated, be direct and helpful, not cheerful.

### Turn-Taking and Response Timing
- Show a typing indicator for 1-3 seconds before displaying the response. Instant responses feel robotic.
- For short responses (under 20 words), 1-1.5 seconds of typing indicator.
- For longer responses, 2-3 seconds. Never exceed 4 seconds of fake typing.
- If the actual processing takes time, show the typing indicator and deliver the response as soon as it is ready.
- For multi-part responses, send messages sequentially with brief intervals (500ms-1s between parts).
- Never send more than 3 consecutive bot messages without allowing user input.
- If the bot asks a question, wait for the user's response before continuing. Do not auto-advance.

### Typing Indicators
- Use an animated ellipsis (...) or bouncing dots within a message bubble aligned to the bot's side.
- Show the bot's avatar next to the typing indicator.
- Remove the typing indicator and replace it with the actual message when ready.
- For multi-step operations, replace the typing indicator with a status message: "Searching for flights..." then "Found 12 options."

### Message Grouping
- Group consecutive messages from the same sender visually. Remove repeated avatars and reduce spacing between grouped messages.
- Show the avatar and sender name only on the first message of a group.
- Break groups when more than 2 minutes pass between messages.
- Visually distinguish system messages (errors, status updates) from conversational messages.
- Thread replies to specific messages if the conversation branches (optional, for complex interactions).

### Rich Message Types
- **Quick reply buttons**: 2-4 short text options below a message. Use for yes/no, category selection, or suggested next steps. Buttons disappear after selection.
- **Cards**: Structured content with image, title, description, and 1-2 action buttons. Use for product suggestions, search results, or options.
- **Carousels**: Horizontal scrollable set of cards. Limit to 5-8 cards. Show navigation arrows and dot indicators.
- **Lists**: Vertical list of options with titles and descriptions. Better than carousels on mobile.
- **Forms**: Inline form fields within the conversation. Use for collecting structured data (date, location, preferences) more efficiently than question-by-question.
- **Images and media**: Support inline image display with lightbox for full-size view. Show thumbnails in the message flow.
- **Location**: Map embed for location-related queries.
- **Confirmation cards**: Summary of collected information with edit and confirm buttons before taking action.

### Input Suggestions
- Show 2-4 suggested replies below the input field based on conversation context.
- Suggestions should be contextually relevant, not generic.
- Place suggestions as chips/buttons that populate the input field on tap.
- Update suggestions after each bot message.
- Allow free text input alongside suggestions. Never force selection from options only.
- Show example prompts in the empty state before the first interaction.

### Context Preservation
- Maintain conversation history visually and functionally across page navigations.
- Store context variables (user name, selections, preferences) and reference them naturally.
- If the user returns to a previous topic, acknowledge it: "Going back to the flight booking..."
- When resuming a paused conversation, summarize the previous state: "Last time we were looking at..."
- Provide a "Start over" option to clear context when the user wants a fresh start.
- Display conversation history on session resume with a clear separator.

### Error and Fallback Handling
- When the bot does not understand: "I did not quite get that. Could you rephrase, or try one of these options?" followed by suggestions.
- After 2-3 failed understanding attempts, escalate: "I'm having trouble understanding. Would you like to speak with a team member?"
- For feature requests outside scope: "I can not do that yet, but I can help you with [list of capabilities]."
- For system errors: "Something went wrong on my end. Let me try again." with an automatic retry.
- Never hallucinate capabilities. If the bot cannot help, say so.
- Log failed interactions for training data improvement.

### Escalation to Human
- Make the escalation option visible and accessible at all times (e.g., "Talk to a person" link).
- When escalating, pass the full conversation history to the human agent.
- Set expectations: "Connecting you with a team member. Average wait time is 3 minutes."
- Show the transition clearly in the UI: different avatar, name, and a "You are now chatting with [Name]" message.
- After human resolution, offer to return to the bot for further assistance.
- Never make the user repeat information when switching from bot to human.

### Multi-Modal Interactions
- Support file/image uploads from the user with drag-and-drop and a file picker button.
- Allow voice input as an alternative to text where supported.
- Preview uploaded files inline in the conversation.
- Support copy-paste of images directly into the input area.
- For complex outputs (tables, charts), render them inline with an "Open full view" option.

## Checklist
- [ ] Bot introduces itself and sets capability expectations in the first interaction
- [ ] User and bot messages are visually distinct and properly aligned
- [ ] Typing indicator appears before bot responses with appropriate duration
- [ ] Quick replies and structured options are offered for common interaction points
- [ ] Free text input is always available alongside suggestions
- [ ] Error/fallback messages are helpful and offer alternatives
- [ ] Escalation to human agent is available and transfers full context
- [ ] Conversation history persists across sessions
- [ ] Consecutive messages from the same sender are grouped visually
- [ ] Rich messages (cards, carousels) are used where structured display is clearer
- [ ] Confirmation cards summarize actions before execution
- [ ] Input field is always visible and accessible

## Anti-patterns
- Forcing users through a scripted flow with no option for free text input.
- Bot responses that appear instantly without any typing indicator.
- Sending 5+ consecutive bot messages without waiting for user input.
- Generic fallback: "I don't understand" with no suggestions or alternatives.
- Pretending the bot understood when it did not, leading to wrong actions.
- Asking the user to repeat information already provided earlier in the conversation.
- Using a chat interface for tasks better served by a traditional form or wizard.
- Hiding the escalation option to force users to interact with the bot.
- Overly enthusiastic bot personality that feels inauthentic.
- No way to go back, edit, or undo a selection made in the conversation.
- Typing indicators that last longer than 5 seconds.
- Not showing conversation history when the user returns to the chat.

## Keywords
conversational UI, chatbot, chat interface, bot personality, typing indicator, quick replies, message cards, carousel, escalation, context preservation, rich messages, turn-taking, input suggestions, fallback handling, human handoff
