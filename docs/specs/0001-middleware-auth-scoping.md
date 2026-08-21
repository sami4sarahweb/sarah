# 0001. Middleware Auth Scoping for High Speed Public Routes

**Date**: 2026-08-21
**Status**: Proposed

## Summary

This specification restricts Next.js middleware execution and Supabase authentication network calls strictly to dashboard and auth routes. Public visitor routes completely bypass middleware authentication roundtrips, eliminating unnecessary latency on every public page load. This change enables instant page delivery, protects edge performance, prevents open redirect vulnerabilities, and maintains secure role authorization across all administrative surfaces.

## Context

The application currently executes Supabase session verification (`supabase.auth.getUser()`) inside Next.js middleware on almost every incoming HTTP request. While static assets like images and internal Next.js files are excluded, all public pages (such as the landing page, service catalogs, project galleries, and quote forms) trigger a remote HTTPS network roundtrip to the Supabase Auth server before rendering.

This architecture introduces several critical problems. First, public page visitors experience added network latency (often 150 to 350 milliseconds) purely waiting for an auth check on pages that require no login. Second, executing dynamic auth cookie checks on public routes opts those pages into dynamic server rendering, blocking Incremental Static Regeneration (ISR) and static page caching. Third, unexpected network spikes or brief Supabase Auth downtime directly degrade availability for public marketing visitors who have no relationship with the admin dashboard.

Restricting middleware execution strictly to `/dashboard`, `/login`, `/signup`, `/auth`, and admin API routes isolates auth latency to administrative and authentication workflows while unlocking true static speed for public visitors.

## Requirements

**User stories**:
- As a public website visitor, I want public pages to load instantly without waiting for backend authentication checks so that I get a fast and responsive browsing experience.
- As an administrator, I want unauthenticated attempts to access `/dashboard` to redirect to `/login` with my intended destination preserved so that I can sign in and resume my work immediately.
- As a security conscious operator, I want unauthorized users and non admin accounts prevented from accessing the dashboard so that private administrative data remains protected.

**Acceptance criteria**:
- **AC-1**: Public routes (`/`, `/services`, `/projects`, `/gallery`, `/request-quote`, `/contact`, and their child paths) completely bypass middleware auth network roundtrips, achieving server response time under 100 milliseconds.
- **AC-2**: Middleware `matcher` configuration in `src/middleware.ts` explicitly matches `['/dashboard', '/dashboard/:path*', '/login', '/signup', '/auth/:path*', '/api/admin/:path*']`.
- **AC-3**: Unauthenticated visits to `/dashboard` routes redirect to `/login?returnUrl=<encoded_path>` with HTTP 307 temporary redirect status.
- **AC-4**: The `returnUrl` parameter is rigorously validated to ensure it starts with a single slash and contains no leading double slashes or protocol relative tricks; invalid or malicious URLs safely fall back to `/dashboard`.
- **AC-5**: The login page and OAuth or email callback workflows (`/auth/callback`) preserve and forward the validated `returnUrl` destination through the entire authentication flow.
- **AC-6**: Authenticated users lacking the `admin` role in `user.app_metadata.role` who access `/dashboard` routes redirect to `/`.
- **AC-7**: Authenticated users visiting `/login` or `/signup` redirect to `/dashboard` automatically.
- **AC-8**: Authoritative session and admin role verification is reinforced in the dashboard Server Component layout (`src/app/dashboard/layout.tsx`) and Server Actions as an essential secondary defense layer.

## Options considered

### Option 1: Strict Next.js matcher configuration with secure app_metadata authorization

Configure the Next.js middleware `config.matcher` array to explicitly match only administrative and authentication paths (`['/dashboard', '/dashboard/:path*', '/login', '/signup', '/auth/:path*', '/api/admin/:path*']`). Next.js completely skips invoking the middleware runtime on public requests. Authorize access exclusively via server controlled `user.app_metadata.role`.

**Pros**:
- Zero execution overhead on all public routes.
- Next.js can serve fully static or ISR cached HTML from the edge without running middleware code.
- Clean separation of public and administrative routing.
- Eliminates client role tampering by relying strictly on `app_metadata`.

**Cons**:
- If new administrative routes are added under paths outside `/dashboard`, developers must remember to add them to the matcher list.

