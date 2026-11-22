# Deployment — CodeNest

## 1. Environment Variables

Create `.env.local` from `.env.example` for local development, and configure the same variable in your production host:

| Variable | Scope | Required | Notes |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | client + server | Yes (prod) | Canonical site URL (e.g. `https://yourdomain.com`) |

Firebase configuration is stored in `firebase-applet-config.json` (public client config; database access is enforced by `firestore.rules` and Firebase Authentication).

---

## 2. Vercel (Recommended)

1. Push the repository to GitHub / GitLab.
2. Import the project in Vercel.
3. Framework preset: **Next.js**.
4. Build command: `npm run build`.
5. Install command: `npm install`.
6. Set `NEXT_PUBLIC_SITE_URL` to your production domain (e.g. `https://yourdomain.com`).
7. Deploy.
8. Add your custom domain and wait for SSL provisioning.
9. Add your custom domain in **Firebase Console → Authentication → Settings → Authorized domains** so Google sign-in works inside `/ar/studio` and `/en/studio`.

---

## 3. Node.js Host / VPS

1. Install Node.js 22.
2. Clone the repository.
3. `npm install`
4. `npm run build`
5. Start with `npm start` (port 3000) via PM2 or systemd.
6. Put Nginx or Caddy in front for TLS/HTTPS.
7. Set `NEXT_PUBLIC_SITE_URL` to your public HTTPS URL.
8. Add your production domain to Firebase Authentication **Authorized domains**.

---

## 4. Built-in CMS & First-Time Content Setup

The CMS lives directly inside the app at `/ar/studio` and `/en/studio` (blocked from search indexing via `noindex` and `robots.ts`).

1. Open `https://yourdomain.com/ar/studio`.
2. Sign in with the authorized admin Google account.
3. Click **Sync default content to database** once in the Overview tab to populate Firestore collections from the local fallback.
4. Replace all placeholder brand details, contact endpoints (`email`, `whatsapp`), projects, team roles, blog posts, stats, process steps, and legal pages with real production copy, and turn off `placeholder` flags on published records.

---

## 5. Post-Deploy Verification Checklist

- [ ] `/ar` and `/en` load cleanly with proper `dir="rtl"` / `dir="ltr"`
- [ ] Dark and light themes toggle smoothly
- [ ] `/sitemap.xml`, `/robots.txt`, and `/manifest.webmanifest` resolve with the production domain
- [ ] Social share preview card (`/og-cover.jpg`) renders when sharing links
- [ ] Contact form submits and creates records visible in `/ar/studio` → Inbox
- [ ] Authorized admin can sign in and publish edits in `/ar/studio`
- [ ] `npm run build`, `npm run lint`, `npm run typecheck`, and `npm test` pass cleanly