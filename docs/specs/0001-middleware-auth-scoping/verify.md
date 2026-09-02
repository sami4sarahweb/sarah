# Verify: Middleware Auth Scoping · spec 0001 · updated 2026-08-21
_Steps derived from spec 0001 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones._

## UI / manual
- [ ] Visit `/` as anonymous visitor → page responds instantly without auth network roundtrip → AC-1
- [ ] Visit `/services`, `/projects`, `/gallery`, `/request-quote`, `/contact` → all public pages load without middleware auth latency → AC-1
- [ ] Visit `/dashboard/services` unauthenticated → redirects to `/login?returnUrl=%2Fdashboard%2Fservices` with HTTP 307 status → AC-3
- [ ] Enter valid admin credentials on `/login?returnUrl=%2Fdashboard%2Fservices` → signs in and redirects to `/dashboard/services` → AC-3, AC-5
- [ ] Visit `/login?returnUrl=%2F%2Fattacker.com` and log in → safely redirects to `/dashboard`, rejecting external or double slash destination → AC-4
- [ ] Visit `/login?returnUrl=%2F%5Cattacker.com` and log in → safely redirects to `/dashboard`, rejecting backslash evasion → AC-4
- [ ] Sign in as user with non admin role (e.g. `app_metadata.role = 'customer'`) and navigate to `/dashboard` → redirects to `/` → AC-6
- [ ] Visit `/login` or `/signup` while already authenticated as admin → automatically redirects to `/dashboard` → AC-7
- [ ] Direct access to dashboard server layout without auth session → server component redirects to `/login` → AC-8

## Commands
- [ ] `npm run build` → TypeScript and Turbopack production build succeeds with 0 errors → AC-1, AC-2
- [ ] `npx eslint "src/lib/auth/redirect.ts" "src/middleware.ts" "src/lib/supabase/middleware.ts" "src/app/auth/actions.ts" "src/app/(auth)/login/page.tsx" "src/app/(auth)/signup/page.tsx" "src/app/auth/callback/route.ts" "src/app/dashboard/layout.tsx"` → Lint checks pass with 0 errors → AC-1 to AC-8

## Acceptance-criteria coverage
- AC-1: Public routes bypass middleware auth calls · covered by UI steps 1, 2 and build command
- AC-2: Explicit middleware config matcher in `src/middleware.ts` · covered by build command and router verification
- AC-3: Unauthenticated `/dashboard` redirects to `/login?returnUrl=...` with HTTP 307 · covered by UI step 3
- AC-4: URL sanitization rejects protocol relative and invalid paths · covered by UI steps 5, 6
- AC-5: `returnUrl` preserved and forwarded through login and auth callbacks · covered by UI step 4
- AC-6: Non admin authenticated role redirected to `/` · covered by UI step 7
- AC-7: Authenticated users on `/login` or `/signup` redirected to `/dashboard` · covered by UI step 8
- AC-8: Server component defense in depth verified · covered by UI step 9
