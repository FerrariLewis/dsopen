import React, { useState, useEffect } from 'react';
import { getShortcutRegistry } from './shortcut-registry.js';
import { useEnchantAppearance } from './enchant-theme.jsx';
import { useI18n } from './i18n.jsx';
import { NPM_ENTRY_NAME } from './constants.js';
import { api } from './api-client.js';
import { latestState, subscribers, publish, openSettings } from './studio-state.js';

export function ShortcutAction() {
  const t = useI18n();
  const appearance = useEnchantAppearance();
  const [state, setState] = useState(latestState);
  const registry = getShortcutRegistry();
  const [budget, setBudget] = useState(() => registry.getSnapshot());
  const enabled = state?.settings.showShortcut === true;
  useEffect(() => {
    const changed = (value) => setState(value);
    subscribers.add(changed);
    if (latestState) setState(latestState);
    else
      api('/state')
        .then(publish)
        .catch(() => {});
    return () => subscribers.delete(changed);
  }, []);
  useEffect(() => registry.subscribe(() => setBudget(registry.getSnapshot())), [registry]);
  useEffect(() => {
    if (!enabled) return;
    return registry.acquire(NPM_ENTRY_NAME);
  }, [enabled, registry]);
  if (!enabled || !budget.visibleIds.includes(NPM_ENTRY_NAME)) return null;
  return (
    <button
      type="button"
      title={t('开机动画', 'Startup animation')}
      aria-label={t('开机动画', 'Startup animation')}
      onClick={openSettings}
      {...appearance}
      style={{
        ...appearance.style,
        border: 0,
        background: 'transparent',
        color: 'var(--lewis-accent,currentColor)',
        cursor: 'pointer',
        padding: 8,
        font: 'inherit',
      }}
    >
      ▷
    </button>
  );
}
