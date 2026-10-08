import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SiteDocument } from '../../components/SiteDocument';
import { SiteShell } from '../../components/SiteShell';

export const metadata: Metadata = {
  "title": "jean-baudrillard",
  "openGraph": {
    "siteName": "the matrix",
    "title": "jean-baudrillard",
    "description": "Jean’s references in the movie \"Rather than merely predicting a future dystopia, Baudrillard’s work argues that dystopia had already been realized at the time of writing\"  (Haar, Rebecca,  and..."
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
