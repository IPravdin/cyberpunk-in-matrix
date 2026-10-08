# Cyberpunk in The Matrix

A twelve-page site built with Next.js App Router, React, TypeScript, and Tailwind CSS. It includes the original articles, local fonts, images, animated backgrounds, and 22 YouTube embeds. There is no database, authentication, or content API.

## Development

Use Node.js 22 or newer and pnpm 10.30.2:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open <http://localhost:3000>. Set another port with `PORT=8080 pnpm dev`. To bind to the local interface, run `pnpm dev --hostname 127.0.0.1`.

## Source

Each named page lives in `src/app/<slug>/page.tsx`; the homepage lives in `src/app/page.tsx`. The shared root layout is `src/app/layout.tsx`. Pages own their content and metadata, and use `next/link` for navigation.

`src/components/SiteShell.tsx` handles navigation, keyboard focus, the mobile menu, and the scroll header. `src/styles/globals.css` imports Tailwind with the `tw` prefix and no Preflight reset. The active theme and fonts remain under `public/files/` and `public/assets/vendor/`; `public/assets/site.css` provides focus outlines, mobile menu visibility, and reduced motion. Images and GIFs live in `public/images/`.

The active theme still uses some original class names, table layouts, and font elements. These support the current styling. The separate HTML fallback, duplicate navigation script, and migration tooling have been removed.

## Validation

Install Chromium once:

```sh
pnpm exec playwright install chromium
```

Run the development checks:

```sh
pnpm check
```

This runs lint, type-check, and browser tests. The browser suite checks all twelve pages, their content hashes, links, image and iframe attributes, CSS definitions, clean URLs and HTML aliases, missing pages, pill choices, keyboard navigation, responsive navigation, the scroll threshold, and reading without JavaScript. Content expectations live in `tests/fixtures/pages.json`; intentional editorial changes require updating the corresponding expectations.

Tests start a single Next.js server on port 4175 with a dedicated `.next-test/` directory, so they can run alongside the normal development server. YouTube embeds use offline fixtures during tests.

Validate the production export:

```sh
pnpm build
pnpm check:export
pnpm test:export
```

The export checker compares the built pages with the current content expectations and resolves local links, scripts, stylesheets, fonts, images, and route payload references. Production browser tests use a static server on port 4176.

## Preview and deployment

The project currently uses static export:

```sh
pnpm build
pnpm preview
```

The preview serves `out/` at <http://localhost:4173>. Set another port with `PORT=8080 pnpm preview`.

Publish the contents of `out/` to a static host. Resolve clean named URLs such as `/contents` to their `.html` files before checking directories: Next.js also exports route payload directories with those names. Keep `/index.html` and named `.html` aliases working, and return 404 for unknown paths without an SPA fallback.

`pnpm start` invokes `next start`, which requires server output instead of the configured static export. Use `pnpm preview` for this configuration.

Git history and previously deployed artifacts provide rollback. No separate fallback application is maintained. No deployment or DNS change is performed by these commands.

YouTube playback needs internet access and depends on the videos' availability and embedding permissions. Bibliography URLs remain plain text. The local pages, fonts, images, and navigation require no Weebly or Google Fonts service.
