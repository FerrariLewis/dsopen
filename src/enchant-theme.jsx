import { useEffect, useState } from 'react';
import { getEnchantRegistry, themeAttributes } from './enchant-bridge.js';

/** Every top-layer dialog subscribes independently of its settings page. */
export function useEnchantAppearance() {
  const registry = getEnchantRegistry();
  const [snapshot, setSnapshot] = useState(() => registry.getSnapshot());
  useEffect(() => {
    const refresh = () => setSnapshot(registry.getSnapshot());
    const dispose = registry.subscribe(refresh);
    refresh();
    return dispose;
  }, [registry]);
  return themeAttributes(snapshot.theme);
}
