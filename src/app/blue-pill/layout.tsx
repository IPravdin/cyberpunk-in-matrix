import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SiteDocument } from '../../components/SiteDocument';
import { SiteShell } from '../../components/SiteShell';

export const metadata: Metadata = {
  "title": "blue-pill",
  "openGraph": {
    "siteName": "the matrix",
    "title": "blue-pill",
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
    <SiteDocument bodyClass="no-header-page full-width-body-off header-overlay-on wsite-theme-dark fade-in">
      <SiteShell>{children}</SiteShell>
    </SiteDocument>
  );
}
