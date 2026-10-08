import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SiteDocument } from '../../components/SiteDocument';
import { SiteShell } from '../../components/SiteShell';

export const metadata: Metadata = {
  "title": "home",
  "openGraph": {
    "siteName": "the matrix",
    "title": "home",
    "description": "the matrix"
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
    <SiteDocument bodyClass="no-header-page wsite-page-index full-width-body-off header-overlay-on alt-nav-off wsite-theme-dark fade-in">
      <SiteShell home>{children}</SiteShell>
    </SiteDocument>
  );
}
