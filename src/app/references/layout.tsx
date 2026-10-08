import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SiteDocument } from '../../components/SiteDocument';
import { SiteShell } from '../../components/SiteShell';

export const metadata: Metadata = {
  "title": "References",
  "openGraph": {
    "siteName": "the matrix",
    "title": "References",
    "description": "​Abbott, Carl. “Cyberpunk Cities: Science Fiction Meets Urban Theory.” Journal of Planning Education and Research 27 (2007): 122-131. Auger, Emily E. Tech-noir Film: A Theory of the Development..."
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
    <SiteDocument bodyClass="no-header-page wsite-page-references full-width-body-off header-overlay-on alt-nav-off wsite-theme-dark fade-in">
      <SiteShell>{children}</SiteShell>
    </SiteDocument>
  );
}
