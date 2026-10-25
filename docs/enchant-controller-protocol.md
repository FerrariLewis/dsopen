# ENCHANT controller integration protocol v1

## Author-written updates across the series

Before every release of any ENCHANT product, ask the owner for the exact text to
show to users. Do not generate or reuse announcement text on the owner's behalf.
Provide a local preview and obtain the owner's confirmation before publishing.
`package.json.lewisEnchantRelease` binds `{ version, notes }` to that product's
actual package version. Preserve the approved text and line breaks; render it as
plain React text in the update dialog. The registry metadata and archive must
carry the same text so users on the npm mirror need no GitHub request to read it.
New build/release/stage steps must reject missing or mismatched text. Legacy
packages without text remain readable; a newly shipped renderer is required to
display this field. Each separate repository should adopt the same validation
contract and keep its own package/version identity.

The current plugin remains independently usable. No controller is installed,
required, created or persisted by this protocol. It does not modify host files,
window state, uploaded media or plugin preferences. CSS `liquid-glass` is a web
material, not Apple's native Liquid Glass framework or a macOS private API.

## Identity and ownership

Each separately bundled plugin accesses
`globalThis[Symbol.for('dsh.lewis.enchant.v1')]` through `getEnchantRegistry()`.
The registry has `version:1`, `getSnapshot()`, `subscribe(listener)`,
`registerPlugin(descriptor)`, `acquireController(descriptor)`, `refresh()`,
`shouldGroupSettings(pluginId)`, and `openControllerSettings(pluginId)`.
The existing 17-shortcut registry is separate and unchanged.

`registerPlugin({id,name,sectionId,renderSettings,openSettings})` returns an
idempotent release. This describes a single product, not a GitHub repository.
Settings rendering and fallback opening belong to the product. Two overlapping
mounts with the same stable product identity share an entry and release only
their own registration. The controller can enumerate `snapshot.plugins` to
render its child-product list and call a child's `renderSettings()`.

## Future controller setup

The controller must first register its real `settings.section` entry. Its lease
must be acquired only after that registration, and released before removing it:

```js
const registry = getEnchantRegistry();
const offHub = slots.register({
  name: 'settings.section', id: 'dsh-lewis-controller-settings',
  order: 80, label: () => '附魔台',
}, ControllerSettings);
const lease = registry.acquireController({
  id: 'dsh-lewis-controller',
  sectionId: 'dsh-lewis-controller-settings',
  isEntryReady: () => slots.entries('settings.section')
    .some(entry => entry.options.id === 'dsh-lewis-controller-settings'),
  // Synchronous: select this child and open the controller UI; return false
  // if the action could not be performed, so the child can fall back.
  openSettings: pluginId => openControllerAndSelect(pluginId),
  theme: { appearanceMode: 'follow-host', effect: 'frosted', blur: 30, radius: 30 },
});
// On future controller preference changes:
lease.setTheme({ appearanceMode: 'custom', effect: 'liquid-glass', accent: '#87b5ef', colorScheme: 'dark', fontSize: 18 });
// Follow General settings again without losing the controller's saved choices:
lease.setTheme({ appearanceMode: 'follow-host' });
// Teardown, including hot unload:
lease.release();
offHub();
```

Only one controller lease is allowed. A stale lease cannot change or release a
successor. Future persistence is the controller's responsibility; it reloads
its saved theme before acquiring or updating this lease after app startup.
This in-memory registry is not cross-window storage or an installation API.

## Product settings navigation

Products register their section through:

```js
slots.inject('settings.section', () => bindSettingsEntry({
  slots, registry, pluginId: 'dsh-openup-lewis',
  register: () => slots.register({
    name: 'settings.section', id: 'dsh-boot-studio-settings',
    order: 80, label: () => '开机动画',
  }, ProductSettings),
}));
```

The binding subscribes to both the series registry and the actual host settings
ledger. It disposes its own section only when the controller is ready **and its
actual section exists**. Losing that section or releasing the controller lease
restores the product section. A missing/throwing readiness callback never hides
the child. A host without inspectable section entries and subscriptions always
keeps the product's section.

Observed Harness SDK signatures, from the locally bundled settings-general
client: line 1145 reads `slots.entries('settings.section')`, 1155 subscribes via
`slots.subscribe('settings.section', listener)` and 1158 calls its disposer;
1233 stores the `slots.register(...)` disposer and 1271 calls it. Returning a
null React component would not remove the navigation row, because those rows
are constructed from slot registration entries.

## Theme boundary

Default appearance mode is `follow-host`. The adapter reads Harness's actual
`body[data-ds-dark-theme]`, `--dsh-content-font-size`, `--dsw-font-family`, and
semantic palette/accent tokens. All plugin roots and native-dialog top layers
subscribe to one read-only document observer. No General setting is written.

Theme keys are restricted to `appearanceMode`, `effect`, `accent`, `surface`,
`colorScheme`, `fontSize`, `fontFamily`, `blur`, and `radius`. Mode is
`follow-host` or `custom`; scheme is `light`, `dark`, or null; custom font size
is an integer 10–32; font families use a bounded name-list whitelist. Colors
accept only six-digit hex or null. Blur is an integer 0–48; radius is an integer
12–40. Invalid patches are rejected before modifying active theme.

Explicit `follow-host` ignores stored custom colors, scheme and typography.
`custom` can override them independently. Buttons, toggles and selected outlines
read `--lewis-accent`; artwork pixels are excluded. For compatibility, older
controllers sending color overrides without an explicit mode imply `custom`.

`useEnchantAppearance()` resolves host values and controller overrides through
`themeAttributes(snapshot.theme, hostAppearance)`. It returns
`data-lewis-effect`, `data-lewis-themed`, `data-lewis-color-scheme`,
`data-lewis-appearance-mode`, typography, semantic palette and accent variables.
The root component and every native-dialog top layer must subscribe and apply
these attributes independently; a modal dialog must not rely on CSS inheritance
from the settings panel that launched it. The media layer is excluded from
theme styling, so custom and bundled animation/image pixels are unchanged.

No theme button is added by this protocol. A future controller can enable the
effect on Windows, macOS or other supported web renderers. Actual Mac hardware
behavior must still be verified on a Mac; a CSS mode is not proof of hardware QA.

When an old immutable v1 registry is still loaded after a hot update, the adapter
preserves it and its plugin entries. Check `registry.appearanceModes` before
offering custom controls. `requiresReloadForCustomAppearance: true` means the
normal Harness restart is needed to load the expanded protocol. The fallback
continues to follow General settings and never replaces or duplicates the old
registry's plugin descriptors.
