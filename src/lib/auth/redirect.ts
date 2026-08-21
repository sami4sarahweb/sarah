/**
 * Sanitizes a redirect destination URL to prevent open redirect vulnerabilities.
 * Allows only relative paths starting with a single forward slash and no backslashes.
 */
export function sanitizeRedirectUrl(url: string | null | undefined, fallback = '/dashboard'): string {
  if (!url || typeof url !== 'string') {
    return fallback
  }

  const trimmed = url.trim()

  // Must start with exactly one forward slash, not followed by another slash or backslash
  // Rejects protocol relative URLs like '//evil.com' or '\evil.com' or 'http://...'
  const isSafeRelativeUrl = /^\/[^\/\\]/.test(trimmed) || trimmed === '/'

  if (!isSafeRelativeUrl) {
    return fallback
  }

  return trimmed
}
