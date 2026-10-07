# Cyberpunk in The Matrix

Independent static copy of <https://cyberpunkinmatrix.weebly.com/>, captured on
September 30, 2026. The 12 retained public pages and their referenced assets are
preserved.
The site uses plain HTML, CSS, and JavaScript; no Weebly account, database,
framework, package installation, or build step is required to run it.

## Preview locally

With Node.js 18 or newer:

```sh
npm start
```

Open <http://localhost:4173>. Stop the preview with Ctrl+C. To select a different
port, run `PORT=8080 npm start`.

Alternatively, with Python 3:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory public
```

Use a local web server instead of double-clicking HTML files: original URLs and
asset references start at the website root.

## Edit and publish

- Edit the HTML pages in `public/` directly. Their filenames match the original
  URLs, so links such as `/the-choice.html` keep working.
- Original theme styles are in `public/files/main_style.css`. Small migration
  adjustments are in `public/assets/migration.css`.
- Mobile navigation and the template photo galleries are implemented in
  `public/assets/site.js`.
- Images and animated GIFs are in `public/uploads/`. Theme fonts are in
  `public/files/theme/fonts/`; other locally saved dependencies are under
  `public/assets/vendor/`. Those vendor folder names record their origin; they
  are ordinary local files, with no connection to those hosts at runtime.

To publish, upload **the contents of `public/`** to your static host's document
root, or configure `public` as the publish directory with no build command.
Serve the site at the root of its domain, not under a subdirectory. Keep the
`.html` filenames. Do not configure a single-page-app fallback: this is a
multi-page site. The Node server is for local preview only.

Only `public/` is needed for hosting. Keep the complete project as your source
backup. The original Weebly subdomain remains controlled by Weebly; publishing
elsewhere requires a new host URL or a domain you control. No deployment or DNS
change has been made by this migration.

## What is preserved

The original text, layouts, responsive styles, images, animated backgrounds,
fonts, reading sequence, red/blue pill choices, and bibliography are retained.
The retained public pages are included:

| Page | File |
| --- | --- |
| Home | `index.html` |
| Table of contents | `contents.html` |
| The Matrix (1999) | `the-matrix-film.html` |
| Genre introduction | `intro-to-cyberpunk-and-post-cyberpunk.html` |
| Cyberpunk analysis | `cyberpunk-the-matrix-and-post-cyberpunk.html` |
| Pill choice | `the-choice.html` |
| Blue pill | `blue-pill.html` |
| Mise en scène | `mise-en-scene.html` |
| Technical perspective | `tech.html` |
| Jean Baudrillard | `jean-baudrillard.html` |
| Philosophical and society issues | `influence.html` |
| Bibliography | `references.html` |
## Migration changes and limits

- Removed Weebly signup advertising, analytics, account bootstrapping, and
  platform scripts. There are no public forms or store features on these pages.
- Replaced the mobile menu with local JavaScript, including keyboard support.
- The original theme's WOFF/WOFF2 files caused browser decoding errors. The
  migrated stylesheet uses the original working TTF fonts instead. Original
  downloaded files remain in the backup.
- The three inert “View Gallery” template buttons now open the photos already
  present in their respective sections, with next/previous and Escape controls.
- Added a local favicon and visible keyboard focus outlines.
- **22 YouTube embeds remain external.** Their URLs are preserved, but the
  actual videos are not downloaded. Playback needs internet access and depends
  on each video's continued availability and embedding permissions. The site
  content, images, fonts, and navigation work without Weebly or Google Fonts.
- This recovers the **published frontend source**, not Weebly's private editor,
  unpublished drafts, account data, or server-side source. An account export
  would be needed to recover anything that was never publicly published.

## Repeatable migration

The generated site is already ready to edit and host. To repeat the conversion
from the captured archive, install the optional migration-only parser:

```sh
python3 -m venv .venv
.venv/bin/pip install -r scripts/requirements-migration.txt
.venv/bin/python scripts/migrate.py
```

**Regeneration overwrites the generated HTML and original asset copies in
`public/`. Back up any edits first.** It uses the saved download cache and only
accesses the network if a cached asset is missing. It does not recrawl the live
site. The custom `site.js`, `migration.css`, and favicon are maintained separately.

## Verification

```sh
npm run check
```

This offline check uses Python's standard library. It checks that all 14 pages
retain their original content text, local links and CSS assets resolve, the
191 archived assets have the recorded sizes, and no remote scripts, images,
stylesheets, or fonts remain. If you intentionally edit page text, update the
comparison policy in `scripts/check.py` rather than altering the original archive.

Chromium verification covered all pages at 1200×853 and 390×853, with no missing
images, horizontal overflow, or console warnings/errors. The main reading
sequence, both pill branches, Home links, mobile menu, and gallery next/Escape
controls were exercised. Representative layouts were compared with the live
original. External media responses were isolated during the offline checks;
video playback and other browsers were not comprehensively tested.
