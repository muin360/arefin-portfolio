# Arefin Mueen — Portfolio & AI Platform

Personal portfolio and AI automation showcase for **Arefin Mueen** — AI Automation & AI Agent Developer. Built with Next.js App Router, MongoDB Atlas persistent database, NextAuth authentication, and a personal live admin panel (`/admin`).

## Live Production URL

**[https://tensorstudio.vercel.app](https://tensorstudio.vercel.app)**

## Features

- **MongoDB Atlas Integration** — Persistent cloud database backing all projects, blog posts, services, skills, about data, settings, and contact inquiries.
- **Personal Live Admin Panel (`/admin`)** — Authenticated dashboard to manage content dynamically without redeployment.
- **Dynamic Content & Instant Revalidation** — Instant cache invalidation when content is updated.
- **Hardened Security** — Server-side mutation verification, strict CSP, HSTS, X-Frame-Options DENY, nosniff, no-index admin routes.
- **SEO & Social Optimization** — Canonical metadata, dynamic XML sitemaps, JSON-LD structured data, RSS feed, and dynamic Open Graph cards.

## Local Development

```bash
# Install dependencies
npm install

# Setup local environment
cp .env.local.example .env.local

# Run local development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) and [http://localhost:3000/admin](http://localhost:3000/admin).

## Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for complete Vercel and MongoDB Atlas configuration details.
