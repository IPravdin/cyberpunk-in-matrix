import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SiteDocument } from '../../components/SiteDocument';
import { SiteShell } from '../../components/SiteShell';

export const metadata: Metadata = {
  "title": "Intro to Cyberpunk and Post-Cyberpunk",
  "openGraph": {
    "siteName": "the matrix",
    "title": "Intro to Cyberpunk and Post-Cyberpunk",
    "description": "Cyberpunk as a term firstly appeared in Bruce Bethke’s short story “Cyberpunk” (1980). The author combined two words ‘cybernetics’ and ‘punk’, where cybernetics represents the..."
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
    <SiteDocument bodyClass="no-header-page wsite-page-intro-to-cyberpunk-and-post-cyberpunk full-width-body-off header-overlay-on alt-nav-off wsite-theme-dark fade-in">
      <SiteShell>{children}</SiteShell>
    </SiteDocument>
  );
}
