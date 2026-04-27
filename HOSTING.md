# Hosting Guide — Arefin Muin Portfolio

A complete, beginner-friendly guide to deploying this site on **Vercel**, hooking it up to your own domain, and managing it after launch.

You only need to do **Part 1 + Part 2** to get live. Everything after is optional polish.

---

## Why Vercel

- Free for personal sites — no credit card required.
- Built by the same team that makes Next.js, so deployment is one click.
- Auto HTTPS, auto global CDN, auto previews on every PR.
- All the security headers in `vercel.json` are applied automatically.

---

## Part 1 · Push the source to GitHub

You need a GitHub account first. If you don't have one: https://github.com/join — free.

### 1.1 Create an empty repo

1. Go to https://github.com/new
2. **Repository name:** `arefin-portfolio`
3. **Visibility:** Public (private is fine too)
4. **Do NOT** check "Add a README", "Add .gitignore", or "Add a license" — the project already has those
5. Click **Create repository**

GitHub will show you a page with commands. Don't run those — use the ones below instead.

### 1.2 Push the code from your computer

Open a terminal in the project folder (the unzipped `arefin-portfolio` folder), then run, replacing `YOUR-USERNAME` with your GitHub username:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/arefin-portfolio.git
git push -u origin main
```

If `git push` asks for a password, GitHub no longer accepts passwords on the command line. Two options:

- **Easier:** install [GitHub Desktop](https://desktop.github.com/) and use it for steps `git init`/`add`/`commit`/`push` — it logs you in for you.
- **CLI:** create a Personal Access Token at https://github.com/settings/tokens?type=beta — give it "Contents: read & write" on this repo, paste it as the password.

Refresh the GitHub repo page — you should see all your files.

---

## Part 2 · Deploy to Vercel

### 2.1 Sign up

1. Go to https://vercel.com/signup
2. Click **Continue with GitHub** — this connects the two accounts in one step.

### 2.2 Import the repo

1. On the Vercel dashboard, click **Add New… → Project**
2. Find `arefin-portfolio` in the list and click **Import**
3. **Framework preset:** should auto-detect `Next.js` — leave it
4. **Build command:** `next build --webpack`  *(important — see "Build command" note below)*
5. **Output directory:** `out`  *(this project does a static export)*
6. **Install command:** `npm install` *(default is fine)*
7. **Environment variables:** none needed
8. Click **Deploy**

Wait ~60 seconds. You'll get a URL like `arefin-portfolio-xxx.vercel.app`. That's your live site.

> **Build command note:** This project uses **webpack**, not Turbopack. If Vercel preselects `next build` with no flag, change it to `next build --webpack`. The `package.json` already has `"build": "next build --webpack"` so as long as Vercel runs `npm run build`, you're fine.

### 2.3 Sanity-check it

Open the `*.vercel.app` URL. Then check that the security headers are live:

```bash
curl -I https://your-project.vercel.app/
```

You should see `strict-transport-security`, `x-frame-options: DENY`, `content-security-policy: …` and `permissions-policy: …` in the response. If they're there, all the security work is active.

---

## Part 3 · (Optional) Add your own domain

### 3.1 Buy a domain

Recommended registrar: **Cloudflare Registrar** (https://dash.cloudflare.com → Domain Registration → Register Domains). Reasons:

- Sold at wholesale cost — usually the cheapest
- WHOIS privacy is free and on by default
- No upsells

Other good registrars: Namecheap, Porkbun. Avoid GoDaddy (overpriced renewals).

Pick something like `arefinmuin.com`. Cost: ~$8–12/year for `.com`.

### 3.2 Point it at Vercel

1. In Vercel: **Project → Settings → Domains → Add**
2. Type `arefinmuin.com` (or whatever you bought) → **Add**
3. Vercel will show DNS records to add. There are two common options:

**Option A — Use Cloudflare/registrar DNS:**
- In your registrar's DNS panel, add the records Vercel showed:
  - `A` record `@` → `76.76.21.21`
  - `CNAME` record `www` → `cname.vercel-dns.com`
- Save. Wait 5–60 min for DNS propagation.

**Option B — Use Vercel's nameservers** *(simpler if you don't need other DNS)*:
- Copy the two nameservers Vercel shows (`ns1.vercel-dns.com`, `ns2.vercel-dns.com`)
- In your registrar, change the domain's nameservers to those two
- Wait 5–60 min

Vercel will issue an HTTPS certificate automatically once DNS resolves. The domain badge in the Vercel dashboard turns green when ready.

### 3.3 Update site URLs

Some files have the old preview URL hard-coded. After your domain works, edit and re-push:

- `src/app/layout.tsx` — change `const SITE_URL = "..."` near the top to your domain (this fixes the OG image and Twitter card URLs)
- `public/sitemap.xml` — replace `out-azhgzofj.devinapps.com` with `arefinmuin.com`
- `public/.well-known/security.txt` — same
- `public/robots.txt` — same

Commit and push — Vercel re-deploys in ~60 seconds.

---

## Part 4 · Managing the site day-to-day

### 4.1 The git workflow

Vercel watches your GitHub repo. Whatever lands on `main` is what's live. The lifecycle is:

```bash
# edit files locally
git add .
git commit -m "Update services copy"
git push
# Vercel auto-deploys in ~60 seconds. You'll get an email when it's live.
```

If you'd rather edit in a UI, https://github.dev (press `.` on any GitHub page) gives you VS Code in your browser — edit, commit, done.

### 4.2 What to edit where

| You want to change… | Edit this file |
|---|---|
| Services list | `src/data/site.ts` (`services` array) |
| Skill / tool list | `src/data/site.ts` (`skills`, `tools` arrays) |
| Project / case study | `src/data/site.ts` (`projects` array) |
| Blog posts | `src/data/posts.ts` |
| Hero copy / homepage sections | `src/app/page.tsx` |
| About-page bio / principles / timeline | `src/app/about/page.tsx` |
| Footer text | `src/components/Footer.tsx` |
| Navigation links | `src/components/Navbar.tsx` |
| Email address | search-and-replace `arefinmuin@gmail.com` across `src/` |

### 4.3 Preview before going live

Every branch you push gets its own preview URL:

```bash
git checkout -b try-new-hero
# edit things
git commit -am "Try new hero copy"
git push -u origin try-new-hero
```

Vercel posts a preview URL like `arefin-portfolio-git-try-new-hero-xxx.vercel.app` in the GitHub branch page. Test on that, then merge into `main` when happy.

### 4.4 Add a real social link

Open `src/components/Footer.tsx` — replace `https://github.com/`, `https://linkedin.com/`, `https://x.com/` with your real profile URLs. Same in `src/app/contact/page.tsx` (the social row at the bottom).

