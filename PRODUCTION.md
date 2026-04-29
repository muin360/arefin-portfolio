# Production Setup Checklist

Things you need to configure on Vercel after applying the source.

## 1. Required environment variables

Project → **Settings → Environment Variables** (Production + Preview):

| Name                                  | Required | Notes                                                                                  |
| ------------------------------------- | -------- | -------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                | yes      | e.g. `https://tensorstudio.vercel.app`. No trailing slash.                              |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`       | yes      | `h3kwrsuj`                                                                              |
| `NEXT_PUBLIC_SANITY_DATASET`          | yes      | `production`                                                                            |
| `SANITY_API_READ_TOKEN`               | optional | **Only needed if your Sanity dataset is private.** Generate a Viewer token in Sanity manage. Make the dataset public to skip this. |
| `SANITY_REVALIDATE_SECRET`            | yes      | Random string. `openssl rand -base64 32`. Same value goes into Sanity webhook config.  |
| `RESEND_API_KEY`                      | yes      | From https://resend.com — Free tier covers 3,000 emails/mo. Without this the contact form returns an error. |
| `CONTACT_TO_EMAIL`                    | optional | Defaults to `arefinmuin@gmail.com`. Override if you want submissions sent elsewhere.   |
| `CONTACT_FROM_EMAIL`                  | optional | Default `Tensor <onboarding@resend.dev>`. After you verify a custom domain in Resend, set this to e.g. `Tensor <hi@tensorstudio.com>`. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`| yes      | Google Search Console verification token (already set: `v1dlYhce2C26iEpbBI1F9mDAwEL40Sh_A_0X1L8j4NU`). |
| `NEXT_PUBLIC_SENTRY_DSN`              | optional | Drop in your Sentry project DSN to enable error monitoring. Without it the SDK is loaded but inert. |
| `SENTRY_DSN`                          | optional | Same DSN as above — used by server runtimes.                                            |

**Do NOT set** `SANITY_API_WRITE_TOKEN` on Vercel. Keep it local-only — it's only used by `scripts/seed.mjs`. Putting it on Vercel adds attack surface for no benefit.

## 2. Sanity webhook (one-time)

Without this, content edits in `/studio` won't appear on the live site until the next deploy.

1. https://www.sanity.io/manage/personal/project/h3kwrsuj/api/webhooks → **Create webhook**
2. **URL:** `https://tensorstudio.vercel.app/api/revalidate`
3. **Trigger on:** ✓ Create, ✓ Update, ✓ Delete
4. **Filter:** `_type in ["post","project","service","skillCategory","siteConfig"]`
5. **Projection:** `{ "_type": _type, "slug": slug.current }`
6. **HTTP method:** POST
7. **API version:** `v2024-10-01`
8. **Secret:** paste the same value you set as `SANITY_REVALIDATE_SECRET` on Vercel
9. Save. Edit any document — it should appear on the live site within ~2s.

## 3. Resend setup

1. Sign up at https://resend.com (free).
2. **Domains** → **Add Domain** → enter your domain → add the DNS records Resend gives you (SPF, DKIM). This step is optional — without it, emails will send from `onboarding@resend.dev` which works but looks less professional.
3. **API Keys** → Create API key → name it `tensor-studio-contact` → copy the `re_...` value → set as `RESEND_API_KEY` on Vercel.
4. After verifying a domain, set `CONTACT_FROM_EMAIL=Tensor <hi@yourdomain.com>` on Vercel.

## 4. What's already wired up (no setup needed)

- **Sitemap & robots** — auto-generated, dynamic, includes all blog posts.
- **JSON-LD structured data** — Person, Organization, WebSite, Article, BreadcrumbList. Visible in [Google's Rich Results Test](https://search.google.com/test/rich-results) once deployed.
- **Per-post Open Graph images** — auto-generated 1200×630 PNG at `/blog/[slug]/opengraph-image`. Twitter, LinkedIn and Slack will use them when you share post URLs.
- **RSS feed** at `/feed.xml`. Discoverable via `<link rel="alternate" type="application/rss+xml">` in `<head>`.
- **Vercel Analytics + Speed Insights** — free, no cookie banner needed (privacy-friendly). Data appears in Project → Analytics tab automatically.
- **Honeypot + rate-limited contact form** — server-validates, dedupes spam, max 5 submissions/min/IP.
- **Client-side blog search** — instant search across the journal.
- **404 page** with custom design.
- **Security headers** including a tight CSP scoped per-route (looser for `/studio`, tighter elsewhere).

## 5. Optional: Sentry

If you want production error monitoring:

1. https://sentry.io → Create project → Platform: **Next.js** → copy the DSN.
2. Set `NEXT_PUBLIC_SENTRY_DSN` and `SENTRY_DSN` on Vercel (same value).
3. Errors will start appearing in the Sentry dashboard.

Without these env vars the SDK does nothing — no overhead, no errors.

## 6. Day-1 SEO actions (do this *now* after deploying)

1. **Search Console** → submit `https://tensorstudio.vercel.app/sitemap.xml`.
2. URL Inspection → Request Indexing on each top-level page (`/`, `/about`, `/services`, `/projects`, `/blog`, `/contact`). This shaves 1–2 weeks off first appearance.
3. Same in **Bing Webmaster Tools**.
4. Add the URL to your GitHub profile, LinkedIn, X bio. Each is a real backlink.

## 7. When you buy a custom domain

1. Vercel → Domains → Add → enter the domain. Follow the DNS instructions.
2. Set `NEXT_PUBLIC_SITE_URL=https://yourdomain.com` on Vercel and redeploy.
3. Update `public/.well-known/security.txt` to use the new domain (it can't be templated — RFC 9116 requires a literal URL).
4. Add the new domain as a separate property in Search Console + Bing Webmaster, and submit `sitemap.xml` again.
5. Optionally verify your domain in Resend so contact form emails come from `@yourdomain.com`.

A custom domain is the **single biggest ranking lever** — Google deeply de-prioritizes `*.vercel.app`. Every week on a real domain is worth months on the free subdomain.
