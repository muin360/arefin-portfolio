# Deployment & Production Setup Guide

Production URL: **[https://tensorstudio.vercel.app](https://tensorstudio.vercel.app)**

This guide details configuring **NextAuth OAuth**, **MongoDB Atlas**, and the **Personal Admin Panel** for production on Vercel.

---

## 1. Required Vercel Environment Variables

In your Vercel Dashboard, go to **Project → Settings → Environment Variables** and configure:

| Variable | Required | Description | Example / Value |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical site URL | `https://tensorstudio.vercel.app` |
| `MONGODB_URI` | Yes | MongoDB Atlas connection string | `mongodb+srv://<USER>:<PASS>@cluster0.7b4yelt.mongodb.net` |
| `MONGODB_DB_NAME` | Yes | Database name in Atlas | `arefin_portfolio` |
| `AUTH_SECRET` | Yes | NextAuth secret for session encryption | Generate: `openssl rand -base64 32` |
| `NEXTAUTH_SECRET` | Yes | NextAuth secret (same as `AUTH_SECRET`) | Generate: `openssl rand -base64 32` |
| `ADMIN_PASSWORD` | Yes | Passcode for logging into `/admin` | Choose a strong personal passcode |
| `ADMIN_EMAILS` | Optional | Allowed admin email addresses | `hmmuhammadmuin50@gmail.com,arefinmueen360@gmail.com` |
| `ADMIN_GITHUB_USERS` | Optional | Allowed admin GitHub usernames | `muin360` |
| `AUTH_GITHUB_ID` | Optional | GitHub OAuth Client ID | From GitHub OAuth App |
| `AUTH_GITHUB_SECRET` | Optional | GitHub OAuth Client Secret | From GitHub OAuth App |
| `AUTH_GOOGLE_ID` | Optional | Google OAuth Client ID | From Google Cloud Console |
| `AUTH_GOOGLE_SECRET` | Optional | Google OAuth Client Secret | From Google Cloud Console |
| `RESEND_API_KEY` | Optional | Resend API key for contact form emails | From https://resend.com |
| `CONTACT_TO_EMAIL` | Optional | Email destination for contact submissions | `hmmuhammadmuin50@gmail.com` |

---

## 2. GitHub OAuth App Configuration

1. Go to [GitHub Developer Settings → OAuth Apps](https://github.com/settings/developers).
2. Click **New OAuth App** (or edit existing):
   - **Application name**: `Arefin Mueen Portfolio`
   - **Homepage URL**: `https://tensorstudio.vercel.app`
   - **Authorization callback URL**: `https://tensorstudio.vercel.app/api/auth/callback/github`
3. Generate a **Client Secret**.
4. Copy Client ID into `AUTH_GITHUB_ID` and Client Secret into `AUTH_GITHUB_SECRET` in Vercel.

---

## 3. Google OAuth Cloud Console Configuration (Fixing "Access Blocked")

1. Go to [Google Cloud Console → APIs & Services → Credentials](https://console.cloud.google.com/apis/credentials).
2. **OAuth Consent Screen**:
   - Set **User Type**: External.
   - Fill in App Name (`Arefin Mueen Portfolio`), User Support Email, and Developer Contact.
   - **IMPORTANT**: If your app Publishing status is **Testing**, you MUST go to the **Test Users** tab and add your email (`hmmuhammadmuin50@gmail.com`, `arefinmueen360@gmail.com`). Otherwise Google displays **"Access blocked: Authorization Error"**!
3. **OAuth 2.0 Client ID** (Web application):
   - **Authorized JavaScript origins**: `https://tensorstudio.vercel.app`
   - **Authorized redirect URIs**: `https://tensorstudio.vercel.app/api/auth/callback/google`
4. Copy Client ID to `AUTH_GOOGLE_ID` and Client Secret to `AUTH_GOOGLE_SECRET` in Vercel.

---

## 4. MongoDB Atlas Serverless Connection Setup

1. Log into [MongoDB Atlas](https://cloud.mongodb.com).
2. Go to **Security → Network Access**:
   - Add IP Address: `0.0.0.0/0` (Allow Access from Anywhere) so Vercel serverless functions can connect from cloud IPs.
3. Database Name: `arefin_portfolio`.
4. Copy Connection String: Set as `MONGODB_URI` in Vercel.

---

## 5. Architectural Isolation

- **Database-Independent Admin Login**: `/admin/login` renders independently with zero database calls. Even if MongoDB Atlas is cold, unreachable, or initializing, `/admin/login` renders immediately.
- **Admin Dashboard Layout**: Protected admin pages (`/admin`, `/admin/projects`, `/admin/posts`, etc.) verify server-side admin status (`isAdmin === true`) before loading MongoDB content.
- **Public Site**: Public pages (`/`, `/about`, `/projects`, `/blog`, etc.) use `src/app/(site)/layout.tsx` for Navbar and Footer with instant cache revalidation when admin edits content.
