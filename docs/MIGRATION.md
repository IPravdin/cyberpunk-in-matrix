# Next.js and Tailwind migration

The site has migrated from a standalone HTML archive to a statically exported Next.js application built with pnpm and Tailwind. The user subsequently requested the App Router explicitly. That follow-up preserves the original reading sequence, `.html` URLs, text, metadata, local assets, responsive layout, and keyboard navigation. The original four migration milestones passed; both App Router checkpoints have now passed. A failed gate must be repaired before the next checkpoint begins.

The application uses individual Next.js App Router folders. Each of the eleven named routes has `src/app/<slug>/page.tsx` and `layout.tsx`; the homepage has its own `src/app/(home)/` route-group folder, which serves `/`. Content lives directly in each page, and static metadata and body classes live in the adjacent layout. `SiteDocument` shares the common document markup and stylesheets. Each route has its own root layout so its stylesheet-defined body classes are present before hydration. Unused legacy class markers have been removed from the active source; the frozen fallback retains them. `SiteShell` remains the only authored client component. The catch-all, content registry, metadata registry, and route resolver have been removed.

Development rewrites map `/index.html` to `/` and each named `.html` URL to its extension-free route. Production serves the original physical `.html` files emitted naturally by static export. The alias is not a second generated route. Experimental `globalNotFound` allows `src/app/global-not-found.tsx` to retain `lang="en"` and a plain 404 response outside the authored-page theme layout. The theme, base styles, local font styles, and accessibility fixes remain a compatibility layer while authored formatting and shared components use Tailwind.

## Legacy inventory

The inventory describes the repository before implementation. The offline baseline check passed on October 8, 2026: **12 pages, 51 referenced assets, 176 local references, and 22 external embeds**.

| Surface | Existing assumption | Migration implication |
| --- | --- | --- |
| Routing | Each document is a file under `public/`. `/` and `/index.html` serve the homepage; reading links use root-relative `.html` URLs. Unknown files return 404. | Preserve every published URL and link target. Verify the exported filenames and direct requests; do not introduce an SPA fallback or require redirects for the existing routes. |
| Content and data models | Text, headings, links, images, iframe attributes, page styles, titles, and Open Graph metadata are embedded in HTML. There is no database, CMS, API model, or content fetch. | Use typed route and content records and React rendering without introducing a backend. Compare the rendered content and attribute contracts with the snapshot. |
| Authentication | No login, account state, cookies, session storage, authorization logic, or public forms exist. Weebly account bootstrap code was removed in the previous archive migration. | No auth replacement is needed. The migrated application remains a public static site. |
| Configuration | The local preview reads only `PORT`, defaults to 4173, and binds to `127.0.0.1`. Asset paths assume hosting at the domain root. | Preserve the local preview convention. Document the new install/build commands and keep domain-root hosting as an explicit requirement. |
| Build tooling | `package.json` has no dependencies or lockfile. `dev` and `start` run `scripts/serve.mjs`; `check` runs Python. Node is declared as `>=18`; there is no compilation step. | Introduce pnpm 10.30.2, a lockfile, Next.js 16.4, React 19.3, TypeScript, Tailwind 4.3.3, and ESLint. Building becomes a deployment prerequisite. The application declares Node `>=22`; the standalone legacy fallback still works with Node 18. |
| Tests | `scripts/check.py` checks local references, dependencies, inline handlers, JavaScript links, and unreferenced assets using Python 3.8 or newer. There are no existing lint, type-check, unit, or browser test commands. | Retain the legacy integrity check and add lint, type-check, output/content contract tests, and focused browser coverage. The new checks must validate generated output as well as source. |
| Deployment | Publish the contents of `public/` to a static host with no build command. No CI, deployment adapter, Dockerfile, DNS configuration, or remote deployment target is defined. | Publish the completed `out/` export after validation. Keep a separately assembled legacy publish directory until the export passes every gate. No deployment or DNS change is part of this migration. |
| External contracts | Twenty-two YouTube iframes remain external. Bibliography URLs are plain text: the retained pages have no external anchor links. Local filenames, iframe URLs, titles, fullscreen/lazy-loading attributes, and metadata are part of the archive. | Preserve those values and the plain-text bibliography. Validate embed attributes without requiring video playback; availability and embedding permission remain controlled by YouTube. |
| Assets and fonts | Images, animated GIFs, a favicon, theme TTF fonts, and previously downloaded vendor font files are local. Vendor directory names describe their source and do not require those hosts at runtime. | Retain public URLs and asset bytes. Avoid font downloads during builds and avoid image optimization that would change GIF animation or dimensions. |
| Styling | A Weebly base stylesheet, theme stylesheet, local font stylesheets, migration fixes, inline styles, and `<font>` attributes combine through the CSS cascade. The theme has rules for features that are absent from the retained pages. | Retain the compatibility styles until parity is demonstrated. Do not remove apparently unused selectors during the routing migration. Disable Tailwind preflight and configure its prefix as `tw` to avoid the existing `.container` class. |
| Interaction | `public/assets/site.js` toggles `nav-open` and `affix` on the body. The mobile menu transfers and restores focus, traps Tab, closes on Escape, updates both toggles, and uses `inert` when closed. | Reproduce these behaviors in a small React client component and remove duplicate event registration from the Next.js rendering path. Preserve focus outlines and reduced-motion behavior. |