### 4.5 Add a new blog post

Open `src/data/posts.ts` and append:

```ts
{
  slug: "my-new-post",
  title: "My new post title",
  excerpt: "A one-line summary that shows up on the blog index.",
  date: "2026-01-15",
  readingTime: "5 min",
  category: "AI Agents",
  body: `
Long-form post body. Multiple paragraphs separated by blank lines.

## Subhead

Markdown-ish paragraphs are fine.
  `,
},
```

Commit, push, done. The new post will appear at `/blog/my-new-post`.

### 4.6 Run it locally before pushing

```bash
npm install     # only first time
npm run dev     # http://localhost:3000
```

Hot-reload — your edits show up instantly. Stop with `Ctrl+C`.

### 4.7 Build production locally

```bash
npm run build
npx next start  # not for static export, just for local preview if desired
# or just preview the static output:
npx serve out
```

---

## Part 5 · Security checklist (already done)

This site ships with:

- **HSTS preload** (forces HTTPS forever, blocks downgrade attacks)
- **`X-Frame-Options: DENY`** + CSP `frame-ancestors 'none'` (clickjacking-proof)
- **`X-Content-Type-Options: nosniff`** (no MIME-sniffing)
- **Strict Content Security Policy** (only same-origin code/assets allowed)
- **`Permissions-Policy`** denying camera, mic, geolocation, payment, USB, FLoC
- **`Referrer-Policy: strict-origin-when-cross-origin`**
- **`Cross-Origin-Opener-Policy: same-origin`**, `Cross-Origin-Resource-Policy: same-origin`
- **Form input sanitization** stripping CR/LF (no `mailto:` header injection)
- **Email obfuscation** in the rendered HTML (assembled at runtime from parts)
- **AI scraper disallow** (`/robots.txt` blocks GPTBot, ClaudeBot, Google-Extended, etc.)
- **`/.well-known/security.txt`** (RFC 9116 disclosure path)
- **`/privacy.html`** plain-English summary

