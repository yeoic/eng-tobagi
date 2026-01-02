# SKILL: seo-checklist
Goal: Apply **SEO + social sharing (OG) + semantic accessibility + performance fundamentals** to Next.js/React pages using a strict checklist so nothing gets missed.

## When to use
- Adding a new public page / landing page / blog / content page
- Redesigning an existing page (copy/layout/URL changes)
- Improving “indexing + share preview” quality for pages that matter for acquisition
- When Lighthouse scores are weak (especially LCP/CLS)

## Non-goals
- Promising rankings or “guaranteed SEO outcomes”
- Introducing a brand-new analytics/tag manager not already used in the repo
- Backend/infra changes (only propose them as follow-up issues)

## Inputs (confirm these first)
- Page intent: (e.g., signup conversion, free trial, purchase, information)
- Page type: public (indexable) vs private (authenticated)
- Routing: slug structure, canonical needs, i18n/localization
- Content: title/description/hero image/sections/FAQ presence

## Procedure (always)
### Step 0) Classify the page
- [ ] Does this page need to rank / be indexable?
    - YES: apply full SEO set
    - NO: consider `noindex` + minimal metadata

### Step 1) Metadata (Next.js App Router baseline)
- [ ] Use `generateMetadata` or `export const metadata` to include:
    - [ ] `title` (keep it tight; important keywords early)
    - [ ] `description` (value prop + clear intent)
    - [ ] `openGraph`: title/description/images/url/siteName/type
    - [ ] `twitter`: card/title/description/images
    - [ ] `alternates`: canonical (when duplicates/params exist)
- [ ] For dynamic routes, generate unique title/description per slug

### Step 2) Semantic HTML & heading hygiene
- [ ] `<main>` exists
- [ ] Exactly one `h1` per page
- [ ] Use `<section>` with correct `h2/h3` nesting
- [ ] Use semantic structures (`ul/ol`, `table`) instead of div soup
- [ ] CTA rules: navigation => `<a>`, actions => `<button>`

### Step 3) Structured data (JSON-LD) where applicable
- Decide schema:
    - [ ] Article/BlogPosting (content)
    - [ ] Product/Offer (pricing/products)
    - [ ] FAQPage (real Q/A content on the page)
    - [ ] BreadcrumbList (deep navigation)
    - [ ] Organization/WebSite (site-wide identity)
- [ ] JSON-LD must match visible content (no hallucinated/hidden claims)
- [ ] In Next.js, render via server component or `next/script`:
    - `<script type="application/ld+json">...</script>`

### Step 4) Performance fundamentals
- [ ] Avoid unnecessary client components (default to server components)
- [ ] Images:
    - [ ] Next.js: use `next/image`
    - [ ] Consider `priority` for true LCP hero images
    - [ ] Ensure fixed dimensions/aspect-ratio to avoid CLS
- [ ] Fonts:
    - [ ] Prefer `next/font` where appropriate
- [ ] Bundles:
    - [ ] Consider dynamic import for heavy components (only if needed)

### Step 5) Accessibility checks
- [ ] Fully keyboard navigable (Tab/Enter/Escape)
- [ ] Visible focus rings
- [ ] Form fields have labels; errors tied via `aria-describedby`
- [ ] Use shadcn/Radix for dialogs/menus (focus trap + aria)

### Step 6) Indexing policy
- Public:
    - [ ] Allow indexing by default
- Private/duplicate/test pages:
    - [ ] `robots` meta: `noindex`/`nofollow` as needed
    - [ ] Canonicalize duplicates

## Verification (minimum)
- [ ] View Source: confirm title/description/OG tags exist
- [ ] Share preview sanity check (OG image + copy) where possible
- [ ] Lighthouse / DevTools: no obvious LCP/CLS regressions
- [ ] Mobile viewport: above-the-fold value prop + primary CTA clear

## Required output (must include in final response)
### SEO / Accessibility / Performance Notes
- SEO: (metadata/OG/canonical/JSON-LD status)
- A11y: (keyboard/labels/focus)
- Perf: (client component minimization/image optimization/CLS control)

### Risks
- (indexing policy mistakes, slug changes, canonical misconfiguration, etc.)

### Test Plan
- (URLs visited, states tested, mobile/desktop, keyboard checks)
