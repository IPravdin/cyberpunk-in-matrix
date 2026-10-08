# Cyberpunk in The Matrix

A static archive of <https://cyberpunkinmatrix.weebly.com/>, captured on September
30, 2026, now maintained with **Next.js 16.4, React 19.3, and Tailwind 4.3.3**.
The twelve pages retain their original text, reading sequence, `.html` URLs,
layouts, local fonts, images, animated backgrounds, pill choices, and bibliography.
The application uses the **Next.js App Router**, exports ordinary static files,
and has no database, authentication, or runtime content-fetching service.

The [migration inventory and checkpoint ledger](docs/MIGRATION.md) record the
compatibility decisions, validation gates, and rollback path.

## Install and develop

Use **Node.js 22 or newer** and **pnpm 10.30.2**, pinned in `package.json`:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open <http://localhost:4173>. The development server binds to `127.0.0.1`.
Stop it with Ctrl+C. Select another port with `PORT=8080 pnpm dev`.

## Edit the site

- Each page owns an App Router folder containing `page.tsx` and `layout.tsx`.
  For example, `src/app/contents/page.tsx` serves `/contents` in development, with
  `/contents.html` retained as a compatibility URL and the production filename.
  `src/app/(home)/page.tsx` serves `/`; the route group keeps the homepage in
  its own folder without adding a URL segment. Development rewrites serve `/index.html` from `/` and named `.html`
  URLs from their extension-free routes. Static export emits the original
  `.html` filenames directly.
- Page content is server-rendered JSX directly in each `page.tsx`. Its adjacent
  `layout.tsx` exports static Metadata API values and the original body classes.
  There is no catch-all route, registry, or route resolver.
- Each route layout uses `src/components/SiteDocument.tsx` for common document
  markup and compatibility stylesheets. Separate root layouts preserve the
  page-specific body classes in server-rendered HTML, even without JavaScript.
- Shared layout, mobile navigation, focus handling, and scroll behavior live in
  `src/components/SiteShell.tsx`, the only authored component with `'use client'`.
  Existing links use ordinary anchors to preserve document navigation and the
  reading sequence. Content remains server-rendered inside this shell.
- `src/app/global-not-found.tsx` uses the experimental `globalNotFound` option
  to retain English document language and a plain 404 response outside the
  authored-page theme layout.
- Tailwind imports and shared page rules are in `src/styles/globals.css`.
  Tailwind uses the `tw` prefix, has no Preflight reset, and emits unlayered
  utilities after the retained theme styles. Authored formatting uses arbitrary
  utilities that preserve the original values.
- The original theme, base layout, local fonts, focus outlines, and reduced-motion
  rules remain a CSS compatibility layer under `public/files/` and
  `public/assets/`. Images and GIFs remain in `public/images/`. Vendor folder
  names record their origin; these files are served locally.

The JSX pages are the active source of truth. The migration does not read or
regenerate pages from HTML at runtime or during the build. `legacy/pages/` holds
the original documents for comparison and rollback, and `legacy/asset-hashes.json`
protects the bytes of the 51 shared assets.

## Validate changes

Install the browser used by the focused checks once:

```sh
pnpm exec playwright install chromium
```

Run the milestone gate:

```sh
pnpm lint
pnpm typecheck
pnpm check:legacy
pnpm test
```

`pnpm check` runs that combined gate. The focused browser suite targets
Next.js and checks every route, content and metadata, links, image and embed
attributes, asset hashes, the homepage alias, missing pages, pill choices,
keyboard menu behavior, resize and scroll thresholds, JavaScript-disabled
reading, and representative desktop/mobile computed layouts. Layout comparisons
include fonts, spacers, and table cells. YouTube embeds use offline fixtures so
external playback does not determine migration parity.

The earlier Pages Router migration completed its 31-test development and export
gates. The App Router follow-up has separate development and production
checkpoints in the migration ledger. Metadata parity compares Open Graph
properties and values independently of tag order. Both App Router checkpoints
passed lint, type-check, legacy integrity,
31 development browser tests, the production build/export audit, and
31 production browser tests. The export checker validates generated App Router Flight data and
local resources without executing serialized scripts.

The test configuration starts isolated servers: Next.js on 4175, the legacy
comparison site on 4174, and the production export on 4176 when selected. It
does not reuse an existing server. To select another target:

```sh
pnpm test:legacy
pnpm build
pnpm test:export
```

`pnpm check:legacy` assembles the fallback and runs the Python integrity check.
It needs Python 3.8 or newer and checks all local references, rejects remote
scripts/images/styles/fonts and inline handlers, and detects unused assets.
`pnpm check:export` checks generated output, original page contracts, local
dependency resolution, embed attributes, and retained asset hashes.

Extension-free route folders export the original physical `.html` files
directly. Generated segment-prefetch payloads stay in their original route
directories; no filename normalization or payload relocation is needed. Native anchors remain the
navigation contract. ESLint prevents introducing `next/link` or `useRouter`
until their static transport endpoints and hosting rules are revisited.

## Build and publish

```sh
pnpm build
pnpm start
```

The build runs Next.js static export and the export integrity check.
The original `.html` filenames are generated without postprocessing. `pnpm start` previews the completed `out/` directory at
<http://localhost:4173>; select another port with `PORT=8080 pnpm start`.

Publish **the contents of `out/`** to a static host's document root, or configure
the host to install with pnpm, build with `pnpm build`, and publish `out`.
Serve at the root of the domain, preserve `.html` filenames, and let unknown
paths return 404. Do not configure an SPA fallback. Keep the complete source
repository for maintenance; the deployed site requires only the export files.

No deployment, DNS, or change to the original Weebly subdomain has been made.

## Legacy fallback

The archived site can be assembled and previewed with Node alone, without
installing pnpm, Next.js, or React:

```sh
node scripts/build-legacy.mjs
SITE_DIR=.legacy node scripts/serve.mjs
```

This fallback works with Node.js 18 or newer. `PORT=8080` selects another preview
port. The builder combines the tracked `legacy/pages/` snapshot with the retained
public assets into `.legacy/`; the integrity and hash checks protect that shared
asset contract. Publish **the contents of `.legacy/`** to roll back. Use either
the complete `out/` artifact or the complete `.legacy/` artifact.

A checkpoint copy of the completed Pages Router export is also available locally
at `/private/tmp/cyberpunk-pages-fallback` during the App Router transition. This
temporary directory is specific to this machine; the tracked legacy snapshot
and builder remain the reproducible fallback available from the repository.

## Archive scope

The earlier archive migration removed Weebly advertising, analytics, account
bootstrap code, and unused platform dependencies, retained working local TTF
fonts, and added keyboard navigation and focus outlines. The Next.js migration
preserves those behaviors and compatibility styles.

**Twenty-two YouTube embeds remain external.** Their URLs and attributes are
retained; playback needs internet access and depends on the videos' continued
availability and embedding permissions. Bibliography URLs remain plain text.
The local content, fonts, images, and navigation do not require Weebly or Google
Fonts. This archive contains the published frontend, not Weebly's private editor,
unpublished drafts, or account data.
