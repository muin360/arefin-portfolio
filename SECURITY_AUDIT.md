# SECURITY_AUDIT.md — Arefin Mueen Portfolio
**Repository:** https://github.com/muin360/arefin-portfolio  
**Audit Date:** 2026-08-20  
**Auditor:** Automated security review (AI-assisted)  
**Commits Audited:** 110 commits, 2,039 historical Git objects  
**Test Files Passed:** 18 / 18 — 148 tests PASS

---

## Executive Summary

A comprehensive credential-leak, secret-exposure, privacy, configuration, API, Git history, and dependency security audit was performed across the full repository including all 19 phases specified. Three confirmed security issues were identified and **all have been remediated**. No real secrets were found in Git history or tracked files. The repository final status is **PASS WITH WARNINGS** (warnings are upstream dependency CVEs not yet safe to auto-upgrade).

---

## Summary Table

| Severity | Count | Status |
|---|---|---|
| **Critical** | 0 | ✅ No critical findings |
| **High** | 1 | ✅ Fixed (revalidate auth bypass) |
| **Medium** | 2 | ✅ Fixed (CSP, secrets fallback) |
| **Low** | 2 | ✅ Fixed (.gitignore, docs) |
| **Informational** | 5 | 📋 Documented |

---

## Phase 1–2: Secret & Credential Discovery

### Current Working Tree — PASS ✅

| File | Finding | Status |
|---|---|---|
| `.env.local` | Contains real credentials — MongoDB URI, ADMIN_PASSWORD, AUTH_SECRET | ✅ **GITIGNORED** — never committed |
| `.env.example` | All values are placeholder templates | ✅ Safe |
| `.env.local.example` | All values are safe placeholders | ✅ Safe |
| `src/lib/**` | All secrets accessed via `process.env.*` only | ✅ Correct |
| `src/app/api/**` | No hardcoded secrets | ✅ Correct |
| `scripts/*.mjs` | Reads from `.env.local` at runtime — not from hardcoded values | ✅ Correct |

### Patterns Searched (Current Tree)
- MongoDB URIs with embedded credentials
- OpenAI / Anthropic / Google API keys
- AWS keys, GitHub tokens, Resend keys
- JWT secrets, NextAuth secrets
- Bearer tokens, Authorization headers
- Long base64 / high-entropy strings
- SMTP passwords, OAuth client secrets

**Result: No real secrets detected in any currently tracked file.**

---

## Phase 12: Git History Audit — PASS ✅

### Scan Scope
- All 110 commits
- All 2,039 historical blob objects
- 12 secret patterns (MongoDB URI with credentials, sk-* keys, GitHub tokens, Google API keys, Anthropic keys, AWS keys, JWT tokens, generic passwords)

### Commits Investigated

| Commit | Triggered Pattern | Verdict |
|---|---|---|
| `f6137ff5` | `apiKey: "sk-test-mock-key"` | ✅ Test fixture — not a real key |
| `a07bc541` | `secret: "sk-ant-test-secret-*"` | ✅ Test fixture — not a real key |
| `a9c41e26` | `mongodb+srv://user:pass@cluster.mongodb.net/prod` | ✅ Redaction test string only |
| `3d1f7451` | `secret: "sk-ant-test-secret-rotated-9999"` | ✅ Test fixture — not a real key |

### Previously Committed Files Searched
- `data/db.json` — historic file, contained only public content/site data, no secrets
- `.env.example` across all revisions — placeholder values only
- `src/sanity/env.ts` (deleted) — no real keys

**Result: No real secrets were ever committed to Git history. Rotation is NOT required.**

---

## Phase 3: Client-Side Exposure Audit — PASS ✅

### NEXT_PUBLIC_* Variables Audit

| Variable | Exposure | Verdict |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical domain | ✅ Safe — public by design |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Google verification token | ✅ Safe — public by design |
| `NEXT_PUBLIC_CAL_USERNAME` | Cal.com embed username | ✅ Safe — public by design |
| `NEXT_PUBLIC_CAL_EVENT` | Cal.com event type | ✅ Safe — public by design |

### Variables Correctly Server-Only (never NEXT_PUBLIC_)