### Option 2: Internal path filter inside middleware code

Keep a catch all matcher but check `request.nextUrl.pathname` at the top of the middleware function, immediately returning `NextResponse.next()` for public routes without creating a Supabase client.

**Pros**:
- Centralizes routing policy inside TypeScript code rather than regex matcher strings.

**Cons**:
- Next.js still invokes the middleware runtime engine on every request, adding several milliseconds of unnecessary invocation overhead and complicating edge cache headers.

### Option 3: Session cookie presence guard

Inspect incoming request cookies for Supabase auth tokens before calling `supabase.auth.getUser()`, skipping the network call when no auth cookies exist.

**Pros**:
- Dynamically adapts to visitors who might have cookies.

**Cons**:
- When an admin browses public pages with cookies, the network call still fires, causing inconsistent response times and complicating static caching.

## Decision

**Chosen option**: Option 1: Strict Next.js matcher configuration with secure app_metadata authorization

We configure the Next.js middleware matcher to execute strictly on `['/dashboard', '/dashboard/:path*', '/login', '/signup', '/auth/:path*', '/api/admin/:path*']`, completely bypassing middleware invocation for public visitors, and verifying admin privileges through `user.app_metadata.role`.

## Rationale

Option 1 provides the highest possible performance and cleanest architectural boundary. By scoping middleware at the Next.js routing layer, public pages never invoke the middleware runtime at all. This guarantees zero remote auth roundtrips for public visitors, removes dynamic cookie evaluation from public routes, and paves the way for static page generation and edge caching across the catalog and showcase pages.

Relying strictly on `app_metadata` eliminates client privilege escalation risks inherent in `user_metadata`. Combining this with strict redirect sanitization and a secondary defense layer in Server Components ensures robust protection against open redirects and broken access control.

## Feature design

**API and Route surface**:
| Route pattern | Middleware action | Auth required | Role required | Unauthenticated behavior | Authenticated behavior |
|---|---|---|---|---|---|
| `/dashboard`, `/dashboard/:path*` | Verify session and role | Yes | admin (`app_metadata`) | Redirect to `/login?returnUrl=...` | Allow if admin, else redirect to `/` |
| `/login` | Check session and forward returnUrl | No | None | Allow access, render form with returnUrl | Redirect to `/dashboard` |
| `/signup` | Check session | No | None | Allow access | Redirect to `/dashboard` |
| `/auth/:path*` | Handle token exchange and cookies | No | None | Process callback, redirect to `next` param | Process callback, redirect to `next` param |
| `/api/admin/:path*` | Verify session and refresh tokens | Yes | admin (`app_metadata`) | Return HTTP 401 Unauthorized | Allow request |
| `/*` (all public routes) | Skipped entirely | No | None | Allow access | Allow access |

**Value sourcing**:
| Action | Value produced / displayed | Source |
|---|---|---|
| Route matching | Execution decision | `config.matcher` in `src/middleware.ts` |
| Unauthenticated redirect | Return destination URL | `request.nextUrl.pathname` plus `request.nextUrl.search` encoded as `returnUrl` query parameter |
| URL validation | Sanitized redirect path | Regex validation `^\/[^\/\\]` on `returnUrl`, falling back to `/dashboard` on invalid input |
| Admin authorization check | Admin role status | `user.app_metadata.role` strictly from Supabase user object |
| Callback redirect | Final destination | `next` query parameter on `/auth/callback`, validated against same relative URL rules |
| Post login redirect | Final destination | `returnUrl` hidden input or query parameter, validated and defaulting to `/dashboard` |

**Key invariants**:
- Public route requests must never trigger an outbound HTTPS call to Supabase Auth during routing.
- The `returnUrl` and callback `next` query parameters must only accept relative paths starting with a single slash (matching `^\/[^\/\\]`), explicitly rejecting any string starting with `//` or containing backslashes.
- User metadata (`user.user_metadata`) must never be trusted for administrative role decisions; only server controlled `user.app_metadata.role` is authoritative.
- Protected dashboard data access must always verify the user role in Server Components or Server Actions regardless of middleware state.

