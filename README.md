# Arefin Muin — Portfolio

Editorial, hand-coded portfolio for an AI Automation & Agent Engineer. Static-exported Next.js + Tailwind, hardened with strict security headers, CSP, HSTS, sanitized contact form, AI-scraper opt-out, and a published `security.txt`.

## Live

https://tensorix.me
(point a custom domain at the project — see [HOSTING.md](./HOSTING.md))

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
```

## Build for production

```bash
npm run build        # outputs to ./out
```

> Uses **webpack**, not Turbopack. The script is preconfigured.

## Where the content lives

| Want to change… | Edit |
|---|---|
| Services, skills, projects | `src/data/site.ts` |
| Blog posts | `src/data/posts.ts` |
| Hero / homepage sections | `src/app/page.tsx` |
| About / Services / Skills / Projects / Contact pages | `src/app/<page>/page.tsx` |
| Footer | `src/components/Footer.tsx` |

## Hosting

See **[HOSTING.md](./HOSTING.md)** for the full Vercel deploy + custom domain + day-to-day management guide.

## Security

Hardening shipped:

- HSTS preload, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`
- Strict Content Security Policy (default-deny)
- `Permissions-Policy` denies camera, mic, geolocation, payment, USB, FLoC/Topics
- `Referrer-Policy: strict-origin-when-cross-origin`
- COOP/CORP set to `same-origin`
- Contact form sanitizes CR/LF (`mailto:` header injection-proof) + length caps + topic allow-list
- Email assembled at runtime — harvesters scraping rendered HTML find no literal address
- AI scrapers (GPTBot, ClaudeBot, Google-Extended, CCBot, PerplexityBot, Bytespider, Amazonbot, FacebookBot) disallowed via `robots.txt`
- `/.well-known/security.txt` (RFC 9116) + `/privacy.html`
- `prefers-reduced-motion` honored

Headers ship in two formats: `vercel.json` (Vercel) and `public/_headers` (Cloudflare Pages, Netlify). Plus a defense-in-depth CSP `<meta>` tag in every page.

## Stack

Next.js 16.2.4 (app router, static export), React 19, Tailwind CSS 4, Geist Sans + Instrument Serif italic, hand-coded SVG animations, IntersectionObserver scroll reveals.

## License

All rights reserved · © Arefin Muin