The existing mobile rules deliberately require separate compatibility values: CSS switches to mobile navigation at **992px**, while the script closes an open menu above **1024px**. The header becomes affixed when scroll position exceeds **50px**. Correcting those differences would be a behavior change and is outside this migration.

### Published page contract

| Page | Required URL |
| --- | --- |
| Home | `/` and `/index.html` |
| Table of contents | `/contents.html` |
| The Matrix film | `/the-matrix-film.html` |
| Genre introduction | `/intro-to-cyberpunk-and-post-cyberpunk.html` |
| Cyberpunk analysis | `/cyberpunk-the-matrix-and-post-cyberpunk.html` |
| Pill choice | `/the-choice.html` |
| Blue pill | `/blue-pill.html` |
| Mise en scène | `/mise-en-scene.html` |
| Technical perspective | `/tech.html` |
| Jean Baudrillard | `/jean-baudrillard.html` |
| Philosophical and society issues | `/influence.html` |
| Bibliography | `/references.html` |

## Stack mapping and compatibility decisions

| Old stack | New stack | Compatibility retained |
| --- | --- | --- |
| Physical HTML documents | Individual App Router page folders and static export | Original `.html` links; development rewrite and physical exported file preserve the homepage alias |
| Duplicated document heads and body classes | Page-local Metadata API exports and root layouts | Titles, Open Graph values, language, viewport, favicon, route-specific body classes in server-rendered HTML |
| Authored HTML content | Server JSX directly in each route’s `page.tsx` | Text, element order, links, image attributes, embed attributes, and legacy layout classes |
| Shared header and navigation markup | `SiteShell` client component around server-rendered content | Existing appearance, active navigation, and menu controls |
| DOM event listeners | React component with cleanup | Menu focus, Escape, Tab wrapping, resize closing, and scroll affix behavior |
| Inline formatting | Statically discoverable Tailwind arbitrary utilities where safe | Exact dimensions, spacing, colors, alignment, background values, and responsive appearance |
| Theme, base, and font CSS | Tailwind plus retained CSS compatibility layer | Original selector behavior, typography, responsive breakpoints, transitions, and font files |
| Node preview without a build | Next.js development plus static export preview | Port 4173 and local-only preview |
| Dependency-free package setup | pnpm 10.30.2 with a committed lockfile | Reproducible package resolution; fallback preview remains independent of package installation |
| Python reference checker | Legacy integrity check plus focused migration checks | Offline local-reference and external-dependency restrictions |
| Upload `public/` | Build and upload `out/` | Static hosting at the root, no SPA fallback, and unchanged local asset URLs |

Some legacy features have no direct replacement:

