# Advatar — Client Showcase (Vercel-ready)

This is the same editable showcase page you had as a standalone HTML file, rebuilt
as a small website so uploads and edits save permanently — for every visitor, not
just your own browser tab.

## What changed vs. the standalone file

- Videos and photos you upload now go to **Vercel Blob** storage and get a real,
  permanent URL — not a temporary in-browser preview.
- All your text edits save to the live site with one click, instead of downloading
  a new file each time.
- The public page is **read-only** for visitors. Only you can edit it, by clicking
  **Edit** in the bottom-right toolbar and entering your password.

## One-time setup

You'll need a free [Vercel](https://vercel.com) account and either the Vercel CLI
or a GitHub repo. The CLI route is quickest if you're doing this solo.

### Option A — Vercel CLI (fastest)

1. Open a terminal in this folder.
2. Install the CLI if you don't have it: `npm i -g vercel`
3. Run `vercel` and follow the prompts (log in, link/create a project).
4. Once deployed, go to your project on **vercel.com** → **Storage** tab →
   **Create Database** → choose **Blob** → connect it to this project.
   Vercel will automatically add a `BLOB_READ_WRITE_TOKEN` environment variable
   for you — you don't need to set this one yourself.
5. Go to **Settings → Environment Variables** on the project and add:
   - `EDIT_PASSWORD` — any password you choose. This is what you'll type in
     when you click "Edit" on the live site.
6. Redeploy so the new environment variables take effect: run `vercel --prod`
   again, or click **Redeploy** in the Vercel dashboard.

### Option B — GitHub + Vercel dashboard

1. Push this folder to a new GitHub repository.
2. On [vercel.com](https://vercel.com), click **Add New → Project**, and
   import that repository.
3. Before the first deploy, or right after, go to **Storage → Create Database
   → Blob** and connect it to the project (this sets `BLOB_READ_WRITE_TOKEN`
   automatically).
4. Go to **Settings → Environment Variables** and add `EDIT_PASSWORD` with
   your chosen password.
5. Deploy (or redeploy if it already deployed once before you added the env var).

## Using the live site

- Visit your site — it loads the last saved version, or the default content
  the first time.
- Click **Edit** (bottom-right) and enter your password to unlock editing.
- Click any text to change it, upload photos/videos into the media blocks,
  and use **+ Add video or photo** / **+ Add result** / the small **×**
  buttons to add or remove items.
- Click **Save to website** when you're happy — this uploads any new media
  and publishes your changes for everyone who visits.
- Click **Stop editing** to go back to the clean, read-only view.

## A couple of things worth knowing

- **The password is a light lock, not bank-grade security.** It stops random
  visitors from defacing the page, but treat it like a shared door key —
  don't reuse a password you care about elsewhere.
- **Large videos**: Vercel Blob's free tier has storage and bandwidth limits
  that are generous for a handful of short reels, but worth keeping an eye on
  if you're uploading a lot of long-form footage. Check current limits at
  vercel.com/docs/storage/vercel-blob before you rely on this for many large files.
- **Local development**: `npm install` then `npm run dev` runs it on your own
  machine at `localhost:3000`. Uploads won't work locally unless you copy your
  `BLOB_READ_WRITE_TOKEN` from Vercel into a local `.env.local` file (see
  `.env.example`) — everything else works fine without it.
