import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SiteDocument } from '../../components/SiteDocument';
import { SiteShell } from '../../components/SiteShell';

export const metadata: Metadata = {
  "title": "The Matrix film",
  "openGraph": {
    "siteName": "the matrix",
    "title": "The Matrix film",
    "description": "On the IMDb.com (n.d.) webpage mentioned that the Matrix is an action and sci-fi film that was released in 1999 and directed by the Wachowskis. The Matrix is one of the iconic films with its unique..."
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
    <SiteDocument bodyClass="no-header-page full-width-body-off header-overlay-on wsite-theme-dark fade-in">
      <SiteShell>{children}</SiteShell>
    </SiteDocument>
  );
}
