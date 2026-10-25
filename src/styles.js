export const CSS = `

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
.bs-logo-options>button {min-width:0;padding:0;overflow:hidden;background:var(--bs-soft);border:1px solid var(--bs-line);border-radius:8px;color:var(--bs-text)}
.bs-logo-options>button.is-selected {border-color:var(--bs-accent);box-shadow:0 0 0 1px color-mix(in srgb,var(--bs-accent) 16%,transparent)}
.bs-logo-options img {display:block;width:100%;aspect-ratio:16/9;object-fit:cover;background:transparent}
.bs-logo-options span {display:block;font-size:calc(var(--bs-f)*.7857);line-height:1.5;padding:7px 6px;text-align:center;overflow-wrap:anywhere}
.bs-ending-preview {display:flex;gap:19px;padding:18px;align-items:center;min-width:0}
.bs-ending-mini {position:relative;width:46%;max-width:245px;aspect-ratio:16/9;overflow:hidden;flex:none;border-radius:8px;border:1px solid var(--bs-line)}
.bs-ending-preview>div:last-child {min-width:0;flex:1}
.bs-ending-preview strong {display:block;font-size:calc(var(--bs-f)*.8571);font-weight:500;margin-bottom:12px;overflow-wrap:anywhere}
.bs-ending-preview p {font-size:calc(var(--bs-f)*.7857);color:var(--bs-muted);margin:7px 0 12px}
.bs-ending-preview small {display:block;font-size:calc(var(--bs-f)*.7143);color:var(--bs-tertiary);margin-top:8px}
.bs-end-library {display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px;padding:15px}
.bs-end-card {border:1px solid var(--bs-line);border-radius:8px;overflow:hidden;background:var(--bs-soft);min-width:0}
.bs-end-card.is-selected {border-color:var(--bs-accent)}
.bs-end-card>button:first-child {display:block;width:100%;border:0;padding:0;background:transparent;color:var(--bs-text)}
.bs-end-card img {width:100%;height:calc(var(--bs-f)*6);object-fit:cover;display:block}
.bs-end-card>button>span {display:block;padding:6px 8px;font-size:calc(var(--bs-f)*.7857);overflow-wrap:anywhere}
.bs-end-card .bs-delete,.bs-end-card>span>button {border:0;background:transparent;color:var(--bs-muted);font-size:calc(var(--bs-f)*.7143);padding:3px 8px 7px;cursor:pointer}
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
.bs-startup-update-brand {font-size:calc(var(--bs-f)*.6429);letter-spacing:.17em;margin:0 0 10px;color:var(--bs-muted);overflow-wrap:anywhere;padding-inline-end:20px}
.bs-startup-update-brand span {display:block;letter-spacing:0;margin-top:7px;color:var(--bs-tertiary);font-size:calc(var(--bs-f)*.7857)}
.bs-startup-update h2 {font-size:calc(var(--bs-f)*1.7857);line-height:1.35;font-weight:500;letter-spacing:-.02em;margin:0 0 12px;color:var(--bs-text);overflow-wrap:anywhere;text-wrap:balance}
.bs-startup-update-copy {font-size:calc(var(--bs-f)*.8571);color:var(--bs-muted);line-height:1.85;margin:0}
.bs-startup-update-versions {display:flex;align-items:center;gap:12px;font-size:calc(var(--bs-f)*.8571);margin:21px 0 19px;color:var(--bs-muted);flex-wrap:wrap}
.bs-startup-update-versions strong {font-weight:500;color:var(--bs-text);background:color-mix(in srgb,var(--bs-accent) 12%,transparent);border-radius:8px;padding:6px 10px}
.bs-startup-update-summary {padding:16px 17px;border-radius:14px;border:1px solid var(--bs-line);background:var(--bs-soft);margin-bottom:18px}
.bs-startup-update-summary p {font-size:calc(var(--bs-f)*.8571);line-height:1.7;margin:0;color:var(--bs-text);display:flex;gap:10px}
.bs-startup-update-summary p:before {content:'✓';color:var(--bs-accent);flex:none}
.bs-startup-update-summary p+p {margin-top:8px}
.bs-startup-update-retain {font-size:calc(var(--bs-f)*.7857);line-height:1.6;color:var(--bs-muted);margin:0 0 23px}
.bs-startup-update-retain:before {content:'◇';margin-inline-end:7px;color:var(--bs-accent)}
.bs-startup-update-status {font-size:calc(var(--bs-f)*.8571);line-height:1.8;color:var(--bs-muted);margin:0 0 19px}
.bs-startup-update-error {font-size:calc(var(--bs-f)*.8571);line-height:1.8;color:var(--bs-danger);margin:0 0 19px;overflow-wrap:anywhere}
.bs-startup-update-actions {display:flex;gap:10px;flex-wrap:wrap}
.bs-startup-update-actions button {min-width:0;min-height:3em;font-size:calc(var(--bs-f)*.8571);line-height:1.5;border-radius:12px;padding:10px 16px;border:1px solid var(--bs-line);background:var(--bs-soft);color:var(--bs-text);flex:1 1 100px;overflow-wrap:anywhere}
.bs-startup-update-actions .bs-startup-update-primary {flex:1.55 1 150px;border-color:var(--bs-accent);color:var(--bs-accent-text);background:var(--bs-accent);box-shadow:0 5px 16px color-mix(in srgb,var(--bs-accent) 6%,transparent)}
.bs-startup-update-actions button:hover:not(:disabled) {border-color:var(--bs-accent);background:color-mix(in srgb,var(--bs-accent) 12%,transparent)}
.bs-startup-update-actions .bs-startup-update-primary:hover:not(:disabled) {background:color-mix(in srgb,var(--bs-accent) 90%,var(--bs-text))}
.bs-reset-glyph {color:var(--bs-danger);background:color-mix(in srgb,var(--bs-danger) 9%,transparent);border-color:color-mix(in srgb,var(--bs-danger) 24%,transparent)}
.bs-reset-summary {margin-top:20px}
.bs-reset-summary p:before {content:'−';color:var(--bs-danger)}
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
