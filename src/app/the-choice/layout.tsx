import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SiteDocument } from '../../components/SiteDocument';
import { SiteShell } from '../../components/SiteShell';

export const metadata: Metadata = {
  "title": "the-choice",
  "openGraph": {
    "siteName": "the matrix",
    "title": "the-choice",
    "description": "Red color has represented aggression, dominance, warnings of danger, it could be for psychological or scientific (higher visibility) reasons. While blue color induces a feeling of peacefulness,..."
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
    <SiteDocument bodyClass="no-header-page wsite-page-the-choice full-width-body-off header-overlay-on alt-nav-off wsite-theme-dark fade-in">
      <SiteShell>{children}</SiteShell>
    </SiteDocument>
  );
}