- A dependency-free deployment workflow becomes a package installation and build workflow. The exported site still needs only a static host; the source project now needs the declared Node version and pnpm.
- Tailwind cannot automatically reproduce the legacy cascade. Preflight remains disabled, the prefix avoids `.container` collisions, and legacy CSS remains in place while each conversion is checked. The root layout registers compatibility styles with React’s `legacy` precedence group, and the page imports generated Tailwind styles afterward. This ordering was verified in browser comparisons. The application emits unlayered utilities because unlayered legacy rules can outrank layered utilities. Authored inline values previously outranked stylesheet rules, so each conversion must preserve that precedence when necessary.
- Extension-free App Router folders export the original `.html` filenames directly. Development rewrites preserve existing `.html` URLs and the homepage alias without redirects. Production needs no filename rewriting or redirects for the existing URLs. The static publishing contract remains the original `.html` files; extension-free page URLs are additionally available from the Next.js development server.
- A route's legacy body classes cannot be moved onto a nested wrapper without changing selectors such as `body.no-header-page`. Each App Router page folder defines a root layout that applies its body classes before hydration, through the shared `SiteDocument`. Multiple root layouts preserve the existing full-document navigation. Experimental `globalNotFound` provides the plain error response independently of that layout.
- Next.js 16.4 exports segment-prefetch directories under each route name. With extension-free folders, these directories coexist with the `.html` files, so generated payloads remain untouched at their original paths. The export audit validates their filenames, presence, serialized content, and resource references. The obsolete filename finalizer and payload archive have been removed. Page links now use extension-free URLs with full-document navigation. Static hosts must resolve clean page URLs to the matching `.html` files before checking directories; the Node preview follows this rule. Introducing client navigation requires revisiting static transport handling.
- Native document navigation resets menu state and browser scroll behavior. Existing links remain ordinary anchors unless an equivalent client-navigation contract is explicitly implemented and tested.
- The original Weebly editor, unpublished drafts, and private account data are not part of the archive and cannot be recreated from this source.
- The App Router Metadata API serializes Open Graph tags in a different order and writes numeric viewport scale as `1` instead of `1.0`. Both represent the same values; viewport comparison normalizes the numeric scale. Next also derives Twitter preview tags from the same retained title and description. Parity compares properties and values semantically, without treating their order as a user-visible change. Generated App Router Flight data differs from Pages Router page data. The export checker parses the exact generated queue expressions as JSON data without execution, validates discriminator types and serialized resource references, and rejects Pages Router data or arbitrary inline JavaScript.

Generated content and Tailwind class strings must be included in Tailwind's source discovery. Converting styles must respect the last effective value of duplicate declarations, quoted URLs, units, and values that do not translate safely. Retained semantic HTML and legacy classes remain acceptable compatibility boundaries; rewriting table layouts, editing prose, removing font attributes, or redesigning the pages is a separate project.

## Completed original migration checkpoints

These four milestones describe the completed initial HTML-to-Pages-Router migration. They remain as historical validation evidence; source locations and router choices inside those checkpoints describe that stage, rather than the current App Router structure. Each milestone ran lint, type-check, and focused tests before the next began. The legacy integrity check protects the fallback and shared public assets.

### Milestone 1 Establish the fallback and validation toolchain

Capture the original documents in `legacy/pages/` before changing the active rendering path. Keep the public static assets at their established URLs. Add pinned pnpm, the validation dependencies and lockfile, TypeScript, ESLint, and focused parity tests. The active site remains the original static site during this checkpoint; Next.js, Tailwind, and React rendering are introduced in Milestone 2.

`scripts/build-legacy.mjs` assembles the snapshot and shared public assets into `.legacy/`. The preview server accepts `SITE_DIR` so the archived site can still run with Node alone. The generated directory is disposable; the tracked snapshot and public assets are the reproducible rollback source.

Gate:

- Install through pnpm and verify the pinned package-manager version and committed lockfile.
- Run `pnpm lint`, `pnpm typecheck`, and the focused fallback/route-manifest tests.
- Assemble `.legacy/` and run the retained integrity checker against it. Confirm the baseline counts and absence of new remote scripts, fonts, images, or stylesheets.
- Start the legacy server without Next.js or React dependencies and confirm the homepage and one `.html` route work.

Fallback: serve `.legacy/`; the active static site remains available while the application foundation is validated.

### Milestone 2 Introduce Next.js and Tailwind with a homepage pilot

Add Next.js, React, and Tailwind with preflight disabled and the `tw` prefix. Render only the homepage through Next.js, using a registry for metadata and body classes. The eleven existing `.html` files remain available from `public/`, and ordinary anchors continue connecting the new homepage to the legacy pages. Keep the legacy menu script for this checkpoint. Move the homepage's authored formatting to Tailwind only when an exact equivalent is available; retain the theme, base, and font compatibility styles.

Gate:

