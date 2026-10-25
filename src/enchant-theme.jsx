import { useLayoutEffect, useState } from 'react';
import { getEnchantRegistry, themeAttributes } from './enchant-bridge.js';
import { getHostAppearanceStore } from './host-appearance.js';

/** Every top-layer dialog subscribes independently of its settings page. */
export function useEnchantAppearance() {
  const registry = getEnchantRegistry();
  const host = getHostAppearanceStore(document);
  const [snapshot, setSnapshot] = useState(() => registry.getSnapshot());
  const [hostAppearance, setHostAppearance] = useState(() => host.getSnapshot());
  useLayoutEffect(() => {
    const refresh = () => setSnapshot(registry.getSnapshot());
    const dispose = registry.subscribe(refresh);
    refresh();
    return dispose;
  }, [registry]);
  useLayoutEffect(() => {
    const refresh = () => setHostAppearance(host.getSnapshot());
    const dispose = host.subscribe(refresh);
    refresh();
    return dispose;
  }, [host]);
  return themeAttributes(snapshot.theme, hostAppearance);
}
