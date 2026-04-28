# Sanity CMS — Setup & Operation

This site uses [Sanity](https://www.sanity.io) as a headless CMS. All content
visible on the site (services, projects, skills, blog posts, contact info) is
edited from `/studio` and rendered through tag-aware ISR.

## 1. First-time setup

You only do this once.

### 1.1. Vercel environment variables

In your Vercel project → **Settings → Environment Variables**, add the
following (Production + Preview scopes):

| Name                                  | Where to get it                                                                                                          | Sensitive? |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`       | https://www.sanity.io/manage → your project → Settings                                                                    | No         |
| `NEXT_PUBLIC_SANITY_DATASET`          | Usually `production`                                                                                                      | No         |
| `SANITY_API_READ_TOKEN`               | Sanity manage → **API → Tokens → Add token** → permission **Viewer**. Required only if the dataset is private (default).  | **Yes**    |
| `SANITY_API_WRITE_TOKEN`              | Same page → permission **Editor**. Used by `scripts/seed.mjs` and the studio when needed.                                 | **Yes**    |
| `SANITY_REVALIDATE_SECRET`            | A random string. Generate with `openssl rand -base64 32` (or any password manager).                                       | **Yes**    |
| `NEXT_PUBLIC_SITE_URL`                | e.g. `https://tensorstudio.vercel.app`. No trailing slash.                                                                | No         |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`| Search Console verification token.                                                                                        | No         |

> Tip: You can use one Editor token everywhere if you don't want to manage
> separate read/write tokens — just set both `SANITY_API_READ_TOKEN` and
> `SANITY_API_WRITE_TOKEN` to the same value. A separate Viewer token is
> safer though.

### 1.2. Make the dataset public (optional, recommended)

Public datasets allow unauthenticated reads, which:
- skip the need for `SANITY_API_READ_TOKEN`,
- enable Sanity's CDN cache (faster).

In Sanity manage → Datasets → `production` → set **Visibility: public**.
Even if a dataset is public, drafts are still private and only visible with a
token, so this is safe for portfolio content.

### 1.3. Seed the dataset

The repo ships with `scripts/seed.mjs` that pushes the original
`src/data/site.ts` and `src/data/posts.ts` content into Sanity as documents.
Run it once:

```bash
# Install deps if you haven't yet
npm install

# Run the seed (uses .env.local for credentials)
npm run sanity:seed
```

You'll see `✓ Committed 20 documents.` Visit `/studio` to confirm the content
appears.

### 1.4. Configure the Sanity → Vercel webhook

This is what makes content edits show up on the live site within seconds
(instead of waiting for a manual rebuild).

1. https://www.sanity.io/manage → your project → **API → Webhooks → Create webhook**.
2. Fill in:
   - **Name:** `Vercel ISR revalidation`
   - **URL:** `https://YOUR_DOMAIN/api/revalidate`
   - **Trigger on:** ✓ Create, ✓ Update, ✓ Delete
   - **Filter:** `_type in ["post","project","service","skillCategory","siteConfig"]`
   - **Projection:** `{ "_type": _type, "slug": slug.current }`
   - **HTTP method:** POST
   - **API version:** `v2024-10-01`
   - **Secret:** paste your `SANITY_REVALIDATE_SECRET` value
3. Save. Try editing any document — within 1–2 seconds the live site
   reflects the change.

## 2. Day-to-day editing

Visit `https://YOUR_DOMAIN/studio`, sign in with the Google/GitHub account
that owns the Sanity project, and edit any document. Changes save instantly
to Sanity's data store, and the webhook revalidates the public site in the
background.

The studio is `noindex`'d by both `robots.txt` and an `X-Robots-Tag` header,
so it never appears in search.

## 3. Architecture

- **Schemas** (`src/sanity/schemaTypes/`): `post`, `project`, `service`, `skillCategory`, `siteConfig`.
- **Client** (`src/sanity/client.ts`): one read client (cached via `next/cache` tags), one write factory.
- **Queries** (`src/sanity/queries.ts`): all GROQ in one place.
- **Fetch wrapper** (`src/sanity/fetch.ts`): tags every request so `revalidateTag()` can target it.
- **Studio route** (`src/app/studio/[[...tool]]/page.tsx`): embedded `<NextStudio>` wrapping `sanity.config.ts`.
- **Webhook** (`src/app/api/revalidate/route.ts`): verifies signed payload, calls `revalidateTag()`.

## 4. Adding a new content type

1. Define the schema in `src/sanity/schemaTypes/myType.ts` and register it in
   `src/sanity/schemaTypes/index.ts`.
2. Add a GROQ query in `src/sanity/queries.ts`.
3. Add a TypeScript type in `src/sanity/types.ts`.
4. Use `sanityFetch<T>({ query, tags: ["myType"] })` in your page/component.
5. Update the webhook filter in Sanity to include `"myType"`.

## 5. Adding a new icon

1. Add the icon component in `src/components/icons.tsx`.
2. Add it to `ICON_OPTIONS` in `src/sanity/schemaTypes/shared.ts`.
3. Map it in `src/components/IconRegistry.tsx`.
4. Add the new value to `IconName` union type in `shared.ts`.

## 6. Local development

```bash
cp .env.example .env.local
# Fill in the values
npm install
npm run dev          # site
# /studio is part of the same dev server — visit http://localhost:3000/studio
```

## 7. Useful commands

```bash
npm run sanity:seed      # one-time content migration
npm run sanity:dataset   # list/manage datasets
```
