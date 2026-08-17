# Production Setup & Deployment Guide

Things to configure when deploying to Vercel (or any Node.js host).

## 1. Required & Optional Environment Variables

Project → **Settings → Environment Variables** (Production + Preview):

| Name                                  | Required | Notes                                                                                  |
| ------------------------------------- | -------- | -------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                | optional | e.g. `https://tensorstudio.vercel.app`. Defaults gracefully if omitted. |
| `ADMIN_PASSWORD`                      | yes      | Passcode for logging into `/admin` (set a strong private passcode).                   |
| `ADMIN_EMAILS`                        | optional | Comma-separated admin emails (e.g. `arefinmueen360@gmail.com`).                        |
| `ADMIN_GITHUB_USERS`                  | optional | Comma-separated admin GitHub logins (e.g. `muin360`).                                  |
| `NEXTAUTH_SECRET`                     | yes      | Random secret string: `openssl rand -base64 32`.                                       |
| `AUTH_GITHUB_ID`                      | optional | GitHub OAuth Client ID for OAuth login.                                                |
| `AUTH_GITHUB_SECRET`                  | optional | GitHub OAuth Client Secret.                                                            |
| `AUTH_GOOGLE_ID`                      | optional | Google OAuth Client ID.                                                                |
| `AUTH_GOOGLE_SECRET`                  | optional | Google OAuth Client Secret.                                                            |
| `RESEND_API_KEY`                      | optional | From https://resend.com — Without this, contact submissions are saved to the database. |
| `CONTACT_TO_EMAIL`                    | optional | Defaults to `arefinmueen360@gmail.com`.                                                |
| `CONTACT_FROM_EMAIL`                  | optional | Default `Arefin Mueen <onboarding@resend.dev>`.                                        |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`| optional | Google Search Console verification token.                                              |
| `NEXT_PUBLIC_SENTRY_DSN`              | optional | Sentry error monitoring DSN.                                                           |
| `SENTRY_DSN`                          | optional | Sentry server runtime DSN.                                                             |

## 2. Personal Live Admin Panel (`/admin`)

The Admin Panel is the **single source of truth** for all website content.

- Works dynamically on **any domain** (`localhost`, `*.vercel.app`, custom domain).
- Sign in with your admin passcode or OAuth at `/admin/login`.
- Manage Hero, About, Projects, Blog Posts, Services, Skills, SEO, Availability, and Contact Submissions directly with live CRUD interfaces.

## 3. Resend Setup (Contact Form)

1. Sign up at https://resend.com (free).
2. **API Keys** → Create API key → copy the `re_...` value → set as `RESEND_API_KEY` in environment variables.
3. Submissions are saved immediately into your database and viewable in `/admin/messages`.

## 4. Built-in Production Features

- **Dynamic Domain Support** — Works seamlessly across local, preview, and production domains.
- **Sitemap & Robots** — Dynamic XML sitemaps and robots.txt.
- **JSON-LD Structured Data** — Person, WebSite, Article, Service schemas.
- **Open Graph Images** — Auto-generated 1200×630 PNG cards.
- **RSS Feed** — At `/feed.xml`.
- **Security Headers** — Strict CSP, HSTS, X-Frame-Options DENY, nosniff.
