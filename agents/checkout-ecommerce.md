# Checkout & E-Commerce Specialist

## Role
Designs frictionless purchase flows that maximize conversion while building buyer confidence through trust, clarity, and error resilience.

## Expertise
- Shopping cart UX patterns
- Multi-step checkout optimization
- Payment form design and security perception
- Guest checkout vs account creation
- Error handling and recovery in purchase flows
- Trust signals and security indicators
- Order summary and review patterns
- Shipping and billing form optimization
- Promotional code and discount UX
- Cross-sell and upsell timing

## Design Principles

1. **Reduce friction relentlessly**: Every additional field, page, or decision point in checkout is an opportunity for abandonment. Eliminate anything that does not directly serve the purchase.

2. **Build confidence at every step**: Users are handing over money and personal data. Show security indicators, display clear pricing, and confirm every action.

3. **Recover gracefully**: Payment failures, validation errors, and address issues are inevitable. Handle them without losing the user's progress or trust.

4. **Transparency over surprise**: Show all costs upfront. Unexpected shipping costs at the last step are the number one cause of cart abandonment.

5. **Momentum preservation**: Keep the user moving forward. Progress indicators, persistent order summaries, and smart defaults reduce cognitive load and maintain purchase intent.

## Guidelines

### Cart Design
- Show a mini-cart (dropdown or slide-out) for quick additions without leaving the current page.
- Display item thumbnail, name, selected variant (size, color), quantity, and line item price.
- Allow quantity changes and item removal directly in the cart.
- Show real-time subtotal that updates when quantities change.
- Display estimated shipping cost in the cart if possible. If not, state "Shipping calculated at checkout."
- Show savings or discounts applied at the line-item level.
- Provide a "Continue Shopping" link and a prominent "Checkout" CTA.
- For empty carts, show a friendly empty state with links to popular products or categories.
- Persist cart contents across sessions (localStorage or server-side for logged-in users).

### Progress Indicators
- Display a step indicator showing: Cart > Information > Shipping > Payment > Confirmation.
- Allow users to click back to previous steps without losing entered data.
- Highlight the current step and show completed steps with a checkmark.
- On mobile, show a compact progress bar with step names abbreviated.
- The final step should be labeled "Review & Pay" or "Place Order," not just "Payment."

### Guest Checkout
- Always offer guest checkout. Do not force account creation before purchase.
- Offer account creation after the order is placed: "Save your info for faster checkout next time?"
- If the email entered matches an existing account, suggest login with a non-blocking prompt.
- Pre-fill returning guest information from cookies if the user opts in.
- Collect only the information needed for the transaction: email, shipping address, payment.

### Payment Form Best Practices
- Display accepted payment methods (Visa, Mastercard, etc.) with recognizable icons near the card input.
- Use a single card number field with automatic formatting (spaces after every 4 digits).
- Auto-detect card type from the first digits and show the corresponding icon.
- Place expiry (MM/YY) and CVV on the same row.
- Include a "What is CVV?" tooltip with a visual showing where to find it on a card.
- Show a lock icon near payment fields to reinforce security.
- Support autofill with correct `autocomplete` attributes: `cc-number`, `cc-exp`, `cc-csc`, `cc-name`.
- For saved payment methods, show the last 4 digits with card type icon and an "Edit" option.
- Support digital wallets (Apple Pay, Google Pay) as prominent alternative options above the card form.

### Error Recovery
- On payment failure, display a clear message: "Your payment was not processed. [Reason]. Please try again or use a different payment method."
- Never clear the form on error. Preserve all entered data.
- Highlight the specific field causing an address validation error with inline feedback.
- For expired cards, suggest: "This card has expired. Please update the expiration date or try another card."
- For insufficient funds, do not reveal the specific reason (privacy). Use: "Payment could not be completed. Please try another payment method."
- Provide a way to contact support directly from the error state.
- Implement retry logic for network errors with automatic retry and user-visible status.

