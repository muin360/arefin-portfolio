# Deployment & Production Setup Guide

Production URL: **[https://tensorstudio.vercel.app](https://tensorstudio.vercel.app)**

This guide walks you through deploying this Next.js portfolio to **Vercel** with **MongoDB Atlas** as the persistent database and the authenticated **Personal Admin Panel** at `/admin`.

---

## 1. Required Vercel Environment Variables

In your Vercel Dashboard, navigate to:
**Project → Settings → Environment Variables**

Add the following variables for **Production** and **Preview**:

| Variable | Required | Description | Example / Note |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical production site URL | `https://tensorstudio.vercel.app` |
| `MONGODB_URI` | Yes | MongoDB Atlas connection string | `mongodb+srv://<USER>:<PASS>@<CLUSTER>.mongodb.net/<DB>?retryWrites=true&w=majority` |
| `MONGODB_DB_NAME` | Yes | Database name in MongoDB Atlas | `arefin_portfolio` |
| `AUTH_SECRET` | Yes | NextAuth secret for session encryption | Generate: `openssl rand -base64 32` |
| `NEXTAUTH_SECRET` | Yes | NextAuth secret (same as `AUTH_SECRET`) | Generate: `openssl rand -base64 32` |
| `ADMIN_PASSWORD` | Yes | Passcode for logging into `/admin` | Choose a strong personal passcode |
| `ADMIN_EMAILS` | Optional | Allowed admin email addresses | `arefinmueen360@gmail.com` |
| `ADMIN_GITHUB_USERS` | Optional | Allowed admin GitHub usernames | `muin360` |
| `AUTH_GITHUB_ID` | Optional | GitHub OAuth Client ID | From GitHub Developer Settings |
| `AUTH_GITHUB_SECRET` | Optional | GitHub OAuth Client Secret | From GitHub Developer Settings |
| `AUTH_GOOGLE_ID` | Optional | Google OAuth Client ID | From Google Cloud Console |
| `AUTH_GOOGLE_SECRET` | Optional | Google OAuth Client Secret | From Google Cloud Console |
| `RESEND_API_KEY` | Optional | Resend API key for contact email delivery | From https://resend.com |
| `CONTACT_TO_EMAIL` | Optional | Where contact submissions are delivered | `arefinmueen360@gmail.com` |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Optional | Google Search Console verification token | |

> [!IMPORTANT]
> **Server-Only Security**: `MONGODB_URI`, `AUTH_SECRET`, `ADMIN_PASSWORD`, and API keys are strictly server-only. They are never exposed to the client bundle or browser.

---

## 2. MongoDB Atlas Setup

1. Log into [MongoDB Atlas](https://cloud.mongodb.com).
2. **Database Access**: Create a database user (e.g. `arefin_portfolio_user`) with read/write permissions.
3. **Network Access**:
   - Go to **Network Access** → **Add IP Address**.
   - Select **Allow Access from Anywhere (`0.0.0.0/0`)** so Vercel serverless functions can connect.
4. **Database Name**: Use `arefin_portfolio`.
5. **Get Connection String**: Under Database → Connect → Choose *Drivers (Node.js)* → Copy the URI and set as `MONGODB_URI`.

---

## 3. Personal Admin Panel (`/admin`)

- **Login URL**: [https://tensorstudio.vercel.app/admin/login](https://tensorstudio.vercel.app/admin/login)
- **Authentication**:
  - Enter your `ADMIN_PASSWORD` passcode.
  - Or sign in via GitHub/Google OAuth if your username or email is listed in `ADMIN_GITHUB_USERS` or `ADMIN_EMAILS`.
- **Management Capabilities**:
  - **Projects**: Create, edit, publish/unpublish, reorder, delete case studies.
  - **Blog Posts**: Write markdown posts, manage drafts, publish.
  - **Services & Skills**: Edit live offerings and capabilities.
  - **About & Settings**: Edit headline, bio, principles, contact info, SEO metadata.
  - **Inquiries**: Review incoming contact form submissions.

---

## 4. Local Development Setup

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
3. Fill in your local `MONGODB_URI` and `ADMIN_PASSWORD` in `.env.local`.
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) and [http://localhost:3000/admin](http://localhost:3000/admin).

---

## 5. Deployment Checklist

- [ ] Push latest code to GitHub repository (`main` branch).
- [ ] Connect repo to Vercel and configure the environment variables listed above.
- [ ] Ensure MongoDB Atlas Network Access allows `0.0.0.0/0`.
- [ ] Deploy project on Vercel.
- [ ] Verify homepage loads at `https://tensorstudio.vercel.app`.
- [ ] Visit `https://tensorstudio.vercel.app/admin/login` and log in with your passcode.
- [ ] Test editing a project or post in `/admin` and confirm it updates on the live website.