- Run `pnpm lint`, `pnpm typecheck`, and focused content/metadata/route tests.
- Confirm the homepage retains its text, links, media, metadata, body classes, and layout. Verify the index alias without creating a second competing source of content.
- Request every legacy `.html` page through the new development server, preserving the full reading sequence, media, and 22 embeds while those pages remain static.
- Compare the new homepage with the fallback at desktop and mobile sizes. Exercise the links to legacy pages and verify the legacy menu script still works on both sides of the boundary.

Fallback: rebuild and serve `.legacy/`; no published URLs need to change while the Next.js rendering is repaired.

### Milestone 3 Move the remaining pages and navigation into React

Render the eleven remaining pages through explicit `.html` routes and local JSX content. Remove the competing authored HTML documents from the active public directory after the route checkpoint passes; retain their tracked snapshots in `legacy/pages/`. Extract the shared React shell and move the menu and affix behavior into its interaction component. Preserve the two menu buttons, body state classes, focus movement, keyboard wrapping, `inert` state, and existing resize and scroll thresholds. Ensure event listeners are cleaned up and the legacy script is not also loaded by Next.js.

Gate:

- Run `pnpm lint`, `pnpm typecheck`, and focused content/metadata/route and interaction tests.
- Confirm all twelve documents retain their text, heading order, links, image sources, metadata, body classes, and 22 iframe URLs and attributes.
- Compare representative pages in a browser at desktop and mobile sizes, including the homepage, contents, a long analysis page, and the red/blue pill flow.
- Open the mobile menu and confirm both controls report `aria-expanded="true"`; the first menu control receives focus.
- Check forward and reverse Tab wrapping. Escape and the close control must close the menu, restore focus, set both controls to collapsed, and make the menu inert.
- Verify resizing beyond 1024px closes the menu and scroll positions above/below 50px toggle affix state correctly.
- Check mobile CSS at and around 992px, visible keyboard focus, reduced motion, and navigation to another document.

Fallback: serve `.legacy/` with its original script. A failed interaction test blocks the export milestone.

### Milestone 4 Validate the export and hand over deployment

Build the complete static export and normalize `.html.html` output names through `scripts/finalize-export.mjs`. Treat `out/` as the publish directory. Update the operational instructions to use pnpm, the required Node version, static output, validation, and the fallback commands.

Gate:

- Run `pnpm lint`, `pnpm typecheck`, the focused tests, and `pnpm build`.
- Check that the normalized export contains the original twelve document filenames and the generated framework files it references. No duplicate `.html.html` pages may remain.
- Serve the export as plain static files and request `/`, `/index.html`, every retained `.html` route, representative assets, and an unknown path. Original routes must return 200 and the unknown path must return 404 without an SPA fallback.
- Validate exported local links, styles, scripts, images, fonts, favicon, metadata, and embed contracts. Framework-generated resources must stay local.
- Finish browser parity checks against the fallback on desktop and mobile, including the reading sequence and both pill choices. Record any unavoidable user-visible differences before declaring completion.

Fallback: publish the contents of `.legacy/` or return to the previous static artifact. Promote `out/` only after the export gate passes. Keep the fallback instructions and snapshot for a later, explicitly scoped cleanup.

## App Router follow-up checkpoints

Checkpoints 5 and 6 record the initial catch-all App Router implementation. Checkpoint 7 records individual folders with `.html` suffixes. Checkpoint 8 removes those suffixes and the associated export normalization; the current architecture is described above.

The user requested the App Router after the original migration completed. This follow-up changes the framework routing and rendering boundary while preserving the same published contract. It keeps the pnpm workflow, CSS compatibility layer, static deployment, and `.legacy/` fallback. A copy of the completed Pages Router export is also available at `/private/tmp/cyberpunk-pages-fallback` on this machine. That temporary copy is a local checkpoint artifact; the tracked legacy snapshot and builder remain the reproducible fallback.

### Checkpoint 5 Validate App Router development parity

Replace the Pages Router source with the root layout and page under `src/app/[[...page]]/`. Move the articles into the server JSX registry in `src/content/`, generate the twelve finite routes, and keep only `SiteShell` as an authored client component. Replace `PageHead` with the Metadata API, apply body classes in the root layout before hydration, and use experimental `globalNotFound` for the independent English plain 404 response. Keep the development-only homepage alias rewrite.

Gate:

