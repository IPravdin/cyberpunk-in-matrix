import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config(
  { ignores: ['.next/**', 'out/**', '.legacy/**', 'public/**', 'legacy/**', 'test-results/**', 'playwright-report/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  { languageOptions: { globals: { ...globals.node, ...globals.browser } } },
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      // Export normalization preserves native document navigation. Enabling
      // client routing also requires restoring its segment-prefetch endpoints.
      'no-restricted-imports': ['error', { paths: [
        { name: 'next/link', message: 'Retain native anchors until the static .html export supports client-prefetch endpoints.' },
        { name: 'next/navigation', importNames: ['useRouter'], message: 'Client navigation requires revisiting the .html export compatibility layer.' },
      ] }],
    },
  },
);
