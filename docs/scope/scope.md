# Scope: Sarah Event Rentals (مؤسسة سارة السهلي)

A bilingual event and party equipment rental platform in Riyadh with a public catalog, quote request engine, and Supabase powered admin dashboard.

**Build approach:** Tracer Bullet (vertical slices built end to end through every layer).
**Workflow:** Beta (check verify then test). The project default level of rigor. /architect is the recommended first stop for a feature with a real decision, but skippable when you already know the build. Any feature can carry its own tag to do more or less.

_These are recommendations to keep your build orderly, not requirements. Skip anything that does not fit: if you already know how to build a feature, use /develop and skip /architect. You decide when a feature is done._

## At a glance

| # | Feature | Phase | Status |
|---|---------|-------|--------|
| A | Public showcase and landing page | Foundation | existing |
| B | Services catalog and detail views | Foundation | existing |
| C | Projects portfolio and case studies | Foundation | existing |
| D | Media gallery and video hub | Foundation | existing |
| E | Quote request and contact booking engine | Foundation | existing |
| F | Authentication and role protected admin dashboard | Foundation | existing |
| 1 | Middleware auth scoping | Slice 1 (Speed) | in-progress |
| 2 | Static and ISR public data caching | Slice 1 (Speed) | planned |
| 3 | Static generation for service and project slugs | Slice 1 (Speed) | planned |
| 4 | Media and image optimization pipeline | Slice 1 (Speed) | planned |
| 5 | Instant hydration and animation smoothness | Slice 1 (Speed) | planned |

## Existing features (Brownfield context)

### A. Public showcase and landing page · existing
Public home page showcasing hero banners, animated highlights, featured services, latest projects, client testimonials, and quick contact options.
Code in `src/app/(public)/page.tsx`, `src/app/(public)/home-client.tsx`

### B. Services catalog and detail views · existing
Services list and dedicated service view displaying specifications, property checklists, attached gallery media, and contextual quote buttons.
Code in `src/app/(public)/services/`

### C. Projects portfolio and case studies · existing
Showcase of completed events and celebrations with client ratings, dates, photography, and narrative descriptions.
Code in `src/app/(public)/projects/`

### D. Media gallery and video hub · existing
Categorized media explorer displaying photo albums, wide YouTube videos, and YouTube Shorts with interactive preview modals.
Code in `src/app/(public)/gallery/`, `src/components/gallery/`

### E. Quote request and contact booking engine · existing
Interactive multi step request form allowing clients to select services, dates, and event types, alongside direct phone and WhatsApp contact channels.
Code in `src/app/(public)/request-quote/`, `src/app/(public)/contact/`

### F. Authentication and role protected admin dashboard · existing
Secure Supabase email authentication, admin role guards, and complete management for services, projects, media, quotes, and inquiries.
Code in `src/app/(auth)/`, `src/app/dashboard/`, `src/middleware.ts`

## Slice 1: High speed performance & edge caching

### 1. Middleware auth scoping · in-progress
Restrict Supabase Auth network calls in middleware strictly to `/dashboard` routes and auth entrypoints, letting all public visitors bypass remote auth roundtrips completely.
**Done when:** public pages trigger zero auth API roundtrips in middleware, and initial server response headers arrive in under 100ms.
- [x] Design it (spec): [0001](../specs/0001-middleware-auth-scoping/index.md)
- [x] Build it: `/develop middleware auth scoping`
  - [x] Scope middleware config matcher to administrative, auth, and callback routes (AC-1, AC-2)
  - [x] Implement redirect sanitizer and preserve returnUrl through login and auth callbacks (AC-3, AC-4, AC-5)
  - [x] Enforce strict app_metadata admin role validation in middleware and server components (AC-6, AC-7, AC-8)
  - Code in `src/middleware.ts`, `src/lib/supabase/middleware.ts`, `src/lib/auth/redirect.ts`, `src/app/auth/`, `src/app/(auth)/`
- [ ] Verify it: `/check verify middleware auth scoping`
- [ ] Test it: `/test middleware auth scoping`

### 2. Static and ISR public data caching · needs a decision
Decouple public queries from dynamic cookies so Next.js can pre render pages and cache database queries with Incremental Static Regeneration tags.
**Done when:** landing page, services, projects, and gallery serve instant cached HTML and JSON with background revalidation on dashboard updates.
- [ ] Design it (spec): `/architect static and isr public data caching`

### 3. Static generation for service and project slugs · needs a decision
Add generateStaticParams to dynamic service and project routes so all slugs build ahead of time.
**Done when:** navigating to any service or project page loads instantly from pre rendered static assets without on the fly database lookups.
- [ ] Design it (spec): `/architect static generation for slugs`

### 4. Media and image optimization pipeline · needs a decision
Migrate raw image tags to Next.js Image component with Supabase storage domains, modern AVIF and WebP formats, explicit dimensions, and priority flags for above the fold hero assets.
**Done when:** Largest Contentful Paint is under 2.5 seconds and total media payload per page load drops by more than 60 percent.
- [ ] Design it (spec): `/architect media and image optimization`

### 5. Instant hydration and animation smoothness
Remove initial zero opacity CSS blocking from page transitions so server rendered HTML displays immediately without waiting for client JavaScript execution.
**Done when:** text and cards render immediately on page load, while GSAP animations smoothly enhance on scroll.
- [ ] Build it: `/develop instant hydration and animation smoothness`

## Deferred

Out of scope for the immediate performance slice, preserved for future releases.
- **Edge image transformations**: automated image resizing via Supabase Edge Functions · needs a decision
- **Multi language localization**: English and Arabic language switcher with localized metadata · needs a decision
- **Event analytics and quote conversion tracking**: privacy compliant visitor tracking for quotation funnel · needs a decision

## Legend

**The decision box.** Every feature carries exactly one, the sub task whose label ends with `(spec)`. Skills locate it by that `(spec)` suffix.

**Feature lifecycle**:
- `planned` · needs a decision: one box, `Design it (spec): /architect <feature>`
- `in-progress` (designed): spec linked, milestones filled by /architect
- `in-progress` (building): milestones checked by /develop
- `done`: verified and confirmed