- Run `pnpm lint`, `pnpm typecheck`, `pnpm check:legacy`, and focused development browser tests on the isolated Next.js server at 4175.
- Confirm `/`, `/index.html`, and all eleven `.html` routes retain the content, headings, links, media, metadata values, and body classes of the snapshot. Compare Open Graph properties and values independently of serialization order.
- Verify the finite manifest rejects unknown single-segment and nested paths with a real 404, preserving `lang="en"` and the plain error response.
- Check JavaScript-disabled reading and the server-rendered body classes. Confirm the menu, focus trap, Escape, focus restoration, resize closure, and affix threshold still work after hydration.
- Compare representative desktop/mobile layouts, including fonts, hidden logo content, spacers, and table cells. Confirm server content has not acquired a client directive and that no Pages Router files remain.

Status: passed on October 8, 2026. Lint, type-check (including generated App Router types), legacy integrity, and all 31 development browser tests passed. The suite verifies App Router response/runtime identity, semantic metadata, finite-route 404 behavior, the homepage alias, every route with JavaScript disabled, menu interactions, and ten desktop/mobile layout comparisons. A stylesheet-order regression was fixed before passing the gate; a transient Chromium network-change failure passed on the unchanged strict rerun.

Fallback: `.legacy/`, or the local Pages Router checkpoint artifact while it remains available.

### Checkpoint 6 Validate the App Router production export

Build the App Router static export, retain filename normalization for the eleven named pages, and extend the export checker for generated Flight data. The checker must recognize the expected Next.js bootstrap/Flight formats without executing script text, verify referenced chunks are present locally, and continue rejecting unrecognized inline scripts or external runtime dependencies. Retain the homepage's physical `index.html` alias without generating a competing route.

Gate:

- Run `pnpm lint`, `pnpm typecheck`, `pnpm check:legacy`, `pnpm build`, and `pnpm test:export`.
- Validate the twelve original documents, the generated 404 response, local framework resources and Flight data, 22 unchanged embed contracts, and all 51 retained asset hashes. Compare Metadata API output semantically and record the final local-reference count.
- Confirm normalized `.html` files serve from a plain static host, including `/index.html`, and that unknown paths return 404 without production rewrites or an SPA fallback.
- Run the focused browser suite against the isolated export server at 4176, including menu interaction, JavaScript-disabled reading, desktop/mobile layout, and both pill choices.
- Record the App Router gate results before treating the new `out/` as the artifact ready for publication.

Status: passed on October 8, 2026. The final cumulative command, `pnpm check && pnpm build && pnpm test:export`, passed lint, generated-route type-check, legacy integrity, 31 development browser tests, the App Router production build and export audit, and 31 production browser tests. The audit verifies 12 original documents, 22 embeds, 51 unchanged asset hashes, 33 preserved segment hashes, 52 serialized Flight responses, and 1,435 resolving local references across six stylesheets. Negative probes confirmed duplicate manifest entries and unexpected preserved files are rejected. Full document navigation uses no redirects or segment-prefetch requests.

Fallback: publish the complete `.legacy/` artifact or use the local Pages Router checkpoint while it remains available. The reproducible legacy fallback remains available after this gate. Removing it or the compatibility styles is a separate cleanup task; the temporary Pages Router copy remains a local option while present.

### Checkpoint 7 Replace registries with individual page folders

Move all twelve articles directly into their route folders, co-locate static metadata and body classes in route layouts, and remove `src/content/`, `src/data/`, and the optional catch-all. Keep the homepage in `(home)` so it has its own folder while retaining `/`. Share only the document markup and navigation components. The export audit now expects Next’s encoded static-segment filenames rather than the former catch-all filenames.

Development gate: lint, type-check, legacy integrity, and 31 browser tests passed. Stale generated development types were regenerated after removing the catch-all.

Production gate: passed. `pnpm check && pnpm build && pnpm test:export` completed lint, type-check, legacy integrity, all 31 development tests, the full build/export audit, and all 31 production tests. The export retains 12 pages, 22 embeds, 51 unchanged assets, 33 preserved segment hashes, 52 Flight responses, and 1,435 references. The architecture check requires each page’s own folder and the absence of the removed registries and resolver.

Fallback: regenerate and serve `.legacy/` using the existing Node-only commands. Retain the compatibility styles and native-anchor navigation contract.

### Checkpoint 8 Remove suffixes from App Router folders

