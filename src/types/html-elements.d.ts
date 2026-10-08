import type { DetailedHTMLProps, HTMLAttributes } from "react";

// Font sizes participate in the active theme's responsive selectors.
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      font: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        size?: string;
        color?: string;
      };
    }
  }
}
