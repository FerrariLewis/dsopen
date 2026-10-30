window.__ModuleLoader__.load({ id: "dsh-boot-studio", factory: (require) => { var module = { exports: {} }; var exports = module.exports;
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client.jsx
var client_exports = {};
__export(client_exports, {
  BootRoot: () => BootRoot,
  EndTitle: () => EndTitle,
  Player: () => Player,
  SettingsPanel: () => SettingsPanel,
  ShortcutAction: () => ShortcutAction,
  api: () => api,
  apply: () => apply,
  openSettings: () => openSettings,
  playbackStages: () => playbackStages
});
module.exports = __toCommonJS(client_exports);
var import_react12 = __toESM(require("react"), 1);

// src/studio-styles.jsx
var import_react = require("react");

// src/styles.js
var CSS = `

/* ENCHANTMENT UI reads the host's resolved theme and typography. Media is below. */
:is(.bs-studio,.bs-startup-update,.bs-modal,.bs-toast) {
  --bs-f:var(--lewis-font-size,14px);
  --bs-panel:var(--lewis-panel-color,var(--dsw-alias-bg-layer-2,Canvas));
  --bs-base:var(--lewis-base-color,var(--dsw-alias-bg-layer-1,Canvas));
  --bs-text:var(--lewis-label-primary,var(--dsw-alias-label-primary,CanvasText));
  --bs-muted:var(--lewis-label-secondary,var(--dsw-alias-label-secondary,GrayText));
  --bs-tertiary:var(--lewis-label-tertiary,var(--dsw-alias-label-tertiary,GrayText));
  --bs-border:var(--lewis-border-color,var(--dsw-alias-border-l2,currentColor));
  --bs-line:color-mix(in srgb,var(--bs-border) 72%,transparent);
  --bs-hover:var(--lewis-hover-color,var(--dsw-alias-interactive-bg-hover,transparent));
  --bs-accent:var(--lewis-accent,var(--dsw-alias-brand-primary-new-colorprimary-new-color,#43b8c5));
  --bs-accent-text:var(--lewis-accent-text,#102d32);
  --bs-danger:var(--lewis-error-color,var(--dsw-alias-state-error-primary,#c6535a));
  --bs-surface:color-mix(in srgb,var(--bs-panel) 24%,transparent);
  --bs-soft:color-mix(in srgb,var(--bs-panel) 18%,transparent);
  box-sizing:border-box;
  color:var(--bs-text);
  font-family:var(--lewis-font-family,inherit);
  font-size:var(--bs-f);
  font-weight:400;
  line-height:1.6;
}
:is(.bs-studio,.bs-startup-update)[data-lewis-color-scheme="light"] {color-scheme:light}
:is(.bs-studio,.bs-startup-update)[data-lewis-color-scheme="dark"] {color-scheme:dark}
.bs-studio *,.bs-startup-update *,.bs-modal *,.bs-player * {box-sizing:border-box}
.bs-studio {
  container-type:inline-size;
  width:100%;
  max-width:1120px;
  margin:auto;
  padding:clamp(18px,3.5%,36px) clamp(14px,3.5%,38px) 26px;
  background:transparent;
  border-radius:16px;
}
.bs-studio :is(button,input,select),.bs-startup-update button,.bs-modal button {font:inherit}
.bs-studio button,.bs-startup-update button,.bs-modal button {
  appearance:none;
  -webkit-appearance:none;
  cursor:pointer;
  transition:background .16s,border-color .16s,box-shadow .16s;
}
.bs-studio :is(button,input,select):focus-visible,.bs-startup-update button:focus-visible,.bs-modal-close:focus-visible {
  outline:2px solid var(--bs-accent);
  outline-offset:3px;
}
:is(.bs-studio,.bs-startup-update) button:disabled {opacity:.48;cursor:default}
.bs-heading {display:flex;justify-content:space-between;align-items:flex-start;gap:16px}
.bs-heading>div {min-width:0;flex:1}
.bs-eyebrow {font-size:calc(var(--bs-f)*.7143);letter-spacing:.16em;color:var(--bs-accent);margin-bottom:9px;overflow-wrap:anywhere}
.bs-heading h1 {font-size:calc(var(--bs-f)*2.07);line-height:1.35;letter-spacing:-.025em;font-weight:650;margin:0 0 9px;overflow-wrap:anywhere}
.bs-heading h1 span {font-size:.86em;font-weight:350;color:var(--bs-muted);margin-inline-start:.42em}
.bs-heading p {margin:0;color:var(--bs-muted);font-size:calc(var(--bs-f)*.93)}
.bs-version {flex:none;font-size:calc(var(--bs-f)*.7143);color:var(--bs-tertiary);border:1px solid var(--bs-line);border-radius:6px;padding:4px 8px;letter-spacing:.04em;margin-top:4px}
.bs-toolbar {display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin:0;padding:16px 18px}
.bs-studio .bs-primary {
  border:1px solid var(--bs-accent);
  background:var(--bs-accent);
  color:var(--bs-accent-text);
  border-radius:8px;
  padding:9px 15px;
  font-size:calc(var(--bs-f)*.8571);
  line-height:1.55;
  font-weight:600;
  max-width:100%;
  overflow-wrap:anywhere;
}
.bs-studio .bs-primary:hover:not(:disabled) {background:color-mix(in srgb,var(--bs-accent) 88%,var(--bs-text));border-color:color-mix(in srgb,var(--bs-accent) 88%,var(--bs-text))}
.bs-notice {min-height:2.15em;padding-top:8px;color:var(--bs-muted);font-size:calc(var(--bs-f)*.8571)}
.bs-alert {background:color-mix(in srgb,var(--bs-danger) 10%,transparent);border:1px solid color-mix(in srgb,var(--bs-danger) 45%,transparent);color:var(--bs-danger);padding:12px;border-radius:9px;margin-top:14px;overflow-wrap:anywhere}
.bs-alert button {background:transparent;border:1px solid currentColor;color:inherit;margin-inline-start:10px;border-radius:5px;padding:3px 8px}
.bs-section-title {display:flex;align-items:baseline;justify-content:space-between;gap:14px;flex-wrap:wrap;margin:12px 0 14px}
.bs-section-title h2,.bs-toolbar h2,.bs-ending-header h2 {font-size:var(--bs-f);font-weight:600;margin:0;min-width:0}
.bs-section-title>span {font-size:calc(var(--bs-f)*.7857);color:var(--bs-tertiary)}
.bs-library {display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin:0}
.bs-clip {min-width:0;border:1px solid var(--bs-line);background:var(--bs-surface);border-radius:12px;overflow:hidden;position:relative}
.bs-clip.is-selected {border-color:var(--bs-accent);box-shadow:0 0 0 1px color-mix(in srgb,var(--bs-accent) 16%,transparent)}
.bs-thumbnail {width:100%;aspect-ratio:16/9;display:block;border:0;position:relative;overflow:hidden;text-align:left;background:#07111c;padding:0;color:white}
.bs-thumbnail video {position:absolute;inset:0;display:block;width:100%;height:100%;object-fit:cover;pointer-events:none}
.bs-thumbnail-shade {position:absolute;inset:0;background:linear-gradient(0deg,#050b1280,transparent 65%)}
.bs-play-icon {position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);display:grid;place-items:center;border:1px solid #ffffff66;background:#0a172a66;backdrop-filter:blur(5px);width:34px;height:34px;border-radius:50%;font-size:calc(var(--bs-f)*.8571);padding-inline-start:2px}
.bs-thumbnail:hover .bs-play-icon {background:var(--bs-accent);color:var(--bs-accent-text);border-color:var(--bs-accent)}
.bs-clip-number {position:absolute;bottom:10px;left:12px;font-size:calc(var(--bs-f)*.7857);letter-spacing:.08em;opacity:.9}
.bs-badge {position:absolute;top:9px;right:9px;border:1px solid #ffffff22;background:#0b111c88;border-radius:4px;font-size:calc(var(--bs-f)*.6429);padding:2px 6px}
.bs-clip-info {padding:12px 12px 9px;display:flex;align-items:center;gap:8px;justify-content:space-between;min-width:0;flex-wrap:wrap}
.bs-clip-info h3 {font-size:calc(var(--bs-f)*.8571);line-height:1.55;font-weight:500;margin:0;min-width:0;overflow-wrap:anywhere}
.bs-clip-info>span {font-size:calc(var(--bs-f)*.7143);color:var(--bs-tertiary);white-space:nowrap}
.bs-clip-actions {display:flex;gap:7px;padding:0 12px 12px;flex-wrap:wrap}
.bs-clip-actions button,.bs-update-actions button {
  flex:1;
  min-width:0;
  border:1px solid color-mix(in srgb,var(--bs-accent) 28%,var(--bs-border));
  background:color-mix(in srgb,var(--bs-accent) 9%,transparent);
  color:var(--bs-text);
  border-radius:7px;
  font-size:calc(var(--bs-f)*.7857);
  line-height:1.6;
  padding:6px 9px;
  overflow-wrap:anywhere;
}
.bs-clip-actions button:hover:not(:disabled),.bs-update-actions button:hover:not(:disabled) {border-color:var(--bs-accent);background:color-mix(in srgb,var(--bs-accent) 16%,transparent)}
.bs-clip-actions .bs-selected {border-color:var(--bs-accent);background:color-mix(in srgb,var(--bs-accent) 15%,transparent);opacity:1}
.bs-clip-actions .bs-delete {flex:0 0 auto;color:var(--bs-danger);border-color:transparent;background:transparent}
.bs-delete-confirm {position:absolute;bottom:0;left:0;right:0;background:color-mix(in srgb,var(--bs-panel) 92%,transparent);border-top:1px solid color-mix(in srgb,var(--bs-danger) 45%,transparent);padding:10px;font-size:calc(var(--bs-f)*.7857);color:var(--bs-text)}
.bs-delete-confirm button {margin:4px;color:var(--bs-danger);border:1px solid color-mix(in srgb,var(--bs-danger) 50%,transparent);border-radius:5px;background:transparent;font-size:inherit;padding:4px 7px}
.bs-upload {display:flex;flex-direction:column;align-items:center;justify-content:center;border:1px dashed var(--bs-border);border-radius:12px;background:var(--bs-soft);min-height:190px;color:var(--bs-muted);gap:6px;padding:15px;min-width:0}
.bs-upload:hover {background:color-mix(in srgb,var(--bs-accent) 9%,transparent);border-color:var(--bs-accent)}
.bs-upload>span {font-size:calc(var(--bs-f)*1.93);color:var(--bs-accent);font-weight:200;line-height:1.2;margin-bottom:5px}
.bs-upload strong {font-size:calc(var(--bs-f)*.8571);font-weight:500;overflow-wrap:anywhere}
.bs-upload small {font-size:calc(var(--bs-f)*.7143);color:var(--bs-tertiary);text-align:center;overflow-wrap:anywhere}
.bs-preferences {border:1px solid var(--bs-line);border-radius:12px;overflow:hidden;background:var(--bs-surface)}
.bs-toggle-row,.bs-field {display:flex;align-items:center;justify-content:space-between;gap:18px;padding:16px 18px;position:relative;margin:0;min-width:0}
.bs-preferences>*+* {border-top:1px solid var(--bs-line)}
.bs-animation-settings {margin:27px 0 29px}
.bs-animation-content {padding:16px}
.bs-animation-content .bs-alert {margin:0 0 12px}
.bs-animation-content .bs-notice {min-height:0;padding:0;margin-bottom:12px}
.bs-animation-content .bs-notice:empty {display:none}
.bs-toggle-row {cursor:pointer}
.bs-toggle-row>span:first-child {flex:1;min-width:0}
.bs-toggle-row strong,.bs-field>span,.bs-field>label {font-weight:500;font-size:calc(var(--bs-f)*.8571);overflow-wrap:anywhere}
.bs-toggle-row small,.bs-field small {display:block;color:var(--bs-muted);font-size:calc(var(--bs-f)*.7857);font-weight:400;margin-top:4px}
.bs-toggle-row input {position:absolute;right:18px;width:34px;height:20px;opacity:0;z-index:1;cursor:pointer}
.bs-switch {width:34px;height:19px;flex:none;background:color-mix(in srgb,var(--bs-muted) 35%,transparent);border-radius:20px;position:relative;transition:background .15s}
.bs-switch:after {content:'';width:13px;height:13px;background:var(--bs-muted);border-radius:50%;position:absolute;left:3px;top:3px;transition:transform .15s}
.bs-toggle-row input:checked+.bs-switch {background:var(--bs-accent)}
.bs-toggle-row input:checked+.bs-switch:after {background:var(--bs-accent-text);transform:translateX(15px)}
.bs-toggle-row input:focus-visible+.bs-switch {outline:2px solid var(--bs-accent);outline-offset:4px}
.bs-toggle-row input:disabled+.bs-switch {opacity:.45}
.bs-field {flex-wrap:wrap}
.bs-field select {color:var(--bs-text);background:var(--bs-soft);border:1px solid var(--bs-border);border-radius:7px;padding:7px 9px;font-size:calc(var(--bs-f)*.8571);max-width:100%;min-width:0}
.bs-field option {color:var(--bs-text);background:var(--bs-panel)}
.bs-field input[type=range] {accent-color:var(--bs-accent);width:160px;max-width:36%}
.bs-field output {font-size:calc(var(--bs-f)*.8571);min-width:2.6em;text-align:right}
.bs-field:has(input[type=range])>span {flex:1}
.bs-help {padding:22px 0 0;color:var(--bs-muted);font-size:calc(var(--bs-f)*.7857)}
.bs-help strong {font-size:calc(var(--bs-f)*.8571);font-weight:500;color:var(--bs-text)}
.bs-help p {margin:7px 0 13px;line-height:1.8}.bs-help>span {font-size:calc(var(--bs-f)*.6429);color:var(--bs-tertiary)}
.bs-loading {text-align:center;color:var(--bs-muted);padding:45px;font-size:inherit}
.bs-ending-settings {margin-bottom:29px}
.bs-studio .bs-text-button {border:0;background:transparent;color:var(--bs-accent);font-size:calc(var(--bs-f)*.7857);padding:0}
.bs-update-area {margin-top:25px;padding-top:8px;border-top:1px solid var(--bs-line)}
.bs-update-card {display:flex;justify-content:space-between;align-items:center;gap:16px;background:var(--bs-surface);border:1px solid var(--bs-line);border-radius:12px;padding:17px;min-width:0}
.bs-update-card strong {font-size:calc(var(--bs-f)*.8571);font-weight:500}
.bs-update-card p {font-size:calc(var(--bs-f)*.7857);color:var(--bs-muted);margin:6px 0 0}
.bs-update-card small {display:block;font-size:calc(var(--bs-f)*.7143);color:var(--bs-tertiary);margin-top:6px}
.bs-update-actions {display:flex;gap:8px;flex-wrap:wrap;flex:0 0 auto;max-width:100%}
.bs-update-message,.bs-update-error {font-size:calc(var(--bs-f)*.7857);margin:10px 0 0;line-height:1.7;color:var(--bs-muted);overflow-wrap:anywhere}
.bs-update-error {color:var(--bs-danger)}
.bs-release-link {display:inline-block;margin-top:8px;color:var(--bs-accent);font-size:calc(var(--bs-f)*.7857);text-decoration:none;overflow-wrap:anywhere}
.bs-logo-options {display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;padding:16px}
.bs-logo-options>.bs-end-card.is-selected {box-shadow:0 0 0 1px color-mix(in srgb,var(--bs-accent) 16%,transparent)}
.bs-logo-options .bs-end-card img {display:block;width:100%;height:auto;aspect-ratio:16/9;object-fit:cover;background:transparent}
.bs-logo-options .bs-end-preview>span {display:block;font-size:calc(var(--bs-f)*.7857);line-height:1.5;padding:7px 6px;text-align:center;overflow-wrap:anywhere}
.bs-ending-preview {display:flex;gap:19px;padding:18px;align-items:center;min-width:0}
.bs-ending-mini {position:relative;width:46%;max-width:245px;aspect-ratio:16/9;overflow:hidden;flex:none;border-radius:8px;border:1px solid var(--bs-line);padding:0;background:transparent;color:inherit;text-align:inherit;cursor:pointer}
.bs-ending-preview>div:last-child {min-width:0;flex:1}
.bs-ending-preview strong {display:block;font-size:calc(var(--bs-f)*.8571);font-weight:500;margin-bottom:12px;overflow-wrap:anywhere}
.bs-ending-preview p {font-size:calc(var(--bs-f)*.7857);color:var(--bs-muted);margin:7px 0 12px}
.bs-ending-preview small {display:block;font-size:calc(var(--bs-f)*.7143);color:var(--bs-tertiary);margin-top:8px}
.bs-end-library {display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px;padding:15px}
.bs-end-card {border:1px solid var(--bs-line);border-radius:8px;overflow:hidden;background:var(--bs-soft);min-width:0}
.bs-end-card.is-selected {border-color:var(--bs-accent)}
.bs-end-preview {display:block;width:100%;border:0;padding:0;background:transparent;color:var(--bs-text);cursor:pointer}
.bs-end-card img {width:100%;height:calc(var(--bs-f)*6);object-fit:cover;display:block}
.bs-end-preview>span {display:block;padding:6px 8px;font-size:calc(var(--bs-f)*.7857);overflow-wrap:anywhere}
.bs-end-card .bs-clip-actions {padding:0 8px 8px}
.bs-end-delete-confirm {display:flex;gap:5px;flex-wrap:wrap;padding:0 8px 8px}
.bs-end-delete-confirm button {border:1px solid var(--bs-line);border-radius:5px;background:transparent;color:var(--bs-muted);font-size:calc(var(--bs-f)*.7143);padding:4px 6px;cursor:pointer}
.bs-sequence-thumb {position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#eeeae1;color:#31383b}
.bs-sequence-thumb svg {width:40px;height:40px;fill:currentColor;margin-bottom:6px}
.bs-sequence-thumb>span {font-size:calc(var(--bs-f)*.93);letter-spacing:.15em}
.bs-sequence-thumb small {font-size:calc(var(--bs-f)*.43);letter-spacing:.12em;opacity:.5}
.bs-sequence-thumb~.bs-play-icon {opacity:0;transition:opacity .2s}
.bs-thumbnail:hover .bs-sequence-thumb~.bs-play-icon {opacity:1}
.bs-entry-title {margin-top:26px}
.bs-reset-area {display:flex;align-items:center;justify-content:space-between;gap:20px;margin-top:30px;padding:24px 0 2px;border-top:1px solid var(--bs-line)}
.bs-reset-area>div {min-width:0}
.bs-reset-area strong {font-size:calc(var(--bs-f)*.8571);font-weight:500;color:var(--bs-text)}
.bs-reset-area p {font-size:calc(var(--bs-f)*.7857);line-height:1.8;color:var(--bs-muted);margin:5px 0 0;max-width:640px;overflow-wrap:anywhere}
.bs-studio .bs-reset-open {flex:none;max-width:100%;color:var(--bs-danger);background:color-mix(in srgb,var(--bs-danger) 6%,transparent);border:1px solid color-mix(in srgb,var(--bs-danger) 38%,transparent);border-radius:10px;padding:10px 17px;font-size:calc(var(--bs-f)*.8571);overflow-wrap:anywhere}
.bs-studio .bs-reset-open:hover:not(:disabled) {background:color-mix(in srgb,var(--bs-danger) 12%,transparent);border-color:var(--bs-danger)}
.bs-studio .bs-author-entry {display:flex;flex-wrap:wrap;align-items:center;justify-content:flex-end;gap:9px;min-width:0;padding-top:17px;color:var(--bs-tertiary);font-size:calc(var(--bs-f)*.7143);line-height:1.6}
.bs-studio .bs-author-entry>span {min-width:0;overflow-wrap:anywhere;font:inherit}
.bs-studio .bs-author-entry>button {display:inline-flex;align-items:center;justify-content:center;gap:5px;flex:0 0 auto;min-height:28px;width:auto;max-width:100%;margin:0;padding:3px 9px;border:1px solid color-mix(in srgb,var(--bs-accent) 30%,transparent);border-radius:8px;background:color-mix(in srgb,var(--bs-accent) 6%,transparent);color:var(--bs-text);font:inherit;text-decoration:none;box-shadow:none}
.bs-studio .bs-author-entry>button:hover {background:color-mix(in srgb,var(--bs-accent) 13%,transparent);border-color:var(--bs-accent)}

/* Native dialogs live in the top layer and receive their own host-theme values. */
.bs-startup-update {
  --bs-update-radius:var(--lewis-radius,30px);
  --bs-update-blur:var(--lewis-blur,30px);
  width:min(448px,calc(100vw - 32px));
  max-width:none;
  max-height:calc(100dvh - 40px);
  margin:auto;
  padding:0;
  border:0;
  overflow:auto;
  background:transparent;
  outline:none;
}
.bs-startup-update::backdrop {background:color-mix(in srgb,var(--bs-base) 20%,transparent);backdrop-filter:blur(calc(var(--bs-update-blur)*.23));-webkit-backdrop-filter:blur(calc(var(--bs-update-blur)*.23))}
.bs-startup-update-card {
  position:relative;
  width:100%;
  padding:31px;
  border:1px solid color-mix(in srgb,var(--bs-border) 85%,transparent);
  border-radius:var(--bs-update-radius);
  background:color-mix(in srgb,var(--bs-panel) 30%,transparent);
  backdrop-filter:blur(var(--bs-update-blur)) saturate(118%);
  -webkit-backdrop-filter:blur(var(--bs-update-blur)) saturate(118%);
  box-shadow:0 24px 72px color-mix(in srgb,var(--bs-text) 10%,transparent),inset 0 1px 0 color-mix(in srgb,var(--bs-panel) 34%,transparent);
  overflow:hidden;
}
.bs-startup-update .bs-startup-update-close {
  position:absolute;
  right:17px;
  top:17px;
  z-index:2;
  display:grid;
  place-items:center;
  width:32px;
  height:32px;
  margin:0;
  padding:0;
  border:1px solid var(--bs-line);
  border-radius:50%;
  background:color-mix(in srgb,var(--bs-panel) 26%,transparent);
  color:var(--bs-muted);
  font-size:calc(var(--bs-f)*1.3);
  line-height:0;
}
.bs-startup-update .bs-startup-update-close>svg {display:block;width:16px;height:16px;min-width:16px;flex:none;pointer-events:none}
.bs-startup-update .bs-startup-update-close:hover {color:var(--bs-text);background:var(--bs-hover)}
.bs-startup-update-glyph {width:55px;height:55px;border-radius:18px;display:grid;place-items:center;font-size:calc(var(--bs-f)*2.14);line-height:1;color:var(--bs-accent);background:color-mix(in srgb,var(--bs-accent) 9%,transparent);border:1px solid color-mix(in srgb,var(--bs-accent) 18%,transparent);margin-bottom:25px}
.bs-startup-update-brand {font-size:calc(var(--bs-f)*.6429);letter-spacing:.17em;margin:0 0 10px;color:var(--bs-accent);overflow-wrap:anywhere;padding-inline-end:20px}
.bs-startup-update-brand span {display:block;letter-spacing:0;margin-top:7px;color:var(--bs-tertiary);font-size:calc(var(--bs-f)*.7857)}
.bs-startup-update h2 {font-size:calc(var(--bs-f)*1.7857);line-height:1.35;font-weight:500;letter-spacing:-.02em;margin:0 0 12px;color:var(--bs-text);overflow-wrap:anywhere;text-wrap:balance}
.bs-startup-update-copy {font-size:calc(var(--bs-f)*.8571);color:var(--bs-muted);line-height:1.85;margin:0}
.bs-startup-update-versions {display:flex;align-items:center;gap:12px;font-size:calc(var(--bs-f)*.8571);margin:21px 0 19px;color:var(--bs-muted);flex-wrap:wrap}
.bs-startup-update-versions strong {font-weight:500;color:var(--bs-text);background:color-mix(in srgb,var(--bs-accent) 12%,transparent);border-radius:8px;padding:6px 10px}
.bs-startup-update-summary {padding:16px 17px;border-radius:14px;border:1px solid var(--bs-line);background:var(--bs-soft);margin-bottom:18px}
.bs-startup-update-summary p {font-size:calc(var(--bs-f)*.8571);line-height:1.7;margin:0;color:var(--bs-text);display:flex;gap:10px}
.bs-startup-update-summary p:before {content:'\u2713';color:var(--bs-accent);flex:none}
.bs-startup-update-summary p+p {margin-top:8px}
.bs-startup-update-retain {font-size:calc(var(--bs-f)*.7857);line-height:1.6;color:var(--bs-muted);margin:0 0 23px}
.bs-startup-update-status {font-size:calc(var(--bs-f)*.8571);line-height:1.8;color:var(--bs-muted);margin:0 0 19px}
.bs-startup-update-error {font-size:calc(var(--bs-f)*.8571);line-height:1.8;color:var(--bs-danger);margin:0 0 19px;overflow-wrap:anywhere}
.bs-startup-update-restart {font-size:calc(var(--bs-f)*.7857);line-height:1.8;color:var(--bs-muted);margin:0 0 13px;overflow-wrap:anywhere}
.bs-update-progress {padding:16px 17px;margin:17px 0 20px;border:1px solid var(--bs-line);border-radius:14px;background:var(--bs-soft);min-width:0}
.bs-update-progress-heading {display:flex;align-items:center;justify-content:space-between;gap:14px;font-size:calc(var(--bs-f)*.8571);color:var(--bs-text);line-height:1.65}
.bs-update-progress-heading>strong {color:var(--bs-accent);font-weight:500;font-variant-numeric:tabular-nums;flex:none}
.bs-update-progress progress {display:block;width:100%;height:6px;margin:12px 0;border:0;border-radius:999px;overflow:hidden;appearance:none;-webkit-appearance:none;background:color-mix(in srgb,var(--bs-accent) 12%,transparent);color:var(--bs-accent);accent-color:var(--bs-accent)}
.bs-update-progress progress::-webkit-progress-bar {background:color-mix(in srgb,var(--bs-accent) 12%,transparent);border-radius:999px}
.bs-update-progress progress::-webkit-progress-value {background:var(--bs-accent);border-radius:999px;transition:width .25s ease}
.bs-update-progress progress::-moz-progress-bar {background:var(--bs-accent);border-radius:999px}
.bs-update-progress progress:indeterminate {background:linear-gradient(90deg,transparent,var(--bs-accent),transparent),color-mix(in srgb,var(--bs-accent) 12%,transparent);background-size:40% 100%,100% 100%;background-repeat:no-repeat;animation:bs-update-pulse 1.5s ease-in-out infinite}
.bs-update-progress progress:indeterminate::-webkit-progress-bar {background:transparent}
.bs-update-progress-detail {font-size:calc(var(--bs-f)*.7143);color:var(--bs-muted);line-height:1.7;overflow-wrap:anywhere;font-variant-numeric:tabular-nums}
.bs-startup-update-actions {display:flex;gap:10px;flex-wrap:wrap}
.bs-startup-update-actions button {min-width:0;min-height:3em;font-size:calc(var(--bs-f)*.8571);line-height:1.5;border-radius:12px;padding:10px 16px;border:1px solid var(--bs-line);background:var(--bs-soft);color:var(--bs-text);flex:1 1 100px;overflow-wrap:anywhere}
.bs-startup-update-actions .bs-startup-update-primary {flex:1.55 1 150px;border-color:var(--bs-accent);color:var(--bs-accent-text);background:var(--bs-accent);box-shadow:0 5px 16px color-mix(in srgb,var(--bs-accent) 6%,transparent)}
.bs-startup-update-actions button:hover:not(:disabled) {border-color:var(--bs-accent);background:color-mix(in srgb,var(--bs-accent) 12%,transparent)}
.bs-startup-update-actions .bs-startup-update-primary:hover:not(:disabled) {background:color-mix(in srgb,var(--bs-accent) 90%,var(--bs-text))}
.bs-reset-glyph {color:var(--bs-danger);background:color-mix(in srgb,var(--bs-danger) 9%,transparent);border-color:color-mix(in srgb,var(--bs-danger) 24%,transparent)}
.bs-reset-summary {margin-top:20px}
.bs-reset-summary p:before {content:'\u2212';color:var(--bs-danger)}
.bs-reset-warning {font-size:calc(var(--bs-f)*.8571);line-height:1.8;color:var(--bs-danger);margin:0 0 21px}
.bs-reset-actions .bs-reset-confirm {flex:1.5 1 150px;background:color-mix(in srgb,var(--bs-danger) 20%,transparent);color:var(--bs-danger);border-color:color-mix(in srgb,var(--bs-danger) 40%,transparent);box-shadow:none}
.bs-reset-actions .bs-reset-confirm:hover:not(:disabled) {background:color-mix(in srgb,var(--bs-danger) 28%,transparent);border-color:var(--bs-danger)}
.bs-release-notes {margin:0 0 20px;padding:15px 17px;border:1px solid var(--bs-line);border-radius:14px;background:var(--bs-soft);max-height:min(28dvh,220px);overflow:auto;scrollbar-width:thin}
.bs-release-notes h3 {font-size:calc(var(--bs-f)*.7857);line-height:1.6;font-weight:500;color:var(--bs-text);margin:0 0 8px}
.bs-release-notes p {font-size:calc(var(--bs-f)*.8571);line-height:1.8;font-weight:400;color:var(--bs-text);margin:0;white-space:pre-wrap;overflow-wrap:anywhere}
.bs-release-notes .bs-release-notes-empty {color:var(--bs-muted)}
.bs-author-dialog {min-width:0;max-width:calc(100vw - 32px);max-height:calc(100dvh - 32px);overflow:hidden}
.bs-author-dialog .bs-author-card {display:flex;flex-direction:column;min-width:0;max-width:100%;max-height:calc(100dvh - 32px);padding:14px;overflow:hidden}
.bs-author-dialog .bs-author-image-frame {display:flex;align-items:center;justify-content:center;min-width:0;min-height:0;width:100%;overflow:hidden}
.bs-author-dialog .bs-author-image {display:block;flex:0 1 auto;min-width:0;min-height:0;width:auto;height:auto;max-width:100%;max-height:calc(100dvh - 64px);object-fit:contain;object-position:center;border-radius:10px}
.bs-author-dialog .bs-startup-update-close {top:9px;right:9px;background:color-mix(in srgb,var(--bs-base) 65%,transparent);color:var(--bs-text)}
.bs-visually-hidden {position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0}
.bs-modal {position:fixed;inset:0;z-index:2147483400;background:color-mix(in srgb,var(--bs-base) 22%,transparent);backdrop-filter:blur(10px);padding:28px;overflow:auto}
.bs-modal-body {position:relative;max-width:1120px;margin:auto;background:color-mix(in srgb,var(--lewis-panel-color,var(--dsw-alias-bg-layer-2,Canvas)) 20%,transparent);border:1px solid var(--lewis-border-color,var(--dsw-alias-border-l2,currentColor));backdrop-filter:blur(18px);box-shadow:0 25px 100px #0002;border-radius:16px}
.bs-modal-close {position:absolute;right:22px;top:18px;z-index:2;background:color-mix(in srgb,var(--bs-panel) 20%,transparent);border:1px solid var(--bs-border);border-radius:7px;color:var(--bs-text);padding:6px 10px;font-size:calc(var(--bs-f)*.8571);cursor:pointer}
.bs-modal-body .bs-version {display:none}
.bs-toast {position:fixed;bottom:30px;left:50%;transform:translateX(-50%);padding:13px 18px;background:color-mix(in srgb,var(--bs-panel) 35%,transparent);backdrop-filter:blur(18px);border:1px solid var(--bs-line);border-radius:10px;z-index:2147483600;max-width:90vw;box-shadow:0 8px 40px #0002;font-size:calc(var(--bs-f)*.8571)}

/* Future controller material, still driven by the same host-resolved palette. */
.bs-studio[data-lewis-effect="liquid-glass"] {border:1px solid var(--bs-line);border-radius:var(--lewis-radius,30px);background:linear-gradient(135deg,color-mix(in srgb,var(--bs-panel) 14%,transparent),transparent 65%);box-shadow:inset 0 1px 0 color-mix(in srgb,var(--bs-panel) 40%,transparent)}
.bs-studio[data-lewis-effect="liquid-glass"] :is(.bs-preferences,.bs-clip,.bs-update-card) {backdrop-filter:blur(calc(var(--lewis-blur,30px)*.45)) saturate(125%);-webkit-backdrop-filter:blur(calc(var(--lewis-blur,30px)*.45)) saturate(125%);box-shadow:inset 0 1px 0 color-mix(in srgb,var(--bs-panel) 26%,transparent)}
.bs-startup-update[data-lewis-effect="liquid-glass"] .bs-startup-update-card {background:linear-gradient(130deg,color-mix(in srgb,var(--bs-panel) 20%,transparent),transparent 55%),color-mix(in srgb,var(--bs-panel) 26%,transparent);backdrop-filter:blur(var(--bs-update-blur)) saturate(150%);-webkit-backdrop-filter:blur(var(--bs-update-blur)) saturate(150%);box-shadow:0 24px 72px #0002,inset 0 1px 0 color-mix(in srgb,var(--bs-panel) 55%,transparent)}
@container(max-width:650px) {
  .bs-library {grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
  .bs-heading h1 {font-size:calc(var(--bs-f)*1.8)}
  .bs-upload {min-height:170px}
  .bs-toggle-row,.bs-field,.bs-toolbar {padding:14px}
  .bs-animation-content {padding:14px}
  .bs-toggle-row input {right:14px}
  .bs-ending-preview {padding:14px;gap:13px}
  .bs-update-card {align-items:flex-start;flex-direction:column}
  .bs-logo-options {grid-template-columns:repeat(2,minmax(0,1fr))}
}
@container(max-width:380px) {
  .bs-toolbar {align-items:flex-start;flex-direction:column}
  .bs-heading h1 {font-size:calc(var(--bs-f)*1.6)}
  .bs-clip-info {display:block}
  .bs-clip-info>span {display:block;margin-top:3px}
  .bs-ending-preview {flex-direction:column;align-items:stretch}
  .bs-ending-mini {width:100%;max-width:none}
  .bs-ending-preview>div:last-child {width:100%}
  .bs-logo-options {padding:12px;gap:8px}
  .bs-reset-area {align-items:flex-start;flex-direction:column;gap:13px}
}
@container(max-width:260px) {
  .bs-library,.bs-logo-options {grid-template-columns:1fr}
  .bs-heading {flex-wrap:wrap}
  .bs-version {margin-top:0}
}
@media(max-width:520px) {
  .bs-studio {padding:22px 14px;border-radius:10px}
  .bs-animation-settings {margin-top:20px}
  .bs-studio .bs-author-entry {justify-content:center}
  .bs-modal {padding:8px}
  .bs-modal-close {right:14px;top:14px}
}
@media(max-width:450px) {
  .bs-startup-update-card {padding:26px 22px}
  .bs-startup-update-versions {gap:9px}
  .bs-startup-update-actions button {padding:10px 12px}
}
@media(prefers-reduced-transparency:reduce) {
  .bs-startup-update-card,.bs-modal-body,.bs-toast {background:color-mix(in srgb,var(--bs-panel,var(--lewis-panel-color,Canvas)) 96%,transparent);backdrop-filter:none;-webkit-backdrop-filter:none}
  .bs-studio[data-lewis-effect="liquid-glass"] :is(.bs-preferences,.bs-clip,.bs-update-card) {backdrop-filter:none;-webkit-backdrop-filter:none}
}
@media(forced-colors:active) {
  .bs-studio,.bs-startup-update,.bs-modal,.bs-toast {color:CanvasText}
  .bs-studio :is(.bs-preferences,.bs-clip,.bs-update-card),.bs-startup-update-card,.bs-modal-body,.bs-toast {background:Canvas;color:CanvasText;border-color:CanvasText;box-shadow:none;backdrop-filter:none;-webkit-backdrop-filter:none}
  .bs-studio .bs-primary,.bs-startup-update-actions .bs-startup-update-primary {background:Highlight;color:HighlightText;border-color:Highlight}
}
@media(prefers-reduced-motion:reduce) {
  .bs-player,.bs-studio *,.bs-player *,.bs-startup-update * {animation:none!important;transition:none!important}
}
html[data-lewis-player="true"] [data-windows-menu] {visibility:hidden!important;pointer-events:none!important}
html[data-lewis-player="true"],html[data-lewis-player="true"] body {overflow:hidden!important;scrollbar-width:none!important}
html[data-lewis-player="true"]::-webkit-scrollbar,html[data-lewis-player="true"] body::-webkit-scrollbar {display:none!important}
@keyframes bs-reveal {from{opacity:0}to{opacity:1}}
@keyframes bs-prompt-breathe {0%,100%{opacity:.48}50%{opacity:.92}}
@keyframes bs-update-pulse {0%{background-position:-65% 0,0 0}100%{background-position:165% 0,0 0}}

/* Preserved startup playback and end-screen media rules. */
.bs-player{position:fixed;inset:0;z-index:2147483500;background:#05090e;outline:0;cursor:pointer;color:#f4f8f8;font:13px/1.5 Inter,'Segoe UI','Microsoft YaHei',sans-serif;animation:bs-reveal .3s ease-out}.bs-player video{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}.bs-player-top{position:absolute;top:0;left:0;right:0;padding:24px 30px;display:flex;align-items:center;justify-content:space-between;gap:16px;background:linear-gradient(#0008,transparent)}.bs-player-top>span{font-size:10px;letter-spacing:2px;text-shadow:0 2px 7px black}.bs-player-top b{font-weight:400;opacity:.6;margin-left:10px}.bs-player button{border:1px solid #ffffff44;color:#fff;background:#101c2c88;backdrop-filter:blur(12px);border-radius:7px;padding:9px 14px;font-size:12px}.bs-player button:hover{background:#213348bb}.bs-player kbd{font:10px/1.3 monospace;margin-left:10px;color:#b3c5ce;border:1px solid #ffffff33;padding:2px 4px;border-radius:3px}.bs-player-bottom{position:absolute;bottom:0;left:0;right:0;display:flex;justify-content:space-between;gap:15px;padding:24px 30px;background:linear-gradient(transparent,#0009);font-size:11px;letter-spacing:.3px;text-shadow:0 1px 5px black}.bs-player-bottom>span:last-child{opacity:.72}.bs-sound{position:absolute;right:30px;bottom:75px}.bs-play-manual{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);padding:18px 30px!important}.bs-timeline{height:2px;position:absolute;bottom:0;left:0;right:0;background:#ffffff18}.bs-timeline i{display:block;height:100%;background:var(--lewis-accent,#b7eccd);transition:width .08s linear}
.bs-player{width:100vw;height:100vh;height:100dvh;max-width:none;max-height:none;margin:0;border:0;padding:0;overflow:hidden}.bs-player::backdrop{background:#05090e}

.bs-intro-prompt{position:absolute;bottom:5%;left:0;right:0;margin:0;text-align:center;font-size:12px;letter-spacing:.22em;color:#ffffffa6;text-shadow:0 2px 12px #000;pointer-events:none}
.bs-end-title{position:absolute;inset:0;display:grid;place-items:center;overflow:hidden;isolation:isolate;background:radial-gradient(ellipse at 50% 37%,#18202b 0%,#0b0e14 44%,#05070c 100%);color:#e7ebef}
.bs-end-title:before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 18% 22%,#c4dfef44 0 1px,transparent 2px),radial-gradient(circle at 72% 36%,#c4dfef33 0 1px,transparent 2px),radial-gradient(circle at 37% 74%,#c4dfef22 0 1px,transparent 2px);background-size:257px 311px,383px 277px,421px 367px;opacity:.5;pointer-events:none}
.bs-end-brand{position:relative;z-index:1;text-align:center;width:min(680px,85%);transform:translateY(-4vh)}
.bs-end-halo{position:absolute;left:50%;top:27%;transform:translate(-50%,-50%);width:min(37vw,400px);aspect-ratio:1;border:1px solid #b4cce908;border-radius:50%;box-shadow:0 0 100px #c0d7fa06;pointer-events:none}
.bs-end-whale{width:clamp(112px,17vw,212px);height:auto;display:block;margin:0 auto 28px;fill:currentColor;filter:drop-shadow(0 0 25px #cedff11a)}
.bs-end-brand h1{font-family:'Segoe UI',Inter,sans-serif;font-size:clamp(28px,4.2vw,62px);line-height:1.15;letter-spacing:.32em;text-indent:.32em;font-weight:300;margin:0}
.bs-end-brand>p{font-size:clamp(10px,1.15vw,15px);letter-spacing:.72em;text-indent:.72em;font-weight:300;opacity:.56;margin:18px 0 0}
.bs-end-rule{width:45px;height:1px;background:currentColor;opacity:.18;margin:31px auto 0}
.bs-enter-prompt{position:absolute;left:0;right:0;bottom:8%;z-index:3;text-align:center;font-size:clamp(12px,1vw,15px);font-weight:400;letter-spacing:.35em;text-indent:.35em;color:#e3e8ed;margin:0;text-shadow:0 1px 8px #000;animation:bs-prompt-breathe 3.4s ease-in-out infinite;pointer-events:none}
.bs-end-image{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;pointer-events:none}.bs-end-image~.bs-enter-prompt{padding:15px 0;background:radial-gradient(ellipse at center,#0005,transparent 65%)}
.bs-end-title[data-logo=silver] .bs-enter-prompt{color:#405164;text-shadow:0 1px 6px #fff9;background:radial-gradient(ellipse at center,#ffffff44,transparent 65%)}
.bs-end-silver{background:radial-gradient(ellipse at 50% 45%,#f6f8fa,#dbe1e7);color:#435264}.bs-end-silver .bs-enter-prompt{color:#435264;text-shadow:none}
.bs-end-gold{background:radial-gradient(ellipse at 50% 40%,#211e17,#080908);color:#d7c99f}.bs-end-ice{background:radial-gradient(ellipse at 50% 40%,#163344,#060e18);color:#c0e8f4}

.bs-ending-mini .bs-end-brand{transform:translateY(-2px);width:90%}.bs-ending-mini .bs-end-halo{width:85px}.bs-ending-mini .bs-end-whale{width:42px;margin-bottom:8px;filter:none}.bs-ending-mini .bs-end-brand h1{font-size:14px;letter-spacing:.2em;text-indent:.2em}.bs-ending-mini .bs-end-brand>p{font-size:5px;letter-spacing:.6em;margin-top:5px}.bs-ending-mini .bs-end-rule{width:17px;margin-top:8px}.bs-ending-mini .bs-enter-prompt{font-size:6px;bottom:8%;animation:none}

/* Interface hints follow General typography; media pixels remain unchanged. */
.bs-player{font-family:var(--lewis-font-family,inherit);font-size:var(--lewis-font-size,14px)}
.bs-player button{font:inherit;font-size:calc(var(--lewis-font-size,14px) * .86)}
.bs-player .bs-intro-prompt{font-size:calc(var(--lewis-font-size,14px) * .86)}
.bs-player>.bs-end-title>.bs-enter-prompt{bottom:2.5%;font-family:var(--lewis-font-family,inherit);font-size:calc(var(--lewis-font-size,14px) * 1.07)}
`;

// src/style-sheet.js
var STUDIO_STYLE_ID = "dsh-boot-studio-style";
var STUDIO_STYLE_REVISION = 2026102603;
function fingerprint(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) hash = Math.imul(hash ^ value.charCodeAt(i), 16777619);
  return (hash >>> 0).toString(16);
}
function ensureStudioStyles(doc) {
  if (!doc?.head) return null;
  let element = doc.getElementById(STUDIO_STYLE_ID);
  if (!element) {
    element = doc.createElement("style");
    element.id = STUDIO_STYLE_ID;
    doc.head.appendChild(element);
  }
  const installed = Number(element.getAttribute("data-lewis-style-revision")) || 0;
  if (installed > STUDIO_STYLE_REVISION) return element;
  if (element.textContent !== CSS) element.textContent = CSS;
  element.setAttribute("data-lewis-style-revision", String(STUDIO_STYLE_REVISION));
  element.setAttribute("data-lewis-style-fingerprint", fingerprint(CSS));
  return element;
}

// src/studio-styles.jsx
function useStudioStyles() {
  (0, import_react.useLayoutEffect)(() => {
    ensureStudioStyles(document);
  }, []);
}

// src/logo-path.js
var WHALE_PATH = "M48.8354 10.0479C48.3232 9.79199 48.1025 10.2798 47.8032 10.5278C47.7007 10.6079 47.6143 10.7119 47.5273 10.8076C46.7793 11.624 45.9048 12.1597 44.7622 12.0957C43.0923 12 41.666 12.5356 40.4058 13.8398C40.1377 12.2319 39.2476 11.272 37.8926 10.6558C37.1836 10.3359 36.4668 10.0156 35.9702 9.31982C35.6235 8.82373 35.5293 8.27197 35.356 7.72754C35.2456 7.3999 35.1353 7.06396 34.7651 7.00781C34.3633 6.94385 34.2056 7.2876 34.0479 7.57568C33.418 8.75195 33.1733 10.0479 33.1973 11.3599C33.2524 14.312 34.4736 16.6641 36.8999 18.3359C37.1758 18.5278 37.2466 18.7197 37.1597 19C36.9946 19.5757 36.7974 20.1357 36.624 20.7119C36.5137 21.0801 36.3486 21.1597 35.9624 21C34.6309 20.4321 33.481 19.5918 32.4644 18.5757C30.7393 16.8721 29.1792 14.9917 27.2334 13.52C26.7764 13.1758 26.3193 12.856 25.8467 12.5518C23.8618 10.584 26.1069 8.96777 26.627 8.77588C27.1704 8.57568 26.8159 7.8877 25.0591 7.896C23.3022 7.90381 21.6953 8.50391 19.647 9.30371C19.3477 9.42383 19.0322 9.51172 18.7095 9.58398C16.8501 9.22363 14.9199 9.14355 12.9033 9.37598C9.10596 9.80762 6.07275 11.6396 3.84326 14.7681C1.16455 18.5278 0.53418 22.7998 1.30664 27.2559C2.11768 31.9521 4.46582 35.8398 8.07373 38.8799C11.8159 42.0322 16.1255 43.5762 21.041 43.2803C24.0269 43.104 27.3516 42.6963 31.1016 39.4561C32.0469 39.936 33.0396 40.1279 34.686 40.272C35.9546 40.3921 37.1758 40.208 38.1211 40.0078C39.6021 39.688 39.4995 38.2881 38.9639 38.0322C34.623 35.9678 35.5762 36.8081 34.71 36.1279C36.9155 33.4639 40.2402 30.6958 41.54 21.728C41.6426 21.0161 41.5557 20.5679 41.54 19.9917C41.5322 19.6396 41.6108 19.5039 42.0049 19.4639C43.0923 19.3359 44.1479 19.0317 45.1167 18.4878C47.9292 16.9199 49.064 14.3438 49.3315 11.2559C49.3711 10.7837 49.3237 10.2959 48.8354 10.0479ZM24.3262 37.8398C20.1196 34.4639 18.0791 33.3521 17.2358 33.3999C16.4482 33.4482 16.5898 34.3682 16.7632 34.9678C16.9443 35.5601 17.1812 35.9683 17.5117 36.4878C17.7402 36.832 17.8979 37.3442 17.2832 37.728C15.9282 38.584 13.5728 37.4399 13.4624 37.3838C10.7207 35.7358 8.42822 33.5601 6.81348 30.584C5.25342 27.7197 4.34766 24.6479 4.19775 21.3677C4.1582 20.5757 4.38672 20.2959 5.15869 20.1519C6.17529 19.96 7.22314 19.9199 8.23926 20.0718C12.5327 20.7119 16.1885 22.6719 19.2529 25.7759C21.002 27.5439 22.3252 29.6558 23.6885 31.7202C25.1377 33.9121 26.6978 36 28.6831 37.7119C29.3843 38.312 29.9434 38.7681 30.479 39.104C28.8643 39.2881 26.1699 39.3281 24.3262 37.8398ZM26.3433 24.6001C26.3433 24.248 26.6191 23.9678 26.9658 23.9678C27.0444 23.9678 27.1152 23.9839 27.1782 24.0078C27.2651 24.04 27.3438 24.0879 27.4067 24.1602C27.5171 24.272 27.5801 24.4321 27.5801 24.6001C27.5801 24.9521 27.3042 25.2319 26.9575 25.2319C26.6108 25.2319 26.3433 24.9521 26.3433 24.6001ZM32.6064 27.8799C32.2046 28.0479 31.8027 28.1919 31.4165 28.208C30.8179 28.2397 30.1641 27.9922 29.8096 27.688C29.2583 27.2158 28.8643 26.9521 28.6987 26.1279C28.6279 25.7759 28.6675 25.2319 28.7305 24.9199C28.8721 24.248 28.7144 23.8159 28.2495 23.4238C27.8716 23.104 27.3911 23.0161 26.8633 23.0161C26.666 23.0161 26.4849 22.9277 26.3511 22.856C26.1304 22.7441 25.9492 22.4639 26.1226 22.1201C26.1777 22.0078 26.4458 21.7358 26.5088 21.688C27.2256 21.272 28.0527 21.4077 28.8169 21.7197C29.5259 22.0161 30.0615 22.5601 30.834 23.3281C31.6216 24.2559 31.7632 24.5117 32.2124 25.208C32.5669 25.752 32.8901 26.312 33.1104 26.9521C33.2446 27.3521 33.0713 27.6802 32.6064 27.8799Z";

// src/startup-screen.jsx
var import_react2 = __toESM(require("react"), 1);

// assets/startup-screen/source.js
var STARTUP_CSS = `/* ============================================================================\r
 * dsh-startup-screen \u2014 \u542F\u52A8\u754C\u9762 / \u542F\u52A8\u52A8\u753B\u6837\u5F0F\r
 * ----------------------------------------------------------------------------\r
 * \u98CE\u683C\u53D6\u81EA\u53C2\u8003\u7247\uFF08Hypergryph \u5F0F\u5F00\u673A\u5E8F\u5217\uFF09\uFF1A\u9ED1\u8272\u5E8F\u5E55 \u2192 \u7070\u767D\u8FC7\u66DD\u6D17\u767D \u2192 \u6696\u767D\r
 * "\u6280\u672F\u6863\u6848" \u5E95\u677F \u2192 \u7B49\u5BBD\u5B57\u8DDD\u72B6\u6001\u884C \u2192 \u73AF\u5F62\u51C6\u661F\u626B\u63CF \u2192 WELCOME \u7248\u5F0F \u2192 \u8272\u6563\u6545\u969C\u3002\r
 *\r
 * \u5168\u90E8\u5B57\u4F53\u90FD\u53D6\u7CFB\u7EDF\u81EA\u5E26\u5B57\u4F53\uFF0C\u96F6\u7F51\u7EDC\u4F9D\u8D56\uFF1A\r
 *   --dsu-din   Bahnschrift\uFF08Windows 10+ \u81EA\u5E26 DIN 1451 \u98CE\u683C\uFF0C\u5BF9\u5E94\u53C2\u8003\u7247\u91CC\r
 *               "RHINE LAB / SYNTHESIZE INFORMATION" \u90A3\u79CD\u7A84\u4F53\u6280\u672F\u5B57\uFF09\r
 *   --dsu-mono  Cascadia Mono / Consolas\uFF08\u5BF9\u5E94\u53C2\u8003\u7247\u91CC\u7684\u7B49\u5BBD\u5B57\u8DDD\u5C0F\u5B57\uFF09\r
 *   --dsu-zh    \u5FAE\u8F6F\u96C5\u9ED1\uFF08\u5BF9\u5E94\u53C2\u8003\u7247\u5E95\u90E8\u4E2D\u6587\u5C0F\u5B57\u5E55\uFF09\r
 * ========================================================================== */\r
\r
#dsh-startup-root,\r
#dsh-startup-root *,\r
#dsh-startup-root *::before,\r
#dsh-startup-root *::after {\r
  box-sizing: border-box;\r
  margin: 0;\r
  padding: 0;\r
}\r
\r
#dsh-startup-root {\r
  /* \u2014\u2014 \u914D\u8272\uFF08\u6D45\u8272 / \u53C2\u8003\u7247\u8272\u677F\uFF09\u2014\u2014 */\r
  --dsu-bg: #e5e3df;\r
  --dsu-bg-2: #eceae6;\r
  --dsu-ink: #0a0a0a;\r
  --dsu-ink-soft: #3a3936;\r
  --dsu-muted: #7a7873;\r
  --dsu-hair: rgba(10, 10, 10, 0.16);\r
  --dsu-hair-soft: rgba(10, 10, 10, 0.07);\r
  --dsu-accent: #ff7500;\r
  --dsu-glitch-a: #ff3b30;\r
  --dsu-glitch-b: #2971b8;\r
  --dsu-box-bg: #0a0a0a;\r
  --dsu-box-ink: #ffffff;\r
  --dsu-sub-glow: 0 0 6px rgba(255, 255, 255, 0.9);\r
\r
  /* \u5B57\u4F53\u5168\u90E8\u53D6\u7CFB\u7EDF\u81EA\u5E26\uFF0C\u4E0D\u4E0B\u53D1 webfont\uFF08\u542F\u52A8\u96F6\u6296\u52A8\uFF09\u3002\r
     \u4E09\u6863\u56DE\u9000\u94FE\u8986\u76D6 Win / macOS / Linux\uFF1A\r
       DIN \u98CE\u683C\u7A84\u4F53\u91CD\u9ED1\uFF1ABahnschrift(Win) \u2192 DIN Alternate(macOS) \u2192 Ubuntu/Roboto Condensed(Linux)\r
       \u7B49\u5BBD\uFF1ACascadia Mono(Win) \u2192 SFMono/Consolas \u2192 DejaVu Sans Mono(Linux)\r
       \u4E2D\u6587\uFF1A\u5FAE\u8F6F\u96C5\u9ED1(Win) \u2192 \u82F9\u65B9(macOS) \u2192 \u601D\u6E90/Noto/WQY(Linux)\r
     \u5B8C\u5168\u6CA1\u6709\u65F6\u9000\u5230\u901A\u7528 sans-serif \u2014\u2014 \u7248\u5F0F\u4E0D\u53D8\uFF0C\u53EA\u662F\u5B57\u9762\u89C2\u611F\u7565\u6709\u5DEE\u5F02\u3002 */\r
  --dsu-din: "Bahnschrift", "DIN Alternate", "DIN Condensed", "Archivo", "Oswald",\r
    "Arial Narrow", "Liberation Sans Narrow", "Ubuntu Condensed", "Roboto Condensed",\r
    "Noto Sans Display", "HarmonyOS Sans SC", "Microsoft YaHei", "PingFang SC", sans-serif;\r
  --dsu-mono: "Cascadia Mono", "SFMono-Regular", "Consolas", "Menlo", "DejaVu Sans Mono",\r
    "Liberation Mono", "Noto Sans Mono", ui-monospace, monospace;\r
  --dsu-zh: "Microsoft YaHei", "PingFang SC", "Hiragino Sans GB", "HarmonyOS Sans SC",\r
    "Source Han Sans SC", "Noto Sans CJK SC", "Noto Sans SC", "WenQuanYi Micro Hei",\r
    sans-serif;\r
\r
  --dsu-speed: 1;\r
\r
  position: fixed;\r
  inset: 0;\r
  z-index: 2147483000;\r
  overflow: hidden;\r
  background: #000;\r
  color: var(--dsu-ink);\r
  font-family: var(--dsu-din);\r
  -webkit-font-smoothing: antialiased;\r
  text-rendering: geometricPrecision;\r
  cursor: default;\r
  -webkit-user-select: none;\r
  user-select: none;\r
  contain: layout paint style;\r
}\r
\r
/* \u9010\u5B57\u6E10\u663E\uFF08typeIn\uFF09\uFF1A\u7528\u4E0D\u900F\u660E\u5EA6\u800C\u975E\u622A\u65AD\uFF0C\u5C45\u4E2D\u6392\u7248\u4E0D\u4F1A\u5DE6\u53F3\u6296\u52A8 */\r
.dsu-status .dsu-ch,\r
.dsu-sub-en .dsu-ch {\r
  display: inline-block;\r
  opacity: 0;\r
  transform: translateY(0.16em);\r
  transition: opacity 340ms ease, transform 340ms ease;\r
}\r
.dsu-sub-en .dsu-ch { transform: translateY(0.1em); transition-duration: 300ms; }\r
.dsu-status.dsu-in .dsu-ch,\r
.dsu-sub-en.dsu-in .dsu-ch { opacity: 1; transform: none; }\r
\r
/* \u4E2D\u592E\u6807\u8BC6\u4E0E\u7EC8\u5E55\u6807\u8BC6\u7EDF\u4E00\u53D6\u5F53\u524D\u6587\u5B57\u8272 */\r
.dsu-logo svg,\r
.dsu-w3 svg { fill: currentColor; }\r
\r
/* \u6DF1\u8272\u4E3B\u9898\uFF1A\u540C\u4E00\u5957\u7248\u5F0F\uFF0C\u6362\u6210\u6697\u5E95\u677F */\r
#dsh-startup-root.dsu-dark {\r
  --dsu-bg: #0b0b0c;\r
  --dsu-bg-2: #131315;\r
  --dsu-ink: #f2f1ee;\r
  --dsu-ink-soft: #cfcecb;\r
  --dsu-muted: #85847f;\r
  --dsu-hair: rgba(255, 255, 255, 0.18);\r
  --dsu-hair-soft: rgba(255, 255, 255, 0.07);\r
  --dsu-box-bg: #f2f1ee;\r
  --dsu-box-ink: #0b0b0c;\r
  --dsu-sub-glow: 0 0 6px rgba(0, 0, 0, 0.9);\r
  background: #000;\r
}\r
\r
/* \u9996\u5C4F\u515C\u5E95\uFF1A\u811A\u672C\u8FD8\u6CA1\u8DD1\u8D77\u6765\u65F6\u4E5F\u8981\u5148\u7CCA\u4F4F\u6574\u4E2A\u7A97\u53E3\uFF0C\u907F\u514D\u95EA\u51FA\u5E94\u7528\u672C\u4F53 */\r
#dsh-startup-root.dsu-boot::after {\r
  content: "";\r
  position: absolute;\r
  inset: 0;\r
  background: #000;\r
  z-index: 90;\r
}\r
\r
#dsh-startup-root.dsu-gone {\r
  opacity: 0;\r
  pointer-events: none;\r
  transition: opacity 620ms cubic-bezier(0.4, 0, 0.2, 1);\r
}\r
\r
/* \u2500\u2500 \u5E95\u677F \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\r
.dsu-plate {\r
  position: absolute;\r
  inset: 0;\r
  background:\r
    radial-gradient(120% 90% at 78% 12%, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0) 55%),\r
    linear-gradient(168deg, var(--dsu-bg-2) 0%, var(--dsu-bg) 42%, var(--dsu-bg) 100%);\r
  opacity: 0;\r
}\r
\r
.dsu-dark .dsu-plate {\r
  background:\r
    radial-gradient(120% 90% at 78% 12%, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0) 55%),\r
    linear-gradient(168deg, var(--dsu-bg-2) 0%, var(--dsu-bg) 42%, var(--dsu-bg) 100%);\r
}\r
\r
/* \u80CC\u666F\u91CC\u82E5\u9690\u82E5\u73B0\u7684\u6863\u6848\u9762\u677F\uFF08\u53C2\u8003\u7247\u53F3\u4FA7\u6781\u6DE1\u7684\u65B9\u5757\u7FA4\uFF09 */\r
.dsu-watermark {\r
  position: absolute;\r
  inset: 0;\r
  opacity: 0;\r
  pointer-events: none;\r
}\r
.dsu-wm {\r
  position: absolute;\r
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.55), rgba(255, 255, 255, 0));\r
  border: 1px solid var(--dsu-hair-soft);\r
}\r
.dsu-dark .dsu-wm {\r
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.035), rgba(255, 255, 255, 0));\r
}\r
\r
/* \u7EC6\u9897\u7C92\u566A\u70B9\uFF0C\u8BA9\u5927\u8272\u5757\u4E0D"\u5851\u6599" */\r
.dsu-grain {\r
  position: absolute;\r
  inset: -50%;\r
  opacity: 0.05;\r
  transition: opacity 300ms ease;\r
  pointer-events: none;\r
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/></filter><rect width='120' height='120' filter='url(%23n)' opacity='0.6'/></svg>");\r
}\r
\r
/* \u2500\u2500 \u7B2C\u4E00\u5E55\uFF1A\u9ED1\u5E55 + DeepSeek \u6807\u8BC6 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\r
.dsu-black {\r
  position: absolute;\r
  inset: 0;\r
  background: #000;\r
  display: grid;\r
  place-items: center;\r
  z-index: 40;\r
  opacity: 1;\r
}\r
.dsu-black-inner {\r
  display: flex;\r
  flex-direction: column;\r
  align-items: center;\r
  gap: 2px;\r
  opacity: 0;\r
  transform: translateY(6px);\r
  transition: opacity 560ms ease, transform 560ms ease;\r
}\r
.dsu-black-inner.dsu-in {\r
  opacity: 1;\r
  transform: none;\r
}\r
.dsu-black-inner.dsu-out {\r
  opacity: 0;\r
  transform: scale(1.045);\r
  transition: opacity 620ms ease, transform 620ms ease;\r
}\r
.dsu-whale {\r
  display: block;\r
  fill: currentColor;\r
}\r
.dsu-black .dsu-whale {\r
  width: 122px;\r
  height: 122px;\r
  color: #fff;\r
  margin-bottom: 18px;\r
}\r
.dsu-black-zh {\r
  font-family: var(--dsu-zh);\r
  font-size: 33px;\r
  font-weight: 700;\r
  letter-spacing: 0.34em;\r
  text-indent: 0.34em;\r
  color: #fff;\r
}\r
.dsu-black-en {\r
  margin-top: 9px;\r
  font-family: var(--dsu-din);\r
  font-size: 27px;\r
  font-weight: 700;\r
  letter-spacing: 0.62em;\r
  text-indent: 0.62em;\r
  color: #fff;\r
  transition: letter-spacing 1300ms cubic-bezier(0.16, 0.84, 0.24, 1);\r
}\r
.dsu-black-en.dsu-tighten {\r
  letter-spacing: 0.2em;\r
  text-indent: 0.2em;\r
}\r
.dsu-black-sub {\r
  margin-top: 12px;\r
  font-family: var(--dsu-mono);\r
  font-size: 10px;\r
  letter-spacing: 0.42em;\r
  text-indent: 0.42em;\r
  color: rgba(255, 255, 255, 0.5);\r
}\r
/* \u626B\u5149\uFF1A\u4E00\u6761\u6781\u6DE1\u7684\u767D\u8272\u6A2A\u6761\u63A0\u8FC7\u6807\u8BC6 */\r
.dsu-sweep {\r
  position: absolute;\r
  top: 0;\r
  bottom: 0;\r
  width: 42%;\r
  left: -50%;\r
  background: linear-gradient(\r
    100deg,\r
    rgba(255, 255, 255, 0) 0%,\r
    rgba(255, 255, 255, 0.055) 42%,\r
    rgba(255, 255, 255, 0.12) 50%,\r
    rgba(255, 255, 255, 0.055) 58%,\r
    rgba(255, 255, 255, 0) 100%\r
  );\r
  pointer-events: none;\r
}\r
.dsu-sweep.dsu-go {\r
  animation: dsu-sweep 1150ms cubic-bezier(0.32, 0, 0.2, 1) forwards;\r
}\r
@keyframes dsu-sweep {\r
  from { left: -50%; }\r
  to { left: 118%; }\r
}\r
\r
/* \u8FC7\u66DD\u6D17\u767D\uFF1A\u9ED1 \u2192 \u7070 \u2192 \u767D \u2192 \u5E95\u677F */\r
.dsu-wash {\r
  position: absolute;\r
  inset: 0;\r
  background: #8b8a88;\r
  opacity: 0;\r
  z-index: 35;\r
  pointer-events: none;\r
}\r
.dsu-flash {\r
  position: absolute;\r
  inset: 0;\r
  background: #fff;\r
  opacity: 0;\r
  z-index: 60;\r
  pointer-events: none;\r
}\r
\r
/* \u2500\u2500 \u54C1\u724C\u5757\uFF08\u5DE6\u4E0A\u89D2\uFF09\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\r
/* \u9ED1\u5E55\u7ED3\u675F\u540E\u7EDF\u4E00"\u6ED1\u5230\u4F4D"\uFF1A\u5DE6\u4FA7\u6587\u5B57\u4ECE -22px \u6ED1\u5165\uFF0C\u53F3\u4FA7\u5143\u7D20\u4ECE +18px \u6ED1\u5165\uFF0C\r
   \u6309 60ms \u4E00\u6863\u9519\u5F00\uFF1B\u4E0D\u518D\u7528\u88C1\u526A\u5F0F\u64E6\u9664 */\r
.dsu-brand {\r
  position: absolute;\r
  left: 46px;\r
  top: 44px;\r
  z-index: 20;\r
  color: var(--dsu-ink);\r
}\r
.dsu-brand-1,\r
.dsu-brand-2,\r
.dsu-brand-3 {\r
  opacity: 0;\r
  transform: translateX(-22px);\r
  transition: opacity 560ms cubic-bezier(0.16, 0.84, 0.24, 1),\r
    transform 560ms cubic-bezier(0.16, 0.84, 0.24, 1);\r
}\r
.dsu-brand-1 {\r
  font-size: 33px;\r
  font-weight: 700;\r
  letter-spacing: 0.012em;\r
  line-height: 0.98;\r
}\r
.dsu-brand-2 {\r
  font-size: 15px;\r
  font-weight: 700;\r
  letter-spacing: 0.012em;\r
  margin-top: 3px;\r
}\r
.dsu-brand-3 {\r
  font-size: 30px;\r
  font-weight: 400;\r
  line-height: 1.06;\r
  letter-spacing: 0.012em;\r
  display: flex;\r
  align-items: baseline;\r
  gap: 9px;\r
}\r
.dsu-brand-3 b { font-weight: 700; }\r
.dsu-brand.dsu-in .dsu-brand-1 { opacity: 1; transform: none; transition-delay: 60ms; }\r
.dsu-brand.dsu-in .dsu-brand-2 { opacity: 1; transform: none; transition-delay: 150ms; }\r
.dsu-brand.dsu-in .dsu-brand-3 { opacity: 1; transform: none; transition-delay: 240ms; }\r
\r
/* \u4E2D\u592E\u72B6\u6001\u533A */\r
.dsu-center {\r
  position: absolute;\r
  left: 0;\r
  right: 0;\r
  top: 47%;\r
  transform: translateY(-50%);\r
  z-index: 22;\r
  display: flex;\r
  flex-direction: column;\r
  align-items: center;\r
  gap: 0;\r
  pointer-events: none;\r
  transition: opacity 340ms ease;\r
}\r
/* \u7EC8\u5E55\u65F6\u6574\u5757\u4E2D\u592E\u533A\uFF08\u72B6\u6001\u884C / \u5206\u9694\u7EBF / \u9CB8\u9C7C / \u865A\u7EBF\uFF09\u5FC5\u987B\u6574\u4F53\u9000\u573A\uFF0C\r
   \u5426\u5219\u4F1A\u548C WELCOME \u7248\u5F0F\u53E0\u5728\u4E00\u8D77 */\r
.dsu-center.dsu-off { opacity: 0; }\r
\r
.dsu-status {\r
  display: flex;\r
  align-items: center;\r
  gap: 14px;\r
  font-family: var(--dsu-din);\r
  font-size: 44px;\r
  font-weight: 400;\r
  letter-spacing: 0.14em;\r
  color: var(--dsu-ink);\r
  opacity: 0;\r
  transition: opacity 300ms ease;\r
  white-space: nowrap;\r
}\r
.dsu-status.dsu-in { opacity: 1; }\r
.dsu-status.dsu-zhline {\r
  font-family: var(--dsu-zh);\r
  font-weight: 400;\r
  letter-spacing: 0.22em;\r
  text-indent: 0.22em;\r
  font-size: 40px;\r
}\r
.dsu-caret {\r
  display: inline-block;\r
  width: 15px;\r
  height: 4px;\r
  background: var(--dsu-accent);\r
  transform: translateY(3px);\r
  opacity: 0;\r
}\r
.dsu-caret.dsu-on {\r
  opacity: 1;\r
  animation: dsu-blink 1s steps(1, end) infinite;\r
}\r
@keyframes dsu-blink { 50% { opacity: 0; } }\r
\r
.dsu-sub-en {\r
  margin-top: 14px;\r
  font-family: var(--dsu-mono);\r
  font-size: 13px;\r
  font-weight: 400;\r
  letter-spacing: 0.44em;\r
  text-indent: 0.44em;\r
  color: var(--dsu-ink-soft);\r
  opacity: 0;\r
  white-space: nowrap;\r
}\r
.dsu-sub-en.dsu-in { opacity: 1; }\r
\r
.dsu-rule {\r
  margin-top: 22px;\r
  height: 1px;\r
  width: 0;\r
  background: var(--dsu-hair);\r
  transition: width 620ms cubic-bezier(0.2, 0.9, 0.2, 1);\r
}\r
.dsu-rule.dsu-in { width: min(560px, 42vw); }\r
\r
/* \u4E2D\u592E\u6807\u8BC6\uFF08\u9CB8\u9C7C\uFF09\u88C5\u914D\u533A */\r
.dsu-logo {\r
  margin-top: 26px;\r
  height: 0;\r
  opacity: 0;\r
  display: flex;\r
  flex-direction: column;\r
  align-items: center;\r
  transition: opacity 420ms ease, height 420ms ease, margin-top 420ms ease;\r
}\r
.dsu-logo.dsu-in {\r
  opacity: 1;\r
  height: 118px;\r
}\r
.dsu-logo svg {\r
  width: 84px;\r
  height: 84px;\r
  color: var(--dsu-ink);\r
}\r
.dsu-logolabel {\r
  margin-top: 10px;\r
  font-family: var(--dsu-mono);\r
  font-size: 10px;\r
  letter-spacing: 0.58em;\r
  text-indent: 0.58em;\r
  color: var(--dsu-ink-soft);\r
}\r
.dsu-dots {\r
  margin-top: 9px;\r
  height: 2px;\r
  width: 96px;\r
  background-image: radial-gradient(circle, var(--dsu-ink) 40%, transparent 42%);\r
  background-size: 12px 2px;\r
  background-repeat: repeat-x;\r
  opacity: 0.5;\r
}\r
\r
/* \u53F3\u4E0B\u89D2\u7B49\u5BBD\u4FE1\u606F\u884C\uFF08\u5BF9\u5E94\u53C2\u8003\u7247 "\xB7 ID CONFIRMED : JOYC"\uFF09\r
   \u6302\u5728\u9875\u811A\u6B63\u4E0A\u65B9\u3001\u53F3\u8FB9\u7F18\u4E0E\u9875\u811A\u5BF9\u9F50\uFF08\u9875\u811A right:46px / bottom:52px\uFF09\uFF0C\r
   \u548C\u5DE6\u4E0B\u89D2\u7684\u58F0\u7EB9\u6761\u5DE6\u53F3\u5BF9\u79F0\u3002\u539F\u5B9A\u4F4D\u7D27\u8D34\u5C45\u4E2D\u5927\u6807\u9898\u53F3\u4FA7\uFF0C\u8EAB\u4EFD\u7F16\u53F7\u4E00\u957F\u6216\u7A97\u53E3\u4E00\u7A84\r
   \u5C31\u4F1A\u548C\u7248\u5FC3\u6587\u5B57\u53E0\u5B57\uFF0C\u53EA\u80FD\u9760 @media \u5728\u7A84\u7A97\u53E3\u6574\u884C\u85CF\u6389 \u2014\u2014 \u632A\u51FA\u7248\u5FC3\u540E\uFF0C\u78B0\u649E\u5728\r
   \u51E0\u4F55\u4E0A\u4E0D\u518D\u53EF\u80FD\uFF0C\u7A84\u7A97\u53E3\u4E5F\u5C31\u4E0D\u5FC5\u518D\u727A\u7272\u8FD9\u6761\u8BFB\u6570\u3002 */\r
.dsu-idline {\r
  position: absolute;\r
  right: 46px;\r
  bottom: 104px;\r
  transform: translateX(16px);\r
  z-index: 22;\r
  text-align: right;\r
  font-family: var(--dsu-mono);\r
  font-size: 12px;\r
  letter-spacing: 0.2em;\r
  color: var(--dsu-ink-soft);\r
  opacity: 0;\r
  transition: opacity 520ms ease, transform 520ms cubic-bezier(0.16, 0.84, 0.24, 1);\r
  transition-delay: 520ms;\r
  white-space: nowrap;\r
}\r
.dsu-idline.dsu-in { opacity: 1; transform: none; }\r
\r
/* \u2500\u2500 \u73AF\u5F62\u51C6\u661F\uFF08\u9A8C\u8BC1\u901A\u8FC7\uFF09\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\r
/* \u7167\u539F\u7247\uFF1A\u73AF\u5C45\u4E2D\u3001\u76F4\u5F84\u7EA6 56vw\uFF0C\u72B6\u6001\u5B57\u5C31\u843D\u5728\u73AF\u5FC3\u91CC\uFF0C\u4E24\u8005\u662F\u4E00\u4E2A\u6574\u4F53\u3002\r
   \u5173\u952E\u662F\u628A\u4E24\u6BB5\u5F27\u7684\u7F3A\u53E3\u90FD\u7559\u5728\u6B63\u4E0B\u65B9 6 \u70B9\u949F\u65B9\u5411\uFF0C\u5E95\u90E8\u5B57\u5E55\u6C38\u8FDC\u4E0D\u4F1A\u88AB\u538B\u5230\u3002 */\r
.dsu-reticle {\r
  position: absolute;\r
  left: 50%;\r
  top: 45%;\r
  width: min(56vw, 86vh, 1040px);\r
  height: min(56vw, 86vh, 1040px);\r
  transform: translate(-50%, -50%);\r
  z-index: 16;\r
  opacity: 0;\r
  transition: opacity 500ms ease;\r
  pointer-events: none;\r
}\r
.dsu-reticle.dsu-in { opacity: 1; }\r
.dsu-reticle svg { width: 100%; height: 100%; overflow: visible; }\r
.dsu-ret-rot-a { transform-origin: 50% 50%; animation: dsu-spin 9s linear infinite; }\r
.dsu-ret-rot-b { transform-origin: 50% 50%; animation: dsu-spin 5.4s linear infinite reverse; }\r
@keyframes dsu-spin { to { transform: rotate(360deg); } }\r
.dsu-reticle .dsu-ring-a { fill: none; stroke: var(--dsu-ink); stroke-width: 6; }\r
.dsu-reticle .dsu-ring-b { fill: none; stroke: var(--dsu-box-ink); stroke-width: 2.2; opacity: 0.95; }\r
.dsu-reticle .dsu-dot-a { fill: var(--dsu-ink); }\r
.dsu-reticle .dsu-dot-b { fill: var(--dsu-box-ink); }\r
.dsu-reticle .dsu-dot-o { fill: var(--dsu-accent); }\r
.dsu-reticle .dsu-bracket {\r
  fill: none;\r
  stroke: var(--dsu-ink);\r
  stroke-width: 1.6;\r
  opacity: 0.85;\r
}\r
\r
/* \u8BFB\u53D6\u9636\u6BB5\u7684\u5341\u516D\u8FDB\u5236\u7011\u5E03\uFF1A\u653E\u5230\u539F\u7247\u91CC\u6700\u7A7A\u7684\u4E0A\u53F3\u533A\uFF0C\u4E0D\u53BB\u548C\u4E3B\u4F53\u6324\u4E2D\u95F4 */\r
.dsu-hex {\r
  position: absolute;\r
  right: 46px;\r
  top: 22%;\r
  width: 236px;\r
  height: 148px;\r
  overflow: hidden;\r
  z-index: 19;\r
  font-family: var(--dsu-mono);\r
  font-size: 10px;\r
  line-height: 1.55;\r
  letter-spacing: 0.06em;\r
  color: var(--dsu-ink-soft);\r
  opacity: 0;\r
  transition: opacity 320ms ease;\r
  text-align: right;\r
  -webkit-mask-image: linear-gradient(180deg, transparent, #000 22%, #000 74%, transparent);\r
  mask-image: linear-gradient(180deg, transparent, #000 22%, #000 74%, transparent);\r
}\r
.dsu-hex.dsu-in { opacity: 0.6; }\r
\r
/* \u2500\u2500 \u4EA4\u4E92\u533A \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\r
.dsu-action {\r
  position: absolute;\r
  left: 0;\r
  right: 0;\r
  top: 60%;\r
  z-index: 26;\r
  display: flex;\r
  flex-direction: column;\r
  align-items: center;\r
  gap: 12px;\r
  opacity: 0;\r
  pointer-events: none;\r
  transition: opacity 320ms ease;\r
}\r
.dsu-action.dsu-in {\r
  opacity: 1;\r
  pointer-events: auto;\r
}\r
.dsu-btn {\r
  display: inline-flex;\r
  align-items: center;\r
  gap: 14px;\r
  padding: 13px 26px;\r
  border: 1.5px solid var(--dsu-ink);\r
  background: transparent;\r
  color: var(--dsu-ink);\r
  font-family: var(--dsu-din);\r
  font-size: 15px;\r
  letter-spacing: 0.14em;\r
  cursor: pointer;\r
  position: relative;\r
  overflow: hidden;\r
  transition: color 220ms ease, border-color 220ms ease;\r
}\r
.dsu-btn::before {\r
  content: "";\r
  position: absolute;\r
  inset: 0;\r
  background: var(--dsu-ink);\r
  transform: translateX(-101%);\r
  transition: transform 300ms cubic-bezier(0.2, 0.9, 0.2, 1);\r
}\r
.dsu-btn:hover::before { transform: none; }\r
.dsu-btn:hover { color: var(--dsu-box-ink); }\r
.dsu-btn:hover .dsu-btn-en { color: var(--dsu-box-ink); opacity: 1; }\r
.dsu-btn > * { position: relative; z-index: 1; }\r
.dsu-btn:active { transform: translateY(1px); }\r
.dsu-btn-zh { font-family: var(--dsu-zh); font-weight: 500; }\r
.dsu-btn-en { font-family: var(--dsu-mono); font-size: 11px; letter-spacing: 0.24em; opacity: 0.62; }\r
.dsu-btn.dsu-pulse { animation: dsu-pulse 1.9s ease-in-out infinite; }\r
@keyframes dsu-pulse {\r
  0%, 100% { box-shadow: 0 0 0 0 rgba(255, 117, 0, 0); }\r
  50% { box-shadow: 0 0 0 7px rgba(255, 117, 0, 0.14); }\r
}\r
.dsu-hint {\r
  font-family: var(--dsu-zh);\r
  font-size: 11px;\r
  letter-spacing: 0.16em;\r
  color: var(--dsu-muted);\r
}\r
.dsu-hint kbd {\r
  font-family: var(--dsu-mono);\r
  border: 1px solid var(--dsu-hair);\r
  padding: 1px 5px;\r
  margin: 0 3px;\r
  font-size: 10px;\r
  letter-spacing: 0.06em;\r
}\r
\r
/* \u8EAB\u4EFD\u5361\uFF08\u7B2C\u4E8C\u6B65\uFF09\uFF1A\u7EAF\u4E2D\u6587\u6807\u7B7E + \u6570\u5B57\uFF0C\u53BB\u6389\u4E86\u82F1\u6587\u53CC\u5199\u4E0E\u7AD6\u6392\u8868\u5934\uFF0C\u5C3D\u91CF\u5E72\u51C0 */\r
.dsu-card {\r
  display: flex;\r
  flex-direction: column;\r
  gap: 0;\r
  min-width: 300px;\r
  padding: 2px 0;\r
  border-top: 1px solid var(--dsu-hair);\r
  border-bottom: 1px solid var(--dsu-hair);\r
}\r
/* \u4F5C\u8005\u6837\u5F0F\u91CC\u7684 display:flex \u4F1A\u76D6\u6389 [hidden] \u7684 UA display:none\uFF0C\u5FC5\u987B\u663E\u5F0F\u8865\u4E00\u6761\uFF0C\r
   \u5426\u5219\u7B2C\u4E00\u6B65\uFF08\u53EA\u8981\u6309\u94AE\u3001\u4E0D\u8981\u5361\u7247\uFF09\u4F1A\u9732\u51FA\u4E00\u6761\u7A7A\u7684\u8FB9\u6846 */\r
.dsu-card[hidden] { display: none; }\r
.dsu-card-row {\r
  display: flex;\r
  align-items: baseline;\r
  justify-content: space-between;\r
  gap: 34px;\r
  padding: 8px 2px;\r
  font-family: var(--dsu-zh);\r
  font-size: 12.5px;\r
  letter-spacing: 0.14em;\r
  color: var(--dsu-muted);\r
}\r
.dsu-card-row + .dsu-card-row {\r
  border-top: 1px solid var(--dsu-hair-soft);\r
}\r
.dsu-card-row b {\r
  font-family: var(--dsu-din);\r
  font-weight: 700;\r
  font-size: 15px;\r
  letter-spacing: 0.08em;\r
  color: var(--dsu-ink);\r
}\r
.dsu-card-row b.dsu-zhname { font-family: var(--dsu-zh); letter-spacing: 0.1em; }\r
\r
/* \u2500\u2500 \u7EC8\u5E55\uFF1AWELCOME \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\r
.dsu-welcome {\r
  position: absolute;\r
  left: 0;\r
  right: 0;\r
  top: 45%;\r
  transform: translateY(-50%);\r
  z-index: 30;\r
  display: flex;\r
  flex-direction: column;\r
  align-items: center;\r
  opacity: 0;\r
  pointer-events: none;\r
  transition: opacity 420ms ease;\r
}\r
.dsu-welcome.dsu-in { opacity: 1; }\r
.dsu-w1 {\r
  font-size: 40px;\r
  font-weight: 700;\r
  letter-spacing: 0.2em;\r
  text-indent: 0.2em;\r
  color: var(--dsu-ink);\r
}\r
.dsu-w2 {\r
  margin-top: 12px;\r
  background: var(--dsu-box-bg);\r
  color: var(--dsu-box-ink);\r
  padding: 7px 16px 8px;\r
  font-size: 27px;\r
  font-weight: 700;\r
  letter-spacing: 0.12em;\r
  text-indent: 0.12em;\r
}\r
.dsu-w3 {\r
  margin-top: 30px;\r
  display: flex;\r
  flex-direction: column;\r
  align-items: center;\r
  gap: 10px;\r
}\r
.dsu-w3 svg { width: 76px; height: 76px; color: var(--dsu-ink); }\r
.dsu-w3 span {\r
  font-family: var(--dsu-mono);\r
  font-size: 10px;\r
  letter-spacing: 0.5em;\r
  text-indent: 0.5em;\r
  color: var(--dsu-ink-soft);\r
}\r
.dsu-w4 {\r
  margin-top: 20px;\r
  font-family: var(--dsu-zh);\r
  font-size: 15px;\r
  letter-spacing: 0.28em;\r
  text-indent: 0.28em;\r
  color: var(--dsu-ink);\r
}\r
\r
/* \u8272\u6563\u6545\u969C\uFF08\u53C2\u8003\u7247\u7ED3\u5C3E\u7684\u9752\u84DD\u8272\u504F\uFF09\r
   \u505A\u6CD5\uFF1A\u590D\u5236\u5C42\u5E26 0.5px \u6A21\u7CCA + \u5206\u7247 clip-path \u4F4D\u79FB + \u6DF7\u5408\u6A21\u5F0F\uFF0C\r
   \u8BFB\u8D77\u6765\u50CF\u955C\u5934\u8272\u6563\u800C\u4E0D\u662F"\u4E09\u4E2A\u5B57\u53E0\u4E00\u8D77"\u3002\u5E38\u6001\u5FC5\u987B opacity:0\uFF0C\r
   \u5426\u5219\u52A8\u753B\u8DD1\u5B8C\u7EA2\u84DD\u526F\u672C\u4F1A\u4E00\u76F4\u538B\u5728\u6587\u5B57\u4E0A\u3002 */\r
.dsu-glitch { position: relative; }\r
.dsu-glitch[data-text]::before,\r
.dsu-glitch[data-text]::after {\r
  content: attr(data-text);\r
  position: absolute;\r
  left: 0;\r
  top: 0;\r
  width: 100%;\r
  opacity: 0;\r
  pointer-events: none;\r
  filter: blur(0.5px);\r
  mix-blend-mode: multiply;      /* \u6D45\u5E95\u6DF1\u5B57\uFF1A\u505A\u51CF\u8272\u8FB9\u7F18 */\r
  clip-path: inset(0 0 100% 0);\r
}\r
.dsu-glitch[data-text]::before { color: var(--dsu-glitch-a); }\r
.dsu-glitch[data-text]::after { color: var(--dsu-glitch-b); }\r
/* \u9ED1\u5E95\u767D\u5B57\u90A3\u5757\u8981\u6362\u6210\u52A0\u8272\uFF0C\u5426\u5219\u4E58\u5B8C\u662F\u9ED1 */\r
.dsu-glitch.dsu-glitch-box::before,\r
.dsu-glitch.dsu-glitch-box::after { mix-blend-mode: screen; }\r
\r
.dsu-glitch.dsu-on::before { animation: dsu-gx 430ms steps(3, end) 2 both; }\r
.dsu-glitch.dsu-on::after { animation: dsu-gy 430ms steps(3, end) 2 both; }\r
@keyframes dsu-gx {\r
  0% { transform: translate(0, 0); opacity: 0; clip-path: inset(0 0 100% 0); }\r
  14% { transform: translate(-3px, 0); opacity: 0.7; clip-path: inset(6% 0 68% 0); }\r
  34% { transform: translate(2px, 0); opacity: 0.5; clip-path: inset(54% 0 28% 0); }\r
  56% { transform: translate(-2px, 0); opacity: 0.6; clip-path: inset(22% 0 56% 0); }\r
  80% { transform: translate(1px, 0); opacity: 0.32; clip-path: inset(72% 0 10% 0); }\r
  100% { transform: none; opacity: 0; clip-path: inset(0 0 100% 0); }\r
}\r
@keyframes dsu-gy {\r
  0% { transform: translate(0, 0); opacity: 0; clip-path: inset(0 0 100% 0); }\r
  14% { transform: translate(3px, 0); opacity: 0.7; clip-path: inset(62% 0 14% 0); }\r
  34% { transform: translate(-2px, 0); opacity: 0.5; clip-path: inset(10% 0 66% 0); }\r
  56% { transform: translate(2px, 0); opacity: 0.6; clip-path: inset(48% 0 34% 0); }\r
  80% { transform: translate(-1px, 0); opacity: 0.32; clip-path: inset(30% 0 52% 0); }\r
  100% { transform: none; opacity: 0; clip-path: inset(0 0 100% 0); }\r
}\r
\r
/* \u2500\u2500 \u6536\u5C3E\uFF1A\u5F84\u5411\u5149\u6655 + \u53D8\u5F62\u5BBD\u94F6\u5E55\u5149\u6761 + \u6697\u89D2 + \u673A\u4F4D\u540E\u64A4 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\r
/* \u6697\u89D2\uFF1A\u7ED9\u6696\u767D\u5E95\u677F\u4E00\u70B9\u7EB5\u6DF1\uFF0C\u522B\u8BA9\u5927\u8272\u5757\u592A\u5E73 */\r
.dsu-vignette {\r
  position: absolute;\r
  inset: 0;\r
  z-index: 13;\r
  pointer-events: none;\r
  opacity: 0;\r
  transition: opacity 900ms ease;\r
  background:\r
    radial-gradient(122% 104% at 50% 42%, rgba(0, 0, 0, 0) 52%, rgba(0, 0, 0, 0.055) 100%),\r
    radial-gradient(60% 40% at 50% 45%, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0) 100%);\r
}\r
.dsu-dark .dsu-vignette {\r
  background:\r
    radial-gradient(122% 104% at 50% 42%, rgba(0, 0, 0, 0) 48%, rgba(0, 0, 0, 0.42) 100%),\r
    radial-gradient(60% 40% at 50% 45%, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0) 100%);\r
}\r
.dsu-vignette.dsu-in { opacity: 1; }\r
\r
/* \u5F84\u5411\u5149\u6655\uFF1A\u4E0D\u662F\u6574\u5C4F\u7CCA\u767D\uFF0C\u800C\u662F\u4ECE\u4E2D\u5FC3\u70B8\u5F00\u4E00\u6735\u5149\uFF0C\u8FB9\u7F18\u4ECD\u7559\u6696\u8272 */\r
.dsu-bloom {\r
  position: absolute;\r
  left: 50%;\r
  top: 45%;\r
  width: 128vmax;\r
  height: 128vmax;\r
  margin: -64vmax 0 0 -64vmax;\r
  border-radius: 50%;\r
  z-index: 62;\r
  opacity: 0;\r
  pointer-events: none;\r
  will-change: transform, opacity;\r
  background: radial-gradient(\r
    circle,\r
    rgba(255, 255, 255, 0.99) 0%,\r
    rgba(255, 255, 255, 0.94) 22%,\r
    rgba(255, 255, 255, 0.58) 44%,\r
    rgba(255, 255, 255, 0.16) 62%,\r
    rgba(255, 255, 255, 0) 78%\r
  );\r
}\r
.dsu-bloom.dsu-go { animation: dsu-bloom 1250ms cubic-bezier(0.22, 0.68, 0.2, 1) forwards; }\r
@keyframes dsu-bloom {\r
  0% { opacity: 0; transform: scale(0.08); }\r
  20% { opacity: 1; transform: scale(0.42); }\r
  58% { opacity: 0.96; transform: scale(0.96); }\r
  100% { opacity: 0; transform: scale(1.42); }\r
}\r
\r
/* \u53D8\u5F62\u5BBD\u94F6\u5E55\u5149\u6761\uFF1A\u6A2A\u7740\u62BD\u51FA\u6765\u7684\u4E00\u6761\u7EC6\u5149\uFF0C\u5149\u6655\u6700\u4EAE\u90A3\u4E00\u523B\u626B\u8FC7 */\r
.dsu-streak {\r
  position: absolute;\r
  left: 50%;\r
  top: 45%;\r
  height: 3px;\r
  width: 0;\r
  z-index: 63;\r
  opacity: 0;\r
  pointer-events: none;\r
  transform: translate(-50%, -50%);\r
  filter: blur(1px);\r
  background: linear-gradient(\r
    90deg,\r
    rgba(255, 255, 255, 0) 0%,\r
    rgba(255, 255, 255, 0.5) 34%,\r
    rgba(255, 255, 255, 0.98) 50%,\r
    rgba(255, 255, 255, 0.5) 66%,\r
    rgba(255, 255, 255, 0) 100%\r
  );\r
}\r
.dsu-streak.dsu-go { animation: dsu-streak 1000ms cubic-bezier(0.2, 0.78, 0.2, 1) forwards; }\r
@keyframes dsu-streak {\r
  0% { opacity: 0; width: 0; height: 1px; }\r
  26% { opacity: 1; width: 62vw; height: 3px; }\r
  60% { opacity: 0.6; width: 96vw; height: 2px; }\r
  100% { opacity: 0; width: 132vw; height: 1px; }\r
}\r
\r
/* \u5149\u6655\u6700\u4EAE\u90A3\u4E00\u523B\uFF1A\u6587\u5B57\u5E26\u4E00\u70B9\u9752\u8272\u5149\u6655\uFF08halation\uFF09\uFF0C\u9897\u7C92\u53D8\u7C97\u3002\r
   \u6CE8\u610F\u522B\u5728 .dsu-welcome \u4E0A\u52A0 filter \u2014\u2014 \u90A3\u4F1A\u65B0\u5EFA\u5C42\u53E0\u4E0A\u4E0B\u6587\uFF0C\r
   \u628A\u8272\u6563\u5C42\u7684 mix-blend-mode \u9694\u79BB\u6389\uFF0C\u6545\u969C\u4F1A\u5728\u4E2D\u9014"\u556A"\u5730\u53D8\u56DE\u53BB\u3002 */\r
#dsh-startup-root.dsu-peak .dsu-w1,\r
#dsh-startup-root.dsu-peak .dsu-w4 {\r
  color: var(--dsu-glitch-b);\r
  text-shadow: 0 0 14px rgba(41, 113, 184, 0.55);\r
  transition: color 260ms ease, text-shadow 260ms ease;\r
}\r
#dsh-startup-root.dsu-peak .dsu-w3 svg {\r
  filter: drop-shadow(0 0 10px rgba(41, 113, 184, 0.45));\r
}\r
#dsh-startup-root.dsu-peak .dsu-grain { opacity: 0.11; }\r
\r
/* \u63ED\u5E55\uFF1A\u6574\u4E2A\u673A\u4F4D\u540E\u64A4 + \u8F7B\u5FAE\u5931\u7126\uFF0C\u6BD4\u5355\u7EAF\u6DE1\u51FA\u66F4\u6709\u955C\u5934\u611F */\r
#dsh-startup-root.dsu-handoff {\r
  transform: scale(1.035);\r
  filter: blur(5px);\r
  opacity: 0;\r
  transition: opacity 780ms cubic-bezier(0.4, 0, 0.2, 1),\r
    transform 780ms cubic-bezier(0.4, 0, 0.2, 1), filter 780ms cubic-bezier(0.4, 0, 0.2, 1);\r
}\r
\r
/* \u2500\u2500 \u9875\u811A / \u5B57\u5E55 / \u8FDB\u5EA6\u6761 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\r
.dsu-foot {\r
  position: absolute;\r
  right: 46px;\r
  bottom: 52px;\r
  z-index: 24;\r
  display: flex;\r
  align-items: center;\r
  gap: 10px;\r
  font-family: var(--dsu-mono);\r
  font-size: 11px;\r
  letter-spacing: 0.2em;\r
  color: var(--dsu-ink);\r
  opacity: 0;\r
  transform: translateX(18px);\r
  transition: opacity 560ms ease, transform 560ms cubic-bezier(0.16, 0.84, 0.24, 1);\r
  transition-delay: 300ms;\r
}\r
.dsu-foot.dsu-in { opacity: 1; transform: none; }\r
.dsu-foot i {\r
  display: block;\r
  width: 0;\r
  height: 7px;\r
  background: var(--dsu-ink);\r
  transition: width 720ms cubic-bezier(0.2, 0.9, 0.2, 1) 460ms;\r
}\r
.dsu-foot.dsu-in i { width: 26px; }\r
\r
.dsu-subtitle {\r
  position: absolute;\r
  left: 0;\r
  right: 0;\r
  bottom: 50px;\r
  z-index: 24;\r
  display: flex;\r
  flex-direction: column;\r
  align-items: center;\r
  gap: 6px;\r
  pointer-events: none;\r
}\r
.dsu-sub-zh {\r
  font-family: var(--dsu-zh);\r
  font-size: 15px;\r
  letter-spacing: 0.1em;\r
  color: var(--dsu-ink-soft);\r
  text-shadow: var(--dsu-sub-glow);\r
  opacity: 0;\r
  transform: translateY(12px);\r
  transition: opacity 420ms ease, transform 420ms cubic-bezier(0.16, 0.84, 0.24, 1);\r
}\r
.dsu-sub-zh.dsu-in { opacity: 1; transform: none; }\r
.dsu-sub-en2 {\r
  font-family: var(--dsu-mono);\r
  font-size: 9.5px;\r
  letter-spacing: 0.3em;\r
  text-indent: 0.3em;\r
  color: var(--dsu-muted);\r
  opacity: 0;\r
  transform: translateY(8px);\r
  transition: opacity 420ms ease, transform 420ms cubic-bezier(0.16, 0.84, 0.24, 1);\r
}\r
.dsu-sub-en2.dsu-in { opacity: 0.85; transform: none; }\r
\r
/* \u5E95\u90E8\u8FDB\u5EA6\uFF1A\u7167\u539F\u7247\u6536\u6210\u4E2D\u95F4\u4E00\u5C0F\u6BB5\uFF0C\u4E0D\u518D\u6A2A\u8D2F\u6574\u5C4F\u8DDF\u5B57\u5E55\u62A2\u6CE8\u610F\u529B */\r
.dsu-progress {\r
  position: absolute;\r
  left: 50%;\r
  bottom: 11px;\r
  width: min(420px, 32vw);\r
  height: 3px;\r
  transform: translateX(-50%);\r
  z-index: 26;\r
  background: var(--dsu-hair-soft);\r
}\r
.dsu-progress::before {\r
  content: "";\r
  position: absolute;\r
  left: 0;\r
  right: 0;\r
  bottom: 3px;\r
  height: 5px;\r
  background-image: repeating-linear-gradient(90deg, var(--dsu-hair) 0 1px, transparent 1px 30px);\r
  background-size: auto 5px;\r
  background-position: 0 100%;\r
  background-repeat: repeat-x;\r
  opacity: 0.8;\r
}\r
.dsu-progress i {\r
  display: block;\r
  height: 100%;\r
  width: 0;\r
  background: var(--dsu-ink);\r
  box-shadow: inset -2px 0 0 var(--dsu-accent);\r
  transition: width 460ms cubic-bezier(0.3, 0.9, 0.25, 1);\r
}\r
.dsu-progress.dsu-accent i { background: var(--dsu-accent); }\r
\r
/* \u9636\u6BB5\u8BA1\u6570\uFF08\u5DE6\u4E0B\uFF09 */\r
.dsu-stepcount {\r
  position: absolute;\r
  left: 46px;\r
  bottom: 52px;\r
  z-index: 24;\r
  font-family: var(--dsu-mono);\r
  font-size: 11px;\r
  letter-spacing: 0.22em;\r
  color: var(--dsu-muted);\r
  opacity: 0;\r
  transform: translateX(-18px);\r
  transition: opacity 560ms ease, transform 560ms cubic-bezier(0.16, 0.84, 0.24, 1);\r
  transition-delay: 400ms;\r
}\r
.dsu-stepcount.dsu-in { opacity: 1; transform: none; }\r
\r
/* \u8DF3\u8FC7 */\r
.dsu-skip {\r
  position: absolute;\r
  right: 46px;\r
  top: 48px;\r
  z-index: 30;\r
  font-family: var(--dsu-mono);\r
  font-size: 11px;\r
  letter-spacing: 0.24em;\r
  color: var(--dsu-muted);\r
  border: 1px solid transparent;\r
  padding: 5px 10px;\r
  cursor: pointer;\r
  opacity: 0;\r
  transition: opacity 400ms ease, color 200ms ease, border-color 200ms ease;\r
}\r
.dsu-skip.dsu-in { opacity: 1; }\r
.dsu-skip:hover { color: var(--dsu-ink); border-color: var(--dsu-hair); }\r
.dsu-skip[hidden] { display: none; }\r
\r
/* \u2500\u2500 \u673A\u6846\u88C5\u9970\u5C42\uFF08\u7167\u539F\u7247\u7684\u758F\u5BC6\uFF1A\u53EA\u8D34\u8FB9\uFF0C\u4E0D\u5360\u4E2D\u95F4\uFF09\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */\r
/* \u56DB\u89D2\u5B9A\u4F4D\u6807\u8BB0 / \u4E00\u6B21\u6027\u626B\u63CF\u7EBF / \u54C1\u724C\u5757\u4E0B\u5355\u884C\u5C0F\u5B57\uFF08\u542B\u65F6\u949F\uFF09/ \u516D\u4E2A\u9636\u6BB5\u683C */\r
.dsu-frame {\r
  position: absolute;\r
  inset: 0;\r
  z-index: 17;\r
  pointer-events: none;\r
}\r
\r
.dsu-corner {\r
  position: absolute;\r
  width: 16px;\r
  height: 16px;\r
  opacity: 0;\r
  transition: opacity 640ms ease, transform 640ms cubic-bezier(0.16, 0.84, 0.24, 1);\r
}\r
.dsu-corner::before,\r
.dsu-corner::after { content: ""; position: absolute; background: var(--dsu-hair); }\r
.dsu-corner::before { width: 100%; height: 1px; }\r
.dsu-corner::after { width: 1px; height: 100%; }\r
.dsu-c-tl { left: 26px; top: 26px; transform: translate(-10px, -10px); }\r
.dsu-c-tl::before { top: 0; left: 0; }\r
.dsu-c-tl::after { top: 0; left: 0; }\r
.dsu-c-tr { right: 26px; top: 26px; transform: translate(10px, -10px); }\r
.dsu-c-tr::before { top: 0; right: 0; }\r
.dsu-c-tr::after { top: 0; right: 0; }\r
.dsu-c-bl { left: 26px; bottom: 26px; transform: translate(-10px, 10px); }\r
.dsu-c-bl::before { bottom: 0; left: 0; }\r
.dsu-c-bl::after { bottom: 0; left: 0; }\r
.dsu-c-br { right: 26px; bottom: 26px; transform: translate(10px, 10px); }\r
.dsu-c-br::before { bottom: 0; right: 0; }\r
.dsu-c-br::after { bottom: 0; right: 0; }\r
.dsu-frame.dsu-in .dsu-corner { opacity: 1; transform: none; }\r
.dsu-frame.dsu-in .dsu-c-tr { transition-delay: 90ms; }\r
.dsu-frame.dsu-in .dsu-c-br { transition-delay: 180ms; }\r
.dsu-frame.dsu-in .dsu-c-bl { transition-delay: 270ms; }\r
\r
/* \u4E00\u6B21\u6027\u626B\u63CF\u7EBF\uFF1A\u5E95\u677F\u6D17\u767D\u4E4B\u540E\u81EA\u4E0A\u800C\u4E0B\u626B\u4E00\u904D\uFF0C\u9A8C\u51C6\u65F6\u518D\u626B\u4E00\u6B21 */\r
.dsu-scanline {\r
  position: absolute;\r
  left: 0;\r
  right: 0;\r
  top: -14%;\r
  height: 96px;\r
  opacity: 0;\r
  background: linear-gradient(\r
    180deg,\r
    rgba(0, 0, 0, 0) 0%,\r
    rgba(0, 0, 0, 0.045) 58%,\r
    rgba(0, 0, 0, 0.1) 86%,\r
    rgba(0, 0, 0, 0.16) 97%,\r
    rgba(0, 0, 0, 0) 100%\r
  );\r
}\r
.dsu-dark .dsu-scanline {\r
  background: linear-gradient(\r
    180deg,\r
    rgba(255, 255, 255, 0) 0%,\r
    rgba(255, 255, 255, 0.05) 58%,\r
    rgba(255, 255, 255, 0.11) 86%,\r
    rgba(255, 255, 255, 0.18) 97%,\r
    rgba(255, 255, 255, 0) 100%\r
  );\r
}\r
.dsu-scanline.dsu-go { animation: dsu-scan 2600ms cubic-bezier(0.42, 0, 0.58, 1) 1; }\r
@keyframes dsu-scan {\r
  0% { top: -14%; opacity: 0; }\r
  10% { opacity: 1; }\r
  86% { opacity: 1; }\r
  100% { top: 102%; opacity: 0; }\r
}\r
\r
/* \u54C1\u724C\u5757\u4E0B\u65B9\u7684\u4E00\u884C\u5C0F\u5B57\uFF1A\u7248\u672C + \u5B9E\u65F6\u65F6\u949F\uFF08\u65F6\u949F\u70B9\u4EAE\u4E3B\u9898\u6A59\uFF09 */\r
.dsu-meta {\r
  position: absolute;\r
  left: 46px;\r
  top: 170px;\r
  z-index: 20;\r
  display: flex;\r
  align-items: baseline;\r
  gap: 10px;\r
  font-family: var(--dsu-mono);\r
  font-size: 10px;\r
  letter-spacing: 0.16em;\r
  color: var(--dsu-muted);\r
  opacity: 0;\r
  transform: translateX(-18px);\r
  transition: opacity 560ms ease, transform 560ms cubic-bezier(0.16, 0.84, 0.24, 1);\r
  transition-delay: 330ms;\r
}\r
.dsu-meta.dsu-in { opacity: 1; transform: none; }\r
.dsu-meta-2 { color: var(--dsu-accent); }\r
\r
/* \u516D\u4E2A\u9636\u6BB5\u683C\uFF1A\u6A2A\u6392\u5728\u5DE6\u680F\u5C0F\u5B57\u4E0B\u9762\uFF0C\u8D70\u8FC7\u7684\u538B\u6697\u3001\u5F53\u524D\u7684\u70B9\u4EAE\u5E76\u62C9\u957F */\r
.dsu-slats {\r
  position: absolute;\r
  left: 46px;\r
  top: 196px;\r
  z-index: 20;\r
  display: flex;\r
  align-items: center;\r
  gap: 5px;\r
  opacity: 0;\r
  transform: translateX(-18px);\r
  transition: opacity 560ms ease, transform 560ms cubic-bezier(0.16, 0.84, 0.24, 1);\r
  transition-delay: 420ms;\r
}\r
.dsu-slats.dsu-in { opacity: 1; transform: none; }\r
.dsu-slat {\r
  width: 20px;\r
  height: 2px;\r
  background: var(--dsu-hair);\r
  transition: width 460ms cubic-bezier(0.3, 0.9, 0.25, 1), background-color 320ms ease,\r
    opacity 320ms ease;\r
}\r
.dsu-slat.dsu-past { background: var(--dsu-ink); opacity: 0.3; }\r
.dsu-slat.dsu-on { width: 34px; background: var(--dsu-accent); opacity: 1; }\r
\r
/* \u5973\u58F0\u64AD\u62A5\u6307\u793A\u6761\uFF1A\u51FA\u58F0\u65F6\u70B9\u4EAE\u4E3B\u9898\u6A59\u5E76\u8DF3\u52A8\uFF08\u5BF9\u5E94\u53C2\u8003\u7247\u91CC\u5973\u58F0\u5FF5\u72B6\u6001\u884C\u7684\u65F6\u523B\uFF09 */\r
.dsu-voice {\r
  position: absolute;\r
  left: 46px;\r
  bottom: 96px;\r
  z-index: 20;\r
  display: flex;\r
  align-items: flex-end;\r
  gap: 3px;\r
  height: 16px;\r
  opacity: 0;\r
  transition: opacity 560ms ease;\r
  transition-delay: 480ms;\r
}\r
.dsu-voice.dsu-in { opacity: 1; }\r
.dsu-voice i {\r
  width: 2px;\r
  height: 20%;\r
  background: var(--dsu-hair);\r
  transition: height 140ms ease, background-color 240ms ease;\r
}\r
.dsu-voice.dsu-on i {\r
  background: var(--dsu-accent);\r
  animation: dsu-voice 560ms ease-in-out infinite;\r
}\r
.dsu-voice i:nth-child(1) { animation-delay: 0ms; }\r
.dsu-voice i:nth-child(2) { animation-delay: 90ms; }\r
.dsu-voice i:nth-child(3) { animation-delay: 180ms; }\r
.dsu-voice i:nth-child(4) { animation-delay: 60ms; }\r
.dsu-voice i:nth-child(5) { animation-delay: 140ms; }\r
@keyframes dsu-voice {\r
  0%, 100% { height: 20%; }\r
  50% { height: 100%; }\r
}\r
\r
/* \u65E0\u969C\u788D\uFF1A\u5C0A\u91CD\u7CFB\u7EDF"\u51CF\u5C11\u52A8\u6001\u6548\u679C" */\r
@media (prefers-reduced-motion: reduce) {\r
  #dsh-startup-root .dsu-ret-rot-a,\r
  #dsh-startup-root .dsu-ret-rot-b { animation: none; }\r
  #dsh-startup-root .dsu-scanline.dsu-go { animation: none; }\r
}\r
`;

// assets/startup-screen/adapted-runtime.js
function mountStartupRuntime(environment) {
  const { window: window2, document: document2, setTimeout: setTimeout2, clearTimeout: clearTimeout2, setInterval: setInterval2, clearInterval: clearInterval2, requestAnimationFrame, cancelAnimationFrame, fetch: fetch2 } = environment;
  const translate2 = environment.translate || ((zh) => zh);
  "use strict";
  if (window2.__DSH_STARTUP_LOADED__) return;
  window2.__DSH_STARTUP_LOADED__ = true;
  var ROOT_ID = "dsh-startup-root";
  var WHALE_PATH2 = "M48.8354 10.0479C48.3232 9.79199 48.1025 10.2798 47.8032 10.5278C47.7007 10.6079 47.6143 10.7119 47.5273 10.8076C46.7793 11.624 45.9048 12.1597 44.7622 12.0957C43.0923 12 41.666 12.5356 40.4058 13.8398C40.1377 12.2319 39.2476 11.272 37.8926 10.6558C37.1836 10.3359 36.4668 10.0156 35.9702 9.31982C35.6235 8.82373 35.5293 8.27197 35.356 7.72754C35.2456 7.3999 35.1353 7.06396 34.7651 7.00781C34.3633 6.94385 34.2056 7.2876 34.0479 7.57568C33.418 8.75195 33.1733 10.0479 33.1973 11.3599C33.2524 14.312 34.4736 16.6641 36.8999 18.3359C37.1758 18.5278 37.2466 18.7197 37.1597 19C36.9946 19.5757 36.7974 20.1357 36.624 20.7119C36.5137 21.0801 36.3486 21.1597 35.9624 21C34.6309 20.4321 33.481 19.5918 32.4644 18.5757C30.7393 16.8721 29.1792 14.9917 27.2334 13.52C26.7764 13.1758 26.3193 12.856 25.8467 12.5518C23.8618 10.584 26.1069 8.96777 26.627 8.77588C27.1704 8.57568 26.8159 7.8877 25.0591 7.896C23.3022 7.90381 21.6953 8.50391 19.647 9.30371C19.3477 9.42383 19.0322 9.51172 18.7095 9.58398C16.8501 9.22363 14.9199 9.14355 12.9033 9.37598C9.10596 9.80762 6.07275 11.6396 3.84326 14.7681C1.16455 18.5278 0.53418 22.7998 1.30664 27.2559C2.11768 31.9521 4.46582 35.8398 8.07373 38.8799C11.8159 42.0322 16.1255 43.5762 21.041 43.2803C24.0269 43.104 27.3516 42.6963 31.1016 39.4561C32.0469 39.936 33.0396 40.1279 34.686 40.272C35.9546 40.3921 37.1758 40.208 38.1211 40.0078C39.6021 39.688 39.4995 38.2881 38.9639 38.0322C34.623 35.9678 35.5762 36.8081 34.71 36.1279C36.9155 33.4639 40.2402 30.6958 41.54 21.728C41.6426 21.0161 41.5557 20.5679 41.54 19.9917C41.5322 19.6396 41.6108 19.5039 42.0049 19.4639C43.0923 19.3359 44.1479 19.0317 45.1167 18.4878C47.9292 16.9199 49.064 14.3438 49.3315 11.2559C49.3711 10.7837 49.3237 10.2959 48.8354 10.0479ZM24.3262 37.8398C20.1196 34.4639 18.0791 33.3521 17.2358 33.3999C16.4482 33.4482 16.5898 34.3682 16.7632 34.9678C16.9443 35.5601 17.1812 35.9683 17.5117 36.4878C17.7402 36.832 17.8979 37.3442 17.2832 37.728C15.9282 38.584 13.5728 37.4399 13.4624 37.3838C10.7207 35.7358 8.42822 33.5601 6.81348 30.584C5.25342 27.7197 4.34766 24.6479 4.19775 21.3677C4.1582 20.5757 4.38672 20.2959 5.15869 20.1519C6.17529 19.96 7.22314 19.9199 8.23926 20.0718C12.5327 20.7119 16.1885 22.6719 19.2529 25.7759C21.002 27.5439 22.3252 29.6558 23.6885 31.7202C25.1377 33.9121 26.6978 36 28.6831 37.7119C29.3843 38.312 29.9434 38.7681 30.479 39.104C28.8643 39.2881 26.1699 39.3281 24.3262 37.8398ZM26.3433 24.6001C26.3433 24.248 26.6191 23.9678 26.9658 23.9678C27.0444 23.9678 27.1152 23.9839 27.1782 24.0078C27.2651 24.04 27.3438 24.0879 27.4067 24.1602C27.5171 24.272 27.5801 24.4321 27.5801 24.6001C27.5801 24.9521 27.3042 25.2319 26.9575 25.2319C26.6108 25.2319 26.3433 24.9521 26.3433 24.6001ZM32.6064 27.8799C32.2046 28.0479 31.8027 28.1919 31.4165 28.208C30.8179 28.2397 30.1641 27.9922 29.8096 27.688C29.2583 27.2158 28.8643 26.9521 28.6987 26.1279C28.6279 25.7759 28.6675 25.2319 28.7305 24.9199C28.8721 24.248 28.7144 23.8159 28.2495 23.4238C27.8716 23.104 27.3911 23.0161 26.8633 23.0161C26.666 23.0161 26.4849 22.9277 26.3511 22.856C26.1304 22.7441 25.9492 22.4639 26.1226 22.1201C26.1777 22.0078 26.4458 21.7358 26.5088 21.688C27.2256 21.272 28.0527 21.4077 28.8169 21.7197C29.5259 22.0161 30.0615 22.5601 30.834 23.3281C31.6216 24.2559 31.7632 24.5117 32.2124 25.208C32.5669 25.752 32.8901 26.312 33.1104 26.9521C33.2446 27.3521 33.0713 27.6802 32.6064 27.8799Z";
  var DEFAULTS = {
    enabled: true,
    mode: "session",
    // always | session | daily
    theme: "light",
    // light | dark
    speed: 1,
    requireInteraction: true,
    // 第 1、2 步等待用户确认
    allowSkip: true,
    sound: true,
    // 界面音效（WebAudio 合成，无音频文件）
    soundVolume: 0.5,
    voice: true,
    // 女声播报
    voiceLang: "en",
    // en | zh | both
    voiceName: "",
    // '' = 自动挑女声（见 FEMALE_HINTS）
    voiceRate: 0.88,
    // 电影旁白档：比朗读慢，字与字之间才有重量
    voicePitch: 0.85,
    // 压低音调，深沉的 AI 女声
    voiceVolume: 0.9,
    voiceCue: true,
    // 念台词前的一声轻提示
    sfx: "audio",
    // audio=真素材（用户音频里抠的音效）/ synth=现场合成
    voiceSource: "asset",
    // asset=优先用真声素材 / tts=全部 TTS 合成
    voiceLead: 240,
    // 提示音之后留一小段空白再开口
    identity: "JOYCE MOORE",
    // ← 设置页可改的"身份名称"
    identityId: "0087",
    accessLevel: "3",
    brand1: "DEEPSEEK",
    brand2: "SYNTHESIZE INTELLIGENCE",
    brand3a: "HARNESS",
    brand3b: "OS",
    orgZh: "\u6DF1\u5EA6\u6C42\u7D22",
    orgEn: "DEEPSEEK",
    orgSub: "DEEPSEEK HARNESS",
    welcomeBox: "DEEPSEEK HARNESS",
    footer: "POWERED BY DEEPSEEK",
    accent: "#ff7500",
    glitchA: "#ff3b30",
    glitchB: "#2971b8"
  };
  var STEPS = [
    {
      zh: "\u9700\u8981\u8BBF\u95EE\u8BB8\u53EF",
      en: "ACCESS PERMISSION REQUIRED",
      say: "Access permission required.",
      audio: "line-1",
      log: "\u7B49\u5F85\u7528\u6237\u6388\u6743\u2026",
      logEn: "AWAITING OPERATOR CONSENT",
      badge: "AUTHORIZATION",
      action: "grant",
      btnZh: "\u6388\u4E88\u8BBF\u95EE\u6743\u9650",
      btnEn: "GRANT ACCESS",
      hold: 900,
      progress: 0.34
    },
    {
      zh: "\u8EAB\u4EFD\u8D44\u6599\u786E\u8BA4",
      en: "IDENTITY VERIFICATION",
      say: "Identity verification.",
      audio: "line-2",
      log: "\u6838\u5BF9\u8EAB\u4EFD\u8D44\u6599\u2026",
      logEn: "MATCHING OPERATOR RECORD",
      badge: "IDENTITY",
      action: "confirm",
      btnZh: "\u786E\u8BA4\u8EAB\u4EFD",
      btnEn: "CONFIRM IDENTITY",
      hold: 700,
      progress: 0.5
    },
    {
      zh: "\u63A5\u6536\u8BBF\u95EE\u9700\u6C42",
      en: "ACCESS REQUEST RECEIVED",
      say: "Access request received.",
      audio: "line-3",
      log: "\u63A5\u6536\u8BBF\u95EE\u9700\u6C42\uFF0C\u5EFA\u7ACB\u4F1A\u8BDD\u901A\u9053\u2026",
      logEn: "HANDSHAKE ESTABLISHED",
      badge: "REQUEST",
      action: "auto",
      hold: 1200,
      progress: 0.66,
      assembleLogo: true
    },
    {
      zh: "\u5F00\u59CB\u8BFB\u53D6\u6743\u9650",
      en: "PERMISSION READ STARTED",
      say: "Beginning permission read.",
      audio: "line-4",
      log: "\u5F00\u59CB\u8BFB\u53D6\u6743\u9650\uFF0C\u7D22\u5F15\u5DE5\u4F5C\u533A\u4E0E\u4F1A\u8BDD\u2026",
      logEn: "READING PERMISSION SET",
      badge: "READ",
      action: "auto",
      hold: 1200,
      progress: 0.8,
      hex: true
    },
    {
      zh: "\u8BFB\u53D6\u5B8C\u6BD5 \xB7 \u6838\u9A8C\u901A\u8FC7",
      en: "READ COMPLETE \xB7 VERIFIED",
      say: "Read complete. Verification passed.",
      audio: "line-5",
      log: "\u8BFB\u53D6\u5B8C\u6BD5\uFF0C\u6838\u9A8C\u901A\u8FC7\uFF0C\u6743\u9650\u5DF2\u6388\u4E88",
      logEn: "PERMISSION AUTHORIZED",
      badge: "VERIFY",
      action: "auto",
      hold: 1600,
      progress: 0.93,
      reticle: true
    }
  ];
  function cfg() {
    var raw = window2.__DSH_STARTUP__ && typeof window2.__DSH_STARTUP__ === "object" ? window2.__DSH_STARTUP__ : {};
    var out = {};
    for (var k in DEFAULTS) if (Object.prototype.hasOwnProperty.call(DEFAULTS, k)) out[k] = DEFAULTS[k];
    for (var k2 in raw) {
      if (Object.prototype.hasOwnProperty.call(raw, k2) && raw[k2] !== void 0 && raw[k2] !== null) {
        out[k2] = raw[k2];
      }
    }
    out.speed = Math.min(3, Math.max(0.35, Number(out.speed) || 1));
    out.identity = String(out.identity || DEFAULTS.identity).slice(0, 48);
    out.identityId = String(out.identityId || out.identity).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12);
    if (!out.identityId) out.identityId = "OPERATOR";
    return out;
  }
  var C = cfg();
  function injectSelf() {
    window2.__DSH_STARTUP_LOADED__ = false;
    var old = document2.getElementById(ROOT_ID);
    if (old && old.parentNode) old.parentNode.removeChild(old);
    window2.__DSH_STARTUP_SKIP__ = false;
    var s = document2.createElement("script");
    if (window2.__DSH_STARTUP_SCRIPT_URL__) {
      s.src = window2.__DSH_STARTUP_SCRIPT_URL__;
    } else {
      s.src = "/dsh-startup/splash.js?t=" + Date.now();
    }
    document2.head.appendChild(s);
  }
  if (window2.__DSH_STARTUP_SKIP__ === true) {
    window2.__DSH_STARTUP_API__ = {
      replay: injectSelf,
      skip: function() {
      },
      finish: function() {
      },
      config: C
    };
    return;
  }
  setTimeout2(function() {
    try {
      var r = document2.getElementById(ROOT_ID);
      if (r && r.classList && r.classList.contains("dsu-boot")) {
        if (r.parentNode) r.parentNode.removeChild(r);
        document2.documentElement.classList.remove("dsu-lock");
        if (document2.body) document2.body.style.overflow = "";
        window2.__DSH_STARTUP_FAILED__ = true;
      }
    } catch (e) {
    }
  }, 9e3);
  function el(tag, cls, text) {
    var n = document2.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function svgWhale(cls) {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document2.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 50 50");
    svg.setAttribute("aria-hidden", "true");
    if (cls) svg.setAttribute("class", cls);
    var p = document2.createElementNS(ns, "path");
    p.setAttribute("d", WHALE_PATH2);
    p.setAttribute("fill-rule", "nonzero");
    svg.appendChild(p);
    return svg;
  }
  function typeIn(host, text, stagger) {
    host.textContent = "";
    var frag = document2.createDocumentFragment();
    var n = 0;
    for (var i = 0; i < text.length; i++) {
      var ch = text.charAt(i);
      if (ch === " ") {
        frag.appendChild(document2.createTextNode(translate2("zh", "en") === "en" ? " " : "\xA0"));
        continue;
      }
      var s = el("span", "dsu-ch", ch);
      s.style.transitionDelay = Math.round(n * stagger) + "ms";
      frag.appendChild(s);
      n++;
    }
    host.appendChild(frag);
  }
  function setIn(node, on, cls) {
    if (!node) return;
    node.classList.toggle(cls || "dsu-in", !!on);
  }
  var root = document2.getElementById(ROOT_ID);
  if (!root) {
    root = el("div");
    root.id = ROOT_ID;
    root.className = "dsu-root";
    document2.body.appendChild(root);
  }
  root.classList.toggle("dsu-dark", C.theme === "dark");
  root.style.setProperty("--dsu-speed", String(C.speed));
  root.style.setProperty("--dsu-accent", C.accent);
  root.style.setProperty("--dsu-glitch-a", C.glitchA);
  root.style.setProperty("--dsu-glitch-b", C.glitchB);
  var ui = {};
  var localizedBindings = /* @__PURE__ */ new Map();
  function localizedText(node, zh, en, stagger, html2) {
    var render = function() {
      if (html2) node.innerHTML = translate2(zh, en);
      else node.textContent = translate2(zh, en);
    };
    localizedBindings.set(node, render);
    if (typeof stagger === "number") typeIn(node, translate2(zh, en), stagger);
    else render();
  }
  var clockTimer = null;
  var html = '<div class="dsu-plate"></div><div class="dsu-vignette"></div><div class="dsu-watermark"></div><div class="dsu-grain"></div><div class="dsu-black"><div class="dsu-black-inner"></div><div class="dsu-sweep"></div></div><div class="dsu-wash"></div><header class="dsu-brand"><div class="dsu-brand-1"></div><div class="dsu-brand-2"></div><div class="dsu-brand-3"><b></b><span></span></div></header><div class="dsu-stepcount">[ 00 / 06 ] INIT</div><div class="dsu-center"><div class="dsu-status"><span class="dsu-status-zh"></span><i class="dsu-caret"></i></div><div class="dsu-sub-en"></div><div class="dsu-rule"></div><div class="dsu-logo"></div><div class="dsu-dots" hidden></div></div><div class="dsu-idline"></div><div class="dsu-reticle"></div><div class="dsu-hex"></div><div class="dsu-welcome"><div class="dsu-w1">WELCOME TO</div><div class="dsu-w2"></div><div class="dsu-w3"></div><div class="dsu-w4"></div></div><div class="dsu-action"><div class="dsu-card" hidden></div><button class="dsu-btn" type="button"><span class="dsu-btn-zh"></span><span class="dsu-btn-en"></span></button><div class="dsu-hint"></div></div><div class="dsu-frame"><i class="dsu-corner dsu-c-tl"></i><i class="dsu-corner dsu-c-tr"></i><i class="dsu-corner dsu-c-bl"></i><i class="dsu-corner dsu-c-br"></i><div class="dsu-scanline"></div></div><div class="dsu-slats"></div><div class="dsu-voice"><i></i><i></i><i></i><i></i><i></i></div><div class="dsu-meta"><span class="dsu-meta-1"></span><span class="dsu-meta-2"></span></div><div class="dsu-skip">SKIP \u25B8</div><footer class="dsu-foot"><span></span><i></i></footer><div class="dsu-subtitle"><span class="dsu-sub-zh"></span><span class="dsu-sub-en2"></span></div><div class="dsu-progress"><i></i></div><div class="dsu-bloom"></div><div class="dsu-streak"></div><div class="dsu-flash"></div>';
  root.innerHTML = html;
  function q(sel) {
    return root.querySelector(sel);
  }
  ui.plate = q(".dsu-plate");
  ui.watermark = q(".dsu-watermark");
  ui.black = q(".dsu-black");
  ui.blackInner = q(".dsu-black-inner");
  ui.sweep = q(".dsu-sweep");
  ui.wash = q(".dsu-wash");
  ui.flash = q(".dsu-flash");
  ui.bloom = q(".dsu-bloom");
  ui.streak = q(".dsu-streak");
  ui.vignette = q(".dsu-vignette");
  ui.brand = q(".dsu-brand");
  ui.center = q(".dsu-center");
  ui.brand1 = q(".dsu-brand-1");
  ui.brand2 = q(".dsu-brand-2");
  ui.brand3b = q(".dsu-brand-3 b");
  ui.brand3s = q(".dsu-brand-3 span");
  ui.stepcount = q(".dsu-stepcount");
  ui.status = q(".dsu-status");
  ui.statusZh = q(".dsu-status-zh");
  ui.caret = q(".dsu-caret");
  ui.subEn = q(".dsu-sub-en");
  ui.rule = q(".dsu-rule");
  ui.logo = q(".dsu-logo");
  ui.dots = q(".dsu-dots");
  ui.idline = q(".dsu-idline");
  ui.reticle = q(".dsu-reticle");
  ui.hex = q(".dsu-hex");
  ui.welcome = q(".dsu-welcome");
  ui.w1 = q(".dsu-w1");
  ui.w2 = q(".dsu-w2");
  ui.w3 = q(".dsu-w3");
  ui.w4 = q(".dsu-w4");
  ui.action = q(".dsu-action");
  ui.card = q(".dsu-card");
  ui.btn = q(".dsu-btn");
  ui.btnZh = q(".dsu-btn-zh");
  ui.btnEn = q(".dsu-btn-en");
  ui.hint = q(".dsu-hint");
  ui.skip = q(".dsu-skip");
  ui.foot = q(".dsu-foot");
  ui.footText = q(".dsu-foot span");
  ui.subZh = q(".dsu-sub-zh");
  ui.subEn2 = q(".dsu-sub-en2");
  ui.progress = q(".dsu-progress");
  ui.bar = q(".dsu-progress i");
  ui.frame = q(".dsu-frame");
  ui.scanline = q(".dsu-scanline");
  ui.slats = q(".dsu-slats");
  ui.voice = q(".dsu-voice");
  ui.meta = q(".dsu-meta");
  ui.meta1 = q(".dsu-meta-1");
  ui.meta2 = q(".dsu-meta-2");
  ui.brand1.textContent = C.brand1;
  ui.brand2.textContent = C.brand2;
  ui.brand3b.textContent = C.brand3a;
  ui.brand3s.textContent = C.brand3b;
  ui.footText.textContent = C.footer;
  ui.w2.textContent = C.welcomeBox;
  localizedText(ui.w4, "\u6B22\u8FCE " + C.identity + " \u8BBF\u95EE", "WELCOME, " + C.identity);
  ui.idline.textContent = "\xB7 ID CONFIRMED : " + C.identityId;
  (function blackStage() {
    var inner = ui.blackInner;
    var whale = svgWhale("dsu-whale");
    inner.appendChild(whale);
    var org = el("div", "dsu-black-zh");
    localizedText(org, C.orgZh, C.orgEn);
    inner.appendChild(org);
    var en = el("div", "dsu-black-en", C.orgEn);
    inner.appendChild(en);
    inner.appendChild(el("div", "dsu-black-sub", C.orgSub));
    ui.blackEn = en;
  })();
  (function logoStage() {
    ui.logo.appendChild(svgWhale());
    ui.logo.appendChild(el("div", "dsu-logolabel", "D E E P S E E K"));
  })();
  (function welcomeLogo() {
    ui.w3.appendChild(svgWhale());
    ui.w3.appendChild(el("span", "dsu-w3label", "D E E P S E E K  \xB7  H A R N E S S"));
  })();
  (function watermark() {
    var boxes = [
      [0.6, 0.02, 0.16, 0.96],
      [0.78, 0.02, 0.16, 0.96],
      [0.96, 0.02, 0.16, 0.96],
      [0.05, 0.02, 0.1, 0.5]
    ];
    for (var i = 0; i < boxes.length; i++) {
      var b = boxes[i];
      var n = el("div", "dsu-wm");
      n.style.left = b[0] * 100 + "%";
      n.style.top = b[1] * 100 + "%";
      n.style.width = b[2] * 100 + "%";
      n.style.height = b[3] * 100 + "%";
      ui.watermark.appendChild(n);
    }
  })();
  (function slatsAndMeta() {
    for (var i = 0; i < STEPS.length + 1; i++) ui.slats.appendChild(el("i", "dsu-slat"));
    ui.meta1.textContent = "REV 0.1.0 \xB7 WEB PROFILE";
    paintClock();
    clockTimer = setInterval2(paintClock, 1e3);
  })();
  (function reticle() {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document2.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 400 400");
    function arc(cx, cy, r, a0, a1, cls, cap) {
      var rad = function(d) {
        return (d - 90) * Math.PI / 180;
      };
      var x0 = cx + r * Math.cos(rad(a0)), y0 = cy + r * Math.sin(rad(a0));
      var x1 = cx + r * Math.cos(rad(a1)), y1 = cy + r * Math.sin(rad(a1));
      var large = a1 - a0 > 180 ? 1 : 0;
      var p = document2.createElementNS(ns, "path");
      p.setAttribute("d", "M" + x0.toFixed(2) + " " + y0.toFixed(2) + " A" + r + " " + r + " 0 " + large + " 1 " + x1.toFixed(2) + " " + y1.toFixed(2));
      p.setAttribute("class", cls);
      if (cap) p.setAttribute("stroke-linecap", cap);
      return { node: p, x: x1, y: y1, x0, y0 };
    }
    var gA = document2.createElementNS(ns, "g");
    gA.setAttribute("class", "dsu-ret-rot-a");
    var a = arc(200, 200, 150, 215, 505, "dsu-ring-a", "round");
    gA.appendChild(a.node);
    var da = document2.createElementNS(ns, "circle");
    da.setAttribute("class", "dsu-dot-a");
    da.setAttribute("cx", a.x.toFixed(2));
    da.setAttribute("cy", a.y.toFixed(2));
    da.setAttribute("r", "7");
    gA.appendChild(da);
    svg.appendChild(gA);
    var gB = document2.createElementNS(ns, "g");
    gB.setAttribute("class", "dsu-ret-rot-b");
    var b = arc(200, 200, 104, 200, 490, "dsu-ring-b", "round");
    gB.appendChild(b.node);
    var db = document2.createElementNS(ns, "circle");
    db.setAttribute("class", "dsu-dot-b");
    db.setAttribute("cx", b.x0.toFixed(2));
    db.setAttribute("cy", b.y0.toFixed(2));
    db.setAttribute("r", "4");
    gB.appendChild(db);
    svg.appendChild(gB);
    var gC = document2.createElementNS(ns, "g");
    var bl = arc(200, 200, 62, 118, 242, "dsu-bracket", "round");
    var br = arc(200, 200, 62, 298, 62, "dsu-bracket", "round");
    gC.appendChild(bl.node);
    gC.appendChild(br.node);
    svg.appendChild(gC);
    var pts = [[152, 132], [252, 268], [278, 150]];
    for (var i = 0; i < pts.length; i++) {
      var c = document2.createElementNS(ns, "circle");
      c.setAttribute("class", "dsu-dot-o");
      c.setAttribute("cx", pts[i][0]);
      c.setAttribute("cy", pts[i][1]);
      c.setAttribute("r", "2.8");
      svg.appendChild(c);
    }
    ui.reticle.appendChild(svg);
  })();
  var timers = [];
  var waiters = [];
  var skipped = false;
  var finished = false;
  var hexTimer = null;
  function ms(base) {
    return Math.round(base / C.speed);
  }
  function wait(base) {
    return new Promise(function(resolve) {
      if (skipped) return resolve();
      var done = false;
      function fin() {
        if (done) return;
        done = true;
        var i = waiters.indexOf(fin);
        if (i >= 0) waiters.splice(i, 1);
        resolve();
      }
      var t = setTimeout2(fin, Math.max(0, ms(base)));
      timers.push(t);
      waiters.push(fin);
    });
  }
  function waitAction() {
    return new Promise(function(resolve) {
      if (skipped || !C.requireInteraction) return resolve();
      var done = false;
      function fin() {
        if (done) return;
        done = true;
        cleanup();
        resolve();
      }
      function onKey(e) {
        if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
          e.preventDefault();
          fin();
        }
      }
      function onClick(e) {
        e.preventDefault();
        fin();
      }
      function cleanup() {
        ui.btn.removeEventListener("click", onClick);
        ui.action.removeEventListener("click", onClick);
        document2.removeEventListener("keydown", onKey);
        var i = waiters.indexOf(fin);
        if (i >= 0) waiters.splice(i, 1);
      }
      ui.btn.addEventListener("click", onClick);
      ui.action.addEventListener("click", onClick);
      document2.addEventListener("keydown", onKey);
      waiters.push(fin);
    });
  }
  function releaseAll() {
    for (var i = 0; i < timers.length; i++) clearTimeout2(timers[i]);
    timers.length = 0;
    var list = waiters.slice();
    waiters.length = 0;
    for (var j = 0; j < list.length; j++) {
      try {
        list[j]();
      } catch (err) {
      }
    }
  }
  function setProgress(p) {
    var pct = Math.max(0, Math.min(1, p));
    ui.bar.style.width = Math.round(pct * 100) + "%";
  }
  function setSlats(active) {
    var items = ui.slats.children;
    for (var i = 0; i < items.length; i++) {
      var idx = i + 1;
      items[i].classList.toggle("dsu-on", idx === active);
      items[i].classList.toggle("dsu-past", idx < active);
    }
  }
  function sweep() {
    if (!ui.scanline) return;
    ui.scanline.classList.remove("dsu-go");
    void ui.scanline.offsetWidth;
    ui.scanline.classList.add("dsu-go");
  }
  function paintClock() {
    var d = /* @__PURE__ */ new Date();
    var pad = function(n) {
      return (n < 10 ? "0" : "") + n;
    };
    ui.meta2.textContent = pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
  }
  function setSubtitle(zh, en) {
    ui.subZh.classList.remove("dsu-in");
    ui.subEn2.classList.remove("dsu-in");
    setTimeout2(function() {
      localizedText(ui.subZh, zh || "", en || "");
      ui.subEn2.textContent = en || "";
      ui.subZh.classList.add("dsu-in");
      if (en) ui.subEn2.classList.add("dsu-in");
    }, ms(140));
  }
  function setStepCount(i, code) {
    var totalSteps = STEPS.length + 1;
    ui.stepcount.textContent = "[ " + String(i).padStart(2, "0") + " / " + String(totalSteps).padStart(2, "0") + " ] " + code;
  }
  function startHex() {
    var lines = 12;
    function line() {
      var s = "";
      for (var i = 0; i < 26; i++) {
        s += "0123456789ABCDEF".charAt(Math.floor(Math.random() * 16));
        if (i % 2 === 1) s += " ";
      }
      return s;
    }
    function paint() {
      var out = [];
      for (var i = 0; i < lines; i++) out.push(line());
      ui.hex.innerHTML = out.join("<br>");
    }
    paint();
    ui.hex.classList.add("dsu-in");
    audio.tickRun();
    hexTimer = setInterval2(paint, 110);
  }
  function stopHex() {
    if (hexTimer) {
      clearInterval2(hexTimer);
      hexTimer = null;
    }
    ui.hex.classList.remove("dsu-in");
  }
  function clamp01(v, lo, hi) {
    var n = Number(v);
    return isFinite(n) ? Math.min(hi, Math.max(lo, n)) : lo;
  }
  var audio = /* @__PURE__ */ (function() {
    var ctx = null;
    function ac(force) {
      if (!C.sound && !force) return null;
      try {
        var AC = window2.AudioContext || window2.webkitAudioContext;
        if (!AC) return null;
        if (!ctx) ctx = new AC();
        if (ctx.state === "suspended" && typeof ctx.resume === "function") ctx.resume();
        return ctx;
      } catch (e) {
        return null;
      }
    }
    function vol(gain) {
      return Math.max(2e-4, (gain == null ? 0.05 : gain) * clamp01(C.soundVolume, 0, 1) * 2);
    }
    function tone(freq, dur, type, gain, delay, glideTo) {
      var c = ac();
      if (!c) return;
      try {
        var t0 = c.currentTime + (delay || 0);
        var o = c.createOscillator(), g = c.createGain();
        o.type = type || "sine";
        o.frequency.setValueAtTime(freq, t0);
        if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, t0 + dur);
        g.gain.setValueAtTime(1e-4, t0);
        g.gain.exponentialRampToValueAtTime(vol(gain), t0 + Math.min(0.02, dur * 0.3));
        g.gain.exponentialRampToValueAtTime(1e-4, t0 + dur);
        o.connect(g);
        g.connect(c.destination);
        o.start(t0);
        o.stop(t0 + dur + 0.03);
      } catch (e) {
      }
    }
    function noise(dur, gain) {
      var c = ac();
      if (!c) return;
      try {
        var n = Math.floor(c.sampleRate * dur);
        var buf = c.createBuffer(1, n, c.sampleRate);
        var d = buf.getChannelData(0);
        for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
        var src = c.createBufferSource();
        src.buffer = buf;
        var f = c.createBiquadFilter();
        f.type = "bandpass";
        f.frequency.value = 1500;
        f.Q.value = 0.6;
        var g = c.createGain();
        g.gain.value = vol(gain);
        src.connect(f);
        f.connect(g);
        g.connect(c.destination);
        src.start();
      } catch (e) {
      }
    }
    var buffers = {};
    var fetching = {};
    function loadAsset(name) {
      if (C.sfx === "synth") return;
      if (buffers[name] || fetching[name]) return;
      fetching[name] = true;
      try {
        fetch2("/dsh-startup/asset/" + name + ".mp3").then(function(r) {
          return r.ok ? r.arrayBuffer() : null;
        }).then(function(ab) {
          return ab ? ac().decodeAudioData(ab) : null;
        }).then(function(buf) {
          if (buf) buffers[name] = buf;
        }).catch(function() {
        });
      } catch (e) {
      }
    }
    var pending = {};
    function ensureAsset(name) {
      if (buffers[name]) return Promise.resolve(true);
      if (pending[name]) return pending[name];
      if (C.voiceSource === "tts") return Promise.resolve(false);
      pending[name] = new Promise(function(resolve) {
        try {
          fetch2("/dsh-startup/asset/" + name + ".mp3").then(function(r) {
            return r.ok ? r.arrayBuffer() : null;
          }).then(function(ab) {
            if (!ab) return null;
            return ac(true).decodeAudioData(ab);
          }).then(function(buf) {
            if (buf) {
              buffers[name] = buf;
              resolve(true);
            } else {
              resolve(false);
            }
          }).catch(function() {
            resolve(false);
          });
        } catch (e) {
          resolve(false);
        }
      });
      return pending[name];
    }
    function playAssetAndWait(name, gain) {
      return new Promise(function(resolve) {
        var c = ac(true);
        var buf = buffers[name];
        if (!c || !buf) {
          resolve(0);
          return;
        }
        try {
          var src = c.createBufferSource();
          src.buffer = buf;
          var g = c.createGain();
          g.gain.value = Math.min(1, (gain == null ? 0.85 : gain) * clamp01(C.voiceVolume, 0, 1) * 1.6);
          src.connect(g);
          g.connect(c.destination);
          src.onended = function() {
            resolve(Math.round(buf.duration * 1e3));
          };
          src.start();
        } catch (e) {
          resolve(0);
        }
      });
    }
    function playAsset(name, gain) {
      var c = ac();
      if (!c) return false;
      var buf = buffers[name];
      if (!buf) {
        loadAsset(name);
        return false;
      }
      try {
        var src = c.createBufferSource();
        src.buffer = buf;
        var g = c.createGain();
        g.gain.value = Math.min(1, (gain == null ? 0.55 : gain) * clamp01(C.soundVolume, 0, 1) * 2);
        src.connect(g);
        g.connect(c.destination);
        src.start();
        return true;
      } catch (e) {
        return false;
      }
    }
    return {
      resume: function() {
        ac();
        loadAsset("sfx-tick");
        loadAsset("sfx-ticks-run");
      },
      preload: function() {
        loadAsset("sfx-tick");
        loadAsset("sfx-ticks-run");
      },
      ensureAsset,
      playAssetAndWait,
      /* 文字渐显 / 阶段推进 / 按钮确认 —— 优先用真素材 */
      tick: function() {
        if (!playAsset("sfx-tick", 0.45)) tone(1760, 0.035, "square", 0.022);
      },
      tickRun: function() {
        playAsset("sfx-ticks-run", 0.5);
      },
      step: function() {
        if (!playAsset("sfx-tick", 0.6)) {
          tone(880, 0.05, "sine", 0.05);
          tone(1320, 0.07, "sine", 0.028, 0.045);
        }
      },
      hover: function() {
        tone(2200, 0.02, "sine", 0.018);
      },
      confirm: function() {
        tone(660, 0.09, "triangle", 0.07);
        tone(990, 0.17, "triangle", 0.055, 0.085);
      },
      sweep: function() {
        noise(0.75, 0.035);
      },
      /* 念台词之前的两声轻提示：这一笔让 TTS 从"浏览器念字"变成"系统播报" */
      cue: function() {
        tone(1046.5, 0.05, "sine", 0.028);
        tone(1568, 0.06, "sine", 0.02, 0.075);
      },
      rise: function() {
        tone(220, 1.1, "sine", 0.032, 0, 990);
      },
      chime: function() {
        tone(659.25, 0.9, "sine", 0.055);
        tone(830.61, 0.9, "sine", 0.04, 0.09);
        tone(987.77, 1.3, "sine", 0.045, 0.18);
      }
    };
  })();
  var voice = (function() {
    var supported = typeof window2 !== "undefined" && !!window2.speechSynthesis && typeof window2.SpeechSynthesisUtterance === "function";
    var voices = [];
    var picked = { en: null, zh: null };
    var meter = null;
    var saidOnce = false;
    var pending = { en: "", zh: "" };
    var NATURAL_HINTS = ["natural", "neural", "online", "premium", "enhanced", "siri", "google"];
    var FEMALE_HINTS = [
      "aria",
      "jenny",
      "michelle",
      "emma",
      "ava",
      "libby",
      "sonia",
      "maisie",
      "zira",
      "samantha",
      "karen",
      "moira",
      "tessa",
      "victoria",
      "serena",
      "allison",
      "susan",
      "fiona",
      "hazel",
      "female",
      "woman",
      "xiaoxiao",
      "xiaoyi",
      "xiaomo",
      "huihui",
      "yaoyao",
      "\u6653\u6653",
      "\u6653\u4F0A",
      "\u5973\u58F0"
    ];
    var MALE_HINTS = [
      "david",
      "mark",
      "guy",
      "ryan",
      "george",
      "daniel",
      "alex",
      "fred",
      "male",
      "yunxi",
      "yunjian",
      "kangkang"
    ];
    function score(v, want) {
      var name = String(v.name || "").toLowerCase();
      var lang = String(v.lang || "").toLowerCase();
      var sc = 0;
      for (var i = 0; i < NATURAL_HINTS.length; i++) {
        if (name.indexOf(NATURAL_HINTS[i]) !== -1) {
          sc += 60;
          break;
        }
      }
      for (var j = 0; j < FEMALE_HINTS.length; j++) {
        if (name.indexOf(FEMALE_HINTS[j]) !== -1) {
          sc += 40;
          break;
        }
      }
      for (var k = 0; k < MALE_HINTS.length; k++) {
        if (name.indexOf(MALE_HINTS[k]) !== -1) {
          sc -= 45;
          break;
        }
      }
      if (lang.indexOf(want) === 0) sc += 25;
      if (v.localService) sc += 4;
      if (v.default) sc += 3;
      return sc;
    }
    function bestFor(want) {
      if (!voices.length) return null;
      if (C.voiceName) {
        for (var i = 0; i < voices.length; i++) {
          var v = voices[i];
          if (v.name === C.voiceName && String(v.lang || "").toLowerCase().indexOf(want) === 0) return v;
        }
      }
      var pool = [];
      for (var j = 0; j < voices.length; j++) {
        if (String(voices[j].lang || "").toLowerCase().indexOf(want) === 0) pool.push(voices[j]);
      }
      if (!pool.length) pool = voices.slice();
      var best = null;
      var bs = -1e9;
      for (var n = 0; n < pool.length; n++) {
        var sc = score(pool[n], want);
        if (sc > bs) {
          bs = sc;
          best = pool[n];
        }
      }
      return best;
    }
    function setMeter(on) {
      if (meter) meter.classList.toggle("dsu-on", !!on);
    }
    function load() {
      if (!supported) return;
      try {
        voices = window2.speechSynthesis.getVoices() || [];
      } catch (e) {
        voices = [];
      }
      picked.en = bestFor("en");
      picked.zh = bestFor("zh");
    }
    function spokenName(name) {
      return String(name || "").replace(/\S+/g, function(w) {
        return /^[A-Z0-9.\-]+$/.test(w) && w.length > 1 ? w.charAt(0) + w.slice(1).toLowerCase() : w;
      });
    }
    function utter(text, lang) {
      try {
        var u = new window2.SpeechSynthesisUtterance(text);
        var v = lang.indexOf("zh") === 0 ? picked.zh : picked.en;
        if (v) {
          u.voice = v;
          u.lang = v.lang || lang;
        } else u.lang = lang;
        u.rate = clamp01(C.voiceRate, 0.5, 2);
        u.pitch = clamp01(C.voicePitch, 0, 2);
        u.volume = clamp01(C.voiceVolume, 0, 1);
        u.onstart = function() {
          setMeter(true);
        };
        u.onend = function() {
          setMeter(false);
        };
        u.onerror = function() {
          setMeter(false);
        };
        window2.speechSynthesis.speak(u);
        return true;
      } catch (e) {
        return false;
      }
    }
    function estimateMs(items) {
      var chars = 0;
      var rate = clamp01(C.voiceRate, 0.5, 2) || 1;
      for (var i = 0; i < items.length; i++) {
        var t = String(items[i].t || "");
        chars += /[\u4e00-\u9fa5]/.test(t) ? t.length * 1.7 : t.length;
      }
      return Math.round(chars / 13 * 1e3 / rate) + 460;
    }
    function buildUtter(text, lang) {
      var u = new window2.SpeechSynthesisUtterance(text);
      var v = lang.indexOf("zh") === 0 ? picked.zh : picked.en;
      if (v) {
        u.voice = v;
        u.lang = v.lang || lang;
      } else u.lang = lang;
      u.rate = clamp01(C.voiceRate, 0.5, 2);
      u.pitch = clamp01(C.voicePitch, 0, 2);
      u.volume = clamp01(C.voiceVolume, 0, 1);
      return u;
    }
    return {
      supported,
      load,
      attach: function(node) {
        meter = node;
      },
      /**
       * 念一行，返回"这一行实际花了多久(ms)"的 Promise。
       *
       * 三个关键决定：
       *  - **不 cancel 上一句**。原来每步都 cancel，用户点快一点、或者
       *    hold 短于台词长度，语音就被硬生生掐断 —— 那正是要避免的。
       *    speechSynthesis 本身是队列，不 cancel 就是顺序播报。
       *  - 提示音响过之后留 `voiceLead` 的空白再开口，这是旁白的呼吸感。
       *  - 等 `onend` 才 resolve，动画据此决定这一步停多久；个别引擎不触发
       *    onend 时按估算兜底，绝不把动画卡死。
       */
      line: function(en, zh, asset) {
        if (asset && C.voice && C.voiceSource !== "tts" && !finished) {
          return audio.ensureAsset(asset).then(function(ok) {
            if (!ok || finished) return 0;
            if (C.voiceCue !== false) audio.cue();
            return audio.playAssetAndWait(asset, 0.85).then(function(ms2) {
              if (ms2 > 0) setMeter(true);
              return ms2;
            });
          }).then(function(ms2) {
            if (ms2 > 0) {
              saidOnce = true;
              return ms2;
            }
            return ttsLine(en, zh);
          });
        }
        return ttsLine(en, zh);
      },
      /** TTS 路径：素材缺失 / voiceSource=tts / 终幕那条动态名字 */
      tts: function(en, zh) {
        return ttsLine(en, zh);
      },
      /** 不等待的版本：设置页试听 / 任何"念完就行"的场合 */
      say: function(en, zh) {
        return this.line(en, zh);
      },
      /** 浏览器要求"先有用户手势"才放声：第一次点击/按键解锁 + 补播当前行 */
      unlock: function() {
        try {
          if (supported) window2.speechSynthesis.resume();
        } catch (e) {
        }
        audio.resume();
        if (supported && !saidOnce) {
          try {
            var w = new window2.SpeechSynthesisUtterance(" ");
            w.volume = 0;
            var v = picked.en || picked.zh;
            if (v) {
              w.voice = v;
              w.lang = v.lang;
            }
            window2.speechSynthesis.speak(w);
          } catch (e) {
          }
        }
        if (!saidOnce && C.voice && (pending.en || pending.zh)) this.say(pending.en, pending.zh);
      },
      speakName: spokenName,
      current: function() {
        var a = picked.en ? picked.en.name : "";
        var b = picked.zh ? picked.zh.name : "";
        return a === b ? a : a + (b ? "  /  " + b : "");
      },
      listVoices: function() {
        return voices.slice();
      },
      /** 只有这里才真的掐断语音（跳过 / 揭幕） */
      stop: function() {
        try {
          if (supported) window2.speechSynthesis.cancel();
        } catch (e) {
        }
        setMeter(false);
      }
    };
    function ttsLine(en, zh) {
      return new Promise(function(resolve) {
        if (!supported || !C.voice || finished) {
          resolve(0);
          return;
        }
        pending = { en: en || "", zh: zh || "" };
        var items = [];
        var mode = C.voiceLang;
        if (mode === "zh") {
          if (zh) items.push({ t: zh, l: "zh-CN" });
        } else if (mode === "both") {
          if (zh) items.push({ t: zh, l: "zh-CN" });
          if (en) items.push({ t: en, l: "en-US" });
        } else if (en) {
          items.push({ t: en, l: "en-US" });
        }
        if (!items.length) {
          resolve(0);
          return;
        }
        saidOnce = true;
        if (C.voiceCue !== false) audio.cue();
        var startedAt = Date.now();
        var est = estimateMs(items);
        var lead = clamp01(C.voiceLead, 0, 1200);
        var settled = false;
        var watchdog = null;
        function settle() {
          if (settled) return;
          settled = true;
          if (watchdog) clearTimeout2(watchdog);
          setMeter(false);
          resolve(Math.max(0, Date.now() - startedAt));
        }
        setTimeout2(function() {
          if (finished) {
            settle();
            return;
          }
          var last = items.length - 1;
          for (var i = 0; i <= last; i++) {
            var u = buildUtter(items[i].t, items[i].l);
            if (i === last) {
              u.onstart = function() {
                setMeter(true);
              };
              u.onend = settle;
              u.onerror = settle;
            }
            try {
              window2.speechSynthesis.speak(u);
            } catch (e) {
              if (i === last) settle();
            }
          }
          watchdog = setTimeout2(settle, est + 900);
        }, lead);
      });
    }
  })();
  voice.attach(q(".dsu-voice"));
  (function preloadVoices() {
    if (C.voiceSource === "tts") return;
    for (var i = 0; i < STEPS.length; i++) if (STEPS[i].audio) audio.ensureAsset(STEPS[i].audio);
    audio.ensureAsset("line-6");
  })();
  (function wireSound() {
    voice.load();
    if (voice.supported && typeof window2.speechSynthesis.addEventListener === "function") {
      try {
        window2.speechSynthesis.addEventListener("voiceschanged", function() {
          voice.load();
        });
      } catch (e) {
      }
    }
    var unlocked = false;
    function unlock() {
      if (unlocked) return;
      unlocked = true;
      voice.unlock();
      document2.removeEventListener("pointerdown", unlock, true);
      document2.removeEventListener("keydown", unlock, true);
      document2.removeEventListener("touchstart", unlock, true);
    }
    document2.addEventListener("pointerdown", unlock, true);
    document2.addEventListener("keydown", unlock, true);
    document2.addEventListener("touchstart", unlock, true);
  })();
  function run() {
    return Promise.resolve().then(function() {
      return wait(820);
    }).then(function() {
      ui.blackInner.classList.add("dsu-in");
      audio.rise();
      return wait(240);
    }).then(function() {
      ui.blackEn.classList.add("dsu-tighten");
      return wait(880);
    }).then(function() {
      ui.sweep.classList.add("dsu-go");
      return wait(760);
    }).then(function() {
      ui.blackInner.classList.add("dsu-out");
      audio.sweep();
      ui.wash.style.transition = "opacity " + ms(220) + "ms linear";
      ui.wash.style.opacity = "1";
      return wait(260);
    }).then(function() {
      ui.plate.style.transition = "opacity " + ms(900) + "ms ease";
      ui.plate.style.opacity = "1";
      ui.watermark.style.transition = "opacity " + ms(1100) + "ms ease";
      ui.watermark.style.opacity = "1";
      ui.wash.style.transition = "opacity " + ms(720) + "ms cubic-bezier(.2,.9,.2,1)";
      ui.wash.style.opacity = "0";
      ui.black.style.transition = "opacity " + ms(720) + "ms ease";
      ui.black.style.opacity = "0";
      return wait(760);
    }).then(function() {
      ui.brand.classList.add("dsu-in");
      ui.foot.classList.add("dsu-in");
      ui.stepcount.classList.add("dsu-in");
      ui.idline.classList.add("dsu-in");
      ui.frame.classList.add("dsu-in");
      ui.slats.classList.add("dsu-in");
      ui.meta.classList.add("dsu-in");
      ui.vignette.classList.add("dsu-in");
      ui.voice.classList.add("dsu-in");
      setProgress(0.12);
      setStepCount(0, "BOOT");
      setSlats(0);
      setSubtitle("\u7CFB\u7EDF\u81EA\u68C0\u4E2D\u2026", "SYSTEM SELF-CHECK");
      if (C.allowSkip) ui.skip.classList.add("dsu-in");
      return wait(700);
    }).then(function() {
      ui.black.style.display = "none";
      sweep();
    }).then(function() {
      return stepLoop();
    }).then(function() {
      return finale();
    }).catch(function(err) {
      try {
        console.warn("[dsh-startup-screen] \u52A8\u753B\u5F02\u5E38\uFF0C\u76F4\u63A5\u63ED\u5E55\uFF1A", err);
      } catch (e2) {
      }
      return finish();
    });
  }
  function stepLoop() {
    var chain = Promise.resolve();
    STEPS.forEach(function(step, i) {
      chain = chain.then(function() {
        if (finished) return;
        var n = i + 1;
        if (i >= 2) ui.idline.classList.remove("dsu-in");
        setStepCount(n, step.badge);
        setSlats(n);
        setProgress(step.progress);
        setSubtitle(step.log, step.logEn);
        audio.step();
        var spoke = voice.line(step.say, step.zh, step.audio);
        ui.status.classList.toggle("dsu-zhline", true);
        ui.status.classList.remove("dsu-in");
        ui.subEn.classList.remove("dsu-in");
        void ui.status.offsetWidth;
        localizedText(ui.statusZh, step.zh, step.en, 46);
        typeIn(ui.subEn, step.en, 13);
        ui.caret.classList.toggle("dsu-on", !!step.action && step.action !== "auto");
        requestAnimationFrame(function() {
          if (finished) return;
          ui.status.classList.add("dsu-in");
          ui.subEn.classList.add("dsu-in");
        });
        ui.rule.classList.add("dsu-in");
        if (step.assembleLogo) assembleLogo();
        if (step.reticle) {
          ui.logo.classList.remove("dsu-in");
          ui.dots.hidden = true;
          ui.reticle.classList.add("dsu-in");
          sweep();
        }
        if (step.hex) startHex();
        function holdFor(spoken) {
          var target = Math.max(ms(step.hold), (spoken || 0) + ms(240));
          return wait(Math.max(0, target - (spoken || 0)));
        }
        if (step.action === "grant" || step.action === "confirm") {
          showAction(step);
          return wait(520).then(function() {
            return waitAction();
          }).then(function() {
            hideAction();
            audio.confirm();
            ui.caret.classList.remove("dsu-on");
            return spoke;
          }).then(function() {
            return wait(ms(320));
          });
        }
        if (step.hex) {
          return spoke.then(holdFor).then(function() {
            stopHex();
          });
        }
        return spoke.then(holdFor);
      });
    });
    return chain;
  }
  function assembleLogo() {
    ui.logo.classList.add("dsu-in");
    ui.dots.hidden = false;
    var path = ui.logo.querySelector("path");
    if (path && typeof path.getTotalLength === "function") {
      try {
        var len = path.getTotalLength();
        path.style.fill = "none";
        path.style.stroke = "currentColor";
        path.style.strokeWidth = "1.1";
        path.style.strokeDasharray = len;
        path.style.strokeDashoffset = len;
        path.animate(
          [{ strokeDashoffset: len }, { strokeDashoffset: 0 }],
          { duration: ms(1400), easing: "cubic-bezier(.55,.06,.24,1)", fill: "forwards" }
        );
        setTimeout2(function() {
          path.style.transition = "fill " + ms(420) + "ms ease, stroke-width " + ms(420) + "ms ease";
          path.style.fill = "";
          path.style.strokeWidth = "0";
        }, ms(1450));
      } catch (err) {
      }
    }
    return wait(300);
  }
  function showAction(step) {
    localizedText(ui.btnZh, step.btnZh, step.btnEn);
    ui.btnEn.textContent = step.btnEn;
    ui.card.hidden = step.action !== "confirm";
    if (step.action === "confirm") {
      ui.card.innerHTML = "";
      var rows = [
        ["\u8EAB\u4EFD\u540D\u79F0", C.identity, true, "IDENTITY NAME"],
        ["\u8EAB\u4EFD\u7F16\u53F7", C.identityId, false, "IDENTITY ID"],
        ["\u6743\u9650\u7B49\u7EA7", C.accessLevel, false, "ACCESS LEVEL"]
      ];
      rows.forEach(function(r) {
        var row = el("div", "dsu-card-row");
        var label = el("span");
        localizedText(label, r[0], r[3]);
        row.appendChild(label);
        row.appendChild(el("b", r[2] ? "dsu-zhname" : null, r[1]));
        ui.card.appendChild(row);
      });
    }
    localizedText(ui.hint, "\u6309 <kbd>Enter</kbd> / <kbd>Space</kbd>\uFF0C\u6216\u70B9\u51FB\u6309\u94AE\u7EE7\u7EED", "Press <kbd>Enter</kbd> / <kbd>Space</kbd>, or click to continue", void 0, true);
    ui.action.classList.add("dsu-in");
    ui.btn.classList.add("dsu-pulse");
  }
  function hideAction() {
    ui.action.classList.remove("dsu-in");
    ui.btn.classList.remove("dsu-pulse");
  }
  function finale() {
    if (finished) return Promise.resolve();
    setStepCount(6, "WELCOME");
    setSlats(6);
    setProgress(1);
    setSubtitle("\u8EAB\u4EFD\u9A8C\u8BC1\u5B8C\u6210\uFF0C\u4F1A\u8BDD\u5DF2\u5EFA\u7ACB", "IDENTITY VERIFIED \xB7 SESSION ESTABLISHED");
    audio.chime();
    var welcome = voice.line(null, null, "line-6");
    ui.status.classList.remove("dsu-in");
    ui.subEn.classList.remove("dsu-in");
    ui.rule.classList.remove("dsu-in");
    ui.reticle.classList.remove("dsu-in");
    stopHex();
    ui.center.classList.add("dsu-off");
    ui.dots.hidden = true;
    return wait(360).then(function() {
      ui.welcome.classList.add("dsu-in");
      ui.idline.classList.remove("dsu-in");
      return wait(420);
    }).then(function() {
      var targets = [ui.w1, ui.w2, ui.w4];
      targets.forEach(function(t) {
        t.classList.add("dsu-glitch");
        t.setAttribute("data-text", t.textContent);
      });
      ui.w2.classList.add("dsu-glitch-box");
      void ui.welcome.offsetWidth;
      targets.forEach(function(t) {
        t.classList.add("dsu-on");
      });
      return wait(640);
    }).then(function() {
      root.classList.add("dsu-peak");
      ui.bloom.classList.add("dsu-go");
      ui.streak.classList.add("dsu-go");
      return wait(430);
    }).then(function() {
      ui.flash.style.transition = "opacity " + ms(70) + "ms linear";
      ui.flash.style.opacity = "0.72";
      return wait(90);
    }).then(function() {
      ui.flash.style.transition = "opacity " + ms(340) + "ms cubic-bezier(0.4, 0, 0.2, 1)";
      ui.flash.style.opacity = "0";
      return wait(320);
    }).then(function() {
      return welcome;
    }).then(function() {
      root.classList.add("dsu-handoff");
      return wait(780);
    }).then(function() {
      return finish();
    });
  }
  function finish() {
    if (finished) return;
    finished = true;
    releaseAll();
    stopHex();
    voice.stop();
    if (clockTimer) {
      clearInterval2(clockTimer);
      clockTimer = null;
    }
    try {
      if (C.mode === "session") window2.sessionStorage.setItem("dsh-startup-screen:shown", "1");
      if (C.mode === "daily") {
        window2.localStorage.setItem("dsh-startup-screen:day", (/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
      }
    } catch (err) {
    }
    document2.documentElement.classList.remove("dsu-lock");
    document2.documentElement.style.overflow = "";
    if (document2.body) document2.body.style.overflow = "";
    root.classList.remove("dsu-boot");
    root.classList.add("dsu-gone");
    setTimeout2(function() {
      if (root && root.parentNode) root.parentNode.removeChild(root);
      try {
        window2.dispatchEvent(new CustomEvent("dsh-startup:done"));
      } catch (err) {
      }
    }, ms(900));
  }
  function requestSkip() {
    if (skipped || finished) return;
    skipped = true;
    releaseAll();
    finish();
  }
  if (C.allowSkip && ui.skip) {
    ui.skip.hidden = false;
    ui.skip.addEventListener("click", function(e) {
      e.stopPropagation();
      requestSkip();
    });
    document2.addEventListener("keydown", function(e) {
      if (e.key === "Escape") requestSkip();
    });
  } else if (ui.skip) {
    ui.skip.hidden = true;
  }
  window2.__DSH_STARTUP_API__ = {
    /* 设置页试听与冒烟测试用：直接念一行 */
    speak: function(en, zh) {
      voice.say(en, zh);
    },
    speakName: function(n) {
      return voice.speakName(n);
    },
    get voice() {
      return voice.current();
    },
    replay: injectSelf,
    skip: requestSkip,
    finish,
    config: C
  };
  document2.documentElement.classList.add("dsu-lock");
  document2.documentElement.style.overflow = "hidden";
  if (document2.body) document2.body.style.overflow = "hidden";
  setProgress(0.05);
  root.classList.remove("dsu-boot");
  function refreshLocale() {
    root.lang = translate2("zh-CN", "en");
    localizedBindings.forEach(function(render) {
      render();
    });
  }
  root.lang = translate2("zh-CN", "en");
  environment.subscribeLocale?.(refreshLocale);
  if (document2.readyState === "loading") {
    document2.addEventListener("DOMContentLoaded", function() {
      run();
    });
  } else {
    run();
  }
}

// src/host-locale.js
var stores = /* @__PURE__ */ new WeakMap();
var serviceListeners = /* @__PURE__ */ new Set();
var service = null;
function language(value) {
  return /^zh(?:-|$)/i.test(String(value || "")) ? "zh" : value ? "en" : null;
}
function readHostLocale(doc = globalThis.document) {
  try {
    const active = language(service?.getSnapshot?.().active);
    if (active) return active;
  } catch {
  }
  return language(doc?.documentElement?.lang) || "zh";
}
function bindHostLocale(next) {
  if (!next || typeof next.getSnapshot !== "function" || typeof next.subscribe !== "function")
    return () => {
    };
  const previous = service;
  service = next;
  const refresh = () => {
    for (const listener of [...serviceListeners]) listener();
  };
  const unsubscribe = next.subscribe(refresh);
  refresh();
  let disposed = false;
  return () => {
    if (disposed) return;
    disposed = true;
    unsubscribe?.();
    if (service === next) {
      service = previous;
      refresh();
    }
  };
}
function getHostLocaleStore(doc = globalThis.document) {
  if (!doc || typeof doc !== "object") return fallbackStore;
  let store = stores.get(doc);
  if (store) return store;
  const listeners = /* @__PURE__ */ new Set();
  let snapshot = readHostLocale(doc), observer;
  const refresh = () => {
    const next = readHostLocale(doc);
    if (snapshot === next) return;
    snapshot = next;
    for (const listener of [...listeners]) listener();
  };
  store = Object.freeze({
    getSnapshot: () => readHostLocale(doc),
    subscribe(listener) {
      listeners.add(listener);
      if (listeners.size === 1) {
        snapshot = readHostLocale(doc);
        serviceListeners.add(refresh);
        const Observer = doc.defaultView?.MutationObserver;
        if (typeof Observer === "function" && doc.documentElement) {
          observer = new Observer(refresh);
          observer.observe(doc.documentElement, { attributes: true, attributeFilter: ["lang"] });
        }
      }
      let disposed = false;
      return () => {
        if (disposed) return;
        disposed = true;
        listeners.delete(listener);
        if (!listeners.size) {
          serviceListeners.delete(refresh);
          observer?.disconnect();
          observer = null;
        }
      };
    }
  });
  stores.set(doc, store);
  return store;
}
function subscribeHostLocale(listener, doc = globalThis.document) {
  return getHostLocaleStore(doc).subscribe(listener);
}
var fallbackStore = Object.freeze({
  getSnapshot: () => readHostLocale(),
  subscribe: () => () => {
  }
});

// src/i18n.js
function translate(zh, en) {
  return readHostLocale() === "en" ? en : zh;
}
var BUILTIN_NAMES = Object.freeze({
  brand: "Beginning",
  cyberpunk: "Digital Life",
  awakening: "Punk",
  startup: "Half Face",
  "whale-girl": "Whale Girl",
  "deepseek-title": "DeepSeek",
  "deepseek-dance": "Dance",
  "deepseek-sea": "Sea",
  "startup-screen": "Rhine Lab",
  silver: "Distant Mountains",
  gold: "Black and Gold",
  ice: "Blue Mist",
  "assassins-creed": "Assassin\u2019s Creed",
  "cyberpunk-2077": "Cyberpunk 2077",
  gta6: "GTA6",
  horizon6: "Forza Horizon 6",
  horizon5: "Forza Horizon 5",
  horizon4: "Forza Horizon 4",
  classic: "Classic"
});
function localizedName(item) {
  if (!item) return "";
  const builtin = item.source === "builtin" || !item.source && Object.hasOwn(BUILTIN_NAMES, item.id);
  return readHostLocale() === "en" && builtin ? BUILTIN_NAMES[item.id] || item.name : item.name;
}
var MESSAGES = Object.freeze({
  "\u8BBE\u7F6E\u5DF2\u4FDD\u5B58\uFF0C\u4E0B\u6B21\u542F\u52A8\u751F\u6548": "Settings saved. Changes take effect on the next launch.",
  "\u5DF2\u6062\u590D\u9ED8\u8BA4\uFF0C\u5168\u90E8\u4E0A\u4F20\u7684\u89C6\u9891\u548C\u56FE\u7247\u5DF2\u5220\u9664\u3002": "Defaults restored. All uploaded videos and images have been deleted.",
  \u89C6\u9891\u5DF2\u79FB\u9664: "Video removed.",
  \u7ED3\u675F\u753B\u9762\u5DF2\u79FB\u9664: "End screen removed.",
  "\u8BF7\u9009\u62E9\u4E0D\u8D85\u8FC720 MB\u7684PNG\u3001JPEG\u6216WebP\u56FE\u7247\u3002": "Choose a PNG, JPEG or WebP image up to 20 MB.",
  "\u6B63\u5728\u68C0\u67E5\u7ED3\u675F\u753B\u9762\u2026": "Checking the end screen\u2026",
  "\u65E0\u6CD5\u8BFB\u53D6\u8FD9\u5F20\u56FE\u7247\uFF0C\u8BF7\u66F4\u6362\u6709\u6548\u7684PNG\u3001JPEG\u6216WebP\u3002": "Could not read this image. Choose a valid PNG, JPEG or WebP image.",
  \u4E0A\u4F20\u5931\u8D25: "Upload failed.",
  \u56FE\u7247\u5DF2\u4E0A\u4F20\u5E76\u8BBE\u4E3A\u7ED3\u675F\u753B\u9762: "Image uploaded and set as the end screen.",
  "\u56FE\u7247\u4E0A\u4F20\u4E2D\u65AD\uFF0C\u8BF7\u91CD\u8BD5\u3002": "The image upload was interrupted. Please try again.",
  "\u6B63\u5728\u4E0A\u4F20\u56FE\u7247\u2026": "Uploading the image\u2026",
  "\u8BF7\u9009\u62E9 MP4\u3001M4V \u6216 WebM \u89C6\u9891\u3002\u63A8\u8350 MP4\uFF08H.264 / AAC\uFF09\u3002": "Choose an MP4, M4V or WebM video. MP4 (H.264 / AAC) is recommended.",
  "\u89C6\u9891\u5E94\u5927\u4E8E 0 \u5B57\u8282\uFF0C\u4E14\u4E0D\u8D85\u8FC7 200 MB\u3002": "The video must be larger than 0 bytes and no larger than 200 MB.",
  "\u6B63\u5728\u68C0\u67E5\u89C6\u9891\u2026": "Checking the video\u2026",
  "\u6D4F\u89C8\u5668\u65E0\u6CD5\u8BFB\u53D6\u6B64\u89C6\u9891\u3002\u8BF7\u8F6C\u6362\u4E3A MP4\uFF08H.264 / AAC\uFF09\u540E\u91CD\u8BD5\u3002": "The browser could not read this video. Convert it to MP4 (H.264 / AAC) and try again.",
  \u89C6\u9891\u5DF2\u5BFC\u5165\u5E76\u8BBE\u4E3A\u5F00\u673A\u52A8\u753B: "Video imported and set as the startup animation.",
  "\u4E0A\u4F20\u4E2D\u65AD\uFF0C\u8BF7\u91CD\u8BD5\u3002": "The upload was interrupted. Please try again.",
  "\u6B63\u5728\u4E0A\u4F20\u2026": "Uploading\u2026",
  "\u8BBE\u7F6E\u5FC5\u987B\u662F JSON \u5BF9\u8C61\u3002": "Settings must be a JSON object.",
  "\u5DF2\u53D6\u6D88\u64AD\u653E\u65F6\u957F\u8BBE\u7F6E\uFF0C\u52A8\u753B\u6309\u539F\u59CB\u957F\u5EA6\u5B8C\u6574\u64AD\u653E\u3002": "Playback duration settings have been removed. Animations play at their full original length.",
  "\u5DF2\u53D6\u6D88\u753B\u9762\u663E\u793A\u8BBE\u7F6E\uFF0C\u5F00\u673A\u52A8\u753B\u59CB\u7EC8\u94FA\u6EE1\u5F53\u524D\u7A97\u53E3\u3002": "Display settings have been removed. Startup animations always fill the current window.",
  "\u66F4\u65B0\u63D0\u9192\u4F7F\u7528\u7EDF\u4E00\u5916\u89C2\uFF0C\u5DF2\u53D6\u6D88\u5355\u72EC\u8C03\u8282\u3002": "Update prompts use the shared appearance and no longer have separate controls.",
  "\u97F3\u91CF\u987B\u5728 0 \u5230 1 \u4E4B\u95F4\u3002": "Volume must be between 0 and 1.",
  "\u6240\u9009\u52A8\u753B\u4E0D\u5B58\u5728\uFF0C\u8BF7\u5237\u65B0\u7247\u5E93\u3002": "The selected animation is unavailable. Refresh the library.",
  "\u7ED3\u675F\u5C01\u9762\u987B\u4E3A logo \u6216 image\u3002": "The end cover must be logo or image.",
  "\u6240\u9009\u5C01\u9762\u56FE\u7247\u4E0D\u5B58\u5728\uFF0C\u8BF7\u91CD\u65B0\u4E0A\u4F20\u3002": "The selected cover image is unavailable. Upload it again.",
  "\u4E0D\u652F\u6301\u6B64\u7ED3\u675F\u753B\u9762\u3002": "This end screen is not supported.",
  "\u5C01\u9762\u9002\u914D\u987B\u4E3A cover \u6216 contain\u3002": "Cover fit must be cover or contain.",
  "\u8BF7\u5148\u4E0A\u4F20\u4E00\u5F20\u7ED3\u675F\u5C01\u9762\u56FE\u7247\u3002": "Upload an end cover image first.",
  "\u5199\u5165\u8BF7\u6C42\u7F3A\u5C11\u63D2\u4EF6\u6807\u8BC6\u3002": "The write request is missing the plugin identifier.",
  "\u65E0\u6548\u6765\u6E90\u3002": "Invalid request origin.",
  "\u4E0D\u5141\u8BB8\u8DE8\u7AD9\u4FEE\u6539\u8BBE\u7F6E\u3002": "Settings cannot be changed from another site.",
  "\u8BF7\u4F7F\u7528 application/json\u3002": "Use application/json.",
  "\u8BBE\u7F6E\u5185\u5BB9\u8FC7\u5927\u3002": "The settings payload is too large.",
  "JSON \u683C\u5F0F\u4E0D\u6B63\u786E\u3002": "Invalid JSON format.",
  "\u6587\u4EF6\u4E0A\u4F20\u5DF2\u4E2D\u65AD\u3002": "The upload was interrupted.",
  "\u4E0A\u4F20\u7B49\u5F85\u8D85\u65F6\uFF0C\u8BF7\u91CD\u8BD5\u3002": "The upload timed out. Please try again.",
  "\u8BF7\u6C42\u5185\u5BB9\u8D85\u8FC7\u5927\u5C0F\u9650\u5236\u3002": "The request exceeds the size limit.",
  "\u65E0\u6548\u7684\u89C6\u9891\u5B57\u8282\u8303\u56F4\u3002": "Invalid video byte range.",
  "\u8BBE\u7F6E\u6587\u4EF6\u65E0\u6CD5\u8BFB\u53D6\u3002\u8BF7\u5907\u4EFD\u5E76\u68C0\u67E5 boot-studio/settings.json\u3002": "Could not read the settings file. Back up and check boot-studio/settings.json.",
  "\u8BBE\u7F6E\u6587\u4EF6\u7248\u672C\u6216\u7247\u5E93\u683C\u5F0F\u4E0D\u6B63\u786E\u3002": "The settings file version or library format is invalid.",
  "\u7ED3\u675F\u5C01\u9762\u7247\u5E93\u683C\u5F0F\u4E0D\u6B63\u786E\u3002": "The end cover library format is invalid.",
  "\u5DF2\u4FDD\u5B58\u7684\u8BBE\u7F6E\u683C\u5F0F\u4E0D\u6B63\u786E\uFF0C\u8BF7\u5907\u4EFD\u5E76\u68C0\u67E5 settings.json\u3002": "The saved settings are invalid. Back up and check settings.json.",
  "\u91CD\u7F6E\u6E05\u7406\u8DEF\u5F84\u8D85\u51FA\u6570\u636E\u76EE\u5F55\u3002": "The reset cleanup path is outside the data directory.",
  "\u5185\u7F6E\u7D20\u6750\u76EE\u5F55\u4E0E\u81EA\u5B9A\u4E49\u6570\u636E\u6E05\u7406\u8303\u56F4\u91CD\u53E0\uFF0C\u672A\u4FEE\u6539\u8BBE\u7F6E\u6216\u7D20\u6750\u3002": "Built-in assets overlap the custom data cleanup path. Settings and assets were left unchanged.",
  "\u91CD\u7F6E\u9694\u79BB\u76EE\u5F55\u4E0D\u662F\u5B89\u5168\u7684\u672C\u5730\u6587\u4EF6\u5939\uFF0C\u672A\u4FEE\u6539\u8BBE\u7F6E\u6216\u7D20\u6750\u3002": "The reset quarantine directory is not a safe local folder. Settings and assets were left unchanged.",
  "\u91CD\u7F6E\u9694\u79BB\u76EE\u5F55\u8D85\u51FA\u6570\u636E\u76EE\u5F55\uFF0C\u672A\u4FEE\u6539\u8BBE\u7F6E\u6216\u7D20\u6750\u3002": "The reset quarantine directory is outside the data directory. Settings and assets were left unchanged.",
  "\u6587\u4EF6\u540D\u7F16\u7801\u65E0\u6548\u3002": "Invalid filename encoding.",
  "\u652F\u6301 PNG\u3001JPEG \u548C WebP \u56FE\u7247\uFF0C\u4E0D\u63A5\u53D7 SVG\u3002": "PNG, JPEG and WebP images are supported. SVG is not supported.",
  "\u652F\u6301 MP4\u3001M4V \u548C WebM \u89C6\u9891\u3002": "MP4, M4V and WebM videos are supported.",
  "\u56FE\u7247\u683C\u5F0F\u65E0\u6548\uFF0C\u8BF7\u4E0A\u4F20 PNG\u3001JPEG \u6216 WebP \u56FE\u7247\u3002": "Invalid image format. Upload a PNG, JPEG or WebP image.",
  "\u6587\u4EF6\u4E0D\u662F\u6709\u6548\u7684 MP4 / WebM \u5BB9\u5668\u3002\u8BF7\u4F18\u5148\u4F7F\u7528 H.264 + AAC \u7684 MP4\u3002": "The file is not a valid MP4 / WebM container. An MP4 with H.264 + AAC is recommended.",
  "\u5C01\u9762\u56FE\u7247\u4E0D\u5B58\u5728\u6216\u6587\u4EF6\u5DF2\u88AB\u79FB\u8D70\u3002": "The cover image is unavailable or its file has been moved.",
  "\u52A8\u753B\u4E0D\u5B58\u5728\u6216\u6587\u4EF6\u5DF2\u88AB\u79FB\u8D70\u3002": "The animation is unavailable or its file has been moved.",
  "\u63A5\u53E3\u4E0D\u5B58\u5728\u3002": "This endpoint does not exist.",
  "\u8BF7\u5148\u68C0\u67E5\u5E76\u9009\u62E9\u66F4\u65B0\u7248\u672C\u3002": "Check for updates and select a version first.",
  "\u66F4\u65B0\u5305\u51C6\u5907\u5931\u8D25\u3002": "Could not prepare the update package.",
  "\u52A8\u753B\u4E0D\u5B58\u5728\u3002": "The animation does not exist.",
  "\u5C01\u9762\u56FE\u7247\u4E0D\u5B58\u5728\u3002": "The cover image does not exist.",
  "\u5185\u7F6E\u7ED3\u675F\u5C01\u9762\u4E0D\u5B58\u5728\u3002": "The built-in end cover does not exist.",
  "\u4E0D\u652F\u6301\u6B64\u8BF7\u6C42\u65B9\u6CD5\u3002": "This request method is not supported.",
  "\u8BF7\u5148\u786E\u8BA4\u5220\u9664\u5168\u90E8\u81EA\u5B9A\u4E49\u89C6\u9891\u3001\u56FE\u7247\u548C\u504F\u597D\u3002": "Confirm deletion of all custom videos, images and preferences first.",
  "\u53EA\u80FD\u5220\u9664\u81EA\u5DF1\u4E0A\u4F20\u7684\u5C01\u9762\u56FE\u7247\u3002": "Only uploaded cover images can be deleted.",
  "\u53EA\u80FD\u5220\u9664\u81EA\u5DF1\u4E0A\u4F20\u7684\u52A8\u753B\u3002": "Only uploaded animations can be deleted.",
  "\u6587\u4EF6\u64CD\u4F5C\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u6570\u636E\u76EE\u5F55\u6743\u9650\u548C\u53EF\u7528\u7A7A\u95F4\u3002": "The file operation failed. Check data directory permissions and available space.",
  "\u66F4\u65B0\u5305\u4E0B\u8F7D\u8D85\u8FC7 15 \u5206\u949F\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC\u540E\u91CD\u8BD5\u3002": "The update download exceeded 15 minutes. Check your connection and try again.",
  "\u8FDE\u63A5\u66F4\u65B0\u4E0B\u8F7D\u670D\u52A1\u8D85\u65F6\u3002": "The update download connection timed out.",
  "\u66F4\u65B0\u5305\u4E0B\u8F7D\u957F\u65F6\u95F4\u6CA1\u6709\u8FDB\u5C55\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC\u540E\u91CD\u8BD5\u3002": "The update download has stalled. Check your connection and try again.",
  "npm \u66F4\u65B0\u8BF7\u6C42\u79BB\u5F00\u4E86\u5141\u8BB8\u7684\u6CE8\u518C\u8868\u3002": "The npm update request left the allowed registries.",
  "\u8FDE\u63A5 npm \u6CE8\u518C\u8868\u8D85\u65F6\u3002": "The npm registry connection timed out.",
  "\u65E0\u6CD5\u8FDE\u63A5 npm \u6CE8\u518C\u8868\u3002": "Could not connect to the npm registry.",
  "npm \u6CE8\u518C\u8868\u8FD4\u56DE\u4E86\u65E0\u6548\u8DF3\u8F6C\u3002": "The npm registry returned an invalid redirect.",
  "npm \u6CE8\u518C\u8868\u8DF3\u8F6C\u6B21\u6570\u8FC7\u591A\u3002": "The npm registry returned too many redirects.",
  "\u8BFB\u53D6 npm \u6CE8\u518C\u8868\u5185\u5BB9\u5931\u8D25\u3002": "Could not read the npm registry response.",
  "npm \u66F4\u65B0\u5305\u6807\u8BC6\u4E0E\u5F53\u524D\u63D2\u4EF6\u4E0D\u4E00\u81F4\u3002": "The npm package identifier does not match this plugin.",
  "npm \u66F4\u65B0\u5305\u7684\u4ED3\u5E93\u6807\u8BC6\u4E0D\u5C5E\u4E8E\u672C\u9879\u76EE\u3002": "The npm package repository does not belong to this project.",
  "\u4E0D\u652F\u6301\u7684 npm \u6CE8\u518C\u8868\u3002": "This npm registry is not supported.",
  "npm \u66F4\u65B0\u5305\u5730\u5740\u4E0D\u5C5E\u4E8E\u5141\u8BB8\u7684\u6CE8\u518C\u8868\u548C\u7248\u672C\u3002": "The npm package URL does not match an allowed registry and version.",
  "npm \u66F4\u65B0\u5305\u7F3A\u5C11\u6709\u6548\u7684 SHA-512 \u5B8C\u6574\u6027\u4FE1\u606F\u3002": "The npm package is missing valid SHA-512 integrity information.",
  "npm \u66F4\u65B0\u5305 SHA-512 \u6821\u9A8C\u5931\u8D25\uFF0C\u672A\u6267\u884C\u66F4\u65B0\u3002": "The npm package failed SHA-512 verification. The update was not applied.",
  "\u7EF4\u62A4\u7248\u672C\u5FC5\u987B\u4F7F\u7528 X.Y.Z \u7A33\u5B9A\u7248\u672C\u53F7\u3002": "Release versions must use a stable X.Y.Z version number.",
  "\u7248\u672C\u53F7\u8FC7\u5927\u3002": "The version number is too large.",
  "\u7EF4\u62A4\u6E05\u5355\u683C\u5F0F\u4E0D\u6B63\u786E\u3002": "The update manifest format is invalid.",
  "\u66F4\u65B0\u5305\u6807\u8BC6\u4E0E\u5F53\u524D\u63D2\u4EF6\u4E0D\u4E00\u81F4\u3002": "The update package identifier does not match this plugin.",
  "\u66F4\u65B0\u63D0\u4EA4\u6216 SHA-256 \u65E0\u6548\u3002": "The update commit or SHA-256 is invalid.",
  "\u66F4\u65B0\u5305\u5927\u5C0F\u8D85\u51FA\u9650\u5236\u3002": "The update package exceeds the size limit.",
  "\u7EF4\u62A4\u6E05\u5355\u7F3A\u5C11\u53D1\u5E03\u65F6\u95F4\u6216\u91CD\u542F\u58F0\u660E\u3002": "The update manifest is missing its publication time or restart declaration.",
  "\u53EA\u63A5\u53D7\u672C\u9879\u76EE\u56FA\u5B9A\u7248\u672C\u7684 GitHub Release \u66F4\u65B0\u5305\u3002": "Only versioned GitHub Release packages from this project are accepted.",
  "\u66F4\u65B0\u5305 TAR \u6821\u9A8C\u5931\u8D25\u3002": "The update package failed TAR verification.",
  "\u66F4\u65B0\u5305 TAR \u957F\u5EA6\u65E0\u6548\u3002": "The update package TAR length is invalid.",
  "\u66F4\u65B0\u5305\u5185\u5BB9\u4E0D\u5B8C\u6574\u3002": "The update package is incomplete.",
  "\u66F4\u65B0\u5305\u6269\u5C55\u5934\u65E0\u6548\u3002": "The update package extension header is invalid.",
  "\u66F4\u65B0\u5305\u6269\u5C55\u5934\u957F\u5EA6\u65E0\u6548\u3002": "The update package extension header length is invalid.",
  "\u66F4\u65B0\u5305\u542B\u91CD\u590D package.json\uFF0C\u672A\u6267\u884C\u66F4\u65B0\u3002": "The update package contains duplicate package.json entries. The update was not applied.",
  "\u66F4\u65B0\u5305 package.json \u65E0\u6548\u3002": "The update package package.json is invalid.",
  "\u66F4\u65B0\u5305\u5305\u542B\u8FC7\u591A TAR \u6761\u76EE\uFF0C\u672A\u6267\u884C\u66F4\u65B0\u3002": "The update package contains too many TAR entries. The update was not applied.",
  "\u66F4\u65B0\u5305\u4E2D\u6CA1\u6709 package/package.json\u3002": "The update package is missing package/package.json.",
  "\u7EF4\u62A4\u6587\u4EF6\u8BFB\u53D6\u5DF2\u4E2D\u65AD\u3002": "Reading the update file was interrupted.",
  "\u7EF4\u62A4\u6587\u4EF6\u8D85\u8FC7\u5141\u8BB8\u5927\u5C0F\u3002": "The update file exceeds the size limit.",
  "\u7EF4\u62A4\u6587\u4EF6\u5185\u5BB9\u4E3A\u7A7A\u3002": "The update file is empty.",
  "\u66F4\u65B0\u5305\u672A\u5B8C\u6574\u4E0B\u8F7D\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC\u540E\u91CD\u8BD5\u3002": "The update download is incomplete. Check your connection and try again.",
  "npm \u7248\u672C\u5C1A\u672A\u53D1\u5E03\uFF0C\u5F53\u524D\u7248\u672C\u53EF\u4EE5\u7EE7\u7EED\u4F7F\u7528\u3002": "The npm version is not published yet. You can keep using the current version.",
  "\u6709\u65B0\u7248\u672C\u53EF\u7528\u3002": "A new version is available.",
  "\u5F53\u524D\u5DF2\u662F\u6700\u65B0\u7248\u672C\u3002": "You are up to date.",
  "\u7EF4\u62A4\u901A\u9053\u5C1A\u672A\u53D1\u5E03\uFF0C\u5F53\u524D\u7248\u672C\u53EF\u4EE5\u7EE7\u7EED\u4F7F\u7528\u3002": "The update channel is not published yet. You can keep using the current version.",
  "\u8FDE\u63A5\u7EF4\u62A4\u901A\u9053\u8D85\u65F6\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002": "The update channel connection timed out. Please try again later.",
  "\u53E6\u4E00\u4E2A\u7248\u672C\u6B63\u5728\u51C6\u5907\uFF0C\u8BF7\u7A0D\u540E\u91CD\u65B0\u68C0\u67E5\u3002": "Another version is being prepared. Check again later.",
  "\u66F4\u65B0\u7248\u672C\u5DF2\u53D8\u5316\u6216\u5C1A\u672A\u53D1\u5E03\uFF0C\u8BF7\u91CD\u65B0\u68C0\u67E5\u66F4\u65B0\u3002": "The update version has changed or is not published yet. Check for updates again.",
  "\u66F4\u65B0\u5305 SHA-256 \u6216\u5927\u5C0F\u6821\u9A8C\u5931\u8D25\uFF0C\u672A\u6267\u884C\u66F4\u65B0\u3002": "The update package failed SHA-256 or size verification. The update was not applied.",
  "\u66F4\u65B0\u5305\u7684\u540D\u79F0\u3001\u7248\u672C\u6216\u63D2\u4EF6\u58F0\u660E\u4E0D\u5339\u914D\u3002": "The update package name, version or plugin declaration does not match.",
  "\u66F4\u65B0\u5305\u4E2D\u7684\u4F5C\u8005\u8BF4\u660E\u4E0E\u672C\u6B21\u68C0\u67E5\u7ED3\u679C\u4E0D\u4E00\u81F4\uFF0C\u8BF7\u91CD\u65B0\u68C0\u67E5\u66F4\u65B0\u3002": "The update package release notes do not match the checked version. Check for updates again.",
  "\u7EF4\u62A4\u5305\u5305\u542B\u5B89\u88C5\u811A\u672C\uFF0C\u8BF7\u901A\u8FC7 Harness \u63D2\u4EF6\u7BA1\u7406\u5668\u4EBA\u5DE5\u68C0\u67E5\u3002": "The update package contains installation scripts. Review it in the Harness plugin manager.",
  "npm \u66F4\u65B0\u5305\u5FC5\u987B\u5C5E\u4E8E\u672C\u9879\u76EE\u4E14\u4E0D\u542B\u8FD0\u884C\u4F9D\u8D56\u3002": "The npm update package must belong to this project and contain no runtime dependencies.",
  "\u66F4\u65B0\u5305\u51C6\u5907\u7ED3\u679C\u65E0\u6548\uFF0C\u672A\u8BF7\u6C42\u5B89\u88C5\u3002": "The prepared update is invalid. Installation was not requested.",
  "\u66F4\u65B0\u5305\u8DEF\u5F84\u4E0E\u5DF2\u6821\u9A8C\u7684\u540D\u79F0\u3001\u7248\u672C\u6216 SHA-256 \u4E0D\u4E00\u81F4\uFF0C\u672A\u8BF7\u6C42\u5B89\u88C5\u3002": "The update path does not match the verified name, version or SHA-256. Installation was not requested.",
  "\u66F4\u65B0\u5305\u8DEF\u5F84\u6216\u7248\u672C\u65E0\u6548\uFF0C\u672A\u8BF7\u6C42\u5B89\u88C5\u3002": "The update path or version is invalid. Installation was not requested.",
  "\u5F53\u524D\u8FDE\u63A5\u6CA1\u6709\u7BA1\u7406\u63D2\u4EF6\u7684\u6743\u9650\uFF0C\u8BF7\u4F7F\u7528 Harness \u4E3B\u7A97\u53E3\u7684\u62E5\u6709\u8005\u8FDE\u63A5\u3002": "This connection cannot manage plugins. Use the owner connection in the main Harness window.",
  "Harness \u672A\u63A5\u53D7\u66F4\u65B0\u8BF7\u6C42\uFF0C\u8BF7\u5728\u63D2\u4EF6\u7BA1\u7406\u4E2D\u67E5\u770B\u8BE6\u60C5\u3002": "Harness did not accept the update request. See the plugin manager for details.",
  "\u66F4\u65B0\u672A\u5B8C\u6210\uFF0C\u8BF7\u5728\u63D2\u4EF6\u7BA1\u7406\u4E2D\u67E5\u770B\u8BE6\u60C5\u3002": "The update did not complete. See the plugin manager for details.",
  "Harness \u8FD4\u56DE\u7684\u7248\u672C\u4E0E\u66F4\u65B0\u76EE\u6807\u4E0D\u4E00\u81F4\uFF0C\u8BF7\u67E5\u770B\u63D2\u4EF6\u7BA1\u7406\u3002": "The version returned by Harness does not match the update target. Check the plugin manager.",
  "\u66F4\u65B0\u54CD\u5E94\u8D85\u65F6\u3002\u8BF7\u5728\u63D2\u4EF6\u7BA1\u7406\u4E2D\u6838\u5BF9\u5B9E\u9645\u7248\u672C\u540E\u91CD\u8BD5\u3002": "The update response timed out. Check the installed version in the plugin manager before retrying.",
  "\u66F4\u65B0\u7248\u672C\u65E0\u6548\u6216\u5C1A\u672A\u516C\u5F00\uFF0C\u8BF7\u91CD\u65B0\u68C0\u67E5\u66F4\u65B0\u3002": "The update version is invalid or not public yet. Check for updates again.",
  "\u66F4\u65B0\u5DF2\u53D6\u6D88\uFF1A\u63D2\u4EF6\u5DF2\u505C\u7528\u6216\u5378\u8F7D\uFF0C\u672A\u8BF7\u6C42\u5B89\u88C5\u3002": "The update was canceled because the plugin was disabled or uninstalled. Installation was not requested.",
  "\u6682\u65F6\u65E0\u6CD5\u6062\u590D\u9ED8\u8BA4\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002": "Could not restore defaults. Please try again later.",
  "\u6062\u590D\u9ED8\u8BA4\u672A\u5B8C\u6210\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002": "Restoring defaults did not complete. Please try again later.",
  "\u6682\u65F6\u65E0\u6CD5\u68C0\u67E5\u66F4\u65B0\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002": "Could not check for updates. Please try again later.",
  "\u66F4\u65B0\u672A\u5B8C\u6210\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002": "The update did not complete. Please try again later.",
  "\u53D1\u5E03\u524D\u8BF7\u5148\u8BE2\u95EE\u4F5C\u8005\u5E76\u586B\u5199\u672C\u7248\u672C\u7ED9\u7528\u6237\u5C55\u793A\u7684\u66F4\u65B0\u8BF4\u660E\u3002": "Ask the author for this version\u2019s release notes before publishing.",
  "\u66F4\u65B0\u8BF4\u660E\u987B\u5305\u542B\u4E14\u4EC5\u5305\u542B version \u548C notes\u3002": "Release notes must contain only version and notes.",
  "\u4F5C\u8005\u66F4\u65B0\u8BF4\u660E\u7684\u7248\u672C\u5FC5\u987B\u4E0E\u5B9E\u9645\u5B89\u88C5\u5305\u7248\u672C\u5B8C\u5168\u4E00\u81F4\u3002": "The release notes version must match the package version exactly.",
  "\u4F5C\u8005\u66F4\u65B0\u8BF4\u660E\u987B\u4E3A 1 \u5230 2000 \u5B57\u7684\u7EAF\u6587\u672C\uFF0C\u4E0D\u63A5\u53D7\u63A7\u5236\u5B57\u7B26\u3002": "Release notes must contain 1 to 2000 plain-text characters without control characters.",
  "\u5B89\u88C5\u5305\u5143\u6570\u636E\u4E0D\u5B58\u5728\uFF0C\u65E0\u6CD5\u6838\u5BF9\u4F5C\u8005\u66F4\u65B0\u8BF4\u660E\u3002": "Package metadata is unavailable. Release notes could not be verified."
});
var CODE_MESSAGES = Object.freeze({
  BOOT_SETTINGS_OBJECT: ["\u8BBE\u7F6E\u5FC5\u987B\u662F JSON \u5BF9\u8C61\u3002", "Settings must be a JSON object."],
  BOOT_SETTING_RETIRED_DURATION: [
    "\u5DF2\u53D6\u6D88\u64AD\u653E\u65F6\u957F\u8BBE\u7F6E\uFF0C\u52A8\u753B\u6309\u539F\u59CB\u957F\u5EA6\u5B8C\u6574\u64AD\u653E\u3002",
    "Playback duration settings have been removed. Animations play at their full original length."
  ],
  BOOT_SETTING_RETIRED_FIT: [
    "\u5DF2\u53D6\u6D88\u753B\u9762\u663E\u793A\u8BBE\u7F6E\uFF0C\u5F00\u673A\u52A8\u753B\u59CB\u7EC8\u94FA\u6EE1\u5F53\u524D\u7A97\u53E3\u3002",
    "Display settings have been removed. Startup animations always fill the current window."
  ],
  BOOT_SETTING_RETIRED_UPDATE_APPEARANCE: [
    "\u66F4\u65B0\u63D0\u9192\u4F7F\u7528\u7EDF\u4E00\u5916\u89C2\uFF0C\u5DF2\u53D6\u6D88\u5355\u72EC\u8C03\u8282\u3002",
    "Update prompts use the shared appearance and no longer have separate controls."
  ],
  BOOT_SETTING_UNSUPPORTED: [
    "\u4E0D\u652F\u6301\u6B64\u8BBE\u7F6E\uFF0C\u8BF7\u5237\u65B0\u8BBE\u7F6E\u9875\u540E\u91CD\u8BD5\u3002",
    "This setting is not supported. Refresh Settings and try again."
  ],
  BOOT_SETTING_BOOLEAN: ["\u8BBE\u7F6E\u503C\u5FC5\u987B\u662F\u5F00\u5173\u3002", "The setting must be a boolean."],
  BOOT_SETTING_VOLUME: ["\u97F3\u91CF\u987B\u5728 0 \u5230 1 \u4E4B\u95F4\u3002", "Volume must be between 0 and 1."],
  BOOT_SETTING_VIDEO_MISSING: [
    "\u6240\u9009\u52A8\u753B\u4E0D\u5B58\u5728\uFF0C\u8BF7\u5237\u65B0\u7247\u5E93\u3002",
    "The selected animation is unavailable. Refresh the library."
  ],
  BOOT_SETTING_END_SCREEN: ["\u7ED3\u675F\u5C01\u9762\u987B\u4E3A logo \u6216 image\u3002", "The end cover must be logo or image."],
  BOOT_SETTING_IMAGE_MISSING: [
    "\u6240\u9009\u5C01\u9762\u56FE\u7247\u4E0D\u5B58\u5728\uFF0C\u8BF7\u91CD\u65B0\u4E0A\u4F20\u3002",
    "The selected cover image is unavailable. Upload it again."
  ],
  BOOT_SETTING_LOGO: ["\u4E0D\u652F\u6301\u6B64\u7ED3\u675F\u753B\u9762\u3002", "This end screen is not supported."],
  BOOT_SETTING_END_FIT: ["\u5C01\u9762\u9002\u914D\u987B\u4E3A cover \u6216 contain\u3002", "Cover fit must be cover or contain."],
  BOOT_SETTING_IMAGE_REQUIRED: ["\u8BF7\u5148\u4E0A\u4F20\u4E00\u5F20\u7ED3\u675F\u5C01\u9762\u56FE\u7247\u3002", "Upload an end cover image first."],
  BOOT_WRITE_IDENTIFIER: [
    "\u5199\u5165\u8BF7\u6C42\u7F3A\u5C11\u63D2\u4EF6\u6807\u8BC6\u3002",
    "The write request is missing the plugin identifier."
  ],
  BOOT_WRITE_ORIGIN_INVALID: ["\u65E0\u6548\u6765\u6E90\u3002", "Invalid request origin."],
  BOOT_WRITE_CROSS_SITE: ["\u4E0D\u5141\u8BB8\u8DE8\u7AD9\u4FEE\u6539\u8BBE\u7F6E\u3002", "Settings cannot be changed from another site."],
  BOOT_JSON_CONTENT_TYPE: ["\u8BF7\u4F7F\u7528 application/json\u3002", "Use application/json."],
  BOOT_SETTINGS_TOO_LARGE: ["\u8BBE\u7F6E\u5185\u5BB9\u8FC7\u5927\u3002", "The settings payload is too large."],
  BOOT_JSON_INVALID: ["JSON \u683C\u5F0F\u4E0D\u6B63\u786E\u3002", "Invalid JSON format."],
  BOOT_UPLOAD_INTERRUPTED: ["\u4E0A\u4F20\u4E2D\u65AD\uFF0C\u8BF7\u91CD\u8BD5\u3002", "The upload was interrupted. Please try again."],
  BOOT_UPLOAD_TIMEOUT: ["\u4E0A\u4F20\u7B49\u5F85\u8D85\u65F6\uFF0C\u8BF7\u91CD\u8BD5\u3002", "The upload timed out. Please try again."],
  BOOT_BODY_TOO_LARGE: ["\u8BF7\u6C42\u5185\u5BB9\u8D85\u8FC7\u5927\u5C0F\u9650\u5236\u3002", "The request exceeds the size limit."],
  BOOT_RANGE_INVALID: ["\u65E0\u6548\u7684\u89C6\u9891\u5B57\u8282\u8303\u56F4\u3002", "Invalid video byte range."],
  BOOT_SETTINGS_READ: [
    "\u8BBE\u7F6E\u6587\u4EF6\u65E0\u6CD5\u8BFB\u53D6\u3002\u8BF7\u5907\u4EFD\u5E76\u68C0\u67E5 boot-studio/settings.json\u3002",
    "Could not read the settings file. Back up and check boot-studio/settings.json."
  ],
  BOOT_LIBRARY_FORMAT: [
    "\u8BBE\u7F6E\u6587\u4EF6\u7248\u672C\u6216\u7247\u5E93\u683C\u5F0F\u4E0D\u6B63\u786E\u3002",
    "The settings file version or library format is invalid."
  ],
  BOOT_IMAGE_LIBRARY_FORMAT: [
    "\u7ED3\u675F\u5C01\u9762\u7247\u5E93\u683C\u5F0F\u4E0D\u6B63\u786E\u3002",
    "The end cover library format is invalid."
  ],
  BOOT_SAVED_SETTINGS_INVALID: [
    "\u5DF2\u4FDD\u5B58\u7684\u8BBE\u7F6E\u683C\u5F0F\u4E0D\u6B63\u786E\uFF0C\u8BF7\u5907\u4EFD\u5E76\u68C0\u67E5 settings.json\u3002",
    "The saved settings are invalid. Back up and check settings.json."
  ],
  BOOT_RESET_PATH: [
    "\u91CD\u7F6E\u6E05\u7406\u8DEF\u5F84\u8D85\u51FA\u6570\u636E\u76EE\u5F55\u3002",
    "The reset cleanup path is outside the data directory."
  ],
  BOOT_RESET_ASSETS_OVERLAP: [
    "\u5185\u7F6E\u7D20\u6750\u76EE\u5F55\u4E0E\u81EA\u5B9A\u4E49\u6570\u636E\u6E05\u7406\u8303\u56F4\u91CD\u53E0\uFF0C\u672A\u4FEE\u6539\u8BBE\u7F6E\u6216\u7D20\u6750\u3002",
    "Built-in assets overlap the custom data cleanup path. Settings and assets were left unchanged."
  ],
  BOOT_RESET_QUARANTINE: [
    "\u91CD\u7F6E\u9694\u79BB\u76EE\u5F55\u4E0D\u662F\u5B89\u5168\u7684\u672C\u5730\u6587\u4EF6\u5939\uFF0C\u672A\u4FEE\u6539\u8BBE\u7F6E\u6216\u7D20\u6750\u3002",
    "The reset quarantine directory is not a safe local folder. Settings and assets were left unchanged."
  ],
  BOOT_RESET_CLEANUP: [
    "\u9ED8\u8BA4\u8BBE\u7F6E\u5DF2\u6062\u590D\uFF0C\u4F46\u81EA\u5B9A\u4E49\u6587\u4EF6\u5C1A\u672A\u5168\u90E8\u6E05\u7406\u3002\u8BF7\u518D\u6B21\u6062\u590D\u9ED8\u8BA4\u91CD\u8BD5\u3002",
    "Defaults were restored, but some custom files remain. Restore defaults again to retry cleanup."
  ],
  BOOT_FILENAME_ENCODING: ["\u6587\u4EF6\u540D\u7F16\u7801\u65E0\u6548\u3002", "Invalid filename encoding."],
  BOOT_IMAGE_TYPE: [
    "\u652F\u6301 PNG\u3001JPEG \u548C WebP \u56FE\u7247\uFF0C\u4E0D\u63A5\u53D7 SVG\u3002",
    "PNG, JPEG and WebP images are supported. SVG is not supported."
  ],
  BOOT_VIDEO_TYPE: ["\u652F\u6301 MP4\u3001M4V \u548C WebM \u89C6\u9891\u3002", "MP4, M4V and WebM videos are supported."],
  BOOT_IMAGE_TOO_LARGE: [
    "\u56FE\u7247\u5E94\u5927\u4E8E 0 \u5B57\u8282\uFF0C\u4E14\u4E0D\u8D85\u8FC7 20 MB\u3002",
    "The image must be larger than 0 bytes and no larger than 20 MB."
  ],
  BOOT_VIDEO_TOO_LARGE: [
    "\u89C6\u9891\u5E94\u5927\u4E8E 0 \u5B57\u8282\uFF0C\u4E14\u4E0D\u8D85\u8FC7 200 MB\u3002",
    "The video must be larger than 0 bytes and no larger than 200 MB."
  ],
  BOOT_IMAGE_INVALID: [
    "\u56FE\u7247\u683C\u5F0F\u65E0\u6548\uFF0C\u8BF7\u4E0A\u4F20 PNG\u3001JPEG \u6216 WebP \u56FE\u7247\u3002",
    "Invalid image format. Upload a PNG, JPEG or WebP image."
  ],
  BOOT_VIDEO_INVALID: [
    "\u6587\u4EF6\u4E0D\u662F\u6709\u6548\u7684 MP4 / WebM \u5BB9\u5668\u3002\u8BF7\u4F18\u5148\u4F7F\u7528 H.264 + AAC \u7684 MP4\u3002",
    "The file is not a valid MP4 / WebM container. An MP4 with H.264 + AAC is recommended."
  ],
  BOOT_IMAGE_DECODE: [
    "\u65E0\u6CD5\u8BFB\u53D6\u8FD9\u5F20\u56FE\u7247\uFF0C\u8BF7\u66F4\u6362\u6709\u6548\u7684PNG\u3001JPEG\u6216WebP\u3002",
    "Could not read this image. Choose a valid PNG, JPEG or WebP image."
  ],
  BOOT_VIDEO_DECODE: [
    "\u6D4F\u89C8\u5668\u65E0\u6CD5\u8BFB\u53D6\u6B64\u89C6\u9891\u3002\u8BF7\u8F6C\u6362\u4E3A MP4\uFF08H.264 / AAC\uFF09\u540E\u91CD\u8BD5\u3002",
    "The browser could not read this video. Convert it to MP4 (H.264 / AAC) and try again."
  ],
  BOOT_IMAGE_NOT_FOUND: ["\u5C01\u9762\u56FE\u7247\u4E0D\u5B58\u5728\u3002", "The cover image does not exist."],
  BOOT_VIDEO_NOT_FOUND: ["\u52A8\u753B\u4E0D\u5B58\u5728\u3002", "The animation does not exist."],
  BOOT_LOGO_NOT_FOUND: ["\u5185\u7F6E\u7ED3\u675F\u5C01\u9762\u4E0D\u5B58\u5728\u3002", "The built-in end cover does not exist."],
  BOOT_ROUTE_NOT_FOUND: ["\u63A5\u53E3\u4E0D\u5B58\u5728\u3002", "This endpoint does not exist."],
  BOOT_METHOD_NOT_ALLOWED: ["\u4E0D\u652F\u6301\u6B64\u8BF7\u6C42\u65B9\u6CD5\u3002", "This request method is not supported."],
  BOOT_UPDATE_VERSION_REQUIRED: [
    "\u8BF7\u5148\u68C0\u67E5\u5E76\u9009\u62E9\u66F4\u65B0\u7248\u672C\u3002",
    "Check for updates and select a version first."
  ],
  BOOT_UPDATE_PREPARE_FAILED: ["\u66F4\u65B0\u5305\u51C6\u5907\u5931\u8D25\u3002", "Could not prepare the update package."],
  BOOT_UPDATE_INVALID: [
    "\u66F4\u65B0\u4FE1\u606F\u6216\u5B89\u88C5\u5305\u58F0\u660E\u65E0\u6548\uFF0C\u8BF7\u91CD\u65B0\u68C0\u67E5\u66F4\u65B0\u3002",
    "The update information or package declaration is invalid. Check for updates again."
  ],
  BOOT_UPDATE_NETWORK: [
    "\u65E0\u6CD5\u8FDE\u63A5\u66F4\u65B0\u670D\u52A1\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC\u540E\u91CD\u8BD5\u3002",
    "Could not connect to the update service. Check your connection and try again."
  ],
  BOOT_UPDATE_TIMEOUT: [
    "\u68C0\u67E5\u66F4\u65B0\u8D85\u65F6\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002",
    "The update check timed out. Please try again later."
  ],
  BOOT_UPDATE_INTEGRITY: [
    "\u66F4\u65B0\u5305\u5B8C\u6574\u6027\u6821\u9A8C\u5931\u8D25\uFF0C\u672A\u6267\u884C\u66F4\u65B0\u3002",
    "The update package failed integrity verification. The update was not applied."
  ],
  BOOT_UPDATE_ARCHIVE: [
    "\u66F4\u65B0\u5305\u65E0\u6CD5\u5B89\u5168\u8BFB\u53D6\uFF0C\u672A\u6267\u884C\u66F4\u65B0\u3002",
    "The update package could not be read safely. The update was not applied."
  ],
  BOOT_UPDATE_CACHE: [
    "\u66F4\u65B0\u7F13\u5B58\u76EE\u5F55\u4E0D\u53EF\u7528\uFF0C\u8BF7\u68C0\u67E5\u6570\u636E\u76EE\u5F55\u6743\u9650\u548C\u53EF\u7528\u7A7A\u95F4\u3002",
    "The update cache is unavailable. Check data directory permissions and available space."
  ],
  BOOT_UPDATE_INSTALL_ACK_INVALID: [
    "\u65E0\u6CD5\u786E\u8BA4\u66F4\u65B0\u7F13\u5B58\u7684\u6E05\u7406\u8BF7\u6C42\u3002",
    "The update cache cleanup request could not be acknowledged."
  ],
  BOOT_RESET_CONFIRM: [
    "\u8BF7\u5148\u786E\u8BA4\u5220\u9664\u5168\u90E8\u81EA\u5B9A\u4E49\u89C6\u9891\u3001\u56FE\u7247\u548C\u504F\u597D\u3002",
    "Confirm deletion of all custom videos, images and preferences first."
  ],
  BOOT_IMAGE_DELETE_ONLY: [
    "\u53EA\u80FD\u5220\u9664\u81EA\u5DF1\u4E0A\u4F20\u7684\u5C01\u9762\u56FE\u7247\u3002",
    "Only uploaded cover images can be deleted."
  ],
  BOOT_VIDEO_DELETE_ONLY: ["\u53EA\u80FD\u5220\u9664\u81EA\u5DF1\u4E0A\u4F20\u7684\u52A8\u753B\u3002", "Only uploaded animations can be deleted."],
  BOOT_MEDIA_STORAGE_LIMIT: [
    "\u81EA\u5B9A\u4E49\u7D20\u6750\u603B\u5927\u5C0F\u5DF2\u8FBE\u4E0A\u9650\uFF0C\u8BF7\u5148\u79FB\u9664\u4E0D\u9700\u8981\u7684\u89C6\u9891\u6216\u56FE\u7247\u3002",
    "Custom media has reached its storage limit. Remove unused videos or images first."
  ],
  BOOT_MEDIA_COUNT_LIMIT: [
    "\u81EA\u5B9A\u4E49\u7D20\u6750\u6570\u91CF\u5DF2\u8FBE\u4E0A\u9650\uFF0C\u8BF7\u5148\u79FB\u9664\u4E0D\u9700\u8981\u7684\u89C6\u9891\u6216\u56FE\u7247\u3002",
    "Custom media has reached its file limit. Remove unused videos or images first."
  ],
  BOOT_FILE_OPERATION_FAILED: [
    "\u6587\u4EF6\u64CD\u4F5C\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u6570\u636E\u76EE\u5F55\u6743\u9650\u548C\u53EF\u7528\u7A7A\u95F4\u3002",
    "The file operation failed. Check data directory permissions and available space."
  ],
  BOOT_HTTP_ERROR: ["\u8BF7\u6C42\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002", "The request failed. Please try again later."],
  BOOT_RESPONSE_INVALID: [
    "\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6CD5\u8BC6\u522B\u7684\u5185\u5BB9\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002",
    "The service returned an unrecognized response. Please try again later."
  ],
  BOOT_REQUEST_TIMEOUT: [
    "\u8BF7\u6C42\u8D85\u65F6\uFF0C\u8BF7\u68C0\u67E5\u8FDE\u63A5\u540E\u91CD\u8BD5\u3002",
    "The request timed out. Check your connection and try again."
  ],
  BOOT_REQUEST_CANCELLED: ["\u8BF7\u6C42\u5DF2\u53D6\u6D88\u3002", "The request was canceled."],
  BOOT_NETWORK_ERROR: [
    "\u65E0\u6CD5\u8FDE\u63A5\u5F00\u673A\u52A8\u753B\u670D\u52A1\uFF0C\u8BF7\u68C0\u67E5\u8FDE\u63A5\u6216\u91CD\u542F Harness \u540E\u91CD\u8BD5\u3002",
    "Could not connect to the startup animation service. Check your connection or restart Harness and try again."
  ],
  BOOT_HARNESS_INSTALL_PERMISSION: [
    "\u5F53\u524D\u8FDE\u63A5\u6CA1\u6709\u7BA1\u7406\u63D2\u4EF6\u7684\u6743\u9650\uFF0C\u8BF7\u4F7F\u7528 Harness \u4E3B\u7A97\u53E3\u7684\u62E5\u6709\u8005\u8FDE\u63A5\u3002",
    "This connection cannot manage plugins. Use the owner connection in the main Harness window."
  ],
  BOOT_HARNESS_INSTALL_UNAVAILABLE: [
    "\u5F53\u524D Harness \u4E0D\u652F\u6301\u81EA\u52A8\u5B89\u88C5\u6B64\u66F4\u65B0\uFF0C\u8BF7\u6253\u5F00\u63D2\u4EF6\u7BA1\u7406\u5B8C\u6210\u66F4\u65B0\u3002",
    "This Harness version cannot install this update automatically. Open the plugin manager to update."
  ],
  BOOT_HARNESS_INSTALL_FAILED: [
    "\u66F4\u65B0\u672A\u5B8C\u6210\uFF0C\u8BF7\u5728\u63D2\u4EF6\u7BA1\u7406\u4E2D\u67E5\u770B\u8BE6\u60C5\u3002",
    "The update did not complete. See the plugin manager for details."
  ],
  BOOT_HARNESS_INSTALL_RESPONSE: [
    "Harness \u672A\u63A5\u53D7\u66F4\u65B0\u8BF7\u6C42\uFF0C\u8BF7\u5728\u63D2\u4EF6\u7BA1\u7406\u4E2D\u67E5\u770B\u8BE6\u60C5\u3002",
    "Harness did not accept the update request. See the plugin manager for details."
  ],
  BOOT_HARNESS_INSTALL_VERSION: [
    "Harness \u8FD4\u56DE\u7684\u7248\u672C\u4E0E\u66F4\u65B0\u76EE\u6807\u4E0D\u4E00\u81F4\uFF0C\u8BF7\u67E5\u770B\u63D2\u4EF6\u7BA1\u7406\u3002",
    "The version returned by Harness does not match the update target. Check the plugin manager."
  ],
  BOOT_HARNESS_INSTALL_UNCERTAIN: [
    "\u66F4\u65B0\u7ED3\u679C\u5C1A\u672A\u786E\u8BA4\uFF0C\u8BF7\u5728\u63D2\u4EF6\u7BA1\u7406\u4E2D\u6838\u5BF9\u5B9E\u9645\u7248\u672C\u540E\u518D\u64CD\u4F5C\u3002",
    "The update result could not be confirmed. Check the installed version in the plugin manager before continuing."
  ],
  BOOT_VERSION_INVALID: [
    "\u7EF4\u62A4\u7248\u672C\u5FC5\u987B\u4F7F\u7528 X.Y.Z \u7A33\u5B9A\u7248\u672C\u53F7\u3002",
    "Release versions must use a stable X.Y.Z version number."
  ]
});
var ERROR_CODES = Object.freeze(Object.keys(CODE_MESSAGES));
function englishMessage(text) {
  if (Object.hasOwn(MESSAGES, text)) return MESSAGES[text];
  let match;
  if (match = /^不支持的设置：(.+)$/.exec(text)) return `Unsupported setting: ${match[1]}`;
  if (match = /^(.+) 必须是开关。$/.exec(text)) return `${match[1]} must be a boolean.`;
  if (match = /^(图片|视频)不能超过 (\d+) MB。$/.exec(text))
    return `${match[1] === "\u56FE\u7247" ? "Images" : "Videos"} cannot exceed ${match[2]} MB.`;
  if (match = /^默认设置已恢复，但自定义文件尚未全部清理。请再次恢复默认重试(?:（(.+)）)?。$/.exec(
    text
  ))
    return `Default settings were restored, but some custom files remain. Restore defaults again${match[1] ? ` (${match[1]})` : ""}.`;
  if (match = /^暂时无法检查更新：([\s\S]+)$/.exec(text))
    return `Could not check for updates: ${englishMessage(match[1])}`;
  if (match = /^npm 注册表返回 HTTP (\d+)。$/.exec(text))
    return `The npm registry returned HTTP ${match[1]}.`;
  if (match = /^维护服务返回 HTTP (\d+)。$/.exec(text))
    return `The update service returned HTTP ${match[1]}.`;
  if (match = /^(npm )?更新包下载失败（HTTP (\d+)）。$/.exec(text))
    return `${match[1] ? "The npm update package" : "The update package"} download failed (HTTP ${match[2]}).`;
  if (match = /^Harness 更新请求失败（HTTP (\d+)）。$/.exec(text))
    return `The Harness update request failed (HTTP ${match[1]}).`;
  if (match = /^请求失败 \((\d+)\)$/.exec(text)) return `Request failed (${match[1]})`;
  if (match = /^连接失败：([\s\S]+)。请重启 Harness 后重试。$/.exec(text))
    return `Connection failed: ${englishMessage(match[1])}. Restart Harness and try again.`;
  return text;
}
function localizeMessage(value) {
  const code = value && typeof value === "object" ? value.code || value.errorCode : null;
  const coded = Object.hasOwn(CODE_MESSAGES, code) ? CODE_MESSAGES[code] : null;
  const text = value && typeof value === "object" ? String(value.message || value.error || "") : String(value ?? "");
  if (coded) {
    const [zh, en] = coded;
    return readHostLocale() === "en" ? en : zh;
  }
  return readHostLocale() === "en" ? englishMessage(text) : text;
}

// src/startup-screen.jsx
function mountStartupSequence(container, { sound = false, volume = 0.7, onEnded } = {}) {
  const realDocument = container.ownerDocument;
  const realWindow = realDocument.defaultView;
  const shadow = container.shadowRoot ?? container.attachShadow({ mode: "open" });
  const style = realDocument.createElement("style");
  style.textContent = STARTUP_CSS + `
    #dsh-startup-root[lang="en"] .dsu-status.dsu-zhline {
      font-family: var(--dsu-din); font-size: clamp(15px, 2.8vw, 32px);
      letter-spacing: .04em; text-indent: .04em; white-space: normal;
      max-width: 86vw; text-align: center; justify-content: center;
    }
  `;
  const body = realDocument.createElement("div");
  body.style.cssText = "position:absolute;inset:0;width:100%;height:100%;overflow:hidden;background:#000;";
  shadow.replaceChildren(style, body);
  let disposed = false;
  let completed = false;
  const timers = /* @__PURE__ */ new Set();
  const intervals = /* @__PURE__ */ new Set();
  const frames = /* @__PURE__ */ new Set();
  const contexts = /* @__PURE__ */ new Set();
  const listeners = [];
  const eventTarget = new EventTarget();
  const documentEvents = new EventTarget();
  const level = Number.isFinite(Number(volume)) ? Math.min(1, Math.max(0, Number(volume))) : 0.7;
  const audible = sound === true && level > 0;
  const trackEvents = (target) => ({
    addEventListener(type, listener, options) {
      target.addEventListener(type, listener, options);
      listeners.push(() => target.removeEventListener(type, listener, options));
    },
    removeEventListener: target.removeEventListener.bind(target),
    dispatchEvent: target.dispatchEvent.bind(target)
  });
  const storage = () => {
    const values = /* @__PURE__ */ new Map();
    return {
      getItem: (key) => values.get(String(key)) ?? null,
      setItem: (key, value) => values.set(String(key), String(value)),
      removeItem: (key) => values.delete(String(key))
    };
  };
  const NativeContext = realWindow.AudioContext || realWindow.webkitAudioContext;
  function ManagedAudioContext(...args) {
    if (disposed || !audible || !NativeContext) throw new Error("Audio disabled");
    const context = new NativeContext(...args);
    contexts.add(context);
    return context;
  }
  if (NativeContext) ManagedAudioContext.prototype = NativeContext.prototype;
  const localWindow = {
    ...trackEvents(eventTarget),
    __DSH_STARTUP__: {
      enabled: true,
      mode: "always",
      theme: "light",
      speed: 1,
      requireInteraction: false,
      allowSkip: false,
      sound: audible,
      soundVolume: level,
      voice: false,
      voiceCue: false,
      voiceSource: "tts",
      sfx: "synth"
    },
    __DSH_STARTUP_SKIP__: false,
    AudioContext: ManagedAudioContext,
    webkitAudioContext: ManagedAudioContext,
    speechSynthesis: void 0,
    SpeechSynthesisUtterance: void 0,
    sessionStorage: storage(),
    localStorage: storage()
  };
  const localDocument = {
    ...trackEvents(documentEvents),
    readyState: "complete",
    body,
    // Upstream's scroll locking applies only to these private elements.
    documentElement: realDocument.createElement("div"),
    head: realDocument.createElement("div"),
    createElement: realDocument.createElement.bind(realDocument),
    createElementNS: realDocument.createElementNS.bind(realDocument),
    createTextNode: realDocument.createTextNode.bind(realDocument),
    createDocumentFragment: realDocument.createDocumentFragment.bind(realDocument),
    getElementById: (id) => shadow.getElementById(id)
  };
  const environment = {
    window: localWindow,
    document: localDocument,
    translate,
    subscribeLocale(listener) {
      const unsubscribe = getHostLocaleStore(realDocument).subscribe(listener);
      listeners.push(unsubscribe);
      return unsubscribe;
    },
    setTimeout(callback, delay, ...args) {
      if (disposed) return 0;
      const id = realWindow.setTimeout(() => {
        timers.delete(id);
        if (!disposed) callback(...args);
      }, delay);
      timers.add(id);
      return id;
    },
    clearTimeout(id) {
      timers.delete(id);
      realWindow.clearTimeout(id);
    },
    setInterval(callback, delay, ...args) {
      if (disposed) return 0;
      const id = realWindow.setInterval(() => {
        if (!disposed) callback(...args);
      }, delay);
      intervals.add(id);
      return id;
    },
    clearInterval(id) {
      intervals.delete(id);
      realWindow.clearInterval(id);
    },
    requestAnimationFrame(callback) {
      if (disposed) return 0;
      const id = realWindow.requestAnimationFrame((time) => {
        frames.delete(id);
        if (!disposed) callback(time);
      });
      frames.add(id);
      return id;
    },
    cancelAnimationFrame(id) {
      frames.delete(id);
      realWindow.cancelAnimationFrame(id);
    },
    // Audio assets are intentionally excluded. Never request the original host.
    fetch: () => Promise.reject(new Error("External startup assets are disabled"))
  };
  function dispose() {
    if (disposed) return;
    disposed = true;
    try {
      localWindow.__DSH_STARTUP_API__?.skip();
    } catch {
    }
    for (const id of timers) realWindow.clearTimeout(id);
    for (const id of intervals) realWindow.clearInterval(id);
    for (const id of frames) realWindow.cancelAnimationFrame(id);
    timers.clear();
    intervals.clear();
    frames.clear();
    for (const context of contexts) {
      try {
        void context.close().catch(() => {
        });
      } catch {
      }
    }
    contexts.clear();
    for (const off of listeners) off();
    listeners.length = 0;
    body.getAnimations({ subtree: true }).forEach((animation) => animation.cancel());
    shadow.replaceChildren();
  }
  function complete() {
    if (completed || disposed) return;
    completed = true;
    dispose();
    onEnded?.();
  }
  localWindow.addEventListener("dsh-startup:done", complete, { once: true });
  try {
    mountStartupRuntime(environment);
  } catch (error) {
    dispose();
    throw error;
  }
  return dispose;
}
function StartupSequence({ sound = false, volume = 0.7, onEnded }) {
  const host = (0, import_react2.useRef)(null);
  const ended = (0, import_react2.useRef)(onEnded);
  ended.current = onEnded;
  (0, import_react2.useEffect)(() => {
    if (!host.current) return;
    try {
      return mountStartupSequence(host.current, {
        sound,
        volume,
        onEnded: () => ended.current?.()
      });
    } catch {
      ended.current?.();
    }
  }, [sound, volume]);
  return /* @__PURE__ */ import_react2.default.createElement(
    "div",
    {
      ref: host,
      "data-testid": "startup-sequence",
      "aria-hidden": "true",
      style: {
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        background: "#000"
      }
    }
  );
}

// src/update-panel.jsx
var import_react8 = __toESM(require("react"), 1);

// src/constants.js
var CORE_PACKAGE_NAME = "dsh-boot-studio";
var NPM_ENTRY_NAME = "dsh-openup-lewis";
var BASE_PATH = `/${CORE_PACKAGE_NAME}`;
var MAX_PACKAGE_BYTES = 80 * 1024 * 1024;
var NPM_REGISTRIES = Object.freeze([
  "https://registry.npmjs.org",
  "https://registry.npmmirror.com"
]);
var API_TIMEOUTS = Object.freeze({
  request: 7e3,
  updateCheck: 2e4,
  updatePrepare: 35 * 60 * 1e3,
  uploadVideo: 18e4,
  uploadImage: 12e4,
  reset: 18e4,
  install: 12e4
});

// src/version.js
var VERSION_PATTERN = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
function parseVersion(value) {
  if (typeof value !== "string" || !VERSION_PATTERN.test(value)) return null;
  const parts = value.split(".").map(Number);
  return parts.every(Number.isSafeInteger) ? parts : null;
}
function versionParts(value) {
  if (typeof value !== "string" || !VERSION_PATTERN.test(value)) {
    throw Object.assign(new Error("\u7EF4\u62A4\u7248\u672C\u5FC5\u987B\u4F7F\u7528 X.Y.Z \u7A33\u5B9A\u7248\u672C\u53F7\u3002"), {
      code: "BOOT_VERSION_INVALID"
    });
  }
  const parts = parseVersion(value);
  if (!parts) {
    throw Object.assign(new Error("\u7248\u672C\u53F7\u8FC7\u5927\u3002"), { code: "BOOT_VERSION_INVALID" });
  }
  return parts;
}
function compareVersions(candidate, current) {
  const left = versionParts(candidate);
  const right = versionParts(current);
  for (let index = 0; index < left.length; index++) {
    if (left[index] !== right[index]) return left[index] > right[index] ? 1 : -1;
  }
  return 0;
}
function isNewerVersion(candidate, current) {
  return compareVersions(candidate, current) > 0;
}

// src/api-client.js
function clientError(code, message, properties = {}) {
  return Object.assign(new Error(message), { code, ...properties });
}
var jsonType = (value) => /^(?:application\/json|application\/[\w.+-]+\+json)(?:\s*;|$)/i.test(String(value || "").trim());
function parseJSONResponse(text, { status = 200, contentType } = {}) {
  const ok = status >= 200 && status < 300;
  const fallback = () => clientError(
    ok ? "BOOT_RESPONSE_INVALID" : "BOOT_HTTP_ERROR",
    ok ? "\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6CD5\u8BC6\u522B\u7684\u5185\u5BB9\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002" : `\u8BF7\u6C42\u5931\u8D25 (${status})`,
    { status }
  );
  if (!jsonType(contentType)) throw fallback();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw fallback();
  }
  if (!ok) {
    const message = typeof data?.error === "string" && data.error.trim() ? data.error : `\u8BF7\u6C42\u5931\u8D25 (${status})`;
    const code = typeof data?.code === "string" ? data.code : typeof data?.errorCode === "string" ? data.errorCode : "BOOT_HTTP_ERROR";
    throw clientError(code, message, { status, details: data?.details });
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) throw fallback();
  return data;
}
async function readJSONResponse(response) {
  const status = response.status;
  const contentType = response.headers?.get?.("content-type");
  if (!jsonType(contentType)) return parseJSONResponse("", { status, contentType });
  return parseJSONResponse(await response.text(), { status, contentType });
}
function requestTimeout(path) {
  if (path === "/updates/prepare") return API_TIMEOUTS.updatePrepare;
  if (path === "/updates/check") return API_TIMEOUTS.updateCheck;
  if (path === "/upload") return API_TIMEOUTS.uploadVideo;
  if (path === "/end-images") return API_TIMEOUTS.uploadImage;
  if (path === "/reset") return API_TIMEOUTS.reset;
  return API_TIMEOUTS.request;
}
function createAPIClient({
  basePath = BASE_PATH,
  fetchImpl = (...args) => fetch(...args),
  timeoutForPath = requestTimeout
} = {}) {
  return async function api2(path, options = {}) {
    const controller = new AbortController();
    let timedOut = false;
    const abort = () => controller.abort();
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, timeoutForPath(path));
    if (options.signal?.aborted) controller.abort();
    else options.signal?.addEventListener("abort", abort, { once: true });
    try {
      const response = await fetchImpl(basePath + path, {
        ...options,
        signal: controller.signal,
        headers: {
          "x-dsh-boot-studio": "1",
          ...typeof options.body === "string" ? { "content-type": "application/json" } : {},
          ...options.headers
        }
      });
      return await readJSONResponse(response);
    } catch (error) {
      if (timedOut)
        throw clientError("BOOT_REQUEST_TIMEOUT", "\u8BF7\u6C42\u8D85\u65F6\uFF0C\u8BF7\u68C0\u67E5\u8FDE\u63A5\u540E\u91CD\u8BD5\u3002", { cause: error });
      if (controller.signal.aborted)
        throw clientError("BOOT_REQUEST_CANCELLED", "\u8BF7\u6C42\u5DF2\u53D6\u6D88\u3002", { cause: error });
      if (error?.code) throw error;
      throw clientError(
        "BOOT_NETWORK_ERROR",
        "\u65E0\u6CD5\u8FDE\u63A5\u5F00\u673A\u52A8\u753B\u670D\u52A1\uFF0C\u8BF7\u68C0\u67E5\u8FDE\u63A5\u6216\u91CD\u542F Harness \u540E\u91CD\u8BD5\u3002",
        { cause: error }
      );
    } finally {
      clearTimeout(timer);
      options.signal?.removeEventListener("abort", abort);
    }
  };
}
var api = createAPIClient();

// src/startup-update.js
var PACKAGE_NAMES = /* @__PURE__ */ new Set([NPM_ENTRY_NAME, CORE_PACKAGE_NAME]);
function isAvailableUpdate(status) {
  if (!status || status.available !== true || status.channelReady !== true || !PACKAGE_NAMES.has(status.packageName))
    return false;
  const latest = parseVersion(status.latestVersion), current = parseVersion(status.currentVersion);
  if (!latest || !current || status.manifest && status.manifest.version !== status.latestVersion)
    return false;
  return isNewerVersion(status.latestVersion, status.currentVersion);
}
function createStartupUpdateSession() {
  let snapshot = { checking: false, checked: false, status: null, dismissed: false };
  let checkPromise;
  let completedVersion;
  const listeners = /* @__PURE__ */ new Set();
  function publish2(patch) {
    snapshot = { ...snapshot, ...patch };
    listeners.forEach((listener) => {
      try {
        listener(snapshot);
      } catch {
      }
    });
    return snapshot;
  }
  return {
    getSnapshot: () => snapshot,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    check(request) {
      if (checkPromise) return checkPromise;
      publish2({ checking: true });
      checkPromise = Promise.resolve().then(() => request("/updates/check", { method: "POST", body: "{}" })).then(
        (value) => {
          const status = completedVersion && value ? { ...value, currentVersion: completedVersion } : value;
          publish2({
            checking: false,
            checked: true,
            status: isAvailableUpdate(status) ? status : null
          });
          return snapshot.status;
        },
        () => {
          publish2({ checking: false, checked: true, status: null });
          return null;
        }
      );
      return checkPromise;
    },
    dismiss() {
      publish2({ dismissed: true });
    },
    updated(version) {
      if (!parseVersion(version)) return;
      completedVersion = version;
      publish2({
        dismissed: true,
        status: snapshot.status ? { ...snapshot.status, available: false, currentVersion: version } : null
      });
    }
  };
}
var startupUpdateSession = createStartupUpdateSession();
function absoluteArchivePath(spec) {
  return typeof spec === "string" && spec.length < 8192 && !/[\u0000-\u001f\u007f]/.test(spec) && (/^[A-Za-z]:[\\/]/.test(spec) || /^\/(?!\/)/.test(spec) || /^\\\\[^\\/]+[\\/][^\\/]+[\\/]/.test(spec)) && !spec.split(/[\\/]/).includes("..") && spec.endsWith(".tgz");
}
function validatePreparedUpdate(staged, status) {
  if (!isAvailableUpdate(status) || !staged || staged.version !== status.latestVersion || staged.requiresRestart !== true || !/^[a-f0-9]{64}$/.test(staged.sha256 || "") || !absoluteArchivePath(staged.spec)) {
    throw Error("\u66F4\u65B0\u5305\u51C6\u5907\u7ED3\u679C\u65E0\u6548\uFF0C\u672A\u8BF7\u6C42\u5B89\u88C5\u3002");
  }
  const segments = staged.spec.split(/[\\/]/);
  const basename = `${status.packageName}-${staged.version}-${staged.sha256}.tgz`;
  if (segments.at(-1) !== basename || segments.at(-2) !== "update-cache")
    throw Error("\u66F4\u65B0\u5305\u8DEF\u5F84\u4E0E\u5DF2\u6821\u9A8C\u7684\u540D\u79F0\u3001\u7248\u672C\u6216 SHA-256 \u4E0D\u4E00\u81F4\uFF0C\u672A\u8BF7\u6C42\u5B89\u88C5\u3002");
  return staged;
}
var harnessServices = /* @__PURE__ */ new Set();
function bindHarnessServices(services = {}) {
  const entry = {
    pluginManager: typeof services.pluginManager?.installBundle === "function" ? services.pluginManager : null,
    pluginNavigation: typeof services.pluginNavigation?.openBundle === "function" || typeof services.pluginNavigation?.openList === "function" ? services.pluginNavigation : null
  };
  if (!entry.pluginManager && !entry.pluginNavigation) return () => {
  };
  harnessServices.add(entry);
  return () => harnessServices.delete(entry);
}
function harnessService(name) {
  return [...harnessServices].reverse().find((entry) => entry[name])?.[name] || null;
}
function canOpenHarnessPluginManager() {
  return !!harnessService("pluginNavigation");
}
function openHarnessPluginManager(packageName = NPM_ENTRY_NAME) {
  const navigation = harnessService("pluginNavigation");
  if (!navigation) return false;
  if (typeof navigation.openBundle === "function") navigation.openBundle(packageName);
  else navigation.openList();
  return true;
}
var classifiedInstallErrors = /* @__PURE__ */ new WeakSet();
function installError(code, message, properties) {
  const error = clientError(code, message, properties);
  classifiedInstallErrors.add(error);
  return error;
}
function uncertainInstall(properties) {
  return installError(
    "BOOT_HARNESS_INSTALL_UNCERTAIN",
    "\u66F4\u65B0\u54CD\u5E94\u8D85\u65F6\u3002\u8BF7\u5728\u63D2\u4EF6\u7BA1\u7406\u4E2D\u6838\u5BF9\u5B9E\u9645\u7248\u672C\u540E\u91CD\u8BD5\u3002",
    { ...properties, uncertain: true }
  );
}
function installedResult(answer, version) {
  if (!answer || answer.ok !== true) throw uncertainInstall({ details: answer?.error });
  const result = answer.value;
  if (result && ["failed", "cancelled"].includes(result.application))
    throw installError("BOOT_HARNESS_INSTALL_FAILED", "\u66F4\u65B0\u672A\u5B8C\u6210\uFF0C\u8BF7\u5728\u63D2\u4EF6\u7BA1\u7406\u4E2D\u67E5\u770B\u8BE6\u60C5\u3002", {
      details: result?.error
    });
  if (!result || !["applied", "restart-required"].includes(result.application) || result.error)
    throw uncertainInstall({ details: result?.error });
  if (result.version && result.version !== version)
    throw installError(
      "BOOT_HARNESS_INSTALL_VERSION",
      "Harness \u8FD4\u56DE\u7684\u7248\u672C\u4E0E\u66F4\u65B0\u76EE\u6807\u4E0D\u4E00\u81F4\uFF0C\u8BF7\u67E5\u770B\u63D2\u4EF6\u7BA1\u7406\u3002",
      { uncertain: true }
    );
  return result;
}
async function installVerifiedUpdate(spec, version, {
  fetchImpl = fetch,
  pluginManager = harnessService("pluginManager"),
  timeout = API_TIMEOUTS.install
} = {}) {
  if (!absoluteArchivePath(spec) || !parseVersion(version))
    throw Error("\u66F4\u65B0\u5305\u8DEF\u5F84\u6216\u7248\u672C\u65E0\u6548\uFF0C\u672A\u8BF7\u6C42\u5B89\u88C5\u3002");
  const rpcId = globalThis.crypto?.randomUUID?.() || `lewis-enchant-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const controller = new AbortController();
  let timer;
  const deadline = new Promise((_, reject) => {
    timer = setTimeout(() => {
      controller.abort();
      reject(
        installError(
          "BOOT_HARNESS_INSTALL_UNCERTAIN",
          "\u66F4\u65B0\u54CD\u5E94\u8D85\u65F6\u3002\u8BF7\u5728\u63D2\u4EF6\u7BA1\u7406\u4E2D\u6838\u5BF9\u5B9E\u9645\u7248\u672C\u540E\u91CD\u8BD5\u3002",
          { uncertain: true }
        )
      );
    }, timeout);
  });
  try {
    if (pluginManager) {
      const answer = await Promise.race([
        pluginManager.installBundle(spec, { enabled: true, saveExact: true, requestId: rpcId }),
        deadline
      ]);
      return installedResult(answer, version);
    }
    const response = await Promise.race([
      fetchImpl("/api/pluginManager/installBundle", {
        method: "POST",
        credentials: "same-origin",
        signal: controller.signal,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type: "client-request",
          rpcId,
          method: "pluginManager/installBundle",
          payload: {
            args: { spec, options: { enabled: true, saveExact: true, requestId: rpcId } }
          }
        })
      }),
      deadline
    ]);
    if (response.status === 401 || response.status === 403)
      throw installError(
        "BOOT_HARNESS_INSTALL_PERMISSION",
        "\u5F53\u524D\u8FDE\u63A5\u6CA1\u6709\u7BA1\u7406\u63D2\u4EF6\u7684\u6743\u9650\uFF0C\u8BF7\u4F7F\u7528 Harness \u4E3B\u7A97\u53E3\u7684\u62E5\u6709\u8005\u8FDE\u63A5\u3002"
      );
    if (response.status === 404 || response.status === 405)
      throw installError(
        "BOOT_HARNESS_INSTALL_UNAVAILABLE",
        "\u5F53\u524D Harness \u4E0D\u652F\u6301\u81EA\u52A8\u5B89\u88C5\u6B64\u66F4\u65B0\uFF0C\u8BF7\u6253\u5F00\u63D2\u4EF6\u7BA1\u7406\u5B8C\u6210\u66F4\u65B0\u3002"
      );
    if (!response.ok) throw uncertainInstall({ status: response.status });
    let envelope;
    try {
      envelope = await Promise.race([readJSONResponse(response), deadline]);
    } catch (error) {
      if (classifiedInstallErrors.has(error)) throw error;
      throw installError(
        "BOOT_HARNESS_INSTALL_RESPONSE",
        "Harness \u672A\u63A5\u53D7\u66F4\u65B0\u8BF7\u6C42\uFF0C\u8BF7\u5728\u63D2\u4EF6\u7BA1\u7406\u4E2D\u67E5\u770B\u8BE6\u60C5\u3002",
        { cause: error, uncertain: true }
      );
    }
    if (envelope.type !== "server-response" || envelope.rpcId !== rpcId || typeof envelope.result?.ok !== "boolean")
      throw installError(
        "BOOT_HARNESS_INSTALL_RESPONSE",
        "Harness \u672A\u63A5\u53D7\u66F4\u65B0\u8BF7\u6C42\uFF0C\u8BF7\u5728\u63D2\u4EF6\u7BA1\u7406\u4E2D\u67E5\u770B\u8BE6\u60C5\u3002",
        { uncertain: true }
      );
    return installedResult(envelope.result, version);
  } catch (error) {
    if (controller.signal.aborted)
      throw installError(
        "BOOT_HARNESS_INSTALL_UNCERTAIN",
        "\u66F4\u65B0\u54CD\u5E94\u8D85\u65F6\u3002\u8BF7\u5728\u63D2\u4EF6\u7BA1\u7406\u4E2D\u6838\u5BF9\u5B9E\u9645\u7248\u672C\u540E\u91CD\u8BD5\u3002",
        { cause: error, uncertain: true }
      );
    if (classifiedInstallErrors.has(error)) throw error;
    throw uncertainInstall({ cause: error });
  } finally {
    clearTimeout(timer);
  }
}
var activeUpdates = /* @__PURE__ */ new Map();
var completedUpdates = /* @__PURE__ */ new Map();
var uncertainUpdates = /* @__PURE__ */ new Map();
var pendingAcknowledgements = /* @__PURE__ */ new Map();
var updateKey = (status) => `${status?.packageName}@${status?.latestVersion}`;
function appliedUpdate(status) {
  return completedUpdates.get(updateKey(status)) || null;
}
async function retryUpdateAcknowledgements(request) {
  for (const [key, entry] of pendingAcknowledgements) {
    if (!entry.promise)
      entry.promise = Promise.resolve().then(
        () => request("/updates/installed", {
          method: "POST",
          body: JSON.stringify({ version: entry.version, spec: entry.spec })
        })
      ).then(() => {
        entry.value.cleanupPending = false;
        if (pendingAcknowledgements.get(key) === entry) pendingAcknowledgements.delete(key);
      }).catch(() => {
      }).finally(() => {
        entry.promise = null;
      });
    await entry.promise;
  }
}
function cancelPendingUpdates() {
  let count = 0;
  for (const [key, task] of activeUpdates) {
    if (task.installStarted || task.canceled) continue;
    task.canceled = true;
    task.stopPolling?.();
    if (activeUpdates.get(key) === task) activeUpdates.delete(key);
    count++;
  }
  return count;
}
async function prepareAndInstallUpdate(request, status, { onPhase, onProgress, install = installVerifiedUpdate, pollInterval = 500 } = {}) {
  if (!isAvailableUpdate(status)) throw Error("\u66F4\u65B0\u7248\u672C\u65E0\u6548\u6216\u5C1A\u672A\u516C\u5F00\uFF0C\u8BF7\u91CD\u65B0\u68C0\u67E5\u66F4\u65B0\u3002");
  const key = updateKey(status);
  if (completedUpdates.has(key)) return completedUpdates.get(key);
  if (uncertainUpdates.has(key)) throw uncertainUpdates.get(key);
  let task = activeUpdates.get(key);
  if (!task) {
    task = {
      observers: /* @__PURE__ */ new Set(),
      progressObservers: /* @__PURE__ */ new Set(),
      phase: "prepare",
      progress: {
        version: status.latestVersion,
        phase: "prepare",
        downloadedBytes: 0,
        totalBytes: null,
        percent: null
      },
      promise: null,
      canceled: false,
      installStarted: false,
      stopPolling: null
    };
    activeUpdates.set(key, task);
    const emit = (phase) => {
      task.phase = phase;
      task.observers.forEach((listener) => {
        try {
          listener(phase);
        } catch {
        }
      });
    };
    const emitProgress = (progress) => {
      task.progress = progress;
      task.progressObservers.forEach((listener) => {
        try {
          listener(progress);
        } catch {
        }
      });
    };
    task.promise = Promise.resolve().then(async () => {
      let stopped = false, timer;
      task.stopPolling = () => {
        stopped = true;
        clearTimeout(timer);
      };
      const assertActive = () => {
        if (task.canceled) throw Error("\u66F4\u65B0\u5DF2\u53D6\u6D88\uFF1A\u63D2\u4EF6\u5DF2\u505C\u7528\u6216\u5378\u8F7D\uFF0C\u672A\u8BF7\u6C42\u5B89\u88C5\u3002");
      };
      async function poll() {
        try {
          const progress = await request("/updates/progress");
          if (!stopped && progress?.version === status.latestVersion && ["checking", "downloading", "verifying", "ready"].includes(progress.phase))
            emitProgress(progress);
        } catch {
        }
        if (!stopped) timer = setTimeout(poll, pollInterval);
      }
      try {
        assertActive();
        const preparing = request("/updates/prepare", {
          method: "POST",
          body: JSON.stringify({ version: status.latestVersion })
        });
        void poll();
        const staged = validatePreparedUpdate(await preparing, status);
        assertActive();
        task.stopPolling();
        emit("install");
        emitProgress({ ...task.progress, phase: "install", percent: null });
        assertActive();
        task.installStarted = true;
        const result = await install(staged.spec, staged.version);
        const value = { version: staged.version, result };
        completedUpdates.set(key, value);
        value.cleanupPending = true;
        pendingAcknowledgements.set(key, { version: staged.version, spec: staged.spec, value });
        void retryUpdateAcknowledgements(request);
        emit("complete");
        emitProgress({ ...task.progress, phase: "complete", percent: 100 });
        return value;
      } catch (error) {
        if (error?.uncertain) uncertainUpdates.set(key, error);
        emitProgress({
          ...task.progress,
          phase: task.canceled ? "canceled" : "error",
          percent: null
        });
        throw error;
      } finally {
        task.stopPolling();
      }
    }).finally(() => {
      if (activeUpdates.get(key) === task) activeUpdates.delete(key);
    });
  }
  if (typeof onPhase === "function") {
    task.observers.add(onPhase);
    try {
      onPhase(task.phase);
    } catch {
    }
  }
  if (typeof onProgress === "function") {
    task.progressObservers.add(onProgress);
    try {
      onProgress(task.progress);
    } catch {
    }
  }
  try {
    return await task.promise;
  } finally {
    task.observers.delete(onPhase);
    task.progressObservers.delete(onProgress);
  }
}

// src/update-prompt.jsx
var import_react7 = __toESM(require("react"), 1);

// src/enchant-theme.jsx
var import_react3 = require("react");

// src/host-appearance.js
var stores2 = /* @__PURE__ */ new WeakMap();
var HOST_PALETTES = Object.freeze({
  light: Object.freeze({
    labelPrimary: "#20242c",
    labelSecondary: "#5f6876",
    labelTertiary: "#7b8492",
    borderColor: "#c7ccd4",
    panelColor: "#ffffff",
    baseColor: "#f5f6f8",
    hoverColor: "#20242c0d",
    accent: "#4d6bfe",
    accentText: "#ffffff"
  }),
  dark: Object.freeze({
    labelPrimary: "#eef0f5",
    labelSecondary: "#b5bdc9",
    labelTertiary: "#8b95a5",
    borderColor: "#616b7b",
    panelColor: "#222832",
    baseColor: "#141820",
    hoverColor: "#ffffff14",
    accent: "#7c96ff",
    accentText: "#101827"
  })
});
function property(style, name) {
  return style?.getPropertyValue(name).trim() || "";
}
function safeColor(view, value, fallback) {
  if (!value || /[;{}<>\u0000-\u001f]/.test(value)) return fallback;
  return !view?.CSS?.supports || view.CSS.supports("color", value) ? value : fallback;
}
function contrastText(value, fallback = "#ffffff") {
  let rgb;
  if (/^#[a-f\d]{6}(?:[a-f\d]{2})?$/i.test(value))
    rgb = [1, 3, 5].map((i) => parseInt(value.slice(i, i + 2), 16));
  else if (/^#[a-f\d]{3}$/i.test(value))
    rgb = [1, 2, 3].map((i) => parseInt(value[i] + value[i], 16));
  else if (/^rgba?\(/i.test(value))
    rgb = value.match(/[\d.]+/g)?.slice(0, 3).map(Number);
  if (!rgb || rgb.length !== 3 || !rgb.every(Number.isFinite)) return fallback;
  return rgb.reduce((sum, channel, i) => sum + channel * [0.299, 0.587, 0.114][i], 0) >= 155 ? "#142c2c" : "#f4fbf8";
}
function readHostAppearance(doc) {
  const view = doc?.defaultView;
  const root = doc?.documentElement;
  const body = doc?.body;
  const bodyStyle = view?.getComputedStyle?.(body || root);
  const rootStyle = view?.getComputedStyle?.(root);
  const declaredScheme = rootStyle?.colorScheme || bodyStyle?.colorScheme || "";
  const colorScheme = body?.hasAttribute("data-ds-dark-theme") || root?.hasAttribute("data-ds-dark-theme") || declaredScheme === "dark" ? "dark" : declaredScheme === "light" ? "light" : view?.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const fallback = HOST_PALETTES[colorScheme];
  const get = (name, defaultValue) => safeColor(view, property(bodyStyle, name) || property(rootStyle, name), defaultValue);
  const rawSize = parseFloat(
    property(bodyStyle, "--dsh-content-font-size") || property(rootStyle, "--dsh-content-font-size")
  );
  const fontSize = Number.isFinite(rawSize) ? Math.max(10, Math.min(22, rawSize)) : 14;
  const customTextFamily = property(bodyStyle, "--dsh-font-family-text");
  const fontFamily = property(bodyStyle, "--dsw-font-family") || (customTextFamily ? `${customTextFamily}, system-ui, sans-serif` : bodyStyle?.fontFamily) || "system-ui, sans-serif";
  const accent = get("--dsw-alias-brand-primary-new-colorprimary-new-color", fallback.accent);
  const value = {
    colorScheme,
    fontSize,
    fontFamily,
    labelPrimary: get("--dsw-alias-label-primary", fallback.labelPrimary),
    labelSecondary: get("--dsw-alias-label-secondary", fallback.labelSecondary),
    labelTertiary: get("--dsw-alias-label-tertiary", fallback.labelTertiary),
    borderColor: get("--dsw-alias-border-l2", fallback.borderColor),
    panelColor: get("--dsw-alias-bg-layer-2", fallback.panelColor),
    baseColor: get("--dsw-alias-bg-base", get("--dsw-alias-bg-layer-1", fallback.baseColor)),
    hoverColor: get("--dsw-alias-interactive-bg-hover", fallback.hoverColor),
    accent,
    accentText: contrastText(
      accent,
      get("--dsw-alias-label-primary-foreground", fallback.accentText)
    )
  };
  return Object.freeze(value);
}
function createStore(doc) {
  let snapshot = readHostAppearance(doc), observer, frame = null, media;
  const listeners = /* @__PURE__ */ new Set();
  const view = doc?.defaultView;
  function refresh() {
    frame = null;
    const next = readHostAppearance(doc);
    if (JSON.stringify(next) === JSON.stringify(snapshot)) return;
    snapshot = next;
    for (const listener of [...listeners]) {
      try {
        listener();
      } catch {
      }
    }
  }
  function schedule() {
    if (frame !== null) return;
    if (typeof view?.requestAnimationFrame === "function")
      frame = view.requestAnimationFrame(refresh);
    else refresh();
  }
  function connect() {
    const Observer = view?.MutationObserver;
    if (typeof Observer === "function") {
      observer = new Observer(schedule);
      for (const element of [doc.documentElement, doc.body].filter(Boolean))
        observer.observe(element, {
          attributes: true,
          attributeFilter: ["style", "class", "data-ds-dark-theme"]
        });
      if (doc.head)
        observer.observe(doc.head, {
          subtree: true,
          childList: true,
          characterData: true,
          attributes: true
        });
    }
    media = view?.matchMedia?.("(prefers-color-scheme: dark)");
    media?.addEventListener?.("change", schedule);
    view?.addEventListener?.("resize", schedule);
    doc.fonts?.addEventListener?.("loadingdone", schedule);
    refresh();
  }
  function disconnect() {
    observer?.disconnect();
    observer = void 0;
    media?.removeEventListener?.("change", schedule);
    view?.removeEventListener?.("resize", schedule);
    doc.fonts?.removeEventListener?.("loadingdone", schedule);
    if (frame !== null) view?.cancelAnimationFrame?.(frame);
    frame = null;
  }
  return Object.freeze({
    getSnapshot: () => snapshot,
    subscribe(listener) {
      if (typeof listener !== "function")
        throw new TypeError("Host appearance listener must be a function.");
      listeners.add(listener);
      if (listeners.size === 1) connect();
      let active = true;
      return () => {
        if (!active) return;
        active = false;
        listeners.delete(listener);
        if (!listeners.size) disconnect();
      };
    }
  });
}
function getHostAppearanceStore(doc) {
  if (!doc || typeof doc !== "object") throw new TypeError("Host appearance needs a document.");
  let store = stores2.get(doc);
  if (!store) {
    store = createStore(doc);
    stores2.set(doc, store);
  }
  return store;
}

// src/enchant-bridge.js
var ENCHANT_REGISTRY_KEY = Symbol.for("dsh.lewis.enchant.v1");
var DEFAULT_ENCHANT_THEME = Object.freeze({
  appearanceMode: "follow-host",
  effect: "frosted",
  accent: null,
  surface: null,
  colorScheme: null,
  fontSize: null,
  fontFamily: null,
  blur: 30,
  radius: 30
});
var ID = /^[a-z0-9][a-z0-9._-]{0,127}$/;
var COLOR = /^#[a-f0-9]{6}$/i;
var THEME_KEYS = /* @__PURE__ */ new Set([
  "appearanceMode",
  "effect",
  "accent",
  "surface",
  "colorScheme",
  "fontSize",
  "fontFamily",
  "blur",
  "radius"
]);
var legacyFacades = /* @__PURE__ */ new WeakMap();
function plain(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
}
function identifier(value) {
  if (typeof value !== "string" || !ID.test(value))
    throw new TypeError("\u9644\u9B54\u53F0\u9700\u8981\u7A33\u5B9A\u7684\u63D2\u4EF6\u6216\u8BBE\u7F6E\u5165\u53E3 ID\u3002");
  return value;
}
function validFontFamily(value) {
  if (typeof value !== "string" || !value.trim() || value.length > 256) return false;
  const names = value.split(",");
  return names.length <= 16 && names.every((item) => {
    let name = item.trim();
    if (name[0] === '"' || name[0] === "'") {
      if (name.at(-1) !== name[0]) return false;
      name = name.slice(1, -1);
    }
    return /^[-\p{L}\p{N} _]+$/u.test(name) && new RegExp("\\p{L}", "u").test(name);
  });
}
function themeValue(patch, base = DEFAULT_ENCHANT_THEME) {
  if (!plain(patch)) throw new TypeError("\u9644\u9B54\u53F0\u4E3B\u9898\u5FC5\u987B\u662F\u5BF9\u8C61\u3002");
  const result = { ...base };
  for (const [key, value] of Object.entries(patch)) {
    if (!THEME_KEYS.has(key)) throw new TypeError("\u4E0D\u652F\u6301\u7684\u9644\u9B54\u53F0\u4E3B\u9898\u5C5E\u6027\u3002");
    if (key === "effect" && !["frosted", "liquid-glass"].includes(value))
      throw new TypeError("\u4E0D\u652F\u6301\u7684\u9644\u9B54\u53F0\u6750\u8D28\u3002");
    if (key === "appearanceMode" && !["follow-host", "custom"].includes(value))
      throw new TypeError("\u5916\u89C2\u6A21\u5F0F\u987B\u4E3A\u8DDF\u968F\u901A\u7528\u8BBE\u7F6E\u6216\u81EA\u5B9A\u4E49\u3002");
    if (key === "colorScheme" && value !== null && !["light", "dark"].includes(value))
      throw new TypeError("\u81EA\u5B9A\u4E49\u914D\u8272\u987B\u4E3A\u6D45\u8272\u6216\u6DF1\u8272\u3002");
    if (key === "fontSize" && value !== null && !(Number.isInteger(value) && value >= 10 && value <= 32))
      throw new TypeError("\u81EA\u5B9A\u4E49\u5B57\u53F7\u987B\u4E3A10\u523032\u4E4B\u95F4\u7684\u6574\u6570\u3002");
    if (key === "fontFamily" && value !== null && !validFontFamily(value))
      throw new TypeError("\u81EA\u5B9A\u4E49\u5B57\u4F53\u987B\u4E3A\u6709\u6548\u7684\u5B57\u4F53\u540D\u79F0\u5217\u8868\u3002");
    if (["accent", "surface"].includes(key) && value !== null && (typeof value !== "string" || !COLOR.test(value)))
      throw new TypeError("\u4E3B\u9898\u989C\u8272\u987B\u4E3A\u516D\u4F4D\u5341\u516D\u8FDB\u5236\u989C\u8272\u3002");
    if (key === "blur" && !(Number.isInteger(value) && value >= 0 && value <= 48))
      throw new TypeError("\u4E3B\u9898\u78E8\u7802\u5EA6\u987B\u4E3A 0 \u5230 48 \u7684\u6574\u6570\u3002");
    if (key === "radius" && !(Number.isInteger(value) && value >= 12 && value <= 40))
      throw new TypeError("\u4E3B\u9898\u5706\u89D2\u987B\u4E3A 12 \u5230 40 \u7684\u6574\u6570\u3002");
    result[key] = typeof value === "string" && ["accent", "surface"].includes(key) ? value.toLowerCase() : value;
  }
  if (!Object.hasOwn(patch, "appearanceMode") && ["accent", "surface", "colorScheme", "fontSize", "fontFamily"].some(
    (key) => Object.hasOwn(patch, key) && patch[key] !== null
  ))
    result.appearanceMode = "custom";
  return Object.freeze(result);
}
function themeAttributes(theme = DEFAULT_ENCHANT_THEME, hostAppearance) {
  const value = themeValue(theme);
  const style = { "--lewis-blur": `${value.blur}px`, "--lewis-radius": `${value.radius}px` };
  const custom = value.appearanceMode === "custom";
  const colorScheme = custom && value.colorScheme ? value.colorScheme : hostAppearance?.colorScheme || "light";
  const palette = custom && value.colorScheme ? HOST_PALETTES[colorScheme] : hostAppearance || HOST_PALETTES[colorScheme];
  const accent = custom && value.accent ? value.accent : palette.accent;
  const panelColor = custom && value.surface ? value.surface : palette.panelColor;
  Object.assign(style, {
    "--lewis-font-size": `${custom && value.fontSize !== null ? value.fontSize : hostAppearance?.fontSize || 14}px`,
    "--lewis-font-family": custom && value.fontFamily ? value.fontFamily : hostAppearance?.fontFamily || "system-ui, sans-serif",
    "--lewis-label-primary": palette.labelPrimary,
    "--lewis-label-secondary": palette.labelSecondary,
    "--lewis-label-tertiary": palette.labelTertiary,
    "--lewis-border-color": palette.borderColor,
    "--lewis-panel-color": panelColor,
    "--lewis-base-color": palette.baseColor,
    "--lewis-hover-color": palette.hoverColor,
    "--lewis-accent": accent,
    "--lewis-accent-text": custom && value.accent ? contrastText(value.accent) : palette.accentText
  });
  if (custom && value.surface) style["--lewis-surface"] = value.surface;
  return {
    "data-lewis-effect": value.effect,
    "data-lewis-appearance-mode": value.appearanceMode,
    "data-lewis-color-scheme": colorScheme,
    "data-lewis-themed": "true",
    style
  };
}
function createRegistry() {
  const plugins = /* @__PURE__ */ new Map();
  const listeners = /* @__PURE__ */ new Set();
  let controller = null;
  let revision = 0;
  let snapshot = Object.freeze({
    version: 1,
    revision,
    theme: DEFAULT_ENCHANT_THEME,
    controller: null,
    plugins: Object.freeze([])
  });
  function entryReady(candidate = controller) {
    if (!candidate) return false;
    try {
      return candidate.isEntryReady() === true;
    } catch {
      return false;
    }
  }
  function publish2() {
    const ready = entryReady();
    snapshot = Object.freeze({
      version: 1,
      revision: ++revision,
      theme: controller && ready ? controller.theme : DEFAULT_ENCHANT_THEME,
      controller: controller ? Object.freeze({ id: controller.id, sectionId: controller.sectionId, ready }) : null,
      plugins: Object.freeze([...plugins.values()].map((owners) => [...owners.values()].at(-1)))
    });
    for (const listener of [...listeners]) {
      try {
        listener();
      } catch {
      }
    }
  }
  function refresh() {
    const ready = entryReady();
    if (Boolean(snapshot.controller?.ready) !== ready) publish2();
  }
  function shouldGroupSettings(pluginId) {
    return plugins.has(pluginId) && entryReady() && ![...plugins.get(pluginId).values()].some(
      (plugin) => plugin.sectionId === controller.sectionId
    );
  }
  return Object.freeze({
    version: 1,
    appearanceModes: Object.freeze(["follow-host", "custom"]),
    getSnapshot: () => snapshot,
    subscribe(listener) {
      if (typeof listener !== "function") throw new TypeError("\u9644\u9B54\u53F0\u76D1\u542C\u5668\u5FC5\u987B\u662F\u51FD\u6570\u3002");
      listeners.add(listener);
      let active = true;
      return () => {
        if (active) {
          active = false;
          listeners.delete(listener);
        }
      };
    },
    refresh,
    registerPlugin(descriptor) {
      if (!plain(descriptor)) throw new TypeError("\u9644\u9B54\u53F0\u63D2\u4EF6\u4FE1\u606F\u5FC5\u987B\u662F\u5BF9\u8C61\u3002");
      const { id, name, sectionId, renderSettings, openSettings: openSettings2 } = descriptor;
      identifier(id);
      identifier(sectionId);
      if (typeof name !== "string" || !name.trim() || name.length > 80 || /[\x00-\x1f\x7f]/.test(name))
        throw new TypeError("\u9644\u9B54\u53F0\u63D2\u4EF6\u540D\u79F0\u65E0\u6548\u3002");
      if (typeof renderSettings !== "function" || typeof openSettings2 !== "function")
        throw new TypeError("\u9644\u9B54\u53F0\u63D2\u4EF6\u9700\u8981\u53EF\u7528\u7684\u8BBE\u7F6E\u7EC4\u4EF6\u4E0E\u6253\u5F00\u65B9\u6CD5\u3002");
      const owners = plugins.get(id) || /* @__PURE__ */ new Map();
      const existing = [...owners.values()][0];
      if (existing && (existing.name !== name || existing.sectionId !== sectionId))
        throw new Error("\u9644\u9B54\u53F0\u63D2\u4EF6 ID \u5DF2\u88AB\u53E6\u4E00\u9879\u5360\u7528\u3002");
      const token = Symbol(id);
      owners.set(token, Object.freeze({ id, name, sectionId, renderSettings, openSettings: openSettings2 }));
      plugins.set(id, owners);
      publish2();
      let active = true;
      return () => {
        if (!active) return;
        active = false;
        owners.delete(token);
        if (!owners.size) plugins.delete(id);
        publish2();
      };
    },
    acquireController(descriptor) {
      if (controller) throw new Error("\u9644\u9B54\u53F0\u5DF2\u7ECF\u6709\u4E00\u4E2A\u6D3B\u52A8\u7684\u63A7\u5236\u5668\u3002");
      if (!plain(descriptor)) throw new TypeError("\u9644\u9B54\u53F0\u63A7\u5236\u5668\u4FE1\u606F\u5FC5\u987B\u662F\u5BF9\u8C61\u3002");
      const { id, sectionId, openSettings: openSettings2, isEntryReady } = descriptor;
      identifier(id);
      identifier(sectionId);
      if (typeof openSettings2 !== "function" || typeof isEntryReady !== "function")
        throw new TypeError("\u63A7\u5236\u5668\u9700\u8981\u53EF\u7528\u4E14\u53EF\u9A8C\u8BC1\u7684\u8BBE\u7F6E\u5165\u53E3\u3002");
      if ([...plugins.values()].some(
        (owners) => [...owners.values()].some((plugin) => plugin.sectionId === sectionId)
      ))
        throw new Error("\u63A7\u5236\u5668\u5FC5\u987B\u4F7F\u7528\u72EC\u7ACB\u7684\u8BBE\u7F6E\u5165\u53E3\u3002");
      const token = Symbol(id);
      const candidate = {
        id,
        sectionId,
        openSettings: openSettings2,
        isEntryReady,
        token,
        theme: themeValue(descriptor.theme === void 0 ? {} : descriptor.theme)
      };
      controller = candidate;
      publish2();
      let active = true;
      const assertActive = () => {
        if (!active || controller?.token !== token) throw new Error("\u9644\u9B54\u53F0\u63A7\u5236\u5668\u5DF2\u7ECF\u91CA\u653E\u3002");
      };
      return Object.freeze({
        setTheme(patch) {
          assertActive();
          const next = themeValue(patch, controller.theme);
          controller.theme = next;
          publish2();
        },
        refresh() {
          assertActive();
          refresh();
        },
        release() {
          if (!active) return;
          active = false;
          if (controller?.token !== token) return;
          controller = null;
          publish2();
        }
      });
    },
    shouldGroupSettings,
    openControllerSettings(pluginId) {
      if (!shouldGroupSettings(pluginId)) return false;
      try {
        return controller.openSettings(pluginId) !== false;
      } catch {
        return false;
      }
    }
  });
}
function getEnchantRegistry(scope = globalThis) {
  if ((!scope || typeof scope !== "object") && typeof scope !== "function")
    throw new TypeError("\u9644\u9B54\u53F0\u9700\u8981\u5171\u4EAB\u7A97\u53E3\u4F5C\u7528\u57DF\u3002");
  let registry = scope[ENCHANT_REGISTRY_KEY];
  if (!registry) {
    registry = createRegistry();
    Object.defineProperty(scope, ENCHANT_REGISTRY_KEY, { value: registry, enumerable: false });
  }
  if (registry.version !== 1 || ![
    "getSnapshot",
    "subscribe",
    "registerPlugin",
    "acquireController",
    "shouldGroupSettings",
    "openControllerSettings",
    "refresh"
  ].every((name) => typeof registry[name] === "function"))
    throw new Error("\u9644\u9B54\u53F0\u5171\u4EAB\u534F\u8BAE\u4E0D\u517C\u5BB9\u3002");
  if (registry.appearanceModes?.includes("custom")) return registry;
  let facade = legacyFacades.get(registry);
  if (facade) return facade;
  const legacyTheme = (patch) => {
    if (!plain(patch)) throw new TypeError("\u9644\u9B54\u53F0\u4E3B\u9898\u5FC5\u987B\u662F\u5BF9\u8C61\u3002");
    themeValue(patch);
    if (patch.appearanceMode === "custom" || !Object.hasOwn(patch, "appearanceMode") && ["colorScheme", "fontSize", "fontFamily"].some((key) => Object.hasOwn(patch, key)))
      throw new Error("\u8BF7\u91CD\u65B0\u6253\u5F00 Harness\uFF0C\u4EE5\u542F\u7528\u65B0\u7248\u672C\u7684\u81EA\u5B9A\u4E49\u5916\u89C2\u63A5\u53E3\u3002");
    const output = Object.fromEntries(
      Object.entries(patch).filter(
        ([key]) => ["effect", "accent", "surface", "blur", "radius"].includes(key)
      )
    );
    if (patch.appearanceMode === "follow-host")
      Object.assign(output, { accent: null, surface: null });
    return output;
  };
  facade = Object.freeze({
    version: 1,
    appearanceModes: Object.freeze(["follow-host"]),
    requiresReloadForCustomAppearance: true,
    getSnapshot: registry.getSnapshot.bind(registry),
    subscribe: registry.subscribe.bind(registry),
    registerPlugin: registry.registerPlugin.bind(registry),
    refresh: registry.refresh.bind(registry),
    shouldGroupSettings: registry.shouldGroupSettings.bind(registry),
    openControllerSettings: registry.openControllerSettings.bind(registry),
    acquireController(descriptor) {
      if (!plain(descriptor)) throw new TypeError("\u9644\u9B54\u53F0\u63A7\u5236\u5668\u4FE1\u606F\u5FC5\u987B\u662F\u5BF9\u8C61\u3002");
      const lease = registry.acquireController({
        ...descriptor,
        theme: legacyTheme(descriptor.theme === void 0 ? {} : descriptor.theme)
      });
      return Object.freeze({
        setTheme(patch) {
          lease.setTheme(legacyTheme(patch));
        },
        refresh: lease.refresh.bind(lease),
        release: lease.release.bind(lease)
      });
    }
  });
  legacyFacades.set(registry, facade);
  return facade;
}
function bindSettingsEntry({ slots, registry = getEnchantRegistry(), pluginId, register }) {
  identifier(pluginId);
  if (typeof register !== "function") throw new TypeError("\u9644\u9B54\u53F0\u9700\u8981\u8BBE\u7F6E\u5165\u53E3\u6CE8\u518C\u65B9\u6CD5\u3002");
  if (typeof slots?.entries !== "function" || typeof slots?.subscribe !== "function") {
    const dispose = register();
    let active2 = true;
    return () => {
      if (!active2) return;
      active2 = false;
      if (typeof dispose === "function") dispose();
    };
  }
  let active = true, slot = null, syncing = false;
  function shouldGroup() {
    if (!registry.shouldGroupSettings(pluginId)) return false;
    const owner = registry.getSnapshot().controller;
    try {
      return slots.entries("settings.section").some((entry) => entry.options?.id === owner?.sectionId);
    } catch {
      return false;
    }
  }
  function sync() {
    if (!active || syncing) return;
    syncing = true;
    try {
      registry.refresh();
      if (shouldGroup()) {
        if (slot) {
          const dispose = slot;
          slot = null;
          dispose();
        }
      } else if (!slot) {
        slot = () => {
        };
        const dispose = register();
        if (typeof dispose !== "function")
          throw new TypeError("Harness \u8BBE\u7F6E\u5165\u53E3\u6CA1\u6709\u8FD4\u56DE\u6E05\u7406\u65B9\u6CD5\u3002");
        slot = dispose;
      }
    } finally {
      syncing = false;
    }
  }
  const offRegistry = registry.subscribe(sync);
  const offLedger = slots.subscribe("settings.section", sync);
  try {
    sync();
  } catch (error) {
    active = false;
    offRegistry();
    offLedger();
    slot?.();
    throw error;
  }
  return () => {
    if (!active) return;
    active = false;
    offRegistry();
    offLedger();
    const dispose = slot;
    slot = null;
    dispose?.();
  };
}

// src/enchant-theme.jsx
function useEnchantAppearance() {
  const registry = getEnchantRegistry();
  const host = getHostAppearanceStore(document);
  const [snapshot, setSnapshot] = (0, import_react3.useState)(() => registry.getSnapshot());
  const [hostAppearance, setHostAppearance] = (0, import_react3.useState)(() => host.getSnapshot());
  (0, import_react3.useLayoutEffect)(() => {
    const refresh = () => setSnapshot(registry.getSnapshot());
    const dispose = registry.subscribe(refresh);
    refresh();
    return dispose;
  }, [registry]);
  (0, import_react3.useLayoutEffect)(() => {
    const refresh = () => setHostAppearance(host.getSnapshot());
    const dispose = host.subscribe(refresh);
    refresh();
    return dispose;
  }, [host]);
  return themeAttributes(snapshot.theme, hostAppearance);
}

// src/close-icon.jsx
var import_react4 = __toESM(require("react"), 1);
function CloseIcon() {
  return /* @__PURE__ */ import_react4.default.createElement(
    "svg",
    {
      className: "bs-close-icon",
      viewBox: "0 0 24 24",
      width: "14",
      height: "14",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.7",
      strokeLinecap: "round",
      "aria-hidden": "true",
      focusable: "false"
    },
    /* @__PURE__ */ import_react4.default.createElement("path", { d: "m6 6 12 12M18 6 6 18" })
  );
}

// src/update-progress.jsx
var import_react6 = __toESM(require("react"), 1);

// src/i18n.jsx
var import_react5 = require("react");
function useI18n() {
  const store = getHostLocaleStore();
  const locale = (0, import_react5.useSyncExternalStore)(store.subscribe, store.getSnapshot, () => "zh");
  return (zh, en) => locale === "en" ? en : zh;
}

// src/update-progress.jsx
var mib = (value) => `${(Math.max(0, Number(value) || 0) / 1048576).toFixed(1)} MB`;
function UpdateProgress({ progress = {}, completed = false }) {
  const t = useI18n();
  const phase = completed ? "complete" : progress.phase;
  const downloading = phase === "downloading";
  const measured = downloading && Number.isFinite(progress.totalBytes) && progress.totalBytes > 0;
  const percent = completed ? 100 : measured ? Math.min(
    99,
    Math.max(0, Math.floor(progress.downloadedBytes / progress.totalBytes * 100))
  ) : null;
  const label = completed ? t("\u66F4\u65B0\u5B8C\u6210", "Update complete") : phase === "install" ? t("\u6B63\u5728\u5E94\u7528\u66F4\u65B0", "Applying update") : phase === "verifying" || phase === "ready" ? t("\u6B63\u5728\u6821\u9A8C\u66F4\u65B0\u5305", "Verifying update package") : downloading ? t("\u6B63\u5728\u4E0B\u8F7D\u66F4\u65B0\u5305", "Downloading update package") : t("\u6B63\u5728\u51C6\u5907\u66F4\u65B0", "Preparing update");
  return /* @__PURE__ */ import_react6.default.createElement(
    "div",
    {
      className: "bs-update-progress",
      "data-testid": "update-progress",
      "data-phase": phase || "prepare"
    },
    /* @__PURE__ */ import_react6.default.createElement("div", { className: "bs-update-progress-heading" }, /* @__PURE__ */ import_react6.default.createElement("span", null, label), percent !== null && /* @__PURE__ */ import_react6.default.createElement("strong", null, percent, "%")),
    /* @__PURE__ */ import_react6.default.createElement(
      "progress",
      {
        "aria-label": completed ? t("\u66F4\u65B0\u5B8C\u6210", "Update complete") : downloading ? t("\u66F4\u65B0\u5305\u4E0B\u8F7D\u8FDB\u5EA6", "Update package download progress") : label,
        max: "100",
        ...percent !== null ? { value: percent } : {}
      }
    ),
    /* @__PURE__ */ import_react6.default.createElement("div", { className: "bs-update-progress-detail" }, completed ? t("\u89C6\u9891\u3001\u56FE\u7247\u548C\u8BBE\u7F6E\u5DF2\u4FDD\u7559", "Videos, images and settings have been kept") : downloading ? `${mib(progress.downloadedBytes)}${measured ? ` / ${mib(progress.totalBytes)}` : t(" \xB7 \u6B63\u5728\u63A5\u6536", " \xB7 Receiving")}` : phase === "install" ? t(
      "\u6B63\u5728\u901A\u8FC7 Harness \u5B89\u5168\u5E94\u7528\u66F4\u65B0\uFF0C\u8BF7\u7A0D\u5019\u3002",
      "Applying the update through Harness. Please wait."
    ) : phase === "verifying" || phase === "ready" ? t(
      "\u4E0B\u8F7D\u5DF2\u5B8C\u6210\uFF0C\u6B63\u5728\u68C0\u67E5\u5B89\u88C5\u5305\u7684\u5B8C\u6574\u6027\u3002",
      "Download complete. Checking package integrity."
    ) : t("\u6B63\u5728\u8FDE\u63A5\u66F4\u65B0\u670D\u52A1\uFF0C\u8BF7\u7A0D\u5019\u3002", "Connecting to the update service. Please wait."))
  );
}

// src/update-prompt.jsx
function UpdatePrompt({
  request,
  status = {},
  onDismiss,
  onUpdated,
  preview: preview2 = false,
  kind = "update",
  checkError,
  install
}) {
  const t = useI18n();
  useStudioStyles();
  const appearance = useEnchantAppearance();
  const dialog = (0, import_react7.useRef)(null);
  const mounted = (0, import_react7.useRef)(true);
  const lock = (0, import_react7.useRef)(false);
  const [busy, setBusy] = (0, import_react7.useState)(false);
  const [progress, setProgress] = (0, import_react7.useState)({
    phase: "prepare",
    downloadedBytes: 0,
    totalBytes: null
  });
  const [error, setError] = (0, import_react7.useState)("");
  const [completed, setCompleted] = (0, import_react7.useState)(
    () => kind === "update" ? appliedUpdate(status) : null
  );
  const close = (0, import_react7.useCallback)(() => {
    if (lock.current) return;
    if (completed && !preview2) onUpdated?.(completed.version, completed.result);
    onDismiss?.();
  }, [completed, onDismiss, onUpdated, preview2]);
  (0, import_react7.useEffect)(() => {
    mounted.current = true;
    const element = dialog.current;
    const previous = document.activeElement;
    if (typeof element.showModal === "function") {
      if (!element.open) element.showModal();
    } else element.setAttribute("open", "");
    return () => {
      mounted.current = false;
      if (element.open && typeof element.close === "function") element.close();
      if (previous?.isConnected) previous.focus?.();
    };
  }, []);
  async function accept() {
    if (preview2 || lock.current || completed || !isAvailableUpdate(status)) return;
    lock.current = true;
    setBusy(true);
    setError("");
    try {
      const value = await prepareAndInstallUpdate(request, status, {
        install,
        onProgress: (value2) => {
          if (mounted.current) setProgress(value2);
        }
      });
      if (mounted.current) setCompleted(value);
    } catch (reason) {
      if (mounted.current) setError(reason || "\u66F4\u65B0\u672A\u5B8C\u6210\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002");
    } finally {
      lock.current = false;
      if (mounted.current) setBusy(false);
    }
  }
  const checkingFailed = kind === "error";
  const current = kind === "current";
  const sourceNotes = typeof status.manifest?.releaseNotes === "string" ? status.manifest.releaseNotes : "";
  const englishNotes = typeof status.manifest?.releaseNotesEn === "string" && status.manifest.releaseNotesEn.trim() ? status.manifest.releaseNotesEn : sourceNotes;
  const releaseNotes = t(sourceNotes, englishNotes);
  const title = current ? t("\u5DF2\u7ECF\u662F\u6700\u65B0\u7248\u672C", "You are up to date") : checkingFailed ? t("\u6682\u65F6\u65E0\u6CD5\u68C0\u67E5\u66F4\u65B0\u3002", "Unable to check for updates.") : completed ? t("\u65B0\u7684\u5F00\u573A\uFF0C\u5DF2\u51C6\u5907\u5C31\u7EEA\u3002", "Your new opening is ready.") : t("\u51C6\u5907\u597D\u65B0\u7684\u5F00\u573A", "A new opening awaits");
  const description = current ? t("\u4F60\u7684\u5F00\u673A\u52A8\u753B\u5DF2\u662F\u6700\u65B0\uFF0C\u5FEB\u53BB\u4F53\u9A8C\u5427", "Your startup animation is up to date. Enjoy!") : checkingFailed ? localizeMessage(
    checkError || (status.message ? status : t(
      "\u8BF7\u68C0\u67E5\u7F51\u7EDC\u8FDE\u63A5\uFF0C\u7A0D\u540E\u518D\u8BD5\u3002",
      "Check your network connection and try again later."
    ))
  ) : preview2 ? t(
    "\u8FD9\u91CC\u53EA\u9884\u89C8\u5F39\u7A97\u5916\u89C2\uFF0C\u4E0D\u4F1A\u4E0B\u8F7D\u6216\u5B89\u88C5\u66F4\u65B0\u3002",
    "This preview only shows the dialog. No updates will be downloaded or installed."
  ) : completed ? t(
    "\u66F4\u65B0\u5DF2\u5B8C\u6210\uFF0C\u8BF7\u5B8C\u5168\u9000\u51FA\u5E76\u91CD\u65B0\u6253\u5F00 Harness\uFF0C\u4EE5\u5E94\u7528\u65B0\u7248\u672C\u3002",
    "Update complete. Fully quit and reopen Harness to apply the new version."
  ) : t(
    "\u53D1\u73B0\u5F00\u673A\u52A8\u753B\u7684\u65B0\u7248\u672C\uFF0C\u4E3A\u4E0B\u4E00\u6B21\u542F\u52A8\u6DFB\u4E00\u70B9\u65B0\u610F",
    "A new startup animation version is available for your next launch."
  );
  return /* @__PURE__ */ import_react7.default.createElement(
    "dialog",
    {
      ref: dialog,
      className: "bs-startup-update",
      "data-testid": "startup-update",
      "data-kind": kind,
      "data-preview": preview2 || void 0,
      ...appearance,
      "aria-labelledby": "bs-startup-update-title",
      "aria-describedby": "bs-startup-update-description",
      onCancel: (event) => {
        event.preventDefault();
        close();
      }
    },
    /* @__PURE__ */ import_react7.default.createElement("div", { className: "bs-startup-update-card" }, /* @__PURE__ */ import_react7.default.createElement(
      "button",
      {
        className: "bs-startup-update-close",
        type: "button",
        "aria-label": t("\u5173\u95ED\u66F4\u65B0\u63D0\u793A", "Close update notification"),
        disabled: busy,
        onClick: close
      },
      /* @__PURE__ */ import_react7.default.createElement(CloseIcon, null)
    ), /* @__PURE__ */ import_react7.default.createElement("div", { className: "bs-startup-update-glyph", "aria-hidden": "true" }, current ? "\u2713" : checkingFailed ? "!" : "\u2727"), /* @__PURE__ */ import_react7.default.createElement("p", { className: "bs-startup-update-brand" }, "DSH LEWIS ENCHANTMENT", preview2 && /* @__PURE__ */ import_react7.default.createElement("span", null, t(" \xB7 \u66F4\u65B0\u63D0\u9192\u5916\u89C2\u9884\u89C8", " \xB7 Update notification preview"))), /* @__PURE__ */ import_react7.default.createElement("h2", { id: "bs-startup-update-title" }, title), /* @__PURE__ */ import_react7.default.createElement("p", { id: "bs-startup-update-description", className: "bs-startup-update-copy" }, description), current ? /* @__PURE__ */ import_react7.default.createElement("div", { className: "bs-startup-update-versions" }, /* @__PURE__ */ import_react7.default.createElement("strong", null, status.currentVersion ? `v${status.currentVersion}` : t("\u7248\u672C\u4FE1\u606F\u6682\u4E0D\u53EF\u7528", "Version unavailable")), /* @__PURE__ */ import_react7.default.createElement("span", null, t("\u5F53\u524D\u7248\u672C", "Current version"))) : !checkingFailed && /* @__PURE__ */ import_react7.default.createElement("div", { className: "bs-startup-update-versions" }, /* @__PURE__ */ import_react7.default.createElement("span", null, status.currentVersion ? `v${status.currentVersion}` : t("\u5F53\u524D\u7248\u672C", "Current version")), /* @__PURE__ */ import_react7.default.createElement("span", { "aria-hidden": "true" }, "\u2192"), /* @__PURE__ */ import_react7.default.createElement("strong", null, status.latestVersion ? `v${status.latestVersion}` : preview2 ? t("\u540E\u7EED\u7248\u672C", "Future version") : t("\u65B0\u7248\u672C", "New version"))), !checkingFailed && !current && !busy && !completed && /* @__PURE__ */ import_react7.default.createElement("div", { className: "bs-release-notes", "aria-label": t("\u672C\u6B21\u66F4\u65B0", "What\u2019s new") }, /* @__PURE__ */ import_react7.default.createElement("h3", null, t("\u672C\u6B21\u66F4\u65B0", "What\u2019s new")), releaseNotes.trim() ? /* @__PURE__ */ import_react7.default.createElement("p", null, releaseNotes) : /* @__PURE__ */ import_react7.default.createElement("p", { className: "bs-release-notes-empty" }, preview2 ? t(
      "\u66F4\u65B0\u8BF4\u660E\u5F85\u4F5C\u8005\u586B\u5199\uFF08\u4EC5\u672C\u5730\u9884\u89C8\uFF09",
      "Awaiting the author\u2019s release notes (local preview only)"
    ) : t("\u6B64\u7248\u672C\u672A\u63D0\u4F9B\u66F4\u65B0\u8BF4\u660E\u3002", "No release notes were provided for this version."))), !checkingFailed && !current && !completed && /* @__PURE__ */ import_react7.default.createElement("p", { className: "bs-startup-update-restart" }, t(
      "\u66F4\u65B0\u5B8C\u6210\u540E\uFF0C\u8BF7\u5B8C\u5168\u9000\u51FA\u5E76\u91CD\u65B0\u6253\u5F00 Harness\uFF0C\u4EE5\u5E94\u7528\u65B0\u7248\u672C\u3002",
      "After updating, fully quit and reopen Harness to apply the new version."
    )), !checkingFailed && !current && !completed && /* @__PURE__ */ import_react7.default.createElement("p", { className: "bs-startup-update-retain" }, t("\u4F60\u7684\u89C6\u9891\u3001\u56FE\u7247\u548C\u8BBE\u7F6E\u90FD\u4F1A\u4FDD\u7559", "Your videos, images and settings will be kept")), (busy || completed) && /* @__PURE__ */ import_react7.default.createElement(UpdateProgress, { progress, completed: !!completed }), error && /* @__PURE__ */ import_react7.default.createElement("p", { className: "bs-startup-update-error", role: "alert" }, localizeMessage(error)), error?.code?.startsWith("BOOT_HARNESS_INSTALL") && canOpenHarnessPluginManager() && /* @__PURE__ */ import_react7.default.createElement(
      "button",
      {
        type: "button",
        disabled: busy,
        onClick: () => {
          if (openHarnessPluginManager(status.packageName)) onDismiss?.();
        }
      },
      t("\u6253\u5F00\u63D2\u4EF6\u7BA1\u7406", "Open plugin manager")
    ), /* @__PURE__ */ import_react7.default.createElement("div", { className: "bs-startup-update-actions" }, current || checkingFailed ? /* @__PURE__ */ import_react7.default.createElement("button", { className: "bs-startup-update-primary", type: "button", onClick: close }, t("\u77E5\u9053\u4E86", "Got it")) : preview2 ? /* @__PURE__ */ import_react7.default.createElement("button", { className: "bs-startup-update-primary", type: "button", onClick: close }, t("\u5173\u95ED\u9884\u89C8", "Close preview")) : completed ? /* @__PURE__ */ import_react7.default.createElement(
      "button",
      {
        className: "bs-startup-update-primary",
        type: "button",
        disabled: busy,
        onClick: close
      },
      t("\u77E5\u9053\u4E86", "Got it")
    ) : /* @__PURE__ */ import_react7.default.createElement(import_react7.default.Fragment, null, /* @__PURE__ */ import_react7.default.createElement("button", { type: "button", disabled: busy, onClick: close }, t("\u7A0D\u540E\u518D\u8BF4", "Later")), /* @__PURE__ */ import_react7.default.createElement(
      "button",
      {
        className: "bs-startup-update-primary",
        type: "button",
        disabled: busy,
        onClick: accept
      },
      busy ? t("\u6B63\u5728\u66F4\u65B0\u2026", "Updating\u2026") : error ? t("\u91CD\u8BD5\u66F4\u65B0", "Retry update") : t(`\u66F4\u65B0\u5230 ${status.latestVersion}`, `Update to ${status.latestVersion}`)
    ))))
  );
}

// src/update-panel.jsx
function UpdatePanel({ request, standalone = false, install }) {
  const t = useI18n();
  const [status, setStatus] = (0, import_react8.useState)(null);
  const [busy, setBusy] = (0, import_react8.useState)(false);
  const [prompt, setPrompt] = (0, import_react8.useState)(null);
  (0, import_react8.useEffect)(() => {
    let alive = true;
    request("/updates/status").then((value) => {
      if (alive) setStatus(value);
    }).catch(() => {
    });
    return () => {
      alive = false;
    };
  }, [request]);
  async function check() {
    if (busy) return;
    setBusy(true);
    try {
      void retryUpdateAcknowledgements(request);
      const value = await request("/updates/check", { method: "POST", body: "{}" });
      setStatus(value);
      setPrompt({
        kind: isAvailableUpdate(value) ? "update" : value?.channelReady ? "current" : "error",
        status: value
      });
    } catch (e) {
      setStatus((value) => ({ ...value, available: false, channelReady: false }));
      setPrompt({
        kind: "error",
        status: status || {},
        message: e || "\u6682\u65F6\u65E0\u6CD5\u68C0\u67E5\u66F4\u65B0\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002"
      });
    } finally {
      setBusy(false);
    }
  }
  function updated(version) {
    startupUpdateSession.updated(version);
    setStatus((value) => ({ ...value, available: false, currentVersion: version }));
  }
  return /* @__PURE__ */ import_react8.default.createElement("div", { className: "bs-update-area", "data-testid": "update-panel" }, /* @__PURE__ */ import_react8.default.createElement("div", { className: "bs-section-title" }, /* @__PURE__ */ import_react8.default.createElement("h2", null, t("\u7248\u672C\u4E0E\u66F4\u65B0", "Version and updates")), /* @__PURE__ */ import_react8.default.createElement("span", null, status?.currentVersion ? `v${status.currentVersion}` : "DSH LEWIS ENCHANTMENT")), /* @__PURE__ */ import_react8.default.createElement("div", { className: "bs-update-card" }, /* @__PURE__ */ import_react8.default.createElement("div", null, /* @__PURE__ */ import_react8.default.createElement("strong", null, t("\u4E00\u6B21\u5B89\u88C5\uFF0C\u6301\u7EED\u7115\u65B0", "Install once, keep it fresh")), /* @__PURE__ */ import_react8.default.createElement("p", null, t(
    "\u66F4\u65B0\u4F1A\u4FDD\u7559\u4F60\u7684\u89C6\u9891\u3001\u7ED3\u675F\u56FE\u7247\u548C\u64AD\u653E\u504F\u597D\u3002",
    "Updates keep your videos, end screen images and playback preferences."
  )), standalone && /* @__PURE__ */ import_react8.default.createElement("small", null, t(
    "\u5F53\u524D\u4E3A\u72EC\u7ACB\u9884\u89C8\uFF0C\u68C0\u67E5\u7ED3\u679C\u4EC5\u7528\u4E8E\u5C55\u793A\u3002",
    "This is a standalone preview. Update results are for display only."
  ))), /* @__PURE__ */ import_react8.default.createElement("div", { className: "bs-update-actions" }, /* @__PURE__ */ import_react8.default.createElement("button", { type: "button", disabled: busy, onClick: check }, busy ? t("\u6B63\u5728\u68C0\u67E5\u2026", "Checking\u2026") : isAvailableUpdate(status) ? t("\u67E5\u770B\u66F4\u65B0", "View update") : status?.channelReady ? t("\u5DF2\u662F\u6700\u65B0", "Up to date") : t("\u68C0\u67E5\u66F4\u65B0", "Check for updates")))), prompt && /* @__PURE__ */ import_react8.default.createElement(
    UpdatePrompt,
    {
      request,
      status: prompt.status,
      kind: prompt.kind,
      checkError: prompt.message,
      install,
      preview: standalone && prompt.kind === "update" && !install,
      onDismiss: () => setPrompt(null),
      onUpdated: updated
    }
  ));
}

// src/shortcut-registry.js
var SHORTCUT_LIMIT = 17;
var SHORTCUT_REGISTRY_KEY = Symbol.for("dsh.lewis.enchant.shortcuts.v1");
function createRegistry2() {
  const entries = /* @__PURE__ */ new Map();
  const listeners = /* @__PURE__ */ new Set();
  let snapshot = Object.freeze({
    limit: SHORTCUT_LIMIT,
    count: 0,
    visibleIds: Object.freeze([]),
    waitingIds: Object.freeze([])
  });
  function publish2() {
    const ids = [...entries.keys()];
    snapshot = Object.freeze({
      limit: SHORTCUT_LIMIT,
      count: Math.min(ids.length, SHORTCUT_LIMIT),
      visibleIds: Object.freeze(ids.slice(0, SHORTCUT_LIMIT)),
      waitingIds: Object.freeze(ids.slice(SHORTCUT_LIMIT))
    });
    for (const listener of [...listeners]) {
      try {
        listener();
      } catch {
      }
    }
  }
  return Object.freeze({
    version: 1,
    limit: SHORTCUT_LIMIT,
    getSnapshot: () => snapshot,
    isVisible: (id) => snapshot.visibleIds.includes(id),
    subscribe(listener) {
      if (typeof listener !== "function") throw new TypeError("\u5FEB\u6377\u5165\u53E3\u76D1\u542C\u5668\u5FC5\u987B\u662F\u51FD\u6570\u3002");
      listeners.add(listener);
      let active = true;
      return () => {
        if (active) {
          active = false;
          listeners.delete(listener);
        }
      };
    },
    acquire(id) {
      if (typeof id !== "string" || !id || id.length > 128 || id !== id.trim() || /[\x00-\x1f\x7f]/.test(id))
        throw new TypeError("\u5FEB\u6377\u5165\u53E3\u9700\u8981\u7A33\u5B9A\u4E14\u6709\u6548\u7684\u63D2\u4EF6 ID\u3002");
      const owner = Symbol(id);
      let owners = entries.get(id);
      if (!owners) {
        owners = /* @__PURE__ */ new Set();
        entries.set(id, owners);
      }
      owners.add(owner);
      if (owners.size === 1) publish2();
      let active = true;
      return () => {
        if (!active) return;
        active = false;
        const current = entries.get(id);
        if (!current || !current.delete(owner) || current.size) return;
        entries.delete(id);
        publish2();
      };
    }
  });
}
function getShortcutRegistry(scope = globalThis) {
  if ((!scope || typeof scope !== "object") && typeof scope !== "function")
    throw new TypeError("\u5FEB\u6377\u5165\u53E3\u9700\u8981\u5171\u4EAB\u7A97\u53E3\u4F5C\u7528\u57DF\u3002");
  let registry = scope[SHORTCUT_REGISTRY_KEY];
  if (!registry) {
    registry = createRegistry2();
    Object.defineProperty(scope, SHORTCUT_REGISTRY_KEY, { value: registry, enumerable: false });
  }
  if (registry.version !== 1 || registry.limit !== SHORTCUT_LIMIT || !["acquire", "subscribe", "isVisible", "getSnapshot"].every(
    (key) => typeof registry[key] === "function"
  ))
    throw new Error("\u9644\u9B54\u53F0\u5FEB\u6377\u5165\u53E3\u5171\u4EAB\u534F\u8BAE\u4E0D\u517C\u5BB9\u3002");
  return registry;
}

// src/reset-dialog.jsx
var import_react9 = __toESM(require("react"), 1);
function ResetDialog({ settings = {}, onCancel, onConfirm }) {
  const t = useI18n();
  useStudioStyles();
  const appearance = useEnchantAppearance();
  const dialog = (0, import_react9.useRef)(null);
  const cancelButton = (0, import_react9.useRef)(null);
  const mounted = (0, import_react9.useRef)(true);
  const lock = (0, import_react9.useRef)(false);
  const [busy, setBusy] = (0, import_react9.useState)(false);
  const [error, setError] = (0, import_react9.useState)("");
  (0, import_react9.useEffect)(() => {
    mounted.current = true;
    const element = dialog.current;
    const previous = document.activeElement;
    if (typeof element.showModal === "function") {
      if (!element.open) element.showModal();
    } else element.setAttribute("open", "");
    cancelButton.current?.focus();
    return () => {
      mounted.current = false;
      if (element.open && typeof element.close === "function") element.close();
      if (previous?.isConnected) previous.focus?.();
    };
  }, []);
  function cancel() {
    if (!lock.current) onCancel?.();
  }
  async function confirm() {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError("");
    try {
      if (typeof onConfirm !== "function") throw Error("\u6682\u65F6\u65E0\u6CD5\u6062\u590D\u9ED8\u8BA4\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002");
      await onConfirm();
    } catch (reason) {
      if (mounted.current) setError(reason || "\u6062\u590D\u9ED8\u8BA4\u672A\u5B8C\u6210\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002");
      return;
    } finally {
      lock.current = false;
      if (mounted.current) setBusy(false);
    }
    if (mounted.current) onCancel?.();
  }
  return /* @__PURE__ */ import_react9.default.createElement(
    "dialog",
    {
      ref: dialog,
      className: "bs-startup-update bs-reset-dialog",
      "data-testid": "reset-dialog",
      ...appearance,
      "aria-labelledby": "bs-reset-title",
      "aria-describedby": "bs-reset-description bs-reset-warning",
      "aria-busy": busy,
      onCancel: (event) => {
        event.preventDefault();
        cancel();
      }
    },
    /* @__PURE__ */ import_react9.default.createElement("div", { className: "bs-startup-update-card bs-reset-card" }, /* @__PURE__ */ import_react9.default.createElement(
      "button",
      {
        className: "bs-startup-update-close",
        type: "button",
        "aria-label": t("\u53D6\u6D88\u6062\u590D\u9ED8\u8BA4", "Cancel reset"),
        disabled: busy,
        onClick: cancel
      },
      /* @__PURE__ */ import_react9.default.createElement(CloseIcon, null)
    ), /* @__PURE__ */ import_react9.default.createElement("div", { className: "bs-startup-update-glyph bs-reset-glyph", "aria-hidden": "true" }, "\u21BA"), /* @__PURE__ */ import_react9.default.createElement("p", { className: "bs-startup-update-brand" }, "DSH LEWIS ENCHANTMENT"), /* @__PURE__ */ import_react9.default.createElement("h2", { id: "bs-reset-title" }, t("\u56DE\u5230\u6700\u521D\u7684\u5F00\u573A\uFF1F", "Back to the original opening?")), /* @__PURE__ */ import_react9.default.createElement("p", { id: "bs-reset-description", className: "bs-startup-update-copy" }, t(
      "\u6062\u590D\u9ED8\u8BA4\u540E\uFF0C\u5F00\u673A\u52A8\u753B\u5C06\u56DE\u5230\u5B89\u88C5\u65F6\u7684\u72B6\u6001\u3002",
      "Reset the startup animation to its original settings."
    )), /* @__PURE__ */ import_react9.default.createElement("div", { className: "bs-startup-update-summary bs-reset-summary" }, /* @__PURE__ */ import_react9.default.createElement("p", null, t("\u5220\u9664\u5168\u90E8\u4E0A\u4F20\u7684\u89C6\u9891\u548C\u56FE\u7247", "Delete all uploaded videos and images")), /* @__PURE__ */ import_react9.default.createElement("p", null, t(
      "\u91CD\u7F6E\u64AD\u653E\u3001\u58F0\u97F3\u53CA\u7ED3\u675F\u753B\u9762\u7B49\u504F\u597D",
      "Reset playback, sound and end screen preferences"
    )), /* @__PURE__ */ import_react9.default.createElement("p", null, t("\u91CD\u7F6E\u4FA7\u680F\u5FEB\u6377\u5165\u53E3", "Reset the sidebar shortcut"))), /* @__PURE__ */ import_react9.default.createElement("p", { className: "bs-startup-update-retain bs-reset-retain" }, t("\u5B89\u88C5\u5305\u81EA\u5E26\u7684\u52A8\u753B\u548C\u5C01\u9762\u4F1A\u4FDD\u7559\u3002", "Built-in animations and covers will be kept.")), /* @__PURE__ */ import_react9.default.createElement("p", { id: "bs-reset-warning", className: "bs-reset-warning" }, t(
      "\u6B64\u64CD\u4F5C\u4E0D\u53EF\u64A4\u9500\uFF0C\u8BF7\u5148\u5907\u4EFD\u9700\u8981\u4FDD\u7559\u7684\u7D20\u6750\u3002",
      "This cannot be undone. Back up any media you want to keep first."
    )), busy && /* @__PURE__ */ import_react9.default.createElement("p", { className: "bs-startup-update-status", role: "status", "aria-live": "polite" }, t("\u6B63\u5728\u79FB\u9664\u81EA\u5B9A\u4E49\u7D20\u6750\u5E76\u6062\u590D\u9ED8\u8BA4\u2026", "Removing custom media and restoring defaults\u2026")), error && /* @__PURE__ */ import_react9.default.createElement("p", { className: "bs-startup-update-error", role: "alert" }, localizeMessage(error)), /* @__PURE__ */ import_react9.default.createElement("div", { className: "bs-startup-update-actions bs-reset-actions" }, /* @__PURE__ */ import_react9.default.createElement("button", { ref: cancelButton, type: "button", autoFocus: true, disabled: busy, onClick: cancel }, t("\u53D6\u6D88", "Cancel")), /* @__PURE__ */ import_react9.default.createElement("button", { className: "bs-reset-confirm", type: "button", disabled: busy, onClick: confirm }, busy ? t("\u6B63\u5728\u6062\u590D\u2026", "Resetting\u2026") : t("\u786E\u8BA4\u6062\u590D\u9ED8\u8BA4", "Restore defaults"))))
  );
}

// src/author-dialog.jsx
var import_react10 = __toESM(require("react"), 1);
function AuthorDialog({ settings = {}, onClose }) {
  const t = useI18n();
  useStudioStyles();
  const appearance = useEnchantAppearance();
  const dialog = (0, import_react10.useRef)(null);
  const closeButton = (0, import_react10.useRef)(null);
  const [imageFailed, setImageFailed] = (0, import_react10.useState)(false);
  (0, import_react10.useEffect)(() => {
    const element = dialog.current;
    const previous = document.activeElement;
    if (typeof element.showModal === "function") {
      if (!element.open) element.showModal();
    } else element.setAttribute("open", "");
    closeButton.current?.focus();
    return () => {
      if (element.open && typeof element.close === "function") element.close();
      if (previous?.isConnected) previous.focus?.();
    };
  }, []);
  function backdropClick(event) {
    if (event.target !== event.currentTarget) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)
      onClose();
  }
  return /* @__PURE__ */ import_react10.default.createElement(
    "dialog",
    {
      ref: dialog,
      className: "bs-startup-update bs-author-dialog",
      "data-testid": "author-dialog",
      ...appearance,
      "aria-label": t("\u4F5C\u8005\u56FE\u7247", "Author image"),
      onCancel: (event) => {
        event.preventDefault();
        onClose();
      },
      onClick: backdropClick
    },
    /* @__PURE__ */ import_react10.default.createElement("div", { className: "bs-startup-update-card bs-author-card" }, /* @__PURE__ */ import_react10.default.createElement(
      "button",
      {
        ref: closeButton,
        className: "bs-startup-update-close",
        type: "button",
        "aria-label": t("\u5173\u95ED\u4F5C\u8005\u4FE1\u606F", "Close author information"),
        onClick: onClose
      },
      /* @__PURE__ */ import_react10.default.createElement(CloseIcon, null)
    ), imageFailed ? /* @__PURE__ */ import_react10.default.createElement("span", { className: "bs-visually-hidden", role: "alert" }, t(
      "\u56FE\u7247\u6682\u65F6\u65E0\u6CD5\u663E\u793A\uFF0C\u8BF7\u5173\u95ED\u540E\u91CD\u8BD5\u3002",
      "The image is unavailable. Close this dialog and try again."
    )) : /* @__PURE__ */ import_react10.default.createElement("div", { className: "bs-author-image-frame" }, /* @__PURE__ */ import_react10.default.createElement(
      "img",
      {
        className: "bs-author-image",
        src: `${BASE_PATH}/author-image`,
        alt: t("\u4F5C\u8005\u63D0\u4F9B\u7684\u5FAE\u4FE1\u6536\u6B3E\u7801", "WeChat payment QR code provided by the author"),
        onError: () => setImageFailed(true)
      }
    )))
  );
}

// src/media-upload.js
var TYPES = Object.freeze({
  video: {
    extension: /\.(mp4|m4v|webm)$/i,
    maxBytes: 209715200,
    path: "/upload",
    timeout: "uploadVideo"
  },
  image: {
    extension: /\.(png|jpe?g|webp)$/i,
    maxBytes: 20971520,
    path: "/end-images",
    timeout: "uploadImage"
  }
});
var cancelled = () => clientError("BOOT_REQUEST_CANCELLED", "\u8BF7\u6C42\u5DF2\u53D6\u6D88\u3002");
function validateMediaFile(file, kind, maxBytes = TYPES[kind]?.maxBytes) {
  const type = TYPES[kind];
  if (!type) throw TypeError("Unknown media kind");
  if (!file || !type.extension.test(file.name || ""))
    throw clientError(
      kind === "image" ? "BOOT_IMAGE_TYPE" : "BOOT_VIDEO_TYPE",
      kind === "image" ? "\u8BF7\u9009\u62E9\u4E0D\u8D85\u8FC720 MB\u7684PNG\u3001JPEG\u6216WebP\u56FE\u7247\u3002" : "\u8BF7\u9009\u62E9 MP4\u3001M4V \u6216 WebM \u89C6\u9891\u3002\u63A8\u8350 MP4\uFF08H.264 / AAC\uFF09\u3002"
    );
  if (!Number.isFinite(file.size) || file.size <= 0 || file.size > maxBytes)
    throw clientError(
      kind === "image" ? "BOOT_IMAGE_TOO_LARGE" : "BOOT_VIDEO_TOO_LARGE",
      kind === "image" ? "\u8BF7\u9009\u62E9\u4E0D\u8D85\u8FC720 MB\u7684PNG\u3001JPEG\u6216WebP\u56FE\u7247\u3002" : "\u89C6\u9891\u5E94\u5927\u4E8E 0 \u5B57\u8282\uFF0C\u4E14\u4E0D\u8D85\u8FC7 200 MB\u3002"
    );
}
function probeMediaFile(file, kind, {
  signal,
  documentImpl = globalThis.document,
  ImageImpl = globalThis.Image,
  urlImpl = globalThis.URL
} = {}) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(cancelled());
      return;
    }
    let probe, objectURL, timer, settled = false;
    const cleanup = () => {
      clearTimeout(timer);
      signal?.removeEventListener("abort", abort);
      if (probe) {
        probe.onload = probe.onloadeddata = probe.onerror = null;
        if (kind === "video") {
          probe.removeAttribute("src");
          probe.load();
        } else probe.src = "";
      }
      if (objectURL) urlImpl.revokeObjectURL(objectURL);
    };
    const finish = (error) => {
      if (settled) return;
      settled = true;
      cleanup();
      if (error) reject(error);
      else resolve();
    };
    const abort = () => finish(cancelled());
    const fail = () => finish(
      clientError(
        kind === "image" ? "BOOT_IMAGE_DECODE" : "BOOT_VIDEO_DECODE",
        kind === "image" ? "\u65E0\u6CD5\u8BFB\u53D6\u8FD9\u5F20\u56FE\u7247\uFF0C\u8BF7\u66F4\u6362\u6709\u6548\u7684PNG\u3001JPEG\u6216WebP\u3002" : "\u6D4F\u89C8\u5668\u65E0\u6CD5\u8BFB\u53D6\u6B64\u89C6\u9891\u3002\u8BF7\u8F6C\u6362\u4E3A MP4\uFF08H.264 / AAC\uFF09\u540E\u91CD\u8BD5\u3002"
      )
    );
    try {
      probe = kind === "image" ? new ImageImpl() : documentImpl.createElement("video");
      objectURL = urlImpl.createObjectURL(file);
      signal?.addEventListener("abort", abort, { once: true });
      timer = setTimeout(fail, kind === "image" ? 1e4 : 12e3);
      probe.onerror = fail;
      if (kind === "image") probe.onload = () => finish();
      else {
        probe.onloadeddata = () => finish();
        probe.preload = "auto";
      }
      probe.src = objectURL;
      if (kind === "video") probe.load();
    } catch {
      fail();
    }
  });
}
function sendMedia(file, kind, { signal, basePath, onProgress, xhrFactory }) {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(cancelled());
      return;
    }
    const xhr = xhrFactory();
    let settled = false;
    const finish = (error, result) => {
      if (settled) return;
      settled = true;
      signal.removeEventListener("abort", abort);
      xhr.onload = xhr.onerror = xhr.ontimeout = xhr.onabort = null;
      xhr.upload.onprogress = null;
      if (error) reject(error);
      else resolve(result);
    };
    const abort = () => {
      xhr.abort();
      finish(cancelled());
    };
    signal.addEventListener("abort", abort, { once: true });
    xhr.open("POST", basePath + TYPES[kind].path);
    xhr.setRequestHeader("x-dsh-boot-studio", "1");
    xhr.setRequestHeader("x-file-name", encodeURIComponent(file.name));
    xhr.setRequestHeader("content-type", file.type || "application/octet-stream");
    xhr.timeout = API_TIMEOUTS[TYPES[kind].timeout];
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress?.(Math.round(event.loaded / event.total * 100));
    };
    xhr.onload = () => {
      try {
        finish(
          null,
          parseJSONResponse(xhr.responseText, {
            status: xhr.status,
            contentType: xhr.getResponseHeader("content-type")
          })
        );
      } catch (error) {
        finish(error);
      }
    };
    xhr.onerror = () => finish(clientError("BOOT_UPLOAD_INTERRUPTED", "\u4E0A\u4F20\u4E2D\u65AD\uFF0C\u8BF7\u91CD\u8BD5\u3002"));
    xhr.ontimeout = () => finish(clientError("BOOT_UPLOAD_TIMEOUT", "\u4E0A\u4F20\u7B49\u5F85\u8D85\u65F6\uFF0C\u8BF7\u91CD\u8BD5\u3002"));
    xhr.onabort = () => finish(cancelled());
    try {
      xhr.send(file);
    } catch {
      finish(clientError("BOOT_UPLOAD_INTERRUPTED", "\u4E0A\u4F20\u4E2D\u65AD\uFF0C\u8BF7\u91CD\u8BD5\u3002"));
    }
  });
}
function createMediaUpload(file, {
  kind = "video",
  maxBytes = TYPES[kind]?.maxBytes,
  basePath = BASE_PATH,
  onPhase,
  onProgress,
  probe = probeMediaFile,
  xhrFactory = () => new XMLHttpRequest()
} = {}) {
  const controller = new AbortController();
  const promise = Promise.resolve().then(async () => {
    validateMediaFile(file, kind, maxBytes);
    onPhase?.("probe");
    await probe(file, kind, { signal: controller.signal });
    if (controller.signal.aborted) throw cancelled();
    onPhase?.("upload");
    onProgress?.(0);
    return sendMedia(file, kind, { signal: controller.signal, basePath, onProgress, xhrFactory });
  });
  return { promise, cancel: () => controller.abort() };
}

// src/player-input.js
var MODIFIERS = /* @__PURE__ */ new Set(["Control", "Meta", "Alt", "Shift", "AltGraph", "OS"]);
function handlePlayerKey(event, advance) {
  if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || MODIFIERS.has(event.key) || event.isComposing)
    return false;
  event.preventDefault();
  event.stopPropagation();
  if (!event.repeat) advance();
  return true;
}

// src/settings-sections.jsx
var import_react11 = __toESM(require("react"), 1);
function VideoLibrary({
  state,
  settings,
  busy,
  preview: preview2,
  save,
  remove,
  pendingDelete,
  setPendingDelete,
  input,
  upload
}) {
  const t = useI18n();
  return /* @__PURE__ */ import_react11.default.createElement(import_react11.default.Fragment, null, /* @__PURE__ */ import_react11.default.createElement("div", { className: "bs-library" }, state.clips.map((clip, index) => /* @__PURE__ */ import_react11.default.createElement(
    "article",
    {
      key: clip.id,
      className: `bs-clip ${clip.id === settings.selectedId ? "is-selected" : ""}`
    },
    /* @__PURE__ */ import_react11.default.createElement(
      "button",
      {
        type: "button",
        className: `bs-thumbnail bs-tone-${index % 4}`,
        "aria-label": t(`\u9884\u89C8 ${localizedName(clip)}`, `Preview ${localizedName(clip)}`),
        onClick: () => preview2(clip, settings, false, true),
        disabled: busy
      },
      clip.kind === "sequence" ? /* @__PURE__ */ import_react11.default.createElement("div", { className: "bs-sequence-thumb" }, /* @__PURE__ */ import_react11.default.createElement("svg", { viewBox: "0 0 50 50", "aria-hidden": "true" }, /* @__PURE__ */ import_react11.default.createElement("path", { d: WHALE_PATH })), /* @__PURE__ */ import_react11.default.createElement("span", null, "DEEPSEEK"), /* @__PURE__ */ import_react11.default.createElement("small", null, "TECHNICAL DOSSIER")) : /* @__PURE__ */ import_react11.default.createElement(
        "video",
        {
          src: clip.url + "#t=0.4",
          muted: true,
          playsInline: true,
          preload: "metadata",
          tabIndex: -1
        }
      ),
      /* @__PURE__ */ import_react11.default.createElement("span", { className: "bs-thumbnail-shade" }),
      /* @__PURE__ */ import_react11.default.createElement("span", { className: "bs-play-icon" }, "\u25B6"),
      /* @__PURE__ */ import_react11.default.createElement("span", { className: "bs-clip-number" }, String(index + 1).padStart(2, "0")),
      /* @__PURE__ */ import_react11.default.createElement("span", { className: "bs-badge" }, clip.kind === "sequence" ? t("\u7A0B\u5E8F\u52A8\u753B", "Animated sequence") : clip.source === "builtin" ? t("\u5185\u7F6E", "Built-in") : t("\u6211\u7684\u89C6\u9891", "My video"))
    ),
    /* @__PURE__ */ import_react11.default.createElement("div", { className: "bs-clip-info" }, /* @__PURE__ */ import_react11.default.createElement("h3", null, localizedName(clip)), /* @__PURE__ */ import_react11.default.createElement("span", null, clip.kind === "sequence" ? t("\u539F\u7248\u89C6\u89C9\u5E8F\u5217", "Original visual sequence") : (clip.bytes / 1048576).toFixed(1) + " MB")),
    /* @__PURE__ */ import_react11.default.createElement("div", { className: "bs-clip-actions" }, /* @__PURE__ */ import_react11.default.createElement(
      "button",
      {
        type: "button",
        className: clip.id === settings.selectedId ? "bs-selected" : "",
        onClick: () => save({ selectedId: clip.id }),
        disabled: busy || clip.id === settings.selectedId
      },
      clip.id === settings.selectedId ? t("\u2713 \u5F53\u524D\u52A8\u753B", "\u2713 Selected") : t("\u4F7F\u7528\u6B64\u52A8\u753B", "Use this animation")
    ), clip.source === "upload" && /* @__PURE__ */ import_react11.default.createElement(
      "button",
      {
        className: "bs-delete",
        "aria-label": t(`\u5220\u9664 ${localizedName(clip)}`, `Delete ${localizedName(clip)}`),
        disabled: busy,
        onClick: () => setPendingDelete(clip)
      },
      t("\u79FB\u9664", "Remove")
    )),
    pendingDelete?.id === clip.id && /* @__PURE__ */ import_react11.default.createElement("div", { className: "bs-delete-confirm" }, t("\u79FB\u9664\u6B64\u89C6\u9891\uFF1F", "Remove this video?"), /* @__PURE__ */ import_react11.default.createElement("button", { type: "button", disabled: busy, onClick: () => remove(clip) }, t("\u786E\u8BA4\u79FB\u9664", "Confirm removal")), /* @__PURE__ */ import_react11.default.createElement("button", { type: "button", onClick: () => setPendingDelete(null) }, t("\u53D6\u6D88", "Cancel")))
  )), /* @__PURE__ */ import_react11.default.createElement(
    "button",
    {
      type: "button",
      className: "bs-upload",
      disabled: busy,
      onClick: () => input.current?.click(),
      onDragOver: (e) => e.preventDefault(),
      onDrop: (e) => {
        e.preventDefault();
        upload(e.dataTransfer.files?.[0]);
      }
    },
    /* @__PURE__ */ import_react11.default.createElement("span", null, "\uFF0B"),
    /* @__PURE__ */ import_react11.default.createElement("strong", null, t("\u4E0A\u4F20\u6211\u7684\u89C6\u9891", "Upload my video")),
    /* @__PURE__ */ import_react11.default.createElement("small", null, t("\u70B9\u51FB\u9009\u62E9\uFF0C\u6216\u5C06\u89C6\u9891\u62D6\u5230\u8FD9\u91CC", "Click to select or drop a video here")),
    /* @__PURE__ */ import_react11.default.createElement("small", null, "MP4 / WebM / M4V \xB7 \u2264 200 MB")
  )), state.storage && state.maxCustomMediaBytes > 0 && state.maxCustomMediaFiles > 0 && /* @__PURE__ */ import_react11.default.createElement("p", { className: "bs-hint", role: "status" }, t(
    `\u4E2A\u4EBA\u7D20\u6750\u5DF2\u7528 ${(state.storage.bytes / 1048576).toFixed(1)} / ${(state.maxCustomMediaBytes / 1048576).toFixed(0)} MB\uFF08${state.storage.files} / ${state.maxCustomMediaFiles} \u4E2A\uFF09\u3002\u89C6\u9891\u4E0E\u56FE\u7247\u5171\u7528\u989D\u5EA6\uFF0C\u79FB\u9664\u4E0D\u7528\u7684\u7D20\u6750\u53EF\u91CA\u653E\u7A7A\u95F4\u3002`,
    `Custom media: ${(state.storage.bytes / 1048576).toFixed(1)} / ${(state.maxCustomMediaBytes / 1048576).toFixed(0)} MB (${state.storage.files} / ${state.maxCustomMediaFiles} files). Videos and images share this limit. Remove unused media to free space.`
  )), /* @__PURE__ */ import_react11.default.createElement(
    "input",
    {
      ref: input,
      type: "file",
      accept: ".mp4,.m4v,.webm,video/mp4,video/webm",
      "aria-label": t("\u4E0A\u4F20\u5F00\u673A\u89C6\u9891", "Upload startup video"),
      hidden: true,
      onChange: (e) => {
        upload(e.target.files?.[0]);
        e.target.value = "";
      }
    }
  ));
}
function EndingSettings({
  state,
  settings,
  busy,
  preview: preview2,
  save,
  imageInput,
  uploadEndImage,
  removeEndImage,
  pendingImageDelete,
  setPendingImageDelete,
  EndTitleComponent
}) {
  const t = useI18n();
  const previewEnding = (patch = {}) => preview2(null, { ...settings, ...patch }, true);
  return /* @__PURE__ */ import_react11.default.createElement(import_react11.default.Fragment, null, /* @__PURE__ */ import_react11.default.createElement("div", { className: "bs-preferences bs-ending-settings" }, /* @__PURE__ */ import_react11.default.createElement("div", { className: "bs-field bs-ending-header" }, /* @__PURE__ */ import_react11.default.createElement("h2", null, t("\u7ED3\u675F\u505C\u7559\u753B\u9762", "Ending screen")), /* @__PURE__ */ import_react11.default.createElement(
    "select",
    {
      "aria-label": t("\u7ED3\u675F\u753B\u9762\u7C7B\u578B", "Ending screen type"),
      disabled: busy,
      value: settings.endScreen || "logo",
      onChange: (e) => {
        if (e.target.value === "image" && !settings.endImageId) {
          imageInput.current?.click();
          return;
        }
        save({ endScreen: e.target.value });
      }
    },
    /* @__PURE__ */ import_react11.default.createElement("option", { value: "logo" }, t("\u5185\u7F6E\u753B\u9762", "Built-in screens")),
    /* @__PURE__ */ import_react11.default.createElement("option", { value: "image" }, t("\u6211\u7684\u56FE\u7247", "My images"))
  )), !!state.logos?.length && /* @__PURE__ */ import_react11.default.createElement("div", { className: "bs-logo-options" }, state.logos.map((logo) => {
    const selected = settings.endScreen === "logo" && settings.logoVariant === logo.id;
    return /* @__PURE__ */ import_react11.default.createElement("article", { className: `bs-end-card ${selected ? "is-selected" : ""}`, key: logo.id }, /* @__PURE__ */ import_react11.default.createElement(
      "button",
      {
        type: "button",
        className: "bs-end-preview",
        disabled: busy,
        "aria-label": t(
          `\u9884\u89C8\u5185\u7F6E\u7ED3\u675F\u753B\u9762 ${localizedName(logo)}`,
          `Preview built-in ending screen ${localizedName(logo)}`
        ),
        onClick: () => previewEnding({ endScreen: "logo", logoVariant: logo.id })
      },
      /* @__PURE__ */ import_react11.default.createElement("img", { src: logo.url, alt: "", style: { objectFit: logo.fit || "cover" } }),
      /* @__PURE__ */ import_react11.default.createElement("span", null, localizedName(logo))
    ), /* @__PURE__ */ import_react11.default.createElement("div", { className: "bs-clip-actions" }, /* @__PURE__ */ import_react11.default.createElement(
      "button",
      {
        type: "button",
        className: selected ? "bs-selected" : "",
        disabled: busy || selected,
        "aria-pressed": selected,
        "aria-label": t(
          `\u4F7F\u7528\u5185\u7F6E\u7ED3\u675F\u753B\u9762 ${localizedName(logo)}`,
          `Use built-in ending screen ${localizedName(logo)}`
        ),
        onClick: () => save({ endScreen: "logo", logoVariant: logo.id })
      },
      selected ? t("\u2713 \u5F53\u524D\u753B\u9762", "\u2713 Selected") : t("\u4F7F\u7528\u6B64\u753B\u9762", "Use this screen")
    )));
  })), /* @__PURE__ */ import_react11.default.createElement("div", { className: "bs-ending-preview" }, /* @__PURE__ */ import_react11.default.createElement(
    "button",
    {
      type: "button",
      className: "bs-ending-mini",
      disabled: busy,
      "aria-label": t("\u9884\u89C8\u5F53\u524D\u7ED3\u675F\u753B\u9762", "Preview current ending screen"),
      onClick: () => previewEnding()
    },
    /* @__PURE__ */ import_react11.default.createElement(EndTitleComponent, { settings })
  ), /* @__PURE__ */ import_react11.default.createElement("div", null, /* @__PURE__ */ import_react11.default.createElement("strong", null, settings.endScreen === "image" ? t("\u6211\u7684\u56FE\u7247", "My image") : localizedName(state.logos?.find((logo) => logo.id === settings.logoVariant)) || t("DeepSeek \u6807\u5FD7", "DeepSeek logo")), /* @__PURE__ */ import_react11.default.createElement(
    "button",
    {
      type: "button",
      className: "bs-primary",
      disabled: busy,
      onClick: () => imageInput.current?.click()
    },
    t("\u4E0A\u4F20\u7ED3\u675F\u56FE\u7247", "Upload ending image")
  ), /* @__PURE__ */ import_react11.default.createElement("small", null, "PNG / JPEG / WebP \xB7 \u2264 20 MB"))), settings.endScreen === "image" && /* @__PURE__ */ import_react11.default.createElement("label", { className: "bs-field" }, /* @__PURE__ */ import_react11.default.createElement("span", null, t("\u7ED3\u675F\u56FE\u7247\u663E\u793A", "Image fit")), /* @__PURE__ */ import_react11.default.createElement(
    "select",
    {
      "aria-label": t("\u7ED3\u675F\u56FE\u7247\u663E\u793A", "Image fit"),
      value: settings.endFit || "cover",
      disabled: busy,
      onChange: (e) => save({ endFit: e.target.value })
    },
    /* @__PURE__ */ import_react11.default.createElement("option", { value: "contain" }, t("\u5B8C\u6574\u663E\u793A", "Fit entire image")),
    /* @__PURE__ */ import_react11.default.createElement("option", { value: "cover" }, t("\u94FA\u6EE1\u7A97\u53E3", "Fill window"))
  )), !!state.endImages?.length && /* @__PURE__ */ import_react11.default.createElement("div", { className: "bs-end-library" }, state.endImages.map((image) => /* @__PURE__ */ import_react11.default.createElement(
    "div",
    {
      className: `bs-end-card ${settings.endScreen === "image" && settings.endImageId === image.id ? "is-selected" : ""}`,
      key: image.id
    },
    /* @__PURE__ */ import_react11.default.createElement(
      "button",
      {
        type: "button",
        className: "bs-end-preview",
        disabled: busy,
        "aria-label": t(`\u9884\u89C8\u7ED3\u675F\u56FE\u7247 ${image.name}`, `Preview ending image ${image.name}`),
        onClick: () => previewEnding({ endImageId: image.id, endScreen: "image" })
      },
      /* @__PURE__ */ import_react11.default.createElement("img", { src: image.url, alt: "" }),
      /* @__PURE__ */ import_react11.default.createElement("span", null, image.name)
    ),
    /* @__PURE__ */ import_react11.default.createElement("div", { className: "bs-clip-actions" }, /* @__PURE__ */ import_react11.default.createElement(
      "button",
      {
        type: "button",
        disabled: busy || settings.endScreen === "image" && settings.endImageId === image.id,
        className: settings.endScreen === "image" && settings.endImageId === image.id ? "bs-selected" : "",
        "aria-pressed": settings.endScreen === "image" && settings.endImageId === image.id,
        "aria-label": t(`\u4F7F\u7528\u7ED3\u675F\u56FE\u7247 ${image.name}`, `Use ending image ${image.name}`),
        onClick: () => save({ endImageId: image.id, endScreen: "image" })
      },
      settings.endScreen === "image" && settings.endImageId === image.id ? t("\u2713 \u5F53\u524D\u753B\u9762", "\u2713 Selected") : t("\u4F7F\u7528\u6B64\u753B\u9762", "Use this screen")
    ), pendingImageDelete !== image.id && /* @__PURE__ */ import_react11.default.createElement(
      "button",
      {
        type: "button",
        disabled: busy,
        className: "bs-delete",
        "aria-label": t(
          `\u79FB\u9664\u7ED3\u675F\u56FE\u7247 ${image.name}`,
          `Remove ending image ${image.name}`
        ),
        onClick: () => setPendingImageDelete(image.id)
      },
      t("\u79FB\u9664", "Remove")
    )),
    pendingImageDelete === image.id ? /* @__PURE__ */ import_react11.default.createElement("div", { className: "bs-end-delete-confirm" }, /* @__PURE__ */ import_react11.default.createElement("button", { type: "button", disabled: busy, onClick: () => removeEndImage(image) }, t("\u786E\u8BA4\u79FB\u9664", "Confirm removal")), /* @__PURE__ */ import_react11.default.createElement("button", { type: "button", onClick: () => setPendingImageDelete(null) }, t("\u53D6\u6D88", "Cancel"))) : null
  )))), /* @__PURE__ */ import_react11.default.createElement(
    "input",
    {
      ref: imageInput,
      type: "file",
      accept: ".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp",
      "aria-label": t("\u4E0A\u4F20\u7ED3\u675F\u56FE\u7247", "Upload ending image"),
      hidden: true,
      onChange: (e) => {
        uploadEndImage(e.target.files?.[0]);
        e.target.value = "";
      }
    }
  ));
}

// src/client.jsx
var OPEN = `${CORE_PACKAGE_NAME}:open`;
var PLAY = `${CORE_PACKAGE_NAME}:play`;
var bootClaimed = false;
var launchRequest = null;
var launchDecisionSettled = false;
var latestState = null;
var subscribers = /* @__PURE__ */ new Set();
var playerWindows = /* @__PURE__ */ new WeakMap();
var VERSION = true ? "1.3.2" : null;
function acquirePlayerWindow(doc) {
  const root = doc.documentElement;
  let state = playerWindows.get(doc);
  if (!state) {
    state = { count: 0, previous: root.getAttribute("data-lewis-player") };
    playerWindows.set(doc, state);
  }
  state.count++;
  root.setAttribute("data-lewis-player", "true");
  let released = false;
  return () => {
    if (released) return;
    released = true;
    if (--state.count) return;
    if (state.previous === null) root.removeAttribute("data-lewis-player");
    else root.setAttribute("data-lewis-player", state.previous);
    playerWindows.delete(doc);
  };
}
function publish(value) {
  latestState = value;
  subscribers.forEach((fn) => fn(value));
  return value;
}
function openSettings() {
  if (getEnchantRegistry().openControllerSettings(NPM_ENTRY_NAME)) return;
  window.dispatchEvent(new Event(OPEN));
}
function preview(clip, settings, endOnly = false, clipOnly = false) {
  window.dispatchEvent(new CustomEvent(PLAY, { detail: { clip, settings, endOnly, clipOnly } }));
}
function playbackStages(settings = {}, { endOnly = false, clipOnly = false } = {}) {
  if (endOnly) return { video: false, end: true };
  if (clipOnly) return { video: true, end: false };
  const legacy = settings.enabled !== false;
  return {
    video: typeof settings.videoEnabled === "boolean" ? settings.videoEnabled : legacy,
    end: typeof settings.endEnabled === "boolean" ? settings.endEnabled : legacy
  };
}
function EndTitle({ settings }) {
  const t = useI18n();
  const [imageFailed, setImageFailed] = (0, import_react12.useState)(false);
  (0, import_react12.useEffect)(
    () => setImageFailed(false),
    [settings.endImageId, settings.logoVariant, settings.endScreen]
  );
  const variant = settings.logoVariant || "silver";
  const userImage = settings.endScreen === "image" && settings.endImageId && !imageFailed;
  const builtinImage = settings.endScreen !== "image" && variant !== "classic" && !imageFailed;
  const imageURL = userImage ? `${BASE_PATH}/end-image/${encodeURIComponent(settings.endImageId)}` : builtinImage ? `${BASE_PATH}/logo/${encodeURIComponent(variant)}` : null;
  return /* @__PURE__ */ import_react12.default.createElement(
    "div",
    {
      className: `bs-end-title bs-end-${userImage ? "custom" : variant}`,
      "data-testid": "end-screen",
      "data-logo": builtinImage ? variant : void 0
    },
    imageURL ? /* @__PURE__ */ import_react12.default.createElement(
      "img",
      {
        className: "bs-end-image",
        "data-testid": userImage ? "end-image" : "end-logo-image",
        src: imageURL,
        alt: userImage ? t("\u81EA\u5B9A\u4E49\u7ED3\u675F\u753B\u9762", "Custom ending screen") : t("DeepSeek \u5185\u7F6E\u7ED3\u675F\u753B\u9762", "DeepSeek built-in ending screen"),
        style: { objectFit: userImage ? settings.endFit || "cover" : "cover" },
        onError: () => setImageFailed(true)
      }
    ) : /* @__PURE__ */ import_react12.default.createElement("div", { className: "bs-end-brand" }, /* @__PURE__ */ import_react12.default.createElement("div", { className: "bs-end-halo" }), /* @__PURE__ */ import_react12.default.createElement(
      "svg",
      {
        className: "bs-end-whale",
        viewBox: "0 0 50 50",
        "aria-label": t("DeepSeek \u6807\u5FD7", "DeepSeek logo"),
        role: "img"
      },
      /* @__PURE__ */ import_react12.default.createElement("path", { d: WHALE_PATH })
    ), /* @__PURE__ */ import_react12.default.createElement("h1", null, "DEEPSEEK"), /* @__PURE__ */ import_react12.default.createElement("p", null, "HARNESS"), /* @__PURE__ */ import_react12.default.createElement("div", { className: "bs-end-rule" })),
    /* @__PURE__ */ import_react12.default.createElement("p", { className: "bs-enter-prompt" }, t("\u70B9\u51FB\u8FDB\u5165 DeepSeek Harness", "Click to enter DeepSeek Harness"))
  );
}
function Player({ clip, settings = {}, onClose, endOnly = false, clipOnly = false }) {
  const t = useI18n();
  useStudioStyles();
  const appearance = useEnchantAppearance();
  const video = (0, import_react12.useRef)(null);
  const dialog = (0, import_react12.useRef)(null);
  const closed = (0, import_react12.useRef)(false);
  const stages = playbackStages(settings, { endOnly, clipOnly });
  const initialPhase = stages.video ? "intro" : stages.end ? "end" : "idle";
  const [phase, setPhase] = (0, import_react12.useState)(initialPhase);
  const phaseRef = (0, import_react12.useRef)(initialPhase);
  const lastInput = (0, import_react12.useRef)(-1e3);
  const [blocked, setBlocked] = (0, import_react12.useState)(false);
  const [mutedFallback, setMutedFallback] = (0, import_react12.useState)(false);
  const stopMedia = (0, import_react12.useCallback)(() => {
    const el = video.current;
    if (el) {
      el.pause();
      el.removeAttribute("src");
      el.load();
    }
  }, []);
  const close = (0, import_react12.useCallback)(
    (reason) => {
      if (closed.current) return;
      closed.current = true;
      stopMedia();
      onClose(reason);
    },
    [onClose, stopMedia]
  );
  const showEnd = (0, import_react12.useCallback)(() => {
    if (closed.current || phaseRef.current === "end") return;
    if (!stages.end) {
      close("complete");
      return;
    }
    phaseRef.current = "end";
    stopMedia();
    setPhase("end");
  }, [stopMedia, close, stages.end]);
  const advance = (0, import_react12.useCallback)(() => {
    const now = performance.now();
    if (now - lastInput.current < 250) return;
    lastInput.current = now;
    if (phaseRef.current === "intro") showEnd();
    else close("enter");
  }, [showEnd, close]);
  (0, import_react12.useEffect)(() => {
    closed.current = false;
    if (phaseRef.current === "idle") {
      close("disabled");
      return;
    }
    const playerDialog = dialog.current;
    const previous = document.activeElement;
    const releaseWindow = acquirePlayerWindow(document);
    if (typeof playerDialog.showModal === "function" && !playerDialog.open)
      playerDialog.showModal();
    else playerDialog.setAttribute("open", "");
    const key = (event) => handlePlayerKey(event, advance);
    window.addEventListener("keydown", key, true);
    playerDialog.focus();
    return () => {
      closed.current = true;
      releaseWindow();
      window.removeEventListener("keydown", key, true);
      if (playerDialog.open && typeof playerDialog.close === "function") playerDialog.close();
      if (previous?.isConnected) previous.focus?.();
    };
  }, [advance, close]);
  (0, import_react12.useEffect)(() => {
    if (phase !== "intro") return;
    if (clip.kind === "sequence") {
      const timeout = setTimeout(showEnd, 12e4);
      return () => clearTimeout(timeout);
    }
    const playerVideo = video.current;
    if (!playerVideo) return;
    let progressAt = performance.now();
    let previousTime = playerVideo.currentTime;
    const watchdog = setInterval(() => {
      if (playerVideo.currentTime !== previousTime) {
        previousTime = playerVideo.currentTime;
        progressAt = performance.now();
      }
      if (performance.now() - progressAt > 3e4) showEnd();
    }, 1e3);
    return () => {
      clearInterval(watchdog);
      playerVideo.pause();
      playerVideo.removeAttribute("src");
      playerVideo.load();
    };
  }, [phase, clip?.kind, showEnd]);
  (0, import_react12.useEffect)(() => {
    if (phase !== "intro" || clip.kind === "sequence") return;
    const el = video.current;
    let alive = true;
    el.volume = settings.volume ?? 0.7;
    el.muted = !settings.sound;
    const start = async () => {
      try {
        await el.play();
        if (!alive || closed.current) el.pause();
      } catch (error) {
        if (!alive || closed.current) return;
        if (settings.sound && !el.muted) {
          el.muted = true;
          setMutedFallback(true);
          try {
            await el.play();
            if (!alive || closed.current) el.pause();
          } catch {
            if (alive && !closed.current) setBlocked(true);
          }
        } else setBlocked(true);
      }
    };
    void start();
    return () => {
      alive = false;
    };
  }, [clip?.url, clip?.kind, phase, settings.sound, settings.volume, showEnd]);
  const enableSound = async (e) => {
    e.stopPropagation();
    const el = video.current;
    el.muted = false;
    try {
      await el.play();
      setMutedFallback(false);
      setBlocked(false);
    } catch {
      el.muted = true;
      setBlocked(true);
    }
  };
  const playManually = async (e) => {
    e.stopPropagation();
    try {
      await video.current.play();
      setBlocked(false);
    } catch {
      showEnd();
    }
  };
  if (phase === "idle") return null;
  return /* @__PURE__ */ import_react12.default.createElement(
    "dialog",
    {
      ref: dialog,
      className: "bs-player",
      "data-testid": "player",
      "data-phase": phase,
      ...appearance,
      "aria-label": phase === "end" ? t("DeepSeek \u6807\u9898\u754C\u9762", "DeepSeek title screen") : t(`\u5F00\u673A\u52A8\u753B\uFF1A${localizedName(clip)}`, `Startup animation: ${localizedName(clip)}`),
      tabIndex: -1,
      onCancel: (e) => {
        e.preventDefault();
        advance();
      },
      onPointerDown: (e) => {
        if (!e.target.closest("[data-bs-control]")) advance();
      }
    },
    phase === "end" ? /* @__PURE__ */ import_react12.default.createElement(EndTitle, { settings }) : /* @__PURE__ */ import_react12.default.createElement(import_react12.default.Fragment, null, clip.kind === "sequence" ? /* @__PURE__ */ import_react12.default.createElement(StartupSequence, { sound: settings.sound, volume: settings.volume, onEnded: showEnd }) : /* @__PURE__ */ import_react12.default.createElement(
      "video",
      {
        "data-testid": "boot-video",
        ref: video,
        src: clip.url,
        loop: false,
        playsInline: true,
        preload: "auto",
        style: { objectFit: "cover" },
        onPlaying: () => setBlocked(false),
        onEnded: showEnd,
        onError: showEnd
      }
    ), blocked && /* @__PURE__ */ import_react12.default.createElement("button", { "data-bs-control": true, type: "button", className: "bs-play-manual", onClick: playManually }, t("\u25B6 \u70B9\u51FB\u64AD\u653E", "\u25B6 Click to play")), mutedFallback && /* @__PURE__ */ import_react12.default.createElement("button", { "data-bs-control": true, type: "button", className: "bs-sound", onClick: enableSound }, t("\u266A \u5F00\u542F\u58F0\u97F3", "\u266A Enable sound")), /* @__PURE__ */ import_react12.default.createElement("p", { className: "bs-intro-prompt" }, t("\u6309\u4EFB\u610F\u952E\u8DF3\u8FC7\u52A8\u753B", "Press any key to skip")))
  );
}
function Toggle({ label, description, checked, onChange, disabled }) {
  return /* @__PURE__ */ import_react12.default.createElement("label", { className: "bs-toggle-row" }, /* @__PURE__ */ import_react12.default.createElement("span", null, /* @__PURE__ */ import_react12.default.createElement("strong", null, label), description && /* @__PURE__ */ import_react12.default.createElement("small", null, description)), /* @__PURE__ */ import_react12.default.createElement(
    "input",
    {
      type: "checkbox",
      role: "switch",
      checked,
      onChange: (e) => onChange(e.target.checked),
      disabled
    }
  ), /* @__PURE__ */ import_react12.default.createElement("span", { className: "bs-switch", "aria-hidden": "true" }));
}
function SettingsPanel({ standalone = false, updateTools }) {
  const t = useI18n();
  useStudioStyles();
  const appearance = useEnchantAppearance();
  const [state, setState] = (0, import_react12.useState)(latestState);
  const [error, setError] = (0, import_react12.useState)("");
  const [notice, setNotice] = (0, import_react12.useState)("");
  const [busy, setBusy] = (0, import_react12.useState)(false);
  const [uploadPercent, setUploadPercent] = (0, import_react12.useState)(null);
  const [pendingDelete, setPendingDelete] = (0, import_react12.useState)(null);
  const [pendingImageDelete, setPendingImageDelete] = (0, import_react12.useState)(null);
  const [resetOpened, setResetOpened] = (0, import_react12.useState)(false);
  const [authorOpened, setAuthorOpened] = (0, import_react12.useState)(false);
  const input = (0, import_react12.useRef)(null);
  const imageInput = (0, import_react12.useRef)(null);
  const active = (0, import_react12.useRef)(true);
  const activeUpload = (0, import_react12.useRef)(null);
  (0, import_react12.useEffect)(() => {
    active.current = true;
    const update = (v) => setState(v);
    subscribers.add(update);
    api("/state").then(publish).catch((error2) => {
      if (active.current) setError(error2);
    });
    return () => {
      active.current = false;
      subscribers.delete(update);
      activeUpload.current?.cancel();
    };
  }, []);
  async function save(patch) {
    if (busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      publish(await api("/settings", { method: "POST", body: JSON.stringify(patch) }));
      setNotice("\u8BBE\u7F6E\u5DF2\u4FDD\u5B58\uFF0C\u4E0B\u6B21\u542F\u52A8\u751F\u6548");
    } catch (e) {
      setError(e);
    } finally {
      if (active.current) setBusy(false);
    }
  }
  async function restoreDefaults() {
    if (busy) throw Error("\u8BF7\u7B49\u5F85\u5F53\u524D\u64CD\u4F5C\u5B8C\u6210\u540E\u518D\u6062\u590D\u9ED8\u8BA4\u3002");
    setBusy(true);
    setError("");
    setNotice("");
    try {
      publish(
        await api("/reset", {
          method: "POST",
          body: JSON.stringify({ confirm: "reset-all-custom-data" })
        })
      );
      setNotice("\u5DF2\u6062\u590D\u9ED8\u8BA4\uFF0C\u5168\u90E8\u4E0A\u4F20\u7684\u89C6\u9891\u548C\u56FE\u7247\u5DF2\u5220\u9664\u3002");
    } catch (error2) {
      await api("/state").then(publish).catch(() => {
      });
      throw error2;
    } finally {
      if (active.current) setBusy(false);
    }
  }
  async function remove(clip) {
    setBusy(true);
    setError("");
    try {
      publish(await api("/clips/" + encodeURIComponent(clip.id), { method: "DELETE" }));
      setNotice("\u89C6\u9891\u5DF2\u79FB\u9664");
      setPendingDelete(null);
    } catch (e) {
      setError(e);
    } finally {
      if (active.current) setBusy(false);
    }
  }
  async function removeEndImage(image) {
    setBusy(true);
    setError("");
    try {
      publish(await api("/end-images/" + encodeURIComponent(image.id), { method: "DELETE" }));
      setNotice("\u7ED3\u675F\u753B\u9762\u5DF2\u79FB\u9664");
      setPendingImageDelete(null);
    } catch (e) {
      setError(e);
    } finally {
      if (active.current) setBusy(false);
    }
  }
  function importMedia(file, kind) {
    if (!file || busy || activeUpload.current) return;
    setBusy(true);
    setError("");
    setNotice("");
    const image = kind === "image";
    const task = createMediaUpload(file, {
      kind,
      maxBytes: image ? state?.maxImageUploadBytes : state?.maxUploadBytes,
      onPhase: (phase) => {
        if (active.current)
          setNotice(
            phase === "probe" ? image ? "\u6B63\u5728\u68C0\u67E5\u7ED3\u675F\u753B\u9762\u2026" : "\u6B63\u5728\u68C0\u67E5\u89C6\u9891\u2026" : image ? "\u6B63\u5728\u4E0A\u4F20\u56FE\u7247\u2026" : "\u6B63\u5728\u4E0A\u4F20\u2026"
          );
      },
      onProgress: (percent) => {
        if (active.current) setUploadPercent(percent);
      }
    });
    activeUpload.current = task;
    task.promise.then((result) => {
      if (!active.current) return;
      publish(result.state);
      setNotice(image ? "\u56FE\u7247\u5DF2\u4E0A\u4F20\u5E76\u8BBE\u4E3A\u7ED3\u675F\u753B\u9762" : "\u89C6\u9891\u5DF2\u5BFC\u5165\u5E76\u8BBE\u4E3A\u5F00\u673A\u52A8\u753B");
    }).catch((error2) => {
      if (active.current) {
        setError(error2);
        setNotice("");
      }
    }).finally(() => {
      if (activeUpload.current === task) activeUpload.current = null;
      if (active.current) {
        setBusy(false);
        setUploadPercent(null);
      }
    });
  }
  const uploadEndImage = (file) => importMedia(file, "image");
  const upload = (file) => importMedia(file, "video");
  const settings = state?.settings;
  const selected = state?.clips.find((c) => c.id === settings.selectedId) || state?.clips[0];
  const stages = playbackStages(settings);
  return /* @__PURE__ */ import_react12.default.createElement("section", { className: "bs-studio", "data-testid": "settings", ...appearance }, /* @__PURE__ */ import_react12.default.createElement("div", { className: "bs-heading" }, /* @__PURE__ */ import_react12.default.createElement("div", null, /* @__PURE__ */ import_react12.default.createElement("div", { className: "bs-eyebrow" }, "DSH LEWIS ENCHANTMENT"), /* @__PURE__ */ import_react12.default.createElement("h1", null, t("\u9644\u9B54\u53F0", "Enchantment"), /* @__PURE__ */ import_react12.default.createElement("span", null, t("\u5F00\u673A\u52A8\u753B", "Startup animation"))), /* @__PURE__ */ import_react12.default.createElement("p", null, t("\u81EA\u5B9A\u4E49\u4F60\u7684\u5F00\u573A\uFF0C\u5C01\u9762\u4E0E\u58F0\u97F3\u3002", "Customize your intro, cover and sound."))), VERSION && /* @__PURE__ */ import_react12.default.createElement("span", { className: "bs-version" }, "V", VERSION)), /* @__PURE__ */ import_react12.default.createElement("div", { className: "bs-preferences bs-animation-settings" }, /* @__PURE__ */ import_react12.default.createElement("div", { className: "bs-toolbar" }, /* @__PURE__ */ import_react12.default.createElement("h2", null, t("\u52A8\u753B\u7247\u5E93", "Animation library")), /* @__PURE__ */ import_react12.default.createElement(
    "button",
    {
      className: "bs-primary",
      type: "button",
      disabled: busy || !selected,
      onClick: () => preview(selected, {
        ...settings,
        enabled: true,
        videoEnabled: true,
        endEnabled: true
      })
    },
    t("\u25B6 \u9884\u89C8\u5F53\u524D\u5F00\u573A", "\u25B6 Preview current intro")
  )), /* @__PURE__ */ import_react12.default.createElement("div", { className: "bs-animation-content" }, error && /* @__PURE__ */ import_react12.default.createElement("div", { className: "bs-alert", role: "alert" }, localizeMessage(error), /* @__PURE__ */ import_react12.default.createElement(
    "button",
    {
      type: "button",
      onClick: () => {
        setError("");
        api("/state").then(publish).catch((e) => setError(e));
      }
    },
    t("\u91CD\u8BD5", "Retry")
  )), /* @__PURE__ */ import_react12.default.createElement("div", { className: "bs-notice", role: "status", "aria-live": "polite" }, busy ? uploadPercent !== null ? t(`\u6B63\u5728\u4E0A\u4F20 ${uploadPercent}%`, `Uploading ${uploadPercent}%`) : localizeMessage(notice) || t("\u6B63\u5728\u4FDD\u5B58\u2026", "Saving\u2026") : localizeMessage(notice)), settings && /* @__PURE__ */ import_react12.default.createElement(import_react12.default.Fragment, null, /* @__PURE__ */ import_react12.default.createElement(
    VideoLibrary,
    {
      state,
      settings,
      busy,
      preview,
      save,
      remove,
      pendingDelete,
      setPendingDelete,
      input,
      upload
    }
  )), !state && !error && /* @__PURE__ */ import_react12.default.createElement("div", { className: "bs-loading" }, t("\u6B63\u5728\u52A0\u8F7D\u7247\u5E93\u2026", "Loading library\u2026")))), settings && /* @__PURE__ */ import_react12.default.createElement(import_react12.default.Fragment, null, /* @__PURE__ */ import_react12.default.createElement(
    EndingSettings,
    {
      state,
      settings,
      busy,
      preview,
      save,
      imageInput,
      uploadEndImage,
      removeEndImage,
      pendingImageDelete,
      setPendingImageDelete,
      EndTitleComponent: EndTitle
    }
  ), /* @__PURE__ */ import_react12.default.createElement("div", { className: "bs-section-title" }, /* @__PURE__ */ import_react12.default.createElement("h2", null, t("\u64AD\u653E\u504F\u597D", "Playback preferences"))), /* @__PURE__ */ import_react12.default.createElement("div", { className: "bs-preferences" }, /* @__PURE__ */ import_react12.default.createElement(
    Toggle,
    {
      label: t("\u5F00\u673A\u52A8\u753B", "Startup animation"),
      checked: stages.video,
      disabled: busy,
      onChange: (videoEnabled) => save({ videoEnabled })
    }
  ), /* @__PURE__ */ import_react12.default.createElement(
    Toggle,
    {
      label: t("\u7ED3\u675F\u505C\u7559\u753B\u9762", "Ending screen"),
      checked: stages.end,
      disabled: busy,
      onChange: (endEnabled) => save({ endEnabled })
    }
  ), /* @__PURE__ */ import_react12.default.createElement(
    Toggle,
    {
      label: t("\u64AD\u653E\u58F0\u97F3", "Play sound"),
      checked: settings.sound,
      disabled: busy,
      onChange: (sound) => save({ sound })
    }
  ), /* @__PURE__ */ import_react12.default.createElement(
    Toggle,
    {
      label: t("\u968F\u673A\u5F00\u573A", "Shuffle intros"),
      checked: settings.shuffle,
      disabled: busy,
      onChange: (shuffle) => save({ shuffle })
    }
  )), /* @__PURE__ */ import_react12.default.createElement(UpdatePanel, { request: api, standalone, ...updateTools }), /* @__PURE__ */ import_react12.default.createElement("div", { className: "bs-section-title bs-entry-title" }, /* @__PURE__ */ import_react12.default.createElement("h2", null, t("\u8FDB\u5165\u65B9\u5F0F", "Quick access"))), /* @__PURE__ */ import_react12.default.createElement("div", { className: "bs-preferences" }, /* @__PURE__ */ import_react12.default.createElement(
    Toggle,
    {
      label: t("\u663E\u793A\u4FA7\u680F\u5FEB\u6377\u5165\u53E3", "Show sidebar shortcut"),
      description: t(
        "\u5728\u5934\u50CF\u4E0A\u65B9\u663E\u793A\u201C\u5F00\u673A\u52A8\u753B\u201D\uFF1B\u5173\u95ED\u540E\u4ECD\u53EF\u4ECE\u8BBE\u7F6E\u8FDB\u5165\u3002\u9644\u9B54\u53F0\u7CFB\u5217\u6700\u591A\u663E\u793A17\u4E2A\u5FEB\u6377\u5165\u53E3\u3002",
        "Show Startup animation above your avatar. You can always open it from Settings. The Enchantment series supports up to 17 shortcuts."
      ),
      checked: settings.showShortcut ?? false,
      disabled: busy,
      onChange: (showShortcut) => save({ showShortcut })
    }
  )), /* @__PURE__ */ import_react12.default.createElement("div", { className: "bs-reset-area" }, /* @__PURE__ */ import_react12.default.createElement("div", null, /* @__PURE__ */ import_react12.default.createElement("strong", null, t("\u6062\u590D\u9ED8\u8BA4", "Restore defaults")), /* @__PURE__ */ import_react12.default.createElement("p", null, t(
    "\u91CD\u7F6E\u6240\u6709\u8BBE\u7F6E\uFF0C\u6C38\u4E45\u5220\u9664\u5168\u90E8\u4E0A\u4F20\u7684\u89C6\u9891\u548C\u56FE\u7247\uFF0C\u4EC5\u4FDD\u7559\u5185\u7F6E\u7D20\u6750\u3002",
    "Reset all settings and permanently delete all uploaded videos and images. Built-in media will be kept."
  ))), /* @__PURE__ */ import_react12.default.createElement(
    "button",
    {
      className: "bs-reset-open",
      type: "button",
      disabled: busy,
      onClick: () => setResetOpened(true)
    },
    t("\u6062\u590D\u9ED8\u8BA4", "Restore defaults")
  )), resetOpened && /* @__PURE__ */ import_react12.default.createElement(
    ResetDialog,
    {
      settings,
      onCancel: () => setResetOpened(false),
      onConfirm: restoreDefaults
    }
  ), /* @__PURE__ */ import_react12.default.createElement("div", { className: "bs-author-entry" }, /* @__PURE__ */ import_react12.default.createElement("span", null, t("\u70B9\u51FB\u4E86\u89E3\u66F4\u591A\u4F5C\u8005\u4FE1\u606F", "Learn more about the author")), /* @__PURE__ */ import_react12.default.createElement(
    "button",
    {
      type: "button",
      "aria-label": t("\u67E5\u770B\u4F5C\u8005\u4FE1\u606F", "View author information"),
      onClick: () => setAuthorOpened(true)
    },
    t("\u67E5\u770B", "View"),
    /* @__PURE__ */ import_react12.default.createElement("span", { "aria-hidden": "true" }, "\u2197")
  )), authorOpened && /* @__PURE__ */ import_react12.default.createElement(AuthorDialog, { settings, onClose: () => setAuthorOpened(false) })));
}
function BootRoot() {
  const t = useI18n();
  useStudioStyles();
  const appearance = useEnchantAppearance();
  const [play, setPlay] = (0, import_react12.useState)(null);
  const [opened, setOpened] = (0, import_react12.useState)(false);
  const [message, setMessage] = (0, import_react12.useState)("");
  const [launchSettled, setLaunchSettled] = (0, import_react12.useState)(launchDecisionSettled);
  const [launchState, setLaunchState] = (0, import_react12.useState)(latestState);
  const [updateSnapshot, setUpdateSnapshot] = (0, import_react12.useState)(() => startupUpdateSession.getSnapshot());
  const [offerUpdate, setOfferUpdate] = (0, import_react12.useState)(false);
  const trigger = (0, import_react12.useCallback)((value) => setPlay({ ...value, key: Date.now() }), []);
  (0, import_react12.useEffect)(() => {
    const playEvent = (e) => trigger(e.detail);
    const open = () => setOpened(true);
    window.addEventListener(PLAY, playEvent);
    window.addEventListener(OPEN, open);
    return () => {
      window.removeEventListener(PLAY, playEvent);
      window.removeEventListener(OPEN, open);
    };
  }, [trigger]);
  (0, import_react12.useEffect)(() => {
    const stateChanged = (value) => setLaunchState(value);
    subscribers.add(stateChanged);
    const unsubscribe = startupUpdateSession.subscribe(setUpdateSnapshot);
    setUpdateSnapshot(startupUpdateSession.getSnapshot());
    void startupUpdateSession.check(api);
    return () => {
      subscribers.delete(stateChanged);
      unsubscribe();
    };
  }, []);
  (0, import_react12.useEffect)(() => {
    if (bootClaimed) {
      setLaunchSettled(true);
      return;
    }
    let alive = true;
    launchRequest ||= api("/launch");
    launchRequest.then((value) => {
      if (!alive || bootClaimed) return;
      bootClaimed = true;
      launchDecisionSettled = true;
      publish(value);
      const stages = playbackStages(value.settings);
      if (stages.video || stages.end) {
        const clip = value.clip || value.clips.find((c) => c.id === value.settings.selectedId) || value.clips[0];
        if (clip || stages.end) trigger({ clip, settings: value.settings });
      }
      setLaunchSettled(true);
    }).catch(() => {
      if (alive) {
        bootClaimed = true;
        launchDecisionSettled = true;
        setLaunchSettled(true);
      }
    });
    return () => {
      alive = false;
    };
  }, [trigger]);
  (0, import_react12.useEffect)(() => {
    setOfferUpdate(false);
    if (!launchSettled || play || opened || updateSnapshot.dismissed || !isAvailableUpdate(updateSnapshot.status))
      return;
    let timer = null;
    let alive = true;
    const blocked = () => Array.from(document.querySelectorAll('dialog[open],[role="dialog"][aria-modal="true"]')).some(
      (element) => {
        if (element.matches('[data-testid="startup-update"]:not([data-preview])')) return false;
        return element.getClientRects().length > 0 && getComputedStyle(element).visibility !== "hidden";
      }
    );
    const schedule = () => {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
      if (!alive || blocked()) return;
      timer = setTimeout(() => {
        timer = null;
        if (alive && !blocked()) {
          setOfferUpdate(true);
          observer?.disconnect();
        }
      }, 250);
    };
    const observer = typeof MutationObserver === "function" ? new MutationObserver(schedule) : null;
    observer?.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["open", "hidden", "style", "aria-hidden"]
    });
    schedule();
    return () => {
      alive = false;
      clearTimeout(timer);
      observer?.disconnect();
    };
  }, [launchSettled, play, opened, updateSnapshot]);
  const onClose = (0, import_react12.useCallback)((reason) => {
    setPlay(null);
    if (["media-error", "load-error", "play-error", "timeout"].includes(reason)) {
      setMessage("\u52A8\u753B\u672A\u80FD\u64AD\u653E\uFF0C\u5DF2\u4E3A\u4F60\u8FDB\u5165 Harness\u3002\u53EF\u5728\u8BBE\u7F6E\u4E2D\u66F4\u6362\u89C6\u9891\u3002");
      setTimeout(() => setMessage(""), 6500);
    }
  }, []);
  (0, import_react12.useEffect)(() => {
    if (!opened) return;
    const key = (e) => {
      if (e.key === "Escape" && !play && !document.querySelector("dialog[open]")) setOpened(false);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [opened, play]);
  return /* @__PURE__ */ import_react12.default.createElement(import_react12.default.Fragment, null, opened && /* @__PURE__ */ import_react12.default.createElement(
    "div",
    {
      className: "bs-modal",
      ...appearance,
      onClick: (e) => {
        if (e.target === e.currentTarget) setOpened(false);
      }
    },
    /* @__PURE__ */ import_react12.default.createElement(
      "div",
      {
        role: "dialog",
        "aria-modal": "true",
        "aria-label": t("\u5F00\u673A\u52A8\u753B\u8BBE\u7F6E", "Startup animation settings"),
        className: "bs-modal-body"
      },
      /* @__PURE__ */ import_react12.default.createElement("button", { type: "button", className: "bs-modal-close", onClick: () => setOpened(false) }, t("\u5173\u95ED \xD7", "Close \xD7")),
      /* @__PURE__ */ import_react12.default.createElement(SettingsPanel, null)
    )
  ), play && /* @__PURE__ */ import_react12.default.createElement(
    Player,
    {
      key: play.key,
      clip: play.clip,
      settings: play.settings,
      endOnly: play.endOnly,
      clipOnly: play.clipOnly,
      onClose
    }
  ), offerUpdate && !play && !opened && !updateSnapshot.dismissed && isAvailableUpdate(updateSnapshot.status) && /* @__PURE__ */ import_react12.default.createElement(
    UpdatePrompt,
    {
      request: api,
      status: updateSnapshot.status,
      settings: launchState?.settings,
      onDismiss: () => startupUpdateSession.dismiss(),
      onUpdated: (version) => startupUpdateSession.updated(version)
    }
  ), message && /* @__PURE__ */ import_react12.default.createElement("div", { className: "bs-toast", ...appearance, role: "status" }, localizeMessage(message)));
}
function ShortcutAction() {
  const t = useI18n();
  const appearance = useEnchantAppearance();
  const [state, setState] = (0, import_react12.useState)(latestState);
  const registry = getShortcutRegistry();
  const [budget, setBudget] = (0, import_react12.useState)(() => registry.getSnapshot());
  const enabled = state?.settings.showShortcut === true;
  (0, import_react12.useEffect)(() => {
    const changed = (value) => setState(value);
    subscribers.add(changed);
    if (latestState) setState(latestState);
    else
      api("/state").then(publish).catch(() => {
      });
    return () => subscribers.delete(changed);
  }, []);
  (0, import_react12.useEffect)(() => registry.subscribe(() => setBudget(registry.getSnapshot())), [registry]);
  (0, import_react12.useEffect)(() => {
    if (!enabled) return;
    return registry.acquire(NPM_ENTRY_NAME);
  }, [enabled, registry]);
  if (!enabled || !budget.visibleIds.includes(NPM_ENTRY_NAME)) return null;
  return /* @__PURE__ */ import_react12.default.createElement(
    "button",
    {
      type: "button",
      title: t("\u5F00\u673A\u52A8\u753B", "Startup animation"),
      "aria-label": t("\u5F00\u673A\u52A8\u753B", "Startup animation"),
      onClick: openSettings,
      ...appearance,
      style: {
        ...appearance.style,
        border: 0,
        background: "transparent",
        color: "var(--lewis-accent,currentColor)",
        cursor: "pointer",
        padding: 8,
        font: "inherit"
      }
    },
    "\u25B7"
  );
}
function apply(ctx) {
  const wire = (ready) => {
    const register = () => {
      const registry = getEnchantRegistry();
      let unregister;
      const updateName = () => {
        unregister?.();
        unregister = registry.registerPlugin({
          id: NPM_ENTRY_NAME,
          name: translate("\u5F00\u673A\u52A8\u753B", "Startup animation"),
          sectionId: "dsh-boot-studio-settings",
          renderSettings: () => import_react12.default.createElement(SettingsPanel),
          openSettings: () => window.dispatchEvent(new Event(OPEN))
        });
      };
      updateName();
      const stopLocale = subscribeHostLocale(updateName);
      try {
        ready.slots.inject(
          "shell.overlay",
          () => ready.slots.register(
            { name: "shell.overlay", id: "dsh-boot-studio-overlay", order: 950 },
            () => import_react12.default.createElement(BootRoot)
          )
        );
        ready.slots.inject(
          "settings.section",
          () => bindSettingsEntry({
            slots: ready.slots,
            registry,
            pluginId: NPM_ENTRY_NAME,
            register: () => ready.slots.register(
              {
                name: "settings.section",
                id: "dsh-boot-studio-settings",
                order: 80,
                label: () => translate("\u5F00\u673A\u52A8\u753B", "Startup animation")
              },
              () => import_react12.default.createElement(SettingsPanel)
            )
          })
        );
        ready.slots.inject(
          "sidebar.footer.action",
          () => ready.slots.register(
            {
              name: "sidebar.footer.action",
              id: "dsh-boot-studio-shortcut",
              order: 42,
              label: () => translate("\u5F00\u673A\u52A8\u753B", "Startup animation")
            },
            () => import_react12.default.createElement(ShortcutAction)
          )
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
    if (typeof ready.effect === "function") return ready.effect(register, "dsh-boot-studio: slots");
    else return register();
  };
  if (typeof ctx.inject === "function") {
    const bindInstaller = (ready) => {
      const bind = () => bindHarnessServices({
        pluginManager: ready.remote?.pluginManager
      });
      return typeof ready.effect === "function" ? ready.effect(bind, "dsh-boot-studio: installer") : bind();
    };
    const bindNavigation = (ready) => {
      const bind = () => bindHarnessServices({ pluginNavigation: ready.pluginNavigation });
      return typeof ready.effect === "function" ? ready.effect(bind, "dsh-boot-studio: navigation") : bind();
    };
    ctx.inject(["remote", "remote.pluginManager"], bindInstaller);
    ctx.inject(["pluginNavigation"], bindNavigation);
    ctx.inject(
      ["locale"],
      (ready) => typeof ready.effect === "function" ? ready.effect(() => bindHostLocale(ready.locale)) : bindHostLocale(ready.locale)
    );
    return ctx.inject(["slots"], wire);
  } else {
    const stopServices = bindHarnessServices({
      pluginManager: ctx.remote?.pluginManager,
      pluginNavigation: ctx.pluginNavigation
    });
    const stopLocale = ctx.locale ? bindHostLocale(ctx.locale) : () => {
    };
    const stopSlots = ctx.slots ? wire(ctx) : void 0;
    return () => {
      if (typeof stopSlots === "function") stopSlots();
      stopLocale();
      stopServices();
    };
  }
}
return module.exports; } });
