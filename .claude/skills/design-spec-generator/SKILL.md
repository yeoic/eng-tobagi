# SKILL: design-spec-generator
Goal: Generate an implementation-ready UI/UX design spec (no code) that a frontend engineer can build using Tailwind CSS + shadcn/ui with minimal ambiguity.

## Hard Rules
- NO code blocks (no TS/JS/React/HTML/CSS).
- Use shadcn/ui component names only (e.g., Card, Button, Tabs).
- Use measurable layout language (columns, spacing rhythm, section order, “above the fold”).
- Every interactive UI must define: states (loading/empty/error) + primary CTA + success metric proxy.

## Inputs to capture (infer if missing)
- Screen type: Public marketing vs Authenticated app vs Admin
- Primary user intent (single sentence)
- Primary CTA (one)
- Key entities (e.g., Book/Chapter/Sentence/User/Progress)
- Data density: low/medium/high
- Risk: mistakes users can make (deletes, irreversible changes)

## Output Checklist (must include all)
### 0) Design Goal
- [ ] Page/flow name
- [ ] Primary user intent
- [ ] Primary CTA
- [ ] Success metric proxy (e.g., completion %, task time, conversion)

### 1) Design System (tokens & rules)
- [ ] Layout tokens (container, grid, spacing rhythm)
- [ ] Typography tokens (H1/H2/body/muted)
- [ ] Color/surface rules (emphasis hierarchy)
- [ ] Component rules (button hierarchy, form behavior, state patterns)

### 2) Information Architecture
- [ ] Sections top-to-bottom
- [ ] For each section: purpose, key elements, actions

### 3) Screen Specs (pixel-level structure)
For each screen:
- [ ] Above the fold structure (mobile + desktop)
- [ ] Main content structure (lists/tables/forms)
- [ ] Interaction model (filter/sort/pagination/search)
- [ ] States: loading / empty / error (exact behavior)
- [ ] Microcopy: headline, helper text, CTA labels, error tone

### 4) Responsive Rules
- [ ] Mobile: layout changes + navigation pattern
- [ ] Tablet: changes
- [ ] Desktop: changes

### 5) Accessibility Notes
- [ ] Keyboard path + focus order
- [ ] Labels and error announcement expectations (conceptual)
- [ ] Contrast and hit-target notes

### 6) Handoff to Frontend
- [ ] Component inventory (reusable components to build)
- [ ] Route map (if multi-page)
- [ ] Risky parts (common implementation pitfalls)
- [ ] “Do not change” rules (to preserve the design)

## Quality Bar (reject if any fail)
- [ ] A frontend engineer can implement without guessing layout order or component choices
- [ ] Every destructive action has a confirm pattern
- [ ] Empty state includes next action CTA
- [ ] Admin pages prioritize speed + density; public pages prioritize clarity + conversion
- [ ] No contradictory rules (e.g., “one primary CTA” but multiple primaries)

## Required Final Section
### Design QA Self-Review
- Visual hierarchy: pass/fail + why
- Clarity in 3 seconds: pass/fail + why
- Consistency with system: pass/fail + why
- Accessibility basics: pass/fail + why
- Implementation risk: low/med/high + mitigation
