import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SiteDocument } from '../../components/SiteDocument';
import { SiteShell } from '../../components/SiteShell';

export const metadata: Metadata = {
  "title": "tech",
  "openGraph": {
    "siteName": "the matrix",
    "title": "tech",
    "description": "The Matrix (1999) added level of complexity to a sci-fi action movie, which defined a new standard for the future movies. \"Bullet time\" the iconic visual effect created in the Matrix (1999), which..."
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