| Variable | Usage |
|---|---|
| `MONGODB_URI` | Server-only MongoDB connection — never exposed |
| `AUTH_SECRET` | Session encryption — server-only |
| `NEXTAUTH_SECRET` | Session encryption — server-only |
| `ADMIN_PASSWORD` | Admin passcode — server-only |
| `RESEND_API_KEY` | Email API — server-only |
| `AUTH_GITHUB_SECRET` | OAuth credential — server-only |
| `AUTH_GOOGLE_SECRET` | OAuth credential — server-only |
| `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` / `GEMINI_API_KEY` | AI API keys — server-only |

**Result: No sensitive credentials are exposed to the browser bundle.**

---

## Phase 4: Environment File Hardening

### .gitignore — FIXED ✅

**Finding (Low):** The previous `.gitignore` used verbose line-by-line patterns that could miss new env file variants like `.env.staging`.

**Fix Applied:**
```diff
- .env.local
- .env.development.local
- .env.test.local
- .env.production.local
- .env*.local
- .env.production
- .env.development
+ .env.*
+ .env*.local
+ !.env.example
+ !.env.local.example
```

Both example files remain explicitly tracked with `!` unignore rules.

### Example File Audit — PASS ✅

- `.env.example`: All values use `<PLACEHOLDER>` format or are empty.
- `.env.local.example`: All values are placeholders. `ADMIN_EMAILS` and `ADMIN_GITHUB_USERS` contain the owner's own public info — intentional and safe.

---

## Phase 5: Configuration Audit

### next.config.ts CSP — FIXED ✅

**Finding (Medium):** `connect-src` allowed `https://api.anthropic.com` in the browser CSP. All Anthropic calls are server-side — there is no legitimate reason the browser should connect to Anthropic's API directly.

**Fix Applied:**
```diff
- "connect-src 'self' https://vitals.vercel-insights.com https://api.anthropic.com",
+ "connect-src 'self' https://vitals.vercel-insights.com",
```

### CSP Headers Review — PASS ✅

| Directive | Status | Notes |
|---|---|---|
| `default-src 'self'` | ✅ | |
| `object-src 'none'` | ✅ | Blocks Flash/ActiveX |
| `frame-ancestors 'none'` | ✅ | Clickjacking prevention |
| `base-uri 'self'` | ✅ | Base tag injection prevention |
| `form-action 'self'` | ✅ | Form submission control |
| `script-src 'unsafe-inline'` | ⚠️ | Required by Next.js bootstrap — acceptable |
| `style-src 'unsafe-inline'` | ⚠️ | Required by Tailwind 4 — acceptable |
| `upgrade-insecure-requests` | ✅ | |

### Other Security Headers — PASS ✅

| Header | Value | Status |
|---|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | ✅ 2-year HSTS |
| `X-Frame-Options` | `DENY` | ✅ |
| `X-Content-Type-Options` | `nosniff` | ✅ |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | ✅ |
| `Permissions-Policy` | Comprehensive deny-list (camera, mic, payment, etc.) | ✅ |
| `Cross-Origin-Opener-Policy` | `same-origin` | ✅ |
| `Cross-Origin-Resource-Policy` | `same-site` | ✅ |
| `X-XSS-Protection` | `0` | ✅ Correctly disabled — delegated to CSP |
| `X-Robots-Tag` on `/admin` | `noindex, nofollow, nocache` | ✅ Admin hidden from search |

### DEPLOYMENT.md — FIXED ✅

**Finding (Low):** `DEPLOYMENT.md` contained a specific Atlas cluster subdomain (`cluster0.7b4yelt.mongodb.net`) in an example, leaking tenant infrastructure topology.

**Fix Applied:** Replaced with `<CLUSTER>.mongodb.net/<DB>?retryWrites=true&w=majority`.

---

## Phase 6: Authentication & Admin Security — PASS ✅

### Auth Configuration (`src/lib/auth.ts`)

| Check | Status | Notes |
|---|---|---|
| Session secret uses `AUTH_SECRET` from env | ✅ | Falls back to `NEXTAUTH_SECRET` |
| Credentials provider uses constant-time comparison | ✅ | `timingSafePasscodeCheck()` implemented |
| OAuth GitHub login checked against allowlist | ✅ | `ADMIN_GITHUB_USERS` env list |
| OAuth Google email checked against allowlist | ✅ | `ADMIN_EMAILS` env list |
| `isAdmin` check enforced server-side | ✅ | Middleware + every API route |
| JWT encodes `isAdmin` claim | ✅ | |

