import type { NextConfig } from 'next';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants';

const config: NextConfig = {
  output: 'export',
  trailingSlash: false,
  reactStrictMode: true,
  poweredByHeader: false,
  devIndicators: false,
  experimental: { globalNotFound: true },
};

export default function nextConfig(phase: string): NextConfig {
  // Extension-free routes export the original .html files naturally.
  // Development rewrites preserve the archive's URLs without redirects.
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      ...config,
      output: undefined,
      rewrites() {
        return [
          { source: '/index.html', destination: '/' },
          { source: '/:page.html', destination: '/:page' },
        ];
      },
    };
  }
  return config;
}
