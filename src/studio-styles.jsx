import { useLayoutEffect } from 'react';
import { ensureStudioStyles } from './style-sheet.js';

export function useStudioStyles() {
  useLayoutEffect(() => {
    ensureStudioStyles(document);
  }, []);
}
