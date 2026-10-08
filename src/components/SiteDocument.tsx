import type { ReactNode } from 'react';

// Each route has its own root layout so its body classes are present in SSR.
// Keep this document markup shared while metadata stays beside each page.
export function SiteDocument({ bodyClass, children }: {
  bodyClass: string;
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Register compatibility styles before the page's Tailwind assets. */}
        <link href="/assets/vendor/cdn2.editmysite.com/364b82031d91-sites.css" id="wsite-base-style" rel="stylesheet" type="text/css" precedence="legacy" />
        <link href="/files/main_style.css" rel="stylesheet" title="wsite-theme-css" type="text/css" precedence="legacy" />
        <link href="/assets/vendor/fonts.googleapis.com/26b8c8baf01f-fonts.css" rel="stylesheet" type="text/css" precedence="legacy" />
        <link href="/assets/vendor/fonts.googleapis.com/ef3186d18578-fonts.css" rel="stylesheet" type="text/css" precedence="legacy" />
        <link href="/assets/migration.css" rel="stylesheet" precedence="legacy" />
      </head>
      <body className={bodyClass}>{children}</body>
    </html>
  );
}
