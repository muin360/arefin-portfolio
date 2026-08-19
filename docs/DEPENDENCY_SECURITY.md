# Dependency Security Report
# arefin-portfolio

**Last Updated:** 2026-08-20  
**npm audit total:** 24 vulnerabilities (1 low · 12 moderate · 8 high · 3 critical)  
**Runtime production packages affected:** 4 direct (next, next-auth, postcss, sharp)

---

## Quick Reference: Fix Commands

```bash
# Step 1 — Safe, non-breaking auto-fix (uuid, brace-expansion, etc.)
npm audit fix

# Step 2 — Next.js minor upgrade (resolves postcss, sharp, nanoid, fast-uri via next)
# Read TESTING REQUIREMENTS below before running
npm install next@16.3.1 --save-exact

# Step 3 — next-auth beta upgrade (resolves @auth/core critical)
# Read TESTING REQUIREMENTS below before running
npm install next-auth@5.0.0-beta.32 --save-exact

# Step 4 — vitest major upgrade (dev-only, resolves vitest/vite/esbuild chain)
# Separate PR — test suite syntax may need updates
npm install vitest@4.1.11 --save-exact
```

> **Never run `npm audit fix --force` in production** — it may silently introduce breaking API changes.

---

## Vulnerability Breakdown

### PRODUCTION — Direct Dependencies (Priority 1)

| Package | Installed | Severity | CVE / Advisory | Fix | Impact |
|---|---|---|---|---|---|
| `next` | 16.2.4 | **High** | Middleware bypass, cache poisoning, DoS | `next@16.3.1` (minor) | ✅ Runtime |
| `next-auth` | 5.0.0-beta.x | **Critical** | `@auth/core` credential exposure | `next-auth@5.0.0-beta.32` | ✅ Runtime |
| `postcss` | 8.5.15 | **High** | XSS via `</style>`, arbitrary file read via sourceMappingURL | via `next@16.3.1` | ✅ Runtime (build step) |
| `sharp` | 0.34.5 | **High** | CVE-2026-33327/28/35590/35591 — libvips | via `next@16.3.1` | ✅ Runtime (image opt) |

### PRODUCTION — Transitive Dependencies (Priority 2)

| Package | Severity | CVE / Advisory | Fix | Notes |
|---|---|---|---|---|
| `fast-uri` | **High** | Host confusion via backslash/% encoding | `npm audit fix` | Via `mongodb` |
| `nanoid` | **High** | Infinite loop on negative size | via `next@16.3.1` | Via Next |
| `@auth/core` | **Critical** | Credential exposure | via `next-auth@5.0.0-beta.32` | Via next-auth |
| `@opentelemetry/*` | Moderate | Various | `npm audit fix` | Via `@sentry/nextjs` |
| `@sentry/nextjs` | Moderate | — | `npm audit fix` | Direct dep |
| `resend` / `svix` / `uuid` | Moderate | Buffer bounds | `npm audit fix` | Via resend |

### DEV-ONLY — No Production Exposure (Priority 3)

> These packages **never reach the production runtime or browser bundle**. They run only in the local/CI development environment. Risk is LOW unless the Vitest UI server is accidentally exposed on a public network.

| Package | Severity | Advisory | Fix |
|---|---|---|---|
| `vitest` | **Critical** | GHSA-5xrq-8626-4rwp — Vitest UI arbitrary file read | `vitest@4.1.11` (major) |
| `vite` | **High** | Path traversal in optimized deps, NTLM hash disclosure | via `vitest@4.1.11` |
| `vite-node` | Moderate | — | via `vitest@4.1.11` |
| `esbuild` | Moderate | GHSA-67mh-4wv8-2f99 — dev server arbitrary reads | via `vitest@4.1.11` |
| `@vitest/mocker` | Moderate | — | via `vitest@4.1.11` |
| `brace-expansion` | **High** | DoS via intermediate arrays | `npm audit fix` |
| `js-yaml` | **High** | Quadratic CPU DoS via merge keys | `npm audit fix` |
| `@babel/core` | Low | — | `npm audit fix` |

---

## Upgrade Order & Testing Requirements

### Step 1: `npm audit fix` (safe, do first)

**Fixes:** `uuid`, `svix`, `@sentry/*`, `@opentelemetry/*`, `brace-expansion`, `@babel/core`, `fast-uri` (if resolvable)

**Testing required:**
```bash
npm test           # All 148 tests must pass
npm run build      # Build must succeed
```

**Risk:** Very low — these are transitive minor/patch bumps with no API changes.

---

### Step 2: `next@16.3.1` (minor upgrade)

**Fixes:** `postcss`, `sharp`, `nanoid`, `fast-uri` (via Next's internal deps)

**Testing required:**
```bash
npm run build               # No build errors
npm run dev                 # App loads on localhost:3000
npm test                    # All 148 tests pass
# Manual: test admin login, contact form, AI chat, image optimization
# Manual: verify security headers still present (curl -I https://your-domain.com)
```

**Risk:** Low-to-medium. Minor version per semver — Next.js does not guarantee strict semver for all internal behaviours. Read the [16.3.1 changelog](https://github.com/vercel/next.js/releases) before applying.

**Rollback:**
```bash
npm install next@16.2.4 --save-exact
```

---

### Step 3: `next-auth@5.0.0-beta.32` (beta bump)

**Fixes:** `@auth/core` critical credential exposure

**Testing required:**
```bash
npm test
# Manual: test admin login with credentials (email+passcode)
# Manual: test GitHub OAuth login
# Manual: test Google OAuth login
# Manual: verify session persists after login
# Manual: verify /admin routes reject unauthenticated access
```

**Risk:** Medium — beta software. The `@auth/core` critical advisory makes this upgrade worth doing, but require full auth regression test.

**Rollback:** Revert `package.json` and `package-lock.json` and run `npm ci`.

---

### Step 4: `vitest@4.1.11` (major upgrade — dev only)

**Fixes:** All `vitest`/`vite`/`esbuild` dev toolchain CVEs

**Testing required:**
```bash
npm test           # All 148 tests must pass
# Review vitest 4.x migration guide for API changes
# https://vitest.dev/guide/migration
```

**Risk:** Medium — major version bump. Test configuration (`vitest.config.ts`) and setup files may need updates for vitest 4.x API changes.

---

## Production vs. Dev Classification Summary

| Severity | Production-impacting | Dev-only |
|---|---|---|
| Critical | 2 (`next`, `next-auth` chains) | 1 (`vitest` — UI server) |
| High | 4 (`next`, `postcss`, `sharp`, `fast-uri`) | 3 (`vite`, `brace-expansion`, `js-yaml`) |
| Moderate | 6 | 4 |
| Low | 0 | 1 |

**No dev-only vulnerability has any path to the deployed production application.**

---

## Current Status

| Check | State |
|---|---|
| `npm audit fix` applied | ❌ Not yet — awaiting manual execution |
| `next@16.3.1` upgrade | ❌ Not applied — requires testing |
| `next-auth@5.0.0-beta.32` upgrade | ❌ Not applied — requires auth regression test |
| `vitest@4.1.11` upgrade | ❌ Not applied — requires migration review |
| Tests (current, pre-upgrade) | ✅ 148/148 pass |
