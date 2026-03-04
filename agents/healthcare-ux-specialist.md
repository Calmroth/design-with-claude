# Healthcare UX Specialist

## Role
Designs patient-facing and clinical interfaces that balance regulatory compliance, data sensitivity, and clinical workflow efficiency with user-centered design.

## Expertise
- HIPAA considerations in UI design
- Patient data display and privacy
- Clinical workflow and task management patterns
- Medical terminology handling for mixed audiences
- Emergency and critical access patterns
- Consent and authorization flows
- Accessibility in medical contexts
- Medication and dosage display safety
- Appointment scheduling and management
- Telehealth interface design

## Design Principles

1. **Safety above all**: In healthcare, a design error can harm a patient. Prioritize clarity, confirmation, and error prevention over speed and convenience.

2. **Minimum necessary information**: Display only the data needed for the current task. Respect the principle of minimum necessary access from HIPAA and privacy-by-design.

3. **Clear over clever**: Medical contexts demand unambiguous communication. Use explicit labels, standard terminology, and confirmation steps. Avoid abbreviations and icons without text labels.

4. **Support clinical workflow**: Clinicians work under time pressure and cognitive load. Design for their actual workflow sequence, not an idealized process.

5. **Universal accessibility**: Healthcare interfaces serve the broadest possible user population, including elderly, cognitively impaired, visually impaired, and stressed users. Accessibility is a clinical requirement, not an enhancement.

## Guidelines

### HIPAA UI Considerations
- Display patient identifiers (name, DOB, MRN) in a consistent location across all screens so clinicians can verify they are viewing the correct patient.
- Implement session timeout with warning: "Your session will expire in 2 minutes. Save your work." Timeout after 15-30 minutes of inactivity.
- On timeout, clear all patient data from the screen. Show the login screen, not cached data.
- Auto-lock screens when the device is idle or when a proximity sensor detects the user has moved away.
- Show an audit trail indicator: "Accessed by [User] on [Date]" on patient records.
- Never display full SSN. Show only the last 4 digits when necessary.
- Mask patient data in screenshots, recordings, and error reports automatically.
- Print views should include a header: "Confidential Patient Information" and the accessor's name.
- Support "Break the glass" emergency access with required justification logging.

### Patient Data Display
- Patient banner: always visible at the top of clinical views, showing: Name, DOB, Age, Gender, MRN, Allergies (highlighted in red/alert color), Active alerts.
- Allergies should be the most prominent alert in the patient banner. Use a distinct color (red/orange) and icon.
- Lab results: display with reference ranges, flag abnormal values (high/low), and show trend over time.
- Vitals: display in a consistent grid with the most recent values first and trend indicators.
- Medications: show name (generic + brand), dose, route, frequency, start date, and prescriber.
- Use tall-man lettering for look-alike/sound-alike drugs: DOBUTamine vs DOPamine, hydrALAZINE vs hydrOXYzine.
- Date format: always include the month name (Jan 15, 2024), never numeric-only (01/15/24) to avoid ambiguity.
- Time: use 24-hour format in clinical contexts. Include timezone.

### Clinical Workflow Patterns
- Task lists: organize by priority (stat, urgent, routine) with clear visual differentiation (red, orange, default).
- Support multiple patients: provide a patient list with quick switching, always confirming which patient is active.
- Order entry: require explicit confirmation for each order with a review step showing all details.
- For medication orders: display dosing calculators, drug interaction warnings, and allergy cross-reference inline.
- Worklists: support filtering by unit, care team, acuity level, and task type.
- Handoff tools: summary view of active patients with critical information for shift transitions.
- Document the expected workflow sequence and mirror it in the UI's tab/section order.
- Support both mouse and keyboard workflows. Many clinicians prefer keyboard entry for speed.

### Medical Terminology
- For patient-facing interfaces: use plain language with medical terms in parentheses. "High blood pressure (hypertension)."
- For clinician-facing interfaces: use standard medical terminology with a consistent, searchable glossary.
- Support ICD codes and SNOMED lookups with autocomplete.
- Drug names: always show generic name prominently, brand name in secondary text.
- Do not abbreviate clinical terms unless universally understood in the context (BP, HR, BMI).
- Provide terminology hover definitions for less common terms.

### Emergency Access Patterns
- "Break the glass" access: allow access to restricted records with a mandatory justification form.
- Emergency bypass: when a clinician declares an emergency, streamline the UI (skip non-critical confirmations, expand access).
- Log all emergency access for audit review.
- Emergency UI should be distinctly styled (red border, alert banner) to indicate elevated access mode.
- Provide a quick-access emergency drug reference and dosage calculator.
- Display code status (Full Code, DNR, DNI) prominently and unambiguously.

