import { useSyncExternalStore } from 'react';
import { getHostLocaleStore } from './host-locale.js';
export { translate, localizeMessage, localizedName } from './i18n.js';
export { bindHostLocale } from './host-locale.js';

/** Every mounted surface updates immediately when Harness changes its language. */
export function useI18n() {
  const store = getHostLocaleStore();
  const locale = useSyncExternalStore(store.subscribe, store.getSnapshot, () => 'zh');
  return (zh, en) => locale === 'en' ? en : zh;
}
