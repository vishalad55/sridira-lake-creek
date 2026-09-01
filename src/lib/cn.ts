import clsx, { type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * tailwind-merge has to be told about our custom font sizes. Without this it
 * reads `text-display-lg` as a *colour* utility (the `text-<colour>` group
 * accepts any token it doesn't recognise) and silently drops it whenever a real
 * colour like `text-paper` is merged in — which is how every heading on a dark
 * section lost its display size.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: ['display-xl', 'display-lg', 'display-md', 'display-sm', 'stat', 'eyebrow', 'body-lg'],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