> **Informational:** `src/lib/auth.ts` has hardcoded fallback values for `ADMIN_EMAILS` and `ADMIN_GITHUB_USERS`. These are the owner's own credentials — no unauthorized access risk. In production, these env vars should always be set.

### Admin Route Protection — PASS ✅

Every admin API route (`/api/admin/*`) checks `session?.user?.isAdmin` server-side before any operation. **No client-side-only protection found.**

---

## Phase 7: API & Server Action Security — PASS ✅

### Contact Form (`src/app/(site)/contact/actions.ts`)

| Check | Status |
|---|---|
| Zod schema validation | ✅ |
| Honeypot anti-bot field | ✅ |
| Elapsed-time bot check (≥1.5s) | ✅ |
| Rate limiting by IP (5 req/60s) | ✅ |
| FormData size limit (5MB) | ✅ |
| Email header-injection prevention | ✅ `validateSingleEmail()` |
| HTML output escaping | ✅ `escapeHtml()` |

### Public AI Chat (`/api/agent`)

| Check | Status |
|---|---|
| Payload size limit (100KB) | ✅ |
| Zod schema validation | ✅ |
| Multi-tier rate limiting | ✅ Redis → MongoDB → in-memory |
| IP hashed before logging | ✅ `sha256(ip).slice(0,12)` |
| Errors sanitized before Sentry | ✅ `captureSanitizedAIError()` |

### Revalidate Route — FIXED ✅

**Finding (High):** Hardcoded fallback `"revalidate-secret"` allowed unauthenticated cache invalidation if `ADMIN_SECRET` was unset.

**Fix Applied:**
- Removed hardcoded default
- Added `REVALIDATE_SECRET` env var support
- Replaced `===` comparison with `timingSafePasscodeCheck()`
- Added 4 unit tests covering authorized/unauthorized paths

---

## Phase 8: Database Security — PASS ✅

| Check | Status |
|---|---|
| MongoDB URI is server-only (never NEXT_PUBLIC_) | ✅ |
| Connection errors sanitize credentials before logging | ✅ Regex strips `//user:pass@` |
| No client components access MongoDB directly | ✅ |
| `import "server-only"` enforced in `analytics-db.ts` | ✅ |
| AI provider keys stored AES-256-GCM encrypted | ✅ |
| Decrypted keys never logged | ✅ |

---

## Phase 9: Third-Party Integrations — PASS ✅

| Integration | Credential Location | Client-Visible? |
|---|---|---|
| MongoDB Atlas | env var only | No ✅ |
| NextAuth.js | env var only | No ✅ |
| GitHub OAuth | env vars | Secret server-only ✅ |
| Google OAuth | env vars | Secret server-only ✅ |
| Resend (email) | env var only | No ✅ |
| Vercel Analytics | CDN script | No secrets ✅ |
| Cal.com | `NEXT_PUBLIC_CAL_USERNAME` | Yes — intentionally public ✅ |

---

## Phase 10: Logging & Error Leaks — PASS ✅

| Finding | Status |
|---|---|
| MongoDB error messages strip connection string credentials | ✅ |
| AI errors use `captureSanitizedAIError()` — keys/URIs redacted | ✅ |
| `sanitizeSensitiveText()` covers API keys, Bearer tokens, MongoDB URIs, passwords | ✅ |
| API error responses use safe generic messages — no stack traces | ✅ |

> **Informational:** Raw MongoDB error objects passed to `console.error()` in `src/lib/db/index.ts` could theoretically include partial connection details in some error scenarios. Consider wrapping with `sanitizeSensitiveText()` before console output, or routing solely through Sentry.

---

## Encrypted AI Secret Storage (`src/lib/ai/secrets.ts`) — FIXED ✅

**Finding (Medium):** `getMasterEncryptionKey()` silently fell back to a static predictable string when no environment secret was configured, meaning stored AI provider credentials would be encrypted with a guessable key.

**Fix Applied:** Now throws a descriptive error, ensuring misconfiguration is caught early:
```typescript
throw new Error(
  "Encryption key unconfigured. Please set AI_SECRETS_ENCRYPTION_KEY or AUTH_SECRET in your environment.",
);
```

---

## Phase 14: Dependency Security

**npm audit result:** 24 vulnerabilities (1 low, 12 moderate, 8 high, 3 critical)

> [!WARNING]
> Upstream CVEs exist in Next.js, PostCSS, and the development toolchain. **None have been auto-upgraded** to avoid introducing breaking changes without testing.

