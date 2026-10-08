import type { DetailedHTMLProps, HTMLAttributes } from 'react';

// Archived <font> sizes participate in the theme's responsive selectors.
// Retain them until a separately validated typography migration replaces them.
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      font: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        size?: string;
        color?: string;
      };
    }
  }
}