When you go live on Vercel, verify with:

- https://securityheaders.com/?q=YOUR-DOMAIN (should be A or A+)
- https://hstspreload.org/ (optional — submit your domain to be hard-coded into browsers)
- https://csp-evaluator.withgoogle.com/ (paste the CSP from your `vercel.json`)

---

## Part 6 · Costs you'll actually incur

| Thing | Cost | Notes |
|---|---|---|
| Vercel Hobby | **Free** | More than enough for a personal site; no credit card needed |
| `.com` domain (Cloudflare Registrar) | **~$10/yr** | This is the only ongoing cost |
| Email forwarding (e.g. `hi@arefinmuin.com → arefinmuin@gmail.com`) | Free | Built into Cloudflare; optional |
| HTTPS certificate | **Free** | Auto-provisioned by Vercel |
| Form backend (Formspree etc.) — only if you ever switch from `mailto:` | Free tier exists | Not needed today |

So total: **~$10/year** for the domain; everything else is free.

---

## Part 7 · Common things that go wrong

**"My deploy succeeded but the site is blank."**
Check the Vercel build logs (Project → Deployments → click the deployment → Build Logs). 99% of the time it's a missing dependency or a typo in `next.config.ts`.

**"Custom domain shows 'INVALID_CONFIGURATION'."**
DNS hasn't propagated yet. Wait 30 minutes. Use https://dnschecker.org/ to confirm your A/CNAME records have propagated globally.

**"Vercel uses Turbopack and the build fails."**
Open `package.json` and verify `"build": "next build --webpack"`. In Vercel dashboard → Settings → General → Build & Development Settings, the build command should be `npm run build` (the default).

**"Some images don't show up."**
Static export disables Next.js image optimization. All images must already be the right size. The project's `next.config.ts` has `images: { unoptimized: true }` — leave it.

**"The contact form opens email but my client says nothing happens for them."**
The user has no default `mailto:` handler. Tell them to email `arefinmuin@gmail.com` directly — there's a fallback notice on the form for exactly this. If this becomes a real problem, switch to Formspree (free tier, drop-in replacement).

**"I want to take the site offline temporarily."**
Vercel → Project → Settings → Advanced → **Pause Project**. The domain will return a maintenance page. Resume any time, no data lost.

---

## Part 8 · If you ever want to leave Vercel

Everything is portable. The `out/` folder you get from `npm run build` is plain static HTML/CSS/JS. You can host it anywhere:

- **Cloudflare Pages** — same git workflow, slightly faster CDN
- **Netlify** — same, identical experience
- **GitHub Pages** — free, but no header config (security weakens)
- **AWS S3 + CloudFront** — most control, most setup
- **Your own VPS + Nginx** — total control; copy `out/` to `/var/www/site` and serve it

The `_headers` file in this repo is read by Cloudflare Pages and Netlify out of the box. The `vercel.json` file is read by Vercel. If you move to Nginx, ask me and I'll generate an `nginx.conf` from the same headers.

---

## Quick reference

```bash
# install
npm install

# develop
npm run dev          # http://localhost:3000

# lint
npm run lint

# build for production
npm run build        # outputs to ./out

# preview static build locally
npx serve out
```

Repo structure:

```
arefin-portfolio/
├ src/
│  ├ app/                 ← every URL is a folder here
│  ├ components/          ← reusable UI bits
│  └ data/                ← site.ts, posts.ts (your content)
├ public/                 ← static files copied as-is to /
├ vercel.json             ← Vercel-applied security headers
├ public/_headers         ← Cloudflare/Netlify-applied security headers
└ HOSTING.md              ← this file
```

---

If you get stuck on any step, save the error message and ping me — I'll walk you through it.
