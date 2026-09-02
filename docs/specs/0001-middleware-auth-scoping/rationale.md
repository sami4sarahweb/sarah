# 0001. Middleware Auth Scoping · Rationale

## Context

The application currently executes Supabase session verification (`supabase.auth.getUser()`) inside Next.js middleware on almost every incoming HTTP request. While static assets like images and internal Next.js files are excluded, all public pages (such as the landing page, service catalogs, project galleries, and quote forms) trigger a remote HTTPS network roundtrip to the Supabase Auth server before rendering.

This architecture introduces several critical problems. First, public page visitors experience added network latency (often 150 to 350 milliseconds) purely waiting for an auth check on pages that require no login. Second, executing dynamic auth cookie checks on public routes opts those pages into dynamic server rendering, blocking Incremental Static Regeneration (ISR) and static page caching. Third, unexpected network spikes or brief Supabase Auth downtime directly degrade availability for public marketing visitors who have no relationship with the admin dashboard.

Restricting middleware execution strictly to `/dashboard`, `/login`, `/signup`, `/auth`, and admin API routes isolates auth latency to administrative and authentication workflows while unlocking true static speed for public visitors.

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

## Rationale

Option 1 provides the highest possible performance and cleanest architectural boundary. By scoping middleware at the Next.js routing layer, public pages never invoke the middleware runtime at all. This guarantees zero remote auth roundtrips for public visitors, removes dynamic cookie evaluation from public routes, and paves the way for static page generation and edge caching across the catalog and showcase pages.

Relying strictly on `app_metadata` eliminates client privilege escalation risks inherent in `user_metadata`. Combining this with strict redirect sanitization and a secondary defense layer in Server Components ensures robust protection against open redirects and broken access control.