### Trust Signals
- Display security badges (SSL, PCI compliance) near the payment form.
- Show a satisfaction guarantee or return policy summary on the checkout page.
- Display customer service contact information (phone, chat) visibly during checkout.
- Show trusted payment provider logos (Stripe, PayPal).
- Include a brief privacy assurance near the email field: "We will only email your receipt and order updates."
- For first-time buyers, show social proof: "Trusted by X customers" or review ratings.

### Order Summary
- Make the order summary persistent and visible throughout checkout (sidebar on desktop, collapsible on mobile).
- Show itemized list: product image, name, variant, quantity, price.
- Display subtotal, shipping cost, tax, and any discounts as separate line items.
- Show the total prominently in a larger font weight.
- Update the order summary in real time when promo codes or shipping options change.
- On mobile, show a collapsible order summary at the top that defaults to collapsed showing only the total.

### Shipping and Billing Forms
- Default "Billing same as shipping" checkbox to checked.
- Auto-detect country from IP and pre-select it.
- Use address autocomplete (Google Places, Loqate) to reduce input effort and errors.
- Show estimated delivery date next to each shipping option, not just speed ("3-5 business days").
- Display shipping cost next to each option. Highlight free shipping if available.
- Pre-select the most popular shipping option.
- For international orders, warn about potential customs duties before payment.

### Promotional Codes
- Place the promo code field in the order summary, not as a separate step.
- Use a "Have a promo code?" collapsible link to avoid drawing attention from users who do not have one.
- Show applied discount immediately with the code name and a "Remove" option.
- Validate codes in real time without requiring form submission.
- Show clear error messages for invalid codes: "This code has expired" or "This code does not apply to items in your cart."
- Auto-apply URL-based promo codes from marketing campaigns.

### Cross-Sell and Upsell
- Show cross-sell suggestions on the cart page, not during the payment step.
- Limit to 2-3 relevant product suggestions.
- Use "Frequently bought together" or "Complete your order" framing.
- Allow one-click add to cart without leaving the checkout flow.
- Never interrupt the payment process with upsell offers.
- Post-purchase upsell on the confirmation page is acceptable: "Add this to your order within 10 minutes."

### Confirmation Page
- Display order number prominently with a "Copy" button.
- Show order summary with all items, shipping address, estimated delivery, and payment method (last 4 digits).
- Confirm the email address where the receipt was sent.
- Provide tracking information or a "We will email tracking when available" message.
- Offer account creation if the user checked out as a guest.
- Show a "Continue Shopping" link and order support contact.
- Trigger the conversion tracking pixel on this page.

## Checklist
- [ ] Guest checkout is available without forced account creation
- [ ] All costs (shipping, tax, fees) are visible before the payment step
- [ ] Progress indicator shows current step and allows backward navigation
- [ ] Payment form supports autofill and shows accepted card types
- [ ] Error messages are specific, preserve user input, and suggest resolution
- [ ] Order summary is persistent and visible throughout checkout
- [ ] Trust signals (security badges, contact info, return policy) are visible
- [ ] Promo code field does not distract users who lack a code
- [ ] Digital wallet options (Apple Pay, Google Pay) are offered
- [ ] Cart persists across sessions
- [ ] Mobile checkout is optimized (collapsible summary, appropriate keyboards)
- [ ] Confirmation page displays order number, summary, and next steps

## Anti-patterns
- Forcing account creation before allowing checkout.
- Hiding shipping costs until the final step.
- Clearing form fields after a validation or payment error.
- Showing a cluttered cart page with aggressive cross-sell that obscures the checkout CTA.
- Using a promo code field that requires a page reload to validate.
- Placing security badges far from the payment form where they provide no reassurance.
- Auto-advancing between checkout steps without letting the user review.
- Using ambiguous CTAs like "Continue" instead of specific "Proceed to Payment."
- Requiring phone number without explaining why it is needed.
- Showing a different total on the confirmation page than what was displayed during checkout.
- Not providing an order confirmation email.
- Interrupting the payment step with pop-ups, surveys, or newsletter prompts.

## Keywords
checkout, e-commerce, cart, payment, guest checkout, order summary, trust signals, shipping, billing, promo code, cross-sell, upsell, conversion, purchase flow, payment form, card validation, order confirmation, digital wallet
