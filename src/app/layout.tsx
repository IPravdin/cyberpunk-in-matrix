import "../styles/globals.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteShell } from "../components/SiteShell";

export const metadata: Metadata = {
  title: "Cyberpunk in Matrix",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" />
        {/* Register compatibility styles before the page's Tailwind assets. */}
        <link
          href="/assets/vendor/cdn2.editmysite.com/364b82031d91-sites.css"
          id="wsite-base-style"
          rel="stylesheet"
          type="text/css"
          precedence="legacy"
        />
        <link
          href="/files/main_style.css"
          rel="stylesheet"
          title="wsite-theme-css"
          type="text/css"
          precedence="legacy"
        />
        <link
          href="/assets/vendor/fonts.googleapis.com/26b8c8baf01f-fonts.css"
          rel="stylesheet"
          type="text/css"
          precedence="legacy"
        />
        <link
          href="/assets/vendor/fonts.googleapis.com/ef3186d18578-fonts.css"
          rel="stylesheet"
          type="text/css"
          precedence="legacy"
        />
        <link
          href="/assets/migration.css"
          rel="stylesheet"
          precedence="legacy"
        />
      </head>
      <body className="no-header-page full-width-body-off header-overlay-on wsite-theme-dark fade-in">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