Rename the eleven named route folders to extension-free slugs, retaining each page and its adjacent layout. Add a generic development rewrite for the original `.html` URLs and keep the homepage alias. Next.js now emits the twelve original HTML filenames directly, so remove the filename finalizer and preserve framework payloads in their normal directories. Update the architecture and export checks for extension-free static segment names.

Development gate: lint, type-check, legacy integrity, and 31 browser tests passed, including the original URLs and each clean development route. Generated development types were refreshed after renaming folders.

Production gate: passed. The build emits all twelve original HTML filenames directly. Export integrity validates 22 embeds, 51 unchanged asset hashes, 33 unmodified route segment payloads, 52 Flight responses, and 1,435 resolving references; all 31 static-export browser tests pass. No filename postprocessing or payload relocation remains. Fallback remains `.legacy/`.

### Checkpoint 9 Remove undefined legacy classes

Audit class tokens against the local base/theme/compatibility stylesheets and the React interaction handlers. Remove 57 undefined class names (337 occurrences) across the twelve pages and shared shell, including `wsite-page-*`, `wsite-background-*`, `alt-nav-off`, and unused wrappers. Keep all stylesheet-defined selectors, Tailwind utilities, and the `nav-open`/`affix` interaction states. Empty class attributes are removed without changing the element structure.

The parity expectations explicitly omit only removed inert body markers and account for the already-adopted extension-free link destinations. A browser check inspects loaded stylesheet selectors for every rendered class on every page. Desktop/mobile comparisons continue measuring header wrappers and spacers through structural selectors. Isolated development validation uses `.next-test/` so it can run alongside the user's existing development server. The frozen legacy documents and all 51 asset hashes remain the rollback boundary.

Validation passed: lint, generated-route type-check, legacy integrity, 31 development browser tests, the standard production build, export audit, and 31 production browser tests. The export audit confirms twelve documents, 22 embeds, 51 unchanged assets, 33 route segment payloads, 52 Flight responses, and 1,435 resolving local references. The class cleanup preserves computed desktop/mobile layouts and navigation behavior.

## Validation and fallback commands

The milestone gate is:

```sh
pnpm lint
pnpm typecheck
pnpm check:legacy
pnpm test
```

`pnpm check` runs this combined gate. The default browser target is Next.js. The isolated servers use ports 4175 for Next.js, 4174 for the fallback, and 4176 for the export; the test configuration refuses to reuse existing servers. Install Chromium once with `pnpm exec playwright install chromium`. Focused tests should be selected for the changed surface when the test runner supports filtering. Production validation adds:

```sh
pnpm build
pnpm check:export
pnpm test:export
```

`pnpm build` runs the Next.js build; run `pnpm check:export` separately. No filename postprocessing is needed. `SITE_DIR=out node scripts/serve.mjs` previews the completed `out/` directory at port 4173, including clean URLs and original `.html` aliases. `pnpm start` runs `next start` and requires server output rather than the configured static export. `pnpm test:legacy` selects the archived site for browser tests.

The fallback is assembled and served without an installed framework:

```sh
node scripts/build-legacy.mjs
SITE_DIR=.legacy node scripts/serve.mjs
```

To choose another preview port:

```sh
PORT=8080 SITE_DIR=.legacy node scripts/serve.mjs
```

Stop the server with Ctrl+C. Deploy the contents of the chosen validated directory to the domain root. Never mix selected files from `out/` with `.legacy/`: use one complete artifact so document links, CSS, and framework resources remain consistent.

Rollback does not require pnpm installation or a Next.js build. The original pages are tracked under `legacy/pages/`; `.legacy/` can be regenerated using Node 18 or newer and the retained assets. Asset changes during the migration must preserve the fallback as well as the application. The active JSX source does not depend on the HTML snapshots for rendering or regeneration.

## Milestone ledger

The original four Pages Router migration gates passed on October 8, 2026. Their final cumulative command, `pnpm check && pnpm build && pnpm test:export`, completed successfully. Those historical results remain valid for that completed artifact. The App Router follow-up also passed its development and production gates with `pnpm check && pnpm build && pnpm test:export`. Deployment remains a separate operational action.