### Critical / High — Recommended Upgrades

| Package | Issue | Action |
|---|---|---|
| `next@16.2.4` | Middleware bypass, cache poisoning, DoS CVEs | Upgrade to `next@16.3.1` after testing |
| `postcss` | XSS, arbitrary file read | Fixed by Next.js upgrade |
| `sharp` | CVE-2026-33327/28/35590/35591 | Fixed by Next.js upgrade |
| `fast-uri` | Host confusion | `npm audit fix` (no breaking changes) |
| `js-yaml` | Quadratic CPU DoS | `npm audit fix` |
| `nanoid` | Infinite loop edge case | `npm audit fix` |
| `uuid` (in resend) | Buffer bounds | `npm audit fix` |

### Dev-Only (no production exposure)

| Package | Issue |
|---|---|
| `vitest` / `vite` / `esbuild` | Dev server file read (GHSA-67mh-4wv8-2f99) — local dev only |
| `brace-expansion` | DoS — dev tooling only |

### Recommended Commands

```bash
# Safe non-breaking auto-fixes:
npm audit fix

# Next.js upgrade (test first):
npm install next@16.3.1 --save-exact
```

---

## Phase 15: GitHub Repository Safety

| Setting | Status | Recommendation |
|---|---|---|
| Secret scanning | Not verified | Enable in Settings → Security |
| Push protection | Not verified | Enable to block committed secrets |
| Dependabot alerts | Not verified | Enable for automated CVE notifications |
| Dependency review | Not verified | Enable for PR-level dep scanning |
| Branch protection on `main` | Not verified | Recommended for solo projects too |

Verify at: https://github.com/muin360/arefin-portfolio/settings/security_analysis

---

## Phase 18: Secret Rotation Guidance

| Credential | Exposure Found? | Rotation Required? |
|---|---|---|
| MongoDB URI / password | ❌ No | **No** |
| `AUTH_SECRET` / `NEXTAUTH_SECRET` | ❌ No | **No** |
| `ADMIN_PASSWORD` | ❌ No | **No** |
| GitHub OAuth Client Secret | ❌ No | **No** |
| Google OAuth Client Secret | ❌ No | **No** |
| Resend API Key | ❌ No | **No** |
| AI Provider Keys | ❌ No | **No** |

---

## Fixes Applied

| # | File | Change | Severity |
|---|---|---|---|
| 1 | `.gitignore` | Hardened env glob patterns, explicit `!.env.example` unignore | Low |
| 2 | `DEPLOYMENT.md` | Sanitized Atlas cluster subdomain to `<CLUSTER>` placeholder | Low |
| 3 | `next.config.ts` | Removed `api.anthropic.com` from CSP `connect-src` | Medium |
| 4 | `src/app/api/revalidate/route.ts` | Removed default fallback secret, added `timingSafePasscodeCheck` | **High** |
| 5 | `src/lib/ai/secrets.ts` | Throw on missing encryption key instead of predictable seed | Medium |
| 6 | `src/app/__tests__/revalidate.test.ts` | Added 4 unit tests for authorization logic | — |

---

## Final Security Status

```
╔════════════════════════════════════════════════════════════════════════╗
║  FINAL SECURITY STATUS:  PASS WITH WARNINGS                           ║
╠════════════════════════════════════════════════════════════════════════╣
║  Critical findings:        0                                          ║
║  High findings:            1  → FIXED                                 ║
║  Medium findings:          2  → FIXED                                 ║
║  Low findings:             2  → FIXED                                 ║
║  Informational:            5  → Documented                            ║
╠════════════════════════════════════════════════════════════════════════╣
║  Historical secret exposure:  NONE DETECTED (110 commits scanned)     ║
║  Rotation required:           NO                                      ║
╠════════════════════════════════════════════════════════════════════════╣
║  Test suite (post-fix):    18 files / 148 tests — ALL PASS ✅         ║
╠════════════════════════════════════════════════════════════════════════╣
║  Remaining warnings:                                                  ║
║  1. Upgrade next to 16.3.1 (20+ upstream CVEs)                        ║
║  2. Run npm audit fix (fast-uri, js-yaml, nanoid, uuid)               ║
║  3. Enable GitHub secret scanning + Dependabot                        ║
╚════════════════════════════════════════════════════════════════════════╝
```