**Security model**:
- Public routes: anonymous read access to public marketing, catalog, and quote inquiry forms.
- Authentication routes: accessible to anonymous visitors; authenticated users are redirected to `/dashboard`.
- Dashboard routes: restricted strictly to authenticated users holding the `admin` role in `app_metadata`.
- Open redirect defense: all user supplied redirect targets are sanitized before issuing redirect responses.

**Configuration required**:
- No new environment variables required. Existing `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are used.

**Critical test scenarios**:
- Happy path public browsing: sending a GET request to `/` or `/services` returns HTTP 200 with zero outbound auth requests, verifies **AC-1**, **AC-2**.
- Unauthenticated dashboard access: sending a GET request to `/dashboard/services` redirects to `/login?returnUrl=%2Fdashboard%2Fservices`, verifies **AC-3**.
- Open redirect attack attempt: visiting `/login?returnUrl=//attacker.com` sanitizes redirect to `/dashboard` upon sign in, verifies **AC-4**.
- OAuth and callback return path: visiting `/auth/callback?code=xxx&next=%2Fdashboard%2Fquotes` redirects to `/dashboard/quotes` upon successful exchange, verifies **AC-5**.
- Non admin authenticated access: an authenticated user with a customer role accessing `/dashboard` redirects to `/`, verifies **AC-6**.
- Authenticated user visiting login: an authenticated admin accessing `/login` redirects to `/dashboard`, verifies **AC-7**.
- Deep component authorization: accessing dashboard layout without a valid Supabase session throws a redirect to `/login` from the Server Component, verifies **AC-8**.

## Build plan

- [x] 1. Update `src/middleware.ts` to configure `config.matcher` with explicit path patterns for `['/dashboard', '/dashboard/:path*', '/login', '/signup', '/auth/:path*', '/api/admin/:path*']`, satisfies **AC-1**, **AC-2**.
- [x] 2. Refactor `src/lib/supabase/middleware.ts` to construct the login redirect URL with an encoded `returnUrl` query parameter on unauthenticated dashboard access, satisfies **AC-3**.
- [x] 3. Implement `sanitizeRedirectUrl` helper in `src/lib/auth/redirect.ts` ensuring return destinations match relative URL constraints without leading double slashes, satisfies **AC-4**.
- [x] 4. Refactor `src/lib/supabase/middleware.ts` to enforce admin role verification via `user.app_metadata.role === 'admin'` and handle authenticated visitor redirects on `/login` and `/signup`, satisfies **AC-6**, **AC-7**.
- [x] 5. Update `src/app/auth/callback/route.ts` to extract, sanitize, and redirect to the `next` or `returnUrl` parameter, satisfies **AC-5**.
- [x] 6. Verify and reinforce server side session and role checks in `src/app/dashboard/layout.tsx` to ensure complete defense in depth, satisfies **AC-8**.
- [x] 7. Update login submission handling in `src/app/(auth)/login/page.tsx` and `src/app/auth/actions.ts` to receive and apply the sanitized `returnUrl` upon successful authentication, satisfies **AC-4**, **AC-5**.

## Consequences

**Positive**:
- Public page initial response time drops significantly because zero remote auth calls occur on public routes.
- Public routes can be statically pre rendered and cached via Next.js ISR.
- Admin dashboard remains securely protected with two layer defense (middleware plus server component layout).
- Strict role checking via `app_metadata` prevents client side privilege escalation.
- Open redirect attacks are systematically neutralized.

**Negative / tradeoffs**:
- Authenticated administrators browsing public pages do not have their Supabase auth session tokens refreshed in the background until they visit a dashboard or auth route.
- Any future administrative route placed outside `/dashboard` must be added to the matcher configuration.

**Neutral**:
- Requires updating the login form and auth callback routes to handle `returnUrl` parameters consistently.

## Migration plan

**Strategy**: Direct in place update.
**Phases**:
1. Create redirect sanitization utility.
2. Update middleware matcher and Supabase session helper.
3. Update login form and auth callback route handlers.
4. Verify public response times and dashboard protection.
**Rollback**: Revert changes to `src/middleware.ts` and `src/lib/supabase/middleware.ts`.
**Risks**: Ensure all return URL parsing uses the shared sanitizer to avoid accidental open redirect loopholes.

## Follow-up

- [ ] Confirm Supabase dashboard user creation sets `app_metadata.role = 'admin'` for administrative accounts.