| Milestone | Status | Validation evidence | Available fallback |
| --- | --- | --- | --- |
| 1 Fallback and validation toolchain | Passed | Lint, type-check, legacy integrity, and 29 browser tests passed. Baseline: 12 pages, 51 assets, 176 local references, 22 external embeds. | `.legacy/` |
| 2 Next.js and Tailwind homepage pilot | Passed | Lint, type-check, legacy integrity, and 30 browser tests passed. The Next.js identity check used the isolated server on 4175; the homepage pilot and retained static routes preserved their contracts. | `.legacy/`; the named pages remained static during this checkpoint. |
| 3 Remaining JSX pages and React navigation | Passed | Lint, type-check, legacy integrity, and 31 browser tests passed against Next.js. All routes and the index alias passed, along with React navigation, JavaScript-disabled reading, and desktop/mobile computed layout including fonts, spacers, and table cells. | `.legacy/` |
| 4 Export and handover | Passed | Lint, type-check, legacy integrity, 31 development browser tests, production build, and 31 production browser tests passed. Export integrity confirms 12 original documents, 22 embeds, 51 unchanged asset hashes, and 390 resolving local references. All eleven named export files were normalized; `/index.html` and unknown-route 404 behavior passed. Frozen pnpm installation also passed. | `.legacy/` and the prior static publish artifact |
| 5 App Router development parity | Passed | Lint, generated-route type-check, legacy integrity, and 31 browser tests passed. Includes App runtime identity, all twelve routes and index alias without JavaScript, finite-route/plain 404 behavior, navigation, and ten desktop/mobile layout comparisons. | `.legacy/`; local Pages Router export at `/private/tmp/cyberpunk-pages-fallback` |
| 6 App Router production export | Passed | Lint, generated-route type-check, legacy integrity, 31 development tests, production build and export audit, and 31 production tests passed. Audit: 12 original documents, 22 embeds, 51 unchanged assets, 33 preserved segment hashes, 52 Flight responses, 1,435 local references, six stylesheets. Native navigation uses no redirects or segment-prefetch requests. | `.legacy/`; local Pages Router export while the temporary copy remains available |
| 7 Individual route folders | Passed | Lint, type-check, legacy integrity, production build/export audit, 31 development tests, and 31 production tests passed. Each page owns its route folder, metadata, and body classes. No catch-all or registries remain. | `.legacy/` |
| 8 Extension-free route folders | Passed | Lint, type-check, legacy integrity, build/export audit, 31 development tests, and 31 production tests passed. Original `.html` URLs are retained with development rewrites and natural static export. | `.legacy/` |
| 9 Undefined class cleanup | Passed | Removed 57 undefined names (337 occurrences). Lint, type-check, legacy integrity, production build/export audit, 31 development tests, and 31 production tests passed. All rendered classes have loaded CSS selectors; desktop/mobile layouts and interactions retain parity. | `.legacy/` |

The original migration completed when its first four gates passed. The explicitly requested App Router transition is also complete: Checkpoints 5 and 6 passed, the pnpm workflow builds a validated static artifact, the original routes and behaviors remain valid, and the fallback remains reproducible. Removing the compatibility theme or archive is not required to complete either transition.

The original Pages Router React Doctor scan examined 44 files and reported zero errors and 101 warnings. Those warnings concern retained native anchors, local compatibility/font stylesheet links, existing image wrappers and alt text, YouTube iframe attributes, and the long static article. These are intentional archive compatibility choices; the migration does not redesign content or introduce client navigation. That historical scan does not validate the App Router follow-up; the relevant new browser and export gates remain the acceptance evidence.

The completed Pages Router export checker accepted only local generated framework scripts and serialized page data. Its Turbopack bootstrap parsing checked chunks without executing script text. The App Router checker additionally validates generated Flight data, preserved payload hashes, and complete serialized responses. Checkpoint 6 passed the complete build and browser acceptance gate. Tests wait for the actual Tailwind hiding rule before measuring layout, preventing development stylesheet timing from producing false comparisons. YouTube playback uses offline fixtures; external video availability is not verified by these gates.

The App Router React Doctor scan examined 45 files and reported zero errors and the same 101 compatibility warnings (score 46). The retained local font links, native anchors, image wrappers and alt text, iframe attributes, and long static article explain these warnings. Changing those contracts is outside this migration.

The individual-folder refactor’s React Doctor scan examined 53 files with zero errors and the same 101 compatibility warnings. No new warning category was introduced.
