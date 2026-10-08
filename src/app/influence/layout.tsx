import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SiteDocument } from '../../components/SiteDocument';
import { SiteShell } from '../../components/SiteShell';

export const metadata: Metadata = {
  "title": "influence",
  "openGraph": {
    "siteName": "the matrix",
    "title": "influence",
    "description": "Plato's allegory of cave. In the movie we see that people in The Matrix (1999) believe what they are shown by the matrix just like the people in the cave. Two groups shown one knows about reality..."
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
