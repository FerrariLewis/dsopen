import React from 'react';
import { cancelPendingUpdates, bindHarnessServices } from './startup-update.js';
import { getEnchantRegistry, bindSettingsEntry } from './enchant-bridge.js';
import { translate } from './i18n.jsx';
import { bindHostLocale, subscribeHostLocale } from './host-locale.js';
import { NPM_ENTRY_NAME } from './constants.js';
import { OPEN } from './studio-state.js';
import { SettingsPanel } from './settings-panel.jsx';
import { BootRoot } from './boot-root.jsx';
import { ShortcutAction } from './shortcut-action.jsx';

export { api } from './api-client.js';
export { openSettings } from './studio-state.js';
export { playbackStages, EndTitle, Player } from './player.jsx';
export { SettingsPanel, BootRoot, ShortcutAction };

export function apply(ctx) {
  const wire = (ready) => {
    const register = () => {
      const registry = getEnchantRegistry();
      let unregister;
      const updateName = () => {
        unregister?.();
        unregister = registry.registerPlugin({
          id: NPM_ENTRY_NAME,
          name: translate('开机动画', 'Startup animation'),
          sectionId: 'dsh-boot-studio-settings',
          renderSettings: () => React.createElement(SettingsPanel),
          openSettings: () => window.dispatchEvent(new Event(OPEN)),
        });
      };
      updateName();
      const stopLocale = subscribeHostLocale(updateName);
      try {
        ready.slots.inject('shell.overlay', () =>
          ready.slots.register(
            { name: 'shell.overlay', id: 'dsh-boot-studio-overlay', order: 950 },
            () => React.createElement(BootRoot),
          ),
        );
        ready.slots.inject('settings.section', () =>
          bindSettingsEntry({
            slots: ready.slots,
            registry,
            pluginId: NPM_ENTRY_NAME,
            register: () =>
              ready.slots.register(
                {
                  name: 'settings.section',
                  id: 'dsh-boot-studio-settings',
                  order: 80,
                  label: () => translate('开机动画', 'Startup animation'),
                },
                () => React.createElement(SettingsPanel),
              ),
          }),
        );
        ready.slots.inject('sidebar.footer.action', () =>
          ready.slots.register(
            {
              name: 'sidebar.footer.action',
              id: 'dsh-boot-studio-shortcut',
              order: 42,
              label: () => translate('开机动画', 'Startup animation'),
            },
            () => React.createElement(ShortcutAction),
          ),
        );
        return () => {
          cancelPendingUpdates();
          stopLocale();
          unregister();
        };
      } catch (error) {
        stopLocale();
        unregister();
        throw error;
      }
    };
    if (typeof ready.effect === 'function') return ready.effect(register, 'dsh-boot-studio: slots');
    else return register();
  };
  if (typeof ctx.inject === 'function') {
    // Optional reactive injections leave the settings/player available on older
    // hosts, whose installer can still use the legacy authenticated endpoint.
    const bindInstaller = (ready) => {
      const bind = () =>
        bindHarnessServices({
          pluginManager: ready.remote?.pluginManager,
        });
      return typeof ready.effect === 'function'
        ? ready.effect(bind, 'dsh-boot-studio: installer')
        : bind();
    };
    const bindNavigation = (ready) => {
      const bind = () => bindHarnessServices({ pluginNavigation: ready.pluginNavigation });
      return typeof ready.effect === 'function'
        ? ready.effect(bind, 'dsh-boot-studio: navigation')
        : bind();
    };
    ctx.inject(['remote', 'remote.pluginManager'], bindInstaller);
    ctx.inject(['pluginNavigation'], bindNavigation);
    ctx.inject(['locale'], (ready) =>
      typeof ready.effect === 'function'
        ? ready.effect(() => bindHostLocale(ready.locale))
        : bindHostLocale(ready.locale),
    );
    return ctx.inject(['slots'], wire);
  } else {
    const stopServices = bindHarnessServices({
      pluginManager: ctx.remote?.pluginManager,
      pluginNavigation: ctx.pluginNavigation,
    });
    const stopLocale = ctx.locale ? bindHostLocale(ctx.locale) : () => {};
    const stopSlots = ctx.slots ? wire(ctx) : undefined;
    return () => {
      if (typeof stopSlots === 'function') stopSlots();
      stopLocale();
      stopServices();
    };
  }
}
