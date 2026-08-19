# Security Policy

## Supported Versions

This is a personal portfolio project. Only the latest deployment on the `main` branch is actively maintained.

| Version | Supported |
|---|---|
| Latest `main` | ✅ Yes |
| Older branches | ❌ No |

## Reporting a Vulnerability

If you discover a security vulnerability in this repository, please **do not** open a public GitHub issue.

Instead, use one of the following:

1. **GitHub Private Vulnerability Reporting** — Use the [Report a Vulnerability](../../security/advisories/new) button on the Security tab of this repository.
2. **Email** — Contact the repository owner directly via the email listed on the [GitHub profile](https://github.com/muin360).

Please include:
- A description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested mitigations

You will receive a response within **7 days** acknowledging receipt. Fixes will be prioritized based on severity.

## Disclosure Policy

- Vulnerabilities will be addressed and a fix deployed before any public disclosure.
- Credit will be given to reporters in the patch notes unless anonymity is requested.
- Responsible disclosure is appreciated and encouraged.

## Security Controls in Place

- All API secrets are server-side only — never exposed to the browser
- Secret scanning enabled on GitHub (public repository)
- Push protection enabled to block secret commits
- Dependabot alerts enabled for automated CVE notifications
- CodeQL static analysis runs on every push to `main`
- Dependency review runs on every pull request
- CSP, HSTS, and comprehensive security headers enforced
- Rate limiting on all public API endpoints
- Input validation via Zod on all server actions and API routes
