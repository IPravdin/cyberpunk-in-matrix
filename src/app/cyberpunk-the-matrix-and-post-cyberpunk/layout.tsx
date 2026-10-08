import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SiteDocument } from '../../components/SiteDocument';
import { SiteShell } from '../../components/SiteShell';

export const metadata: Metadata = {
  "title": "Cyberpunk, The Matrix and Post-Cyberpunk",
  "openGraph": {
    "siteName": "the matrix",
    "title": "Cyberpunk, The Matrix and Post-Cyberpunk",
    "description": "Cyberpunk and Post-Cyberpunk are lenses which allow to re-understand past and present in our world respectively (Kilgore 2020, 48-55).   The authors are using nowadays technological, economic,..."
  },
  "icons": {
    "icon": {
      "url": "/favicon.svg",
      "type": "image/svg+xml"
    }
  }
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <SiteDocument bodyClass="no-header-page wsite-page-cyberpunk-the-matrix-and-post-cyberpunk full-width-body-off header-overlay-on alt-nav-off wsite-theme-dark fade-in">
      <SiteShell>{children}</SiteShell>
    </SiteDocument>
  );
}
