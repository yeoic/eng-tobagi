# SKILL: shadcn-tailwind-patterns
Goal: Build consistent, production-grade UI quickly with Tailwind + shadcn/ui, focusing on **responsive UX, accessibility, state coverage, and business clarity**.

## When to use
- Implementing new screens/components
- Shipping high quality fast without a custom design system
- Building forms/modals/tables/lists/filters

## Non-goals
- Excessive animation or visual noise that hurts UX/perf
- Rebuilding UI primitives from scratch (default to shadcn)
- Tailwind class spaghetti (hurts readability and reuse)

## Rules of thumb
- “shadcn for primitives, Tailwind for layout”
- Prefer shadcn/Radix for interactive patterns (a11y built-in)
- Always handle: **loading / empty / error**
- Mobile-first responsive design; minimal breakpoint usage

## Practical recipes

### 1) Page layout (recommended skeleton)
- Outer: `min-h-screen`
- Container: `mx-auto w-full max-w-... px-4`
- Section spacing: `space-y-6` or `py-8`
- Top header: title + supporting copy + primary CTA

Checklist:
- [ ] Users understand the page purpose within 3 seconds
- [ ] One strong primary CTA (others are secondary/ghost)

### 2) Card lists (content/products/results)
- Use shadcn `Card`, `Badge`, `Button`
- Keep hover subtle (small shadow/outline)
- Clamp long text to stabilize layout

Checklist:
- [ ] Click affordance is clear (whole card vs button-only)
- [ ] Skeleton is ready to keep layout stable while loading

### 3) Forms (signup/login/settings)
Suggested stack:
- react-hook-form + zod
- shadcn `Form`, `FormField`, `Input`, `Textarea`, `Select`
- Inline errors under fields, tied with `aria-describedby`

Checklist:
- [ ] Submit has loading state (disabled + spinner/copy change)
- [ ] Errors are user-actionable (no raw logs)
- [ ] Required vs optional is explicit

### 4) Modals / dialogs / drawers
- Prefer shadcn `Dialog`; consider a `Drawer` pattern for mobile (if available)
- Focus management is handled by Radix

Checklist:
- [ ] ESC closes
- [ ] Cancel/close controls exist
- [ ] Use `AlertDialog` for destructive actions

### 5) Tables / filters / search
- Show active filters as chips/badges
- Empty state includes “clear filters” CTA

Checklist:
- [ ] Empty results explain why + what to do next
- [ ] Avoid scroll jumps on filter/sort changes

## Tailwind maintainability rules
- If class strings grow:
    - [ ] Use `cn()` for conditional classes
    - [ ] Extract repeated patterns into components
- Don’t invent random colors:
    - [ ] Prefer shadcn tokens/theme variables
- Keep spacing consistent (4/8px rhythm)

## Minimum accessibility checks (always)
- [ ] Correct element roles (link vs button)
- [ ] Icon buttons include `aria-label`
- [ ] Inputs have labels
- [ ] Focus rings preserved (`focus-visible`)

## Minimum performance checks (always)
- [ ] Don’t overuse client components
- [ ] Dynamic import heavy components if justified
- [ ] Reduce unnecessary state and re-renders (especially lists)

## Common shadcn component map
- Basic: Button, Badge
- Structure: Card, Separator
- Inputs: Input, Textarea, Select, Checkbox, Switch
- Overlays: Dialog, AlertDialog, DropdownMenu, Tooltip
- Feedback: Skeleton, Toast/Sonner (if present in repo)

## Required output (must include in final response)
### UI Patterns Used
- (e.g., Card list + Skeleton, Form validation, Confirm dialog)

### States Covered
- loading:
- empty:
- error:

### A11y Notes
- (keyboard/aria/labels)

### Test Plan
- (mobile/desktop, keyboard, state coverage)