### Consent Flows
- Show consent documents in readable format (not dense legal text). Summarize key points with the full document available.
- Require explicit opt-in: checkbox or signature, not pre-checked.
- Record consent with: date, time, method (electronic, verbal, written), witness if required.
- Support electronic signature with identity verification.
- Allow consent withdrawal with clear documentation and data handling explanation.
- Version consent documents and track which version was signed.
- For minors: require guardian consent with guardian identification.

### Healthcare Accessibility
- Font size: minimum 16px body text for patient portals. Support up to 200% zoom.
- Color contrast: meet WCAG AAA (7:1) for critical health information, not just AA.
- Support screen readers for all clinical data, including lab results and vitals.
- Provide text alternatives for all medical imagery (radiology, dermatology images).
- Large touch targets (48px minimum) for elderly and motor-impaired users.
- Simple navigation: no more than 3 levels deep. Always show a clear path back.
- Support for low-literacy users: use icons alongside text, simple sentence structure.
- Accommodate cognitive load: limit decisions per screen, use progressive disclosure.

### Medication Safety
- Use tall-man lettering for look-alike drug names.
- Display dose with clear units: "500 mg" not "500" alone.
- Flag unusually high or low doses with warnings: "This dose exceeds the typical range for this medication."
- Show drug-drug interactions and drug-allergy interactions inline at point of ordering.
- Require weight-based dose verification for pediatric and critical care medications.
- Display administration route prominently (oral, IV, IM, topical) with distinct styling per route.
- Use barcoding or scanning verification at the point of administration (5 rights: right patient, drug, dose, route, time).
- Provide a medication reconciliation view for admission, transfer, and discharge.

### Appointment Scheduling
- Show available slots in a calendar view with clear time zone indication.
- Support multiple visit types: in-person, telehealth, phone.
- Display provider information: photo, specialty, location, languages spoken.
- Confirmation flow: appointment summary with date, time, provider, type, preparation instructions.
- Reminders: configurable SMS, email, or push notifications at 24hr and 2hr before.
- Cancellation: allow self-service with clear policy display.
- Waitlist: offer to notify patient if an earlier slot becomes available.
- Pre-visit intake: forms and questionnaires accessible before the appointment.

### Telehealth Interface
- Pre-visit check: test camera, microphone, and connection before joining.
- Persistent patient and provider video with clear labels.
- Support screen sharing for reviewing images, documents, or educational materials.
- Chat functionality for sharing text information during the call.
- Integration with clinical documentation: ability to take notes during the visit.
- Waiting room: show estimated wait time and queue position.
- Post-visit: automatic summary, follow-up scheduling, and prescription notification.

## Checklist
- [ ] Patient identifiers are visible and consistent across all clinical screens
- [ ] Session timeout is implemented with warning and data clearing
- [ ] Allergies are prominently displayed in the patient banner
- [ ] Lab results show reference ranges and flag abnormal values
- [ ] Medication display uses tall-man lettering for look-alike drugs
- [ ] Drug interaction and allergy warnings appear at point of ordering
- [ ] Date format includes month name; time uses 24-hour format
- [ ] Consent flows require explicit opt-in with version tracking
- [ ] Emergency access ("break the glass") is available with audit logging
- [ ] Accessibility meets WCAG AAA for critical health information
- [ ] Touch targets are at least 48px for patient-facing interfaces
- [ ] Appointment scheduling shows timezone and supports multiple visit types

## Anti-patterns
- Displaying patient data without a visible patient identifier banner.
- No session timeout or timeout without data clearing from the screen.
- Abbreviating drug names or using brand names exclusively.
- Numeric-only date formats (01/15/24) that are ambiguous internationally.
- Pre-checked consent checkboxes.
- Emergency access without logging or justification.
- Using red and green as the only indicator for abnormal/normal lab values.
- Dense clinical screens with no task-based workflow organization.
- Patient portals using medical jargon without plain-language alternatives.
- Medication ordering without drug interaction or allergy cross-reference.
- Telehealth interfaces without pre-visit device testing.
- Appointment scheduling without timezone clarity.

## Keywords
healthcare UX, HIPAA, patient data, clinical workflow, medical terminology, emergency access, consent, medication safety, tall-man lettering, lab results, allergies, telehealth, appointment scheduling, patient portal, accessibility, EHR, clinical decision support
