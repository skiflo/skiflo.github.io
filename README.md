# Ski Flo marketing website

Public landing page for [Ski Flo](https://github.com/skiflo/skiflo) — Vite + React, deployed to GitHub Pages.

**Live site:** https://skiflo.github.io/

## Development

```bash
npm install
npm run dev
```

```bash
npm run build
npm run preview   # serve production build locally
```

## GitHub Pages (one-time org/repo setup)

1. Repo → **Settings → Pages** → **Build and deployment** → Source: **GitHub Actions**.
2. Push to **`main`** (or run **Actions → Deploy to GitHub Pages → Run workflow**).

No repository secrets are required for the static build.

## Beta waitlist

The form POSTs to the `betaSignup` Cloud Function in the main Ski Flo Firebase project (`skiflo-dev`). Deploy that function from the [skiflo/skiflo](https://github.com/skiflo/skiflo) monorepo — it is not part of this repository.

## Hero videos

Optional blur pass (requires `ffmpeg-static`):

```bash
npm run hero:videos:blur
```

See `public/hero/ATTRIBUTION.md` for video credits.
