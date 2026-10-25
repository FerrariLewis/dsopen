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
  openSettings: () => openSettings
});
module.exports = __toCommonJS(client_exports);
var import_react5 = __toESM(require("react"), 1);

// src/styles.js
var CSS = `
.bs-studio{--bs-bg:#10161b;--bs-card:#182127;--bs-line:#2b363e;--bs-text:#e6eee9;--bs-muted:#8e9d9c;--bs-accent:#b7eccd;box-sizing:border-box;color:var(--bs-text);background:var(--bs-bg);padding:36px 38px 28px;width:100%;max-width:1120px;margin:auto;border-radius:16px;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI','Microsoft YaHei',sans-serif;font-size:14px;line-height:1.55;color-scheme:dark}
.bs-studio *,.bs-player *,.bs-modal *{box-sizing:border-box}
.bs-studio button,.bs-player button,.bs-modal button,.bs-studio input,.bs-studio select{font:inherit}
.bs-studio button,.bs-player button{cursor:pointer;transition:background .18s,border-color .18s,transform .18s}
.bs-studio button:disabled{opacity:.48;cursor:default}.bs-studio button:focus-visible,.bs-player button:focus-visible,.bs-studio input:focus-visible,.bs-studio select:focus-visible,.bs-modal-close:focus-visible{outline:2px solid #b7eccd;outline-offset:4px}
.bs-heading{display:flex;justify-content:space-between;align-items:flex-start;gap:16px}.bs-eyebrow{font-size:10px;letter-spacing:2.2px;color:#a5d7bc;margin-bottom:9px}.bs-heading h1{font-size:29px;letter-spacing:-.8px;font-weight:650;margin:0 0 9px;line-height:1.35}.bs-heading h1 span{font-weight:350;color:#8e9d9c;margin-left:11px}.bs-heading p{margin:0;color:var(--bs-muted);font-size:13px}.bs-version{font-size:10px;color:#a2b2ac;border:1px solid var(--bs-line);border-radius:5px;padding:4px 8px;letter-spacing:1px;margin-top:4px}
.bs-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:27px 0 0;padding:17px 0;border-top:1px solid var(--bs-line);border-bottom:1px solid var(--bs-line)}.bs-status{display:flex;align-items:center;gap:8px;font-size:12px;color:#abbdb5}.bs-status i{width:6px;height:6px;border-radius:50%;background:#b7eccd;box-shadow:0 0 9px #b7eccd44}.bs-primary{border:1px solid #b7eccd;background:#b7eccd;color:#122b20;border-radius:7px;padding:9px 15px;font-weight:600!important;font-size:12px!important}.bs-primary:hover{background:#d3f5e0}
.bs-notice{min-height:31px;padding-top:8px;color:#b7eccd;font-size:12px}.bs-alert{background:#392726;border:1px solid #764b46;color:#ffd9d0;padding:12px;border-radius:8px;margin-top:14px}.bs-alert button{background:transparent;border:1px solid #94635a;color:inherit;margin-left:10px;border-radius:4px}
.bs-section-title{display:flex;align-items:baseline;justify-content:space-between;gap:14px;margin:12px 0 14px}.bs-section-title h2{font-size:14px;font-weight:600;margin:0}.bs-section-title>span{font-size:11px;color:#80918b}.bs-library{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin-bottom:30px}.bs-clip{min-width:0;border:1px solid var(--bs-line);background:var(--bs-card);border-radius:10px;overflow:hidden;position:relative}.bs-clip.is-selected{border-color:#b7eccd;box-shadow:0 0 0 1px #b7eccd22}.bs-thumbnail{width:100%;aspect-ratio:16/9;display:block;border:0;position:relative;overflow:hidden;text-align:left;background:radial-gradient(ellipse at 70% 20%,#2c4d60,#101c27 70%);padding:0;color:white}.bs-tone-1{background:radial-gradient(ellipse at 75% 15%,#5c2e67,#1b122b 70%)}.bs-tone-2{background:radial-gradient(ellipse at 70% 20%,#3e526b,#171f34 70%)}.bs-tone-3{background:radial-gradient(ellipse at 40% 40%,#2b5d50,#0f211c 70%)}.bs-thumbnail video{position:absolute;width:100%;height:100%;object-fit:cover;opacity:.88;pointer-events:none}.bs-thumbnail-shade{position:absolute;inset:0;background:linear-gradient(0deg,#050b12aa,transparent 65%)}.bs-play-icon{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);border:1px solid #ffffff66;background:#0a172a66;backdrop-filter:blur(5px);width:34px;height:34px;border-radius:50%;text-align:center;line-height:32px;font-size:12px;padding-left:2px}.bs-thumbnail:hover .bs-play-icon{background:#b7eccd;color:#142b21;border-color:#b7eccd}.bs-clip-number{position:absolute;bottom:10px;left:12px;font-size:11px;letter-spacing:1px;opacity:.8}.bs-badge{position:absolute;top:9px;right:9px;border:1px solid #ffffff22;background:#0b111c88;border-radius:4px;font-size:9px;padding:2px 6px}.bs-clip-info{padding:12px 12px 9px;display:flex;align-items:center;gap:8px;justify-content:space-between}.bs-clip-info h3{font-size:12px;font-weight:500;margin:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.bs-clip-info>span{font-size:10px;color:#8b9d96;white-space:nowrap}.bs-clip-actions{display:flex;gap:7px;padding:0 12px 12px}.bs-clip-actions button{flex:1;border:1px solid #3c4b49;background:#202d30;color:#c1cfc8;border-radius:5px;font-size:11px;padding:5px}.bs-clip-actions button:hover{border-color:#b7eccd}.bs-clip-actions .bs-selected{color:#b7eccd;background:#b7eccd0d;border-color:#536d60;opacity:1}.bs-clip-actions .bs-delete{flex:0;color:#b5a29c;border:0;background:transparent;white-space:nowrap}.bs-delete-confirm{position:absolute;bottom:0;left:0;right:0;background:#342724;border-top:1px solid #80544b;padding:10px;font-size:11px}.bs-delete-confirm button{margin:4px;color:#ffe2d5;border:1px solid #865a50;border-radius:4px;background:#49342e;font-size:10px}
.bs-studio{container-type:inline-size;padding:clamp(20px,3.5%,36px) clamp(18px,3.5%,38px) 28px}
.bs-thumbnail video{inset:0;display:block}
.bs-upload{display:flex;flex-direction:column;align-items:center;justify-content:center;border:1px dashed #43584e;border-radius:10px;background:#14201c66;min-height:190px;color:#abc5b7;gap:6px;padding:15px}.bs-upload:hover{background:#20392e;border-color:#b7eccd}.bs-upload>span{font-size:27px;color:#b7eccd;font-weight:200;line-height:1.2;margin-bottom:5px}.bs-upload strong{font-size:12px;font-weight:500}.bs-upload small{font-size:10px;color:#7f9e8f}
.bs-preferences{border:1px solid var(--bs-line);border-radius:10px;overflow:hidden;background:#151e23}.bs-toggle-row,.bs-field{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:16px 18px;position:relative;margin:0}.bs-preferences>*+*{border-top:1px solid var(--bs-line)}.bs-toggle-row{cursor:pointer}.bs-toggle-row>span:first-child{flex:1}.bs-toggle-row strong,.bs-field>span,.bs-field>label{font-weight:500;font-size:12px}.bs-toggle-row small,.bs-field small{display:block;color:#7d9188;font-size:11px;font-weight:400;margin-top:4px}.bs-toggle-row input{position:absolute;right:18px;width:34px;height:20px;opacity:0;z-index:1;cursor:pointer}.bs-switch{width:34px;height:19px;flex:none;background:#3b4845;border-radius:20px;position:relative;transition:background .15s}.bs-switch:after{content:'';width:13px;height:13px;background:#a7b9b1;border-radius:50%;position:absolute;left:3px;top:3px;transition:transform .15s}.bs-toggle-row input:checked+.bs-switch{background:#b7eccd}.bs-toggle-row input:checked+.bs-switch:after{background:#173926;transform:translateX(15px)}.bs-toggle-row input:focus-visible+.bs-switch{outline:2px solid #b7eccd;outline-offset:4px}.bs-toggle-row input:disabled+.bs-switch{opacity:.45}
.bs-field select{color:#d6e6dd;background:#202c2e;border:1px solid #3e5148;border-radius:5px;padding:7px 9px;font-size:12px}.bs-field select{max-width:150px}.bs-field input[type=range]{accent-color:#b7eccd;width:160px;max-width:36%}.bs-field output{font-size:12px;width:34px;text-align:right}.bs-field input[type=range]+output{margin-left:-10px}.bs-field:has(input[type=range])>span{flex:1}
.bs-help{padding:22px 0 0;color:#8fa69a;font-size:11px}.bs-help strong{font-size:12px;font-weight:500;color:#c4dbcc}.bs-help p{margin:7px 0 13px;line-height:1.8}.bs-help>span{font-size:9px;color:#61786b}.bs-loading{text-align:center;color:#8e9d9c;padding:45px}
.bs-player{position:fixed;inset:0;z-index:2147483500;background:#05090e;outline:0;cursor:pointer;color:#f4f8f8;font:13px/1.5 Inter,'Segoe UI','Microsoft YaHei',sans-serif;animation:bs-reveal .3s ease-out}.bs-player video{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}.bs-player-top{position:absolute;top:0;left:0;right:0;padding:24px 30px;display:flex;align-items:center;justify-content:space-between;gap:16px;background:linear-gradient(#0008,transparent)}.bs-player-top>span{font-size:10px;letter-spacing:2px;text-shadow:0 2px 7px black}.bs-player-top b{font-weight:400;opacity:.6;margin-left:10px}.bs-player button{border:1px solid #ffffff44;color:#fff;background:#101c2c88;backdrop-filter:blur(12px);border-radius:7px;padding:9px 14px;font-size:12px}.bs-player button:hover{background:#213348bb}.bs-player kbd{font:10px/1.3 monospace;margin-left:10px;color:#b3c5ce;border:1px solid #ffffff33;padding:2px 4px;border-radius:3px}.bs-player-bottom{position:absolute;bottom:0;left:0;right:0;display:flex;justify-content:space-between;gap:15px;padding:24px 30px;background:linear-gradient(transparent,#0009);font-size:11px;letter-spacing:.3px;text-shadow:0 1px 5px black}.bs-player-bottom>span:last-child{opacity:.72}.bs-sound{position:absolute;right:30px;bottom:75px}.bs-play-manual{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);padding:18px 30px!important}.bs-timeline{height:2px;position:absolute;bottom:0;left:0;right:0;background:#ffffff18}.bs-timeline i{display:block;height:100%;background:#b7eccd;transition:width .08s linear}
.bs-player{width:100vw;height:100vh;height:100dvh;max-width:none;max-height:none;margin:0;border:0;padding:0;overflow:hidden}.bs-player::backdrop{background:#05090e}
.bs-modal{position:fixed;inset:0;z-index:2147483400;background:#0009;backdrop-filter:blur(10px);padding:28px;overflow:auto}.bs-modal-body{position:relative;max-width:1120px;margin:auto;box-shadow:0 25px 100px #0006;border-radius:16px}.bs-modal-close{position:absolute;right:30px;top:25px;z-index:2;background:#26382f;border:1px solid #496552;border-radius:5px;color:#d9efe0;padding:6px 10px;cursor:pointer}.bs-modal-body .bs-version{display:none}.bs-toast{position:fixed;bottom:30px;left:50%;transform:translateX(-50%);padding:13px 18px;color:#e9f7ed;background:#273a30;border:1px solid #6a8f76;border-radius:8px;z-index:2147483600;font:12px/1.5 'Segoe UI','Microsoft YaHei',sans-serif;max-width:90vw;box-shadow:0 8px 40px #0006}
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
.bs-end-image{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}.bs-end-image~.bs-enter-prompt{padding:15px 0;background:radial-gradient(ellipse at center,#0005,transparent 65%)}
.bs-end-title[data-logo=silver] .bs-enter-prompt{color:#405164;text-shadow:0 1px 6px #fff9;background:radial-gradient(ellipse at center,#ffffff44,transparent 65%)}
.bs-end-silver{background:radial-gradient(ellipse at 50% 45%,#f6f8fa,#dbe1e7);color:#435264}.bs-end-silver .bs-enter-prompt{color:#435264;text-shadow:none}
.bs-end-gold{background:radial-gradient(ellipse at 50% 40%,#211e17,#080908);color:#d7c99f}.bs-end-ice{background:radial-gradient(ellipse at 50% 40%,#163344,#060e18);color:#c0e8f4}
.bs-ending-settings{margin-bottom:29px}.bs-text-button{border:0;background:transparent;color:#b7eccd;font-size:11px!important;padding:0}
.bs-update-area{margin-top:25px;padding-top:8px;border-top:1px solid var(--bs-line)}.bs-update-card{display:flex;justify-content:space-between;align-items:center;gap:16px;background:#151e23;border:1px solid var(--bs-line);border-radius:9px;padding:17px}.bs-update-card strong{font-size:12px;font-weight:500}.bs-update-card p{font-size:11px;color:#8b9e92;margin:6px 0 0}.bs-update-card small{display:block;font-size:10px;color:#82978a;margin-top:6px}.bs-update-actions{display:flex;gap:8px;flex-wrap:wrap;flex:none}.bs-update-actions button{border:1px solid #4a6254;background:#25382e;color:#b7eccd;border-radius:5px;font-size:11px;padding:7px 10px}.bs-update-message,.bs-update-error{font-size:11px;margin:10px 0 0;line-height:1.7;color:#a9cfb6}.bs-update-error{color:#ffc6b6}.bs-release-link{display:inline-block;margin-top:8px;color:#b7eccd;font-size:11px;text-decoration:none}
.bs-logo-options{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;padding:16px}.bs-logo-options>button{min-width:0;padding:0;overflow:hidden;background:#111b1b;border:1px solid #3a4b44;border-radius:6px;color:#b8cbbf}.bs-logo-options>button.is-selected{border-color:#b7eccd;color:#b7eccd}.bs-logo-options img{display:block;width:100%;aspect-ratio:16/9;object-fit:cover}.bs-logo-options span{display:block;font-size:11px;line-height:1.4;padding:7px 4px;text-align:center}
.bs-ending-preview{display:flex;gap:19px;padding:18px;align-items:center}.bs-ending-mini{position:relative;width:46%;max-width:245px;aspect-ratio:16/9;overflow:hidden;flex:none;border-radius:6px;border:1px solid #3b4b4c}
.bs-ending-mini .bs-end-brand{transform:translateY(-2px);width:90%}.bs-ending-mini .bs-end-halo{width:85px}.bs-ending-mini .bs-end-whale{width:42px;margin-bottom:8px;filter:none}.bs-ending-mini .bs-end-brand h1{font-size:14px;letter-spacing:.2em;text-indent:.2em}.bs-ending-mini .bs-end-brand>p{font-size:5px;letter-spacing:.6em;margin-top:5px}.bs-ending-mini .bs-end-rule{width:17px;margin-top:8px}.bs-ending-mini .bs-enter-prompt{font-size:6px;bottom:8%;animation:none}
.bs-ending-preview>div:last-child{min-width:0;flex:1}.bs-ending-preview strong{font-size:12px;font-weight:500}.bs-ending-preview p{font-size:11px;color:#7d9188;margin:7px 0 12px}.bs-ending-preview small{display:block;font-size:10px;color:#72877b;margin-top:8px}
.bs-end-library{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px;padding:15px}.bs-end-card{border:1px solid #354840;border-radius:7px;overflow:hidden;background:#111b1b;min-width:0}.bs-end-card.is-selected{border-color:#b7eccd}.bs-end-card>button:first-child{display:block;width:100%;border:0;padding:0;background:transparent;color:#cadace}.bs-end-card img{width:100%;height:83px;object-fit:cover;display:block}.bs-end-card>button>span{display:block;padding:6px 8px;font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.bs-end-card .bs-delete,.bs-end-card>span>button{border:0;background:transparent;color:#94aa9b;font-size:10px;padding:3px 8px 7px;cursor:pointer}
.bs-sequence-thumb{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#eeeae1;color:#31383b}.bs-sequence-thumb svg{width:40px;height:40px;fill:currentColor;margin-bottom:6px}.bs-sequence-thumb>span{font-size:13px;letter-spacing:.15em}.bs-sequence-thumb small{font-size:6px;letter-spacing:.12em;opacity:.5}.bs-sequence-thumb~.bs-play-icon{opacity:0;transition:opacity .2s}.bs-thumbnail:hover .bs-sequence-thumb~.bs-play-icon{opacity:1}
@keyframes bs-prompt-breathe{0%,100%{opacity:.48}50%{opacity:.92}}
@container(max-width:650px){.bs-library{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.bs-heading h1{font-size:25px}.bs-upload{min-height:170px}.bs-section-title>span{font-size:10px}.bs-clip-info h3{font-size:11px}.bs-toggle-row,.bs-field{padding:14px}.bs-toggle-row input{right:14px}.bs-ending-preview{padding:14px;gap:13px}.bs-ending-preview .bs-primary{padding:7px 10px;font-size:11px!important}}
@container(max-width:380px){.bs-toolbar{align-items:flex-start;flex-direction:column}.bs-heading h1{font-size:22px}.bs-section-title>span{font-size:9px}.bs-clip-info{display:block}.bs-ending-preview{flex-direction:column;align-items:stretch}.bs-ending-mini{width:100%;max-width:none}.bs-ending-preview>div:last-child{width:100%}.bs-update-card{flex-direction:column;align-items:flex-start}}
@keyframes bs-reveal{from{opacity:0}to{opacity:1}}
@media(max-width:850px){.bs-studio{padding:26px 24px}.bs-library{grid-template-columns:repeat(2,minmax(0,1fr))}.bs-heading h1{font-size:26px}.bs-modal{padding:14px}.bs-modal-close{right:20px;top:20px}}
@media(max-width:520px){.bs-studio{padding:24px 16px;border-radius:10px}.bs-heading h1{font-size:23px}.bs-heading h1 span{margin-left:7px}.bs-eyebrow{font-size:8px}.bs-heading p{font-size:11px}.bs-toolbar{align-items:flex-start;flex-direction:column;margin-top:20px;gap:12px}.bs-library{gap:9px}.bs-clip-info{padding:9px 8px 6px;display:block}.bs-clip-info h3{font-size:11px}.bs-clip-info>span{font-size:9px}.bs-clip-actions{padding:0 8px 9px}.bs-clip-actions button{font-size:10px}.bs-upload{min-height:165px;padding:10px}.bs-upload small{font-size:9px}.bs-section-title>span{font-size:9px}.bs-toggle-row,.bs-field{padding:13px 12px;gap:10px}.bs-toggle-row small,.bs-field small{font-size:10px}.bs-toggle-row input{right:12px}.bs-player-top{padding:16px}.bs-player-top>span{font-size:8px;letter-spacing:1px}.bs-player-top b{display:none}.bs-player-top button{font-size:11px;padding:7px 9px}.bs-player-bottom{padding:18px 16px;font-size:10px}.bs-sound{right:16px;bottom:60px}.bs-modal{padding:7px}.bs-modal-close{right:13px;top:17px;font-size:10px}.bs-modal-body .bs-heading h1{font-size:21px}}
@media(prefers-reduced-motion:reduce){.bs-player,.bs-studio *,.bs-player *{animation:none!important;transition:none!important}}
/* Hide only the optional HTML menu. The desktop host owns native caption buttons. */
html[data-lewis-player="true"] [data-windows-menu]{visibility:hidden!important;pointer-events:none!important}
.bs-entry-title{margin-top:26px}
.bs-reset-area{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-top:30px;padding:24px 0 2px;border-top:1px solid var(--bs-line)}
.bs-reset-area strong{font-size:12px;font-weight:500;color:#d4dfd9}
.bs-reset-area p{font-size:11px;line-height:1.8;color:#8e9d9c;margin:5px 0 0;max-width:640px}
.bs-reset-open{flex:none;color:#eab9b8;background:#e5a5a50b;border:1px solid #b77e7e55;border-radius:12px;padding:10px 17px;font-size:12px!important}
.bs-reset-open:hover:not(:disabled){background:#e5a5a51c;border-color:#ca949477}
.bs-startup-update{--bs-update-radius:30px;--bs-update-blur:30px;box-sizing:border-box;width:min(448px,calc(100vw - 32px));max-width:none;max-height:calc(100dvh - 40px);margin:auto;padding:0;border:0;overflow:auto;background:transparent;color:#eaf3ef;outline:none;font:13px/1.6 Inter,-apple-system,BlinkMacSystemFont,'Segoe UI','Microsoft YaHei',sans-serif;color-scheme:dark}
.bs-startup-update::backdrop{background:#030d1270;backdrop-filter:blur(calc(var(--bs-update-blur) * .23));-webkit-backdrop-filter:blur(calc(var(--bs-update-blur) * .23))}
.bs-startup-update *{box-sizing:border-box}
.bs-startup-update-card{position:relative;width:100%;padding:31px;border:1px solid #ddffff30;border-radius:var(--bs-update-radius);background:linear-gradient(135deg,#b6f7ef13,transparent 62%),#162b31c9;backdrop-filter:blur(var(--bs-update-blur)) saturate(125%);-webkit-backdrop-filter:blur(var(--bs-update-blur)) saturate(125%);box-shadow:0 32px 90px #0006,inset 0 1px 0 #ffffff15;overflow:hidden}
.bs-startup-update button{font:inherit;cursor:pointer;transition:background .18s,filter .18s}
.bs-startup-update button:focus-visible{outline:2px solid #b6eddd;outline-offset:3px}
.bs-startup-update button:disabled{cursor:default;opacity:.6}
.bs-startup-update-close{position:absolute;right:17px;top:17px;border:0;border-radius:50%;background:#ffffff0c;color:#9aafb0;width:31px;height:31px;display:grid;place-items:center;font-size:20px!important;line-height:1}
.bs-startup-update-glyph{width:55px;height:55px;border-radius:18px;display:grid;place-items:center;font-size:30px;line-height:1;color:#b6eddd;background:linear-gradient(145deg,#8adcc51f,#89c4d10b);border:1px solid #c2f9e721;margin-bottom:25px}
.bs-startup-update-brand{font-size:9px;letter-spacing:.17em;margin:0 0 10px;color:#b6eddd;overflow-wrap:anywhere}
.bs-startup-update-brand span{display:block;letter-spacing:0;margin-top:7px;color:#9aafb0;font-size:11px}
.bs-startup-update h2{font-size:25px;line-height:1.35;font-weight:500;letter-spacing:-.02em;margin:0 0 12px;color:#eaf3ef}
.bs-startup-update-copy{font-size:12px;color:#9aafb0;line-height:1.85;margin:0}
.bs-startup-update-versions{display:flex;align-items:center;gap:12px;font-size:12px;margin:21px 0 19px;color:#9aafb0;flex-wrap:wrap}
.bs-startup-update-versions strong{font-weight:500;color:#b6eddd;background:#b2e8da12;border-radius:8px;padding:6px 10px}
.bs-startup-update-summary{padding:16px 17px;border-radius:15px;border:1px solid #cbf1e51a;background:#051b202e;margin-bottom:18px}
.bs-startup-update-summary p{font-size:12px;line-height:1.7;margin:0;color:#eaf3ef;display:flex;gap:10px}
.bs-startup-update-summary p:before{content:'\u2713';color:#b6eddd;flex:none}
.bs-startup-update-summary p+p{margin-top:8px}
.bs-startup-update-retain{font-size:11px;line-height:1.6;color:#9aafb0;margin:0 0 23px}
.bs-startup-update-retain:before{content:'\u25C7';margin-right:7px;color:#b6eddd}
.bs-startup-update-status{font-size:12px;line-height:1.8;color:#b6eddd;margin:0 0 19px}
.bs-startup-update-error{font-size:12px;line-height:1.8;color:#ffd4c9;margin:0 0 19px;overflow-wrap:anywhere}
.bs-startup-update-actions{display:flex;gap:10px}
.bs-startup-update-actions button{min-width:0;min-height:43px;font-size:12px;line-height:1.5;border-radius:13px;padding:10px 16px;border:1px solid #cbf1e51a;background:#ffffff07;color:#9aafb0;flex:1}
.bs-startup-update-actions .bs-startup-update-primary{flex:1.55;border-color:transparent;color:#142c2c;background:#b6eddd;box-shadow:0 5px 16px #95e3cd10}
.bs-startup-update-actions button:hover:not(:disabled){filter:brightness(1.08)}
.bs-reset-glyph{color:#edc1be;background:linear-gradient(145deg,#d88f8f1f,#e4c5bd0a);border-color:#edc1be27}
.bs-reset-summary{margin-top:20px}
.bs-reset-summary p:before{content:'\u2212';color:#e6b2ad}
.bs-reset-warning{font-size:12px;line-height:1.8;color:#edb6af;margin:0 0 21px}
.bs-reset-actions .bs-reset-confirm{flex:1.5;background:#e8b2ad;color:#382124;border-color:transparent;box-shadow:0 5px 16px #e8b2ad0b}
@media(max-width:520px){.bs-reset-area{align-items:flex-start;flex-direction:column;gap:13px}.bs-reset-open{align-self:flex-start}}
@media(max-width:450px){.bs-startup-update-card{padding:27px 23px}.bs-startup-update h2{font-size:23px}.bs-startup-update-actions button{padding:10px 12px}.bs-startup-update-versions{gap:9px}}
@media(prefers-reduced-motion:reduce){.bs-startup-update *{transition:none!important;animation:none!important}}
`;

// src/logo-path.js
var WHALE_PATH = "M48.8354 10.0479C48.3232 9.79199 48.1025 10.2798 47.8032 10.5278C47.7007 10.6079 47.6143 10.7119 47.5273 10.8076C46.7793 11.624 45.9048 12.1597 44.7622 12.0957C43.0923 12 41.666 12.5356 40.4058 13.8398C40.1377 12.2319 39.2476 11.272 37.8926 10.6558C37.1836 10.3359 36.4668 10.0156 35.9702 9.31982C35.6235 8.82373 35.5293 8.27197 35.356 7.72754C35.2456 7.3999 35.1353 7.06396 34.7651 7.00781C34.3633 6.94385 34.2056 7.2876 34.0479 7.57568C33.418 8.75195 33.1733 10.0479 33.1973 11.3599C33.2524 14.312 34.4736 16.6641 36.8999 18.3359C37.1758 18.5278 37.2466 18.7197 37.1597 19C36.9946 19.5757 36.7974 20.1357 36.624 20.7119C36.5137 21.0801 36.3486 21.1597 35.9624 21C34.6309 20.4321 33.481 19.5918 32.4644 18.5757C30.7393 16.8721 29.1792 14.9917 27.2334 13.52C26.7764 13.1758 26.3193 12.856 25.8467 12.5518C23.8618 10.584 26.1069 8.96777 26.627 8.77588C27.1704 8.57568 26.8159 7.8877 25.0591 7.896C23.3022 7.90381 21.6953 8.50391 19.647 9.30371C19.3477 9.42383 19.0322 9.51172 18.7095 9.58398C16.8501 9.22363 14.9199 9.14355 12.9033 9.37598C9.10596 9.80762 6.07275 11.6396 3.84326 14.7681C1.16455 18.5278 0.53418 22.7998 1.30664 27.2559C2.11768 31.9521 4.46582 35.8398 8.07373 38.8799C11.8159 42.0322 16.1255 43.5762 21.041 43.2803C24.0269 43.104 27.3516 42.6963 31.1016 39.4561C32.0469 39.936 33.0396 40.1279 34.686 40.272C35.9546 40.3921 37.1758 40.208 38.1211 40.0078C39.6021 39.688 39.4995 38.2881 38.9639 38.0322C34.623 35.9678 35.5762 36.8081 34.71 36.1279C36.9155 33.4639 40.2402 30.6958 41.54 21.728C41.6426 21.0161 41.5557 20.5679 41.54 19.9917C41.5322 19.6396 41.6108 19.5039 42.0049 19.4639C43.0923 19.3359 44.1479 19.0317 45.1167 18.4878C47.9292 16.9199 49.064 14.3438 49.3315 11.2559C49.3711 10.7837 49.3237 10.2959 48.8354 10.0479ZM24.3262 37.8398C20.1196 34.4639 18.0791 33.3521 17.2358 33.3999C16.4482 33.4482 16.5898 34.3682 16.7632 34.9678C16.9443 35.5601 17.1812 35.9683 17.5117 36.4878C17.7402 36.832 17.8979 37.3442 17.2832 37.728C15.9282 38.584 13.5728 37.4399 13.4624 37.3838C10.7207 35.7358 8.42822 33.5601 6.81348 30.584C5.25342 27.7197 4.34766 24.6479 4.19775 21.3677C4.1582 20.5757 4.38672 20.2959 5.15869 20.1519C6.17529 19.96 7.22314 19.9199 8.23926 20.0718C12.5327 20.7119 16.1885 22.6719 19.2529 25.7759C21.002 27.5439 22.3252 29.6558 23.6885 31.7202C25.1377 33.9121 26.6978 36 28.6831 37.7119C29.3843 38.312 29.9434 38.7681 30.479 39.104C28.8643 39.2881 26.1699 39.3281 24.3262 37.8398ZM26.3433 24.6001C26.3433 24.248 26.6191 23.9678 26.9658 23.9678C27.0444 23.9678 27.1152 23.9839 27.1782 24.0078C27.2651 24.04 27.3438 24.0879 27.4067 24.1602C27.5171 24.272 27.5801 24.4321 27.5801 24.6001C27.5801 24.9521 27.3042 25.2319 26.9575 25.2319C26.6108 25.2319 26.3433 24.9521 26.3433 24.6001ZM32.6064 27.8799C32.2046 28.0479 31.8027 28.1919 31.4165 28.208C30.8179 28.2397 30.1641 27.9922 29.8096 27.688C29.2583 27.2158 28.8643 26.9521 28.6987 26.1279C28.6279 25.7759 28.6675 25.2319 28.7305 24.9199C28.8721 24.248 28.7144 23.8159 28.2495 23.4238C27.8716 23.104 27.3911 23.0161 26.8633 23.0161C26.666 23.0161 26.4849 22.9277 26.3511 22.856C26.1304 22.7441 25.9492 22.4639 26.1226 22.1201C26.1777 22.0078 26.4458 21.7358 26.5088 21.688C27.2256 21.272 28.0527 21.4077 28.8169 21.7197C29.5259 22.0161 30.0615 22.5601 30.834 23.3281C31.6216 24.2559 31.7632 24.5117 32.2124 25.208C32.5669 25.752 32.8901 26.312 33.1104 26.9521C33.2446 27.3521 33.0713 27.6802 32.6064 27.8799Z";

// src/startup-screen.jsx
var import_react = __toESM(require("react"), 1);

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
        frag.appendChild(document2.createTextNode("\xA0"));
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
  ui.w4.textContent = "\u6B22\u8FCE " + C.identity + " \u8BBF\u95EE";
  ui.idline.textContent = "\xB7 ID CONFIRMED : " + C.identityId;
  (function blackStage() {
    var inner = ui.blackInner;
    var whale = svgWhale("dsu-whale");
    inner.appendChild(whale);
    inner.appendChild(el("div", "dsu-black-zh", C.orgZh));
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
      ui.subZh.textContent = zh || "";
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
      confirm: function() {
        if (!playAsset("sfx-tick", 0.85)) {
          tone(660, 0.09, "triangle", 0.07);
          tone(990, 0.17, "triangle", 0.055, 0.085);
        }
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
        typeIn(ui.statusZh, step.zh, 46);
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
    ui.btnZh.textContent = step.btnZh;
    ui.btnEn.textContent = step.btnEn;
    ui.card.hidden = step.action !== "confirm";
    if (step.action === "confirm") {
      ui.card.innerHTML = "";
      var rows = [
        ["\u8EAB\u4EFD\u540D\u79F0", C.identity, true],
        ["\u8EAB\u4EFD\u7F16\u53F7", C.identityId, false],
        ["\u6743\u9650\u7B49\u7EA7", C.accessLevel, false]
      ];
      rows.forEach(function(r) {
        var row = el("div", "dsu-card-row");
        row.appendChild(el("span", null, r[0]));
        row.appendChild(el("b", r[2] ? "dsu-zhname" : null, r[1]));
        ui.card.appendChild(row);
      });
    }
    ui.hint.innerHTML = "\u6309 <kbd>Enter</kbd> / <kbd>Space</kbd>\uFF0C\u6216\u70B9\u51FB\u6309\u94AE\u7EE7\u7EED";
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
  if (document2.readyState === "loading") {
    document2.addEventListener("DOMContentLoaded", function() {
      run();
    });
  } else {
    run();
  }
}

// src/startup-screen.jsx
function mountStartupSequence(container, { sound = false, volume = 0.7, onEnded } = {}) {
  const realDocument = container.ownerDocument;
  const realWindow = realDocument.defaultView;
  const shadow = container.shadowRoot ?? container.attachShadow({ mode: "open" });
  const style = realDocument.createElement("style");
  style.textContent = STARTUP_CSS;
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
    return { getItem: (key) => values.get(String(key)) ?? null, setItem: (key, value) => values.set(String(key), String(value)), removeItem: (key) => values.delete(String(key)) };
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
  const host = (0, import_react.useRef)(null);
  const ended = (0, import_react.useRef)(onEnded);
  ended.current = onEnded;
  (0, import_react.useEffect)(() => {
    if (!host.current) return;
    try {
      return mountStartupSequence(host.current, { sound, volume, onEnded: () => ended.current?.() });
    } catch {
      ended.current?.();
    }
  }, [sound, volume]);
  return /* @__PURE__ */ import_react.default.createElement("div", { ref: host, "data-testid": "startup-sequence", "aria-hidden": "true", style: { position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", background: "#000" } });
}

// src/update-panel.jsx
var import_react2 = __toESM(require("react"), 1);

// src/startup-update.js
var PACKAGE_NAMES = /* @__PURE__ */ new Set(["dsh-openup-lewis", "dsh-boot-studio"]);
var VERSION = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
function parts(value) {
  if (typeof value !== "string" || !VERSION.test(value)) return null;
  const result = value.split(".").map(Number);
  return result.every(Number.isSafeInteger) ? result : null;
}
function isAvailableUpdate(status) {
  if (!status || status.available !== true || status.channelReady !== true || !PACKAGE_NAMES.has(status.packageName)) return false;
  const latest = parts(status.latestVersion), current = parts(status.currentVersion);
  if (!latest || !current || status.manifest && status.manifest.version !== status.latestVersion) return false;
  for (let index = 0; index < latest.length; index++) {
    if (latest[index] !== current[index]) return latest[index] > current[index];
  }
  return false;
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
      checkPromise = Promise.resolve().then(() => request("/updates/check", { method: "POST", body: "{}" })).then((value) => {
        const status = completedVersion && value ? { ...value, currentVersion: completedVersion } : value;
        publish2({ checking: false, checked: true, status: isAvailableUpdate(status) ? status : null });
        return snapshot.status;
      }, () => {
        publish2({ checking: false, checked: true, status: null });
        return null;
      });
      return checkPromise;
    },
    dismiss() {
      publish2({ dismissed: true });
    },
    updated(version) {
      if (!parts(version)) return;
      completedVersion = version;
      publish2({ dismissed: true, status: snapshot.status ? { ...snapshot.status, available: false, currentVersion: version } : null });
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
  if (segments.at(-1) !== basename || segments.at(-2) !== "update-cache") throw Error("\u66F4\u65B0\u5305\u8DEF\u5F84\u4E0E\u5DF2\u6821\u9A8C\u7684\u540D\u79F0\u3001\u7248\u672C\u6216 SHA-256 \u4E0D\u4E00\u81F4\uFF0C\u672A\u8BF7\u6C42\u5B89\u88C5\u3002");
  return staged;
}
async function installVerifiedUpdate(spec, version, { fetchImpl = fetch } = {}) {
  if (!absoluteArchivePath(spec) || !parts(version)) throw Error("\u66F4\u65B0\u5305\u8DEF\u5F84\u6216\u7248\u672C\u65E0\u6548\uFF0C\u672A\u8BF7\u6C42\u5B89\u88C5\u3002");
  const rpcId = globalThis.crypto?.randomUUID?.() || `lewis-enchant-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12e4);
  try {
    const response = await fetchImpl("/api/pluginManager/installBundle", {
      method: "POST",
      credentials: "same-origin",
      signal: controller.signal,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type: "client-request", rpcId, method: "pluginManager/installBundle", payload: { args: { spec, options: { enabled: true, saveExact: true, requestId: rpcId } } } })
    });
    if (response.status === 401 || response.status === 403) throw Error("\u5F53\u524D\u8FDE\u63A5\u6CA1\u6709\u7BA1\u7406\u63D2\u4EF6\u7684\u6743\u9650\uFF0C\u8BF7\u4F7F\u7528 Harness \u4E3B\u7A97\u53E3\u7684\u62E5\u6709\u8005\u8FDE\u63A5\u3002");
    if (!response.ok) throw Error(`Harness \u66F4\u65B0\u8BF7\u6C42\u5931\u8D25\uFF08HTTP ${response.status}\uFF09\u3002`);
    const envelope = await response.json();
    if (envelope.type !== "server-response" || envelope.rpcId !== rpcId || envelope.result?.ok !== true) throw Error("Harness \u672A\u63A5\u53D7\u66F4\u65B0\u8BF7\u6C42\uFF0C\u8BF7\u5728\u63D2\u4EF6\u7BA1\u7406\u4E2D\u67E5\u770B\u8BE6\u60C5\u3002");
    const result = envelope.result.value;
    if (!result || !["applied", "restart-required"].includes(result.application) || result.error) throw Error(result?.error?.diagnostic || "\u66F4\u65B0\u672A\u5B8C\u6210\uFF0C\u8BF7\u5728\u63D2\u4EF6\u7BA1\u7406\u4E2D\u67E5\u770B\u8BE6\u60C5\u3002");
    if (result.version && result.version !== version) throw Error("Harness \u8FD4\u56DE\u7684\u7248\u672C\u4E0E\u66F4\u65B0\u76EE\u6807\u4E0D\u4E00\u81F4\uFF0C\u8BF7\u67E5\u770B\u63D2\u4EF6\u7BA1\u7406\u3002");
    return result;
  } catch (error) {
    if (controller.signal.aborted) throw Error("\u66F4\u65B0\u54CD\u5E94\u8D85\u65F6\u3002\u8BF7\u5728\u63D2\u4EF6\u7BA1\u7406\u4E2D\u6838\u5BF9\u5B9E\u9645\u7248\u672C\u540E\u91CD\u8BD5\u3002");
    throw error;
  } finally {
    clearTimeout(timer);
  }
}
var activeUpdates = /* @__PURE__ */ new Map();
var completedUpdates = /* @__PURE__ */ new Map();
var updateKey = (status) => `${status?.packageName}@${status?.latestVersion}`;
function appliedUpdate(status) {
  return completedUpdates.get(updateKey(status)) || null;
}
async function prepareAndInstallUpdate(request, status, { onPhase, install = installVerifiedUpdate } = {}) {
  if (!isAvailableUpdate(status)) throw Error("\u66F4\u65B0\u7248\u672C\u65E0\u6548\u6216\u5C1A\u672A\u516C\u5F00\uFF0C\u8BF7\u91CD\u65B0\u68C0\u67E5\u66F4\u65B0\u3002");
  const key = updateKey(status);
  if (completedUpdates.has(key)) return completedUpdates.get(key);
  let task = activeUpdates.get(key);
  if (!task) {
    task = { observers: /* @__PURE__ */ new Set(), phase: "prepare", promise: null };
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
    task.promise = Promise.resolve().then(async () => {
      const staged = validatePreparedUpdate(await request("/updates/prepare", { method: "POST", body: JSON.stringify({ version: status.latestVersion }) }), status);
      emit("install");
      const result = await install(staged.spec, staged.version);
      const value = { version: staged.version, result };
      completedUpdates.set(key, value);
      return value;
    }).finally(() => activeUpdates.delete(key));
  }
  if (typeof onPhase === "function") {
    task.observers.add(onPhase);
    try {
      onPhase(task.phase);
    } catch {
    }
  }
  try {
    return await task.promise;
  } finally {
    task.observers.delete(onPhase);
  }
}

// src/update-panel.jsx
function UpdatePanel({ request, standalone = false }) {
  const [status, setStatus] = (0, import_react2.useState)(null);
  const [busy, setBusy] = (0, import_react2.useState)(false);
  const [message, setMessage] = (0, import_react2.useState)("");
  const [error, setError] = (0, import_react2.useState)("");
  (0, import_react2.useEffect)(() => {
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
    setBusy(true);
    setError("");
    setMessage("\u6B63\u5728\u68C0\u67E5\u66F4\u65B0\u2026");
    try {
      const value = await request("/updates/check", { method: "POST", body: "{}" });
      setStatus(value);
      setMessage(value.message || "\u68C0\u67E5\u5B8C\u6210\u3002");
    } catch (e) {
      setError(e.message);
      setMessage("");
    } finally {
      setBusy(false);
    }
  }
  async function update() {
    if (standalone || !status?.available || busy) return;
    setBusy(true);
    setError("");
    setMessage("\u6B63\u5728\u4E0B\u8F7D\u5E76\u6821\u9A8C\u66F4\u65B0\u5305\u2026");
    try {
      const { version, result } = await prepareAndInstallUpdate(request, status, { onPhase: (phase) => setMessage(phase === "install" ? "\u6821\u9A8C\u901A\u8FC7\uFF0C\u6B63\u5728\u901A\u8FC7 Harness \u539F\u4F4D\u66F4\u65B0\u2026" : "\u6B63\u5728\u4E0B\u8F7D\u5E76\u6821\u9A8C\u66F4\u65B0\u5305\u2026") });
      startupUpdateSession.updated(version);
      setStatus((value) => ({ ...value, available: false, currentVersion: version }));
      setMessage(result.application === "restart-required" ? "\u66F4\u65B0\u5B8C\u6210\u3002\u8BF7\u5B8C\u5168\u9000\u51FA\u5E76\u91CD\u542F Harness\uFF0C\u65B0\u7248\u672C\u4F1A\u4FDD\u7559\u539F\u89C6\u9891\u3001\u56FE\u7247\u548C\u8BBE\u7F6E\u3002" : "\u65B0\u7248\u672C\u5DF2\u5E94\u7528\u3002\u5EFA\u8BAE\u91CD\u542F Harness\uFF0C\u8BA9\u6240\u6709\u7A97\u53E3\u4F7F\u7528\u65B0\u7248\u672C\uFF1B\u89C6\u9891\u3001\u56FE\u7247\u548C\u8BBE\u7F6E\u5747\u4FDD\u7559\u3002");
    } catch (e) {
      setError(e.message);
      setMessage("");
    } finally {
      setBusy(false);
    }
  }
  return /* @__PURE__ */ import_react2.default.createElement("div", { className: "bs-update-area", "data-testid": "update-panel" }, /* @__PURE__ */ import_react2.default.createElement("div", { className: "bs-section-title" }, /* @__PURE__ */ import_react2.default.createElement("h2", null, "\u7248\u672C\u4E0E\u66F4\u65B0"), /* @__PURE__ */ import_react2.default.createElement("span", null, status?.currentVersion ? `v${status.currentVersion}` : "DSH LEWIS ENCHANT")), /* @__PURE__ */ import_react2.default.createElement("div", { className: "bs-update-card" }, /* @__PURE__ */ import_react2.default.createElement("div", null, /* @__PURE__ */ import_react2.default.createElement("strong", null, "\u4E00\u6B21\u5B89\u88C5\uFF0C\u6301\u7EED\u7115\u65B0"), /* @__PURE__ */ import_react2.default.createElement("p", null, "\u66F4\u65B0\u4F1A\u4FDD\u7559\u4F60\u7684\u89C6\u9891\u3001\u7ED3\u675F\u56FE\u7247\u548C\u64AD\u653E\u504F\u597D\u3002"), standalone && /* @__PURE__ */ import_react2.default.createElement("small", null, "\u5F53\u524D\u4E3A\u72EC\u7ACB\u9884\u89C8\u3002\u5B89\u88C5\u5230 Harness \u540E\uFF0C\u53EF\u5728\u8FD9\u91CC\u539F\u4F4D\u66F4\u65B0\u3002")), /* @__PURE__ */ import_react2.default.createElement("div", { className: "bs-update-actions" }, /* @__PURE__ */ import_react2.default.createElement("button", { type: "button", disabled: busy, onClick: check }, "\u68C0\u67E5\u66F4\u65B0"), status?.available && /* @__PURE__ */ import_react2.default.createElement("button", { type: "button", className: "bs-primary", disabled: busy || standalone, onClick: update }, "\u66F4\u65B0\u5230 ", status.latestVersion))), (message || error) && /* @__PURE__ */ import_react2.default.createElement("p", { className: error ? "bs-update-error" : "bs-update-message", role: error ? "alert" : "status" }, error || message), status?.available && status.manifest?.releaseNotesUrl && /* @__PURE__ */ import_react2.default.createElement("a", { className: "bs-release-link", href: status.manifest.releaseNotesUrl, target: "_blank", rel: "noreferrer" }, "\u67E5\u770B\u672C\u6B21\u66F4\u65B0\u8BF4\u660E \u2197"));
}

// src/update-prompt.jsx
var import_react3 = __toESM(require("react"), 1);
function UpdatePrompt({ request, status = {}, settings = {}, onDismiss, onUpdated, preview: preview2 = false }) {
  const dialog = (0, import_react3.useRef)(null);
  const mounted = (0, import_react3.useRef)(true);
  const lock = (0, import_react3.useRef)(false);
  const [busy, setBusy] = (0, import_react3.useState)(false);
  const [phase, setPhase] = (0, import_react3.useState)("prepare");
  const [error, setError] = (0, import_react3.useState)("");
  const [completed, setCompleted] = (0, import_react3.useState)(() => appliedUpdate(status));
  const close = (0, import_react3.useCallback)(() => {
    if (lock.current) return;
    if (completed && !preview2) onUpdated?.(completed.version, completed.result);
    onDismiss?.();
  }, [completed, onDismiss, onUpdated, preview2]);
  (0, import_react3.useEffect)(() => {
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
      const value = await prepareAndInstallUpdate(request, status, { onPhase: (value2) => {
        if (mounted.current) setPhase(value2);
      } });
      if (mounted.current) setCompleted(value);
    } catch (reason) {
      if (mounted.current) setError(reason.message || "\u66F4\u65B0\u672A\u5B8C\u6210\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002");
    } finally {
      lock.current = false;
      if (mounted.current) setBusy(false);
    }
  }
  const radius = Number.isFinite(settings.updatePromptRadius) ? Math.min(40, Math.max(0, settings.updatePromptRadius)) : 30;
  const blur = Number.isFinite(settings.updatePromptBlur) ? Math.min(48, Math.max(0, settings.updatePromptBlur)) : 30;
  return /* @__PURE__ */ import_react3.default.createElement("dialog", { ref: dialog, className: "bs-startup-update", "data-testid": "startup-update", "data-preview": preview2 || void 0, style: { "--bs-update-radius": `${radius}px`, "--bs-update-blur": `${blur}px` }, "aria-labelledby": "bs-startup-update-title", "aria-describedby": "bs-startup-update-description", onCancel: (event) => {
    event.preventDefault();
    close();
  } }, /* @__PURE__ */ import_react3.default.createElement("div", { className: "bs-startup-update-card", style: { "--bs-update-radius": `${radius}px`, "--bs-update-blur": `${blur}px` } }, /* @__PURE__ */ import_react3.default.createElement("button", { className: "bs-startup-update-close", type: "button", "aria-label": completed ? "\u5173\u95ED\u66F4\u65B0\u63D0\u793A" : "\u7A0D\u540E\u518D\u8BF4", disabled: busy, onClick: close }, "\xD7"), /* @__PURE__ */ import_react3.default.createElement("div", { className: "bs-startup-update-glyph", "aria-hidden": "true" }, "\u2727"), /* @__PURE__ */ import_react3.default.createElement("p", { className: "bs-startup-update-brand" }, "DSH LEWIS ENCHANT", preview2 && /* @__PURE__ */ import_react3.default.createElement("span", null, " \xB7 \u66F4\u65B0\u63D0\u9192\u5916\u89C2\u9884\u89C8")), /* @__PURE__ */ import_react3.default.createElement("h2", { id: "bs-startup-update-title" }, completed ? "\u65B0\u7684\u5F00\u573A\uFF0C\u5DF2\u51C6\u5907\u5C31\u7EEA\u3002" : "\u65B0\u7684\u5F00\u573A\uFF0C\u51C6\u5907\u597D\u4E86\u3002"), /* @__PURE__ */ import_react3.default.createElement("p", { id: "bs-startup-update-description", className: "bs-startup-update-copy" }, preview2 ? "\u8FD9\u91CC\u53EA\u9884\u89C8\u5F39\u7A97\u5916\u89C2\uFF0C\u4E0D\u4F1A\u4E0B\u8F7D\u6216\u5B89\u88C5\u66F4\u65B0\u3002" : completed ? "\u91CD\u65B0\u6253\u5F00 Harness\uFF0C\u5373\u53EF\u4F7F\u7528\u65B0\u7248\u672C\u3002" : "\u53D1\u73B0\u5F00\u673A\u52A8\u753B\u65B0\u7248\u672C\uFF0C\u4E3A\u4E0B\u4E00\u6B21\u542F\u52A8\u6DFB\u4E00\u70B9\u65B0\u610F\u3002"), /* @__PURE__ */ import_react3.default.createElement("div", { className: "bs-startup-update-versions" }, /* @__PURE__ */ import_react3.default.createElement("span", null, "v", status?.currentVersion || "1.2.5"), /* @__PURE__ */ import_react3.default.createElement("span", { "aria-hidden": "true" }, "\u2192"), /* @__PURE__ */ import_react3.default.createElement("strong", null, preview2 ? "\u540E\u7EED\u7248\u672C" : `v${status.latestVersion}`)), !busy && !completed && /* @__PURE__ */ import_react3.default.createElement("div", { className: "bs-startup-update-summary" }, /* @__PURE__ */ import_react3.default.createElement("p", null, "\u5B8C\u6574\u5B89\u88C5\u5305\u6821\u9A8C\u540E\u66F4\u65B0"), /* @__PURE__ */ import_react3.default.createElement("p", null, "\u4FDD\u7559\u4E2A\u4EBA\u89C6\u9891\u4E0E\u5C01\u9762"), /* @__PURE__ */ import_react3.default.createElement("p", null, "\u91CD\u65B0\u6253\u5F00\u540E\u4F7F\u7528\u65B0\u7248\u672C")), /* @__PURE__ */ import_react3.default.createElement("p", { className: "bs-startup-update-retain" }, "\u4F60\u7684\u89C6\u9891\u3001\u56FE\u7247\u548C\u8BBE\u7F6E\u90FD\u4F1A\u4FDD\u7559"), busy && /* @__PURE__ */ import_react3.default.createElement("p", { className: "bs-startup-update-status", role: "status", "aria-live": "polite" }, phase === "install" ? "\u6821\u9A8C\u901A\u8FC7\uFF0C\u6B63\u5728\u901A\u8FC7 Harness \u5E94\u7528\u66F4\u65B0\u2026" : "\u6B63\u5728\u4E0B\u8F7D\u5E76\u6821\u9A8C\u66F4\u65B0\u5305\u2026"), error && /* @__PURE__ */ import_react3.default.createElement("p", { className: "bs-startup-update-error", role: "alert" }, error), completed && /* @__PURE__ */ import_react3.default.createElement("p", { className: "bs-startup-update-status", role: "status" }, completed.result.application === "restart-required" ? "\u66F4\u65B0\u5B8C\u6210\u3002\u8BF7\u5B8C\u5168\u9000\u51FA\u5E76\u91CD\u65B0\u6253\u5F00 Harness\u3002" : "\u65B0\u7248\u672C\u5DF2\u5E94\u7528\u3002\u5EFA\u8BAE\u91CD\u65B0\u6253\u5F00 Harness\uFF0C\u8BA9\u6240\u6709\u7A97\u53E3\u4F7F\u7528\u65B0\u7248\u672C\u3002"), /* @__PURE__ */ import_react3.default.createElement("div", { className: "bs-startup-update-actions" }, preview2 ? /* @__PURE__ */ import_react3.default.createElement("button", { className: "bs-startup-update-primary", type: "button", onClick: close }, "\u5173\u95ED\u9884\u89C8") : completed ? /* @__PURE__ */ import_react3.default.createElement("button", { className: "bs-startup-update-primary", type: "button", onClick: close }, "\u77E5\u9053\u4E86") : /* @__PURE__ */ import_react3.default.createElement(import_react3.default.Fragment, null, /* @__PURE__ */ import_react3.default.createElement("button", { type: "button", disabled: busy, onClick: close }, "\u7A0D\u540E\u518D\u8BF4"), /* @__PURE__ */ import_react3.default.createElement("button", { className: "bs-startup-update-primary", type: "button", disabled: busy, onClick: accept }, busy ? "\u6B63\u5728\u66F4\u65B0\u2026" : error ? "\u91CD\u8BD5\u66F4\u65B0" : `\u66F4\u65B0\u5230 ${status.latestVersion}`)))));
}

// src/shortcut-registry.js
var SHORTCUT_LIMIT = 17;
var SHORTCUT_REGISTRY_KEY = Symbol.for("dsh.lewis.enchant.shortcuts.v1");
function createRegistry() {
  const entries = /* @__PURE__ */ new Map();
  const listeners = /* @__PURE__ */ new Set();
  let snapshot = Object.freeze({ limit: SHORTCUT_LIMIT, count: 0, visibleIds: Object.freeze([]), waitingIds: Object.freeze([]) });
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
      if (typeof id !== "string" || !id || id.length > 128 || id !== id.trim() || /[\x00-\x1f\x7f]/.test(id)) throw new TypeError("\u5FEB\u6377\u5165\u53E3\u9700\u8981\u7A33\u5B9A\u4E14\u6709\u6548\u7684\u63D2\u4EF6 ID\u3002");
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
  if ((!scope || typeof scope !== "object") && typeof scope !== "function") throw new TypeError("\u5FEB\u6377\u5165\u53E3\u9700\u8981\u5171\u4EAB\u7A97\u53E3\u4F5C\u7528\u57DF\u3002");
  let registry = scope[SHORTCUT_REGISTRY_KEY];
  if (!registry) {
    registry = createRegistry();
    Object.defineProperty(scope, SHORTCUT_REGISTRY_KEY, { value: registry, enumerable: false });
  }
  if (registry.version !== 1 || registry.limit !== SHORTCUT_LIMIT || !["acquire", "subscribe", "isVisible", "getSnapshot"].every((key) => typeof registry[key] === "function")) throw new Error("\u9644\u9B54\u53F0\u5FEB\u6377\u5165\u53E3\u5171\u4EAB\u534F\u8BAE\u4E0D\u517C\u5BB9\u3002");
  return registry;
}

// src/reset-dialog.jsx
var import_react4 = __toESM(require("react"), 1);
function ResetDialog({ settings = {}, onCancel, onConfirm }) {
  const dialog = (0, import_react4.useRef)(null);
  const cancelButton = (0, import_react4.useRef)(null);
  const mounted = (0, import_react4.useRef)(true);
  const lock = (0, import_react4.useRef)(false);
  const [busy, setBusy] = (0, import_react4.useState)(false);
  const [error, setError] = (0, import_react4.useState)("");
  (0, import_react4.useEffect)(() => {
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
      if (mounted.current) setError(reason?.message || "\u6062\u590D\u9ED8\u8BA4\u672A\u5B8C\u6210\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002");
      return;
    } finally {
      lock.current = false;
      if (mounted.current) setBusy(false);
    }
    if (mounted.current) onCancel?.();
  }
  const radius = Number.isFinite(settings.updatePromptRadius) ? Math.min(40, Math.max(0, settings.updatePromptRadius)) : 30;
  const blur = Number.isFinite(settings.updatePromptBlur) ? Math.min(48, Math.max(0, settings.updatePromptBlur)) : 30;
  return /* @__PURE__ */ import_react4.default.createElement("dialog", { ref: dialog, className: "bs-startup-update bs-reset-dialog", "data-testid": "reset-dialog", style: { "--bs-update-radius": `${radius}px`, "--bs-update-blur": `${blur}px` }, "aria-labelledby": "bs-reset-title", "aria-describedby": "bs-reset-description bs-reset-warning", "aria-busy": busy, onCancel: (event) => {
    event.preventDefault();
    cancel();
  } }, /* @__PURE__ */ import_react4.default.createElement("div", { className: "bs-startup-update-card bs-reset-card" }, /* @__PURE__ */ import_react4.default.createElement("button", { className: "bs-startup-update-close", type: "button", "aria-label": "\u53D6\u6D88\u6062\u590D\u9ED8\u8BA4", disabled: busy, onClick: cancel }, "\xD7"), /* @__PURE__ */ import_react4.default.createElement("div", { className: "bs-startup-update-glyph bs-reset-glyph", "aria-hidden": "true" }, "\u21BA"), /* @__PURE__ */ import_react4.default.createElement("p", { className: "bs-startup-update-brand" }, "DSH LEWIS ENCHANT"), /* @__PURE__ */ import_react4.default.createElement("h2", { id: "bs-reset-title" }, "\u56DE\u5230\u6700\u521D\u7684\u5F00\u573A\uFF1F"), /* @__PURE__ */ import_react4.default.createElement("p", { id: "bs-reset-description", className: "bs-startup-update-copy" }, "\u6062\u590D\u9ED8\u8BA4\u540E\uFF0C\u5F00\u673A\u52A8\u753B\u5C06\u56DE\u5230\u5B89\u88C5\u65F6\u7684\u72B6\u6001\u3002"), /* @__PURE__ */ import_react4.default.createElement("div", { className: "bs-startup-update-summary bs-reset-summary" }, /* @__PURE__ */ import_react4.default.createElement("p", null, "\u5220\u9664\u5168\u90E8\u4E0A\u4F20\u7684\u89C6\u9891\u548C\u56FE\u7247"), /* @__PURE__ */ import_react4.default.createElement("p", null, "\u91CD\u7F6E\u64AD\u653E\u3001\u58F0\u97F3\u53CA\u7ED3\u675F\u753B\u9762\u7B49\u504F\u597D"), /* @__PURE__ */ import_react4.default.createElement("p", null, "\u91CD\u7F6E\u66F4\u65B0\u5F39\u7A97\u5916\u89C2\u548C\u4FA7\u680F\u5FEB\u6377\u5165\u53E3")), /* @__PURE__ */ import_react4.default.createElement("p", { className: "bs-startup-update-retain bs-reset-retain" }, "\u5B89\u88C5\u5305\u81EA\u5E26\u7684\u52A8\u753B\u548C\u5C01\u9762\u4F1A\u4FDD\u7559\u3002"), /* @__PURE__ */ import_react4.default.createElement("p", { id: "bs-reset-warning", className: "bs-reset-warning" }, "\u6B64\u64CD\u4F5C\u4E0D\u53EF\u64A4\u9500\uFF0C\u8BF7\u5148\u5907\u4EFD\u9700\u8981\u4FDD\u7559\u7684\u7D20\u6750\u3002"), busy && /* @__PURE__ */ import_react4.default.createElement("p", { className: "bs-startup-update-status", role: "status", "aria-live": "polite" }, "\u6B63\u5728\u79FB\u9664\u81EA\u5B9A\u4E49\u7D20\u6750\u5E76\u6062\u590D\u9ED8\u8BA4\u2026"), error && /* @__PURE__ */ import_react4.default.createElement("p", { className: "bs-startup-update-error", role: "alert" }, error), /* @__PURE__ */ import_react4.default.createElement("div", { className: "bs-startup-update-actions bs-reset-actions" }, /* @__PURE__ */ import_react4.default.createElement("button", { ref: cancelButton, type: "button", autoFocus: true, disabled: busy, onClick: cancel }, "\u53D6\u6D88"), /* @__PURE__ */ import_react4.default.createElement("button", { className: "bs-reset-confirm", type: "button", disabled: busy, onClick: confirm }, busy ? "\u6B63\u5728\u6062\u590D\u2026" : "\u786E\u8BA4\u6062\u590D\u9ED8\u8BA4"))));
}

// src/client.jsx
var BASE = "/dsh-boot-studio";
var OPEN = "dsh-boot-studio:open";
var PLAY = "dsh-boot-studio:play";
var bootClaimed = false;
var launchRequest = null;
var launchDecisionSettled = false;
var latestState = null;
var subscribers = /* @__PURE__ */ new Set();
var playerWindows = /* @__PURE__ */ new WeakMap();
var VERSION2 = true ? "1.2.6" : "1.2.6";
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
async function api(path, options = {}) {
  const controller = new AbortController();
  const timeout = ["/upload", "/end-images", "/updates/prepare", "/reset"].includes(path) ? 18e4 : path === "/updates/check" ? 2e4 : 7e3;
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(BASE + path, {
      ...options,
      signal: controller.signal,
      headers: { "x-dsh-boot-studio": "1", ...options.body && typeof options.body === "string" ? { "content-type": "application/json" } : {}, ...options.headers }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || `\u8BF7\u6C42\u5931\u8D25 (${response.status})`);
    return data;
  } finally {
    clearTimeout(timer);
  }
}
function publish(value) {
  latestState = value;
  subscribers.forEach((fn) => fn(value));
  return value;
}
function openSettings() {
  window.dispatchEvent(new Event(OPEN));
}
function preview(clip, settings, endOnly = false) {
  window.dispatchEvent(new CustomEvent(PLAY, { detail: { clip, settings, endOnly } }));
}
function useStyles() {
  (0, import_react5.useEffect)(() => {
    let el = document.getElementById("dsh-boot-studio-style");
    if (!el) {
      el = document.createElement("style");
      el.id = "dsh-boot-studio-style";
      el.textContent = CSS;
      document.head.appendChild(el);
    }
  }, []);
}
function EndTitle({ settings }) {
  const [imageFailed, setImageFailed] = (0, import_react5.useState)(false);
  (0, import_react5.useEffect)(() => setImageFailed(false), [settings.endImageId, settings.logoVariant, settings.endScreen]);
  const variant = settings.logoVariant || "silver";
  const userImage = settings.endScreen === "image" && settings.endImageId && !imageFailed;
  const builtinImage = settings.endScreen !== "image" && ["silver", "gold", "ice"].includes(variant) && !imageFailed;
  const imageURL = userImage ? `${BASE}/end-image/${encodeURIComponent(settings.endImageId)}` : builtinImage ? `${BASE}/logo/${variant}` : null;
  return /* @__PURE__ */ import_react5.default.createElement("div", { className: `bs-end-title bs-end-${userImage ? "custom" : variant}`, "data-testid": "end-screen", "data-logo": builtinImage ? variant : void 0 }, imageURL ? /* @__PURE__ */ import_react5.default.createElement("img", { className: "bs-end-image", "data-testid": userImage ? "end-image" : "end-logo-image", src: imageURL, alt: userImage ? "\u81EA\u5B9A\u4E49\u7ED3\u675F\u753B\u9762" : "DeepSeek \u5185\u7F6E\u7ED3\u675F\u753B\u9762", style: { objectFit: userImage ? settings.endFit || "contain" : "cover" }, onError: () => setImageFailed(true) }) : /* @__PURE__ */ import_react5.default.createElement("div", { className: "bs-end-brand" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "bs-end-halo" }), /* @__PURE__ */ import_react5.default.createElement("svg", { className: "bs-end-whale", viewBox: "0 0 50 50", "aria-label": "DeepSeek \u6807\u5FD7", role: "img" }, /* @__PURE__ */ import_react5.default.createElement("path", { d: WHALE_PATH })), /* @__PURE__ */ import_react5.default.createElement("h1", null, "DEEPSEEK"), /* @__PURE__ */ import_react5.default.createElement("p", null, "HARNESS"), /* @__PURE__ */ import_react5.default.createElement("div", { className: "bs-end-rule" })), /* @__PURE__ */ import_react5.default.createElement("p", { className: "bs-enter-prompt" }, "\u6309\u4EFB\u610F\u952E\u8FDB\u5165"));
}
function Player({ clip, settings, onClose, endOnly = false }) {
  useStyles();
  const video = (0, import_react5.useRef)(null);
  const dialog = (0, import_react5.useRef)(null);
  const closed = (0, import_react5.useRef)(false);
  const [phase, setPhase] = (0, import_react5.useState)(endOnly ? "end" : "intro");
  const phaseRef = (0, import_react5.useRef)(endOnly ? "end" : "intro");
  const lastInput = (0, import_react5.useRef)(-1e3);
  const [blocked, setBlocked] = (0, import_react5.useState)(false);
  const [mutedFallback, setMutedFallback] = (0, import_react5.useState)(false);
  const stopMedia = (0, import_react5.useCallback)(() => {
    const el = video.current;
    if (el) {
      el.pause();
      el.removeAttribute("src");
      el.load();
    }
  }, []);
  const close = (0, import_react5.useCallback)((reason) => {
    if (closed.current) return;
    closed.current = true;
    stopMedia();
    onClose(reason);
  }, [onClose, stopMedia]);
  const showEnd = (0, import_react5.useCallback)(() => {
    if (closed.current || phaseRef.current === "end") return;
    phaseRef.current = "end";
    stopMedia();
    setPhase("end");
  }, [stopMedia]);
  const advance = (0, import_react5.useCallback)(() => {
    const now = performance.now();
    if (now - lastInput.current < 250) return;
    lastInput.current = now;
    if (phaseRef.current === "intro") showEnd();
    else close("enter");
  }, [showEnd, close]);
  (0, import_react5.useEffect)(() => {
    closed.current = false;
    const playerDialog = dialog.current;
    const previous = document.activeElement;
    const releaseWindow = acquirePlayerWindow(document);
    if (typeof playerDialog.showModal === "function" && !playerDialog.open) playerDialog.showModal();
    else playerDialog.setAttribute("open", "");
    const key = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!e.repeat && !e.isComposing) advance();
    };
    window.addEventListener("keydown", key, true);
    playerDialog.focus();
    return () => {
      closed.current = true;
      releaseWindow();
      window.removeEventListener("keydown", key, true);
      if (playerDialog.open && typeof playerDialog.close === "function") playerDialog.close();
      if (previous?.isConnected) previous.focus?.();
    };
  }, [advance]);
  (0, import_react5.useEffect)(() => {
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
  }, [phase, clip.kind, showEnd]);
  (0, import_react5.useEffect)(() => {
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
  }, [clip.url, clip.kind, phase, settings.sound, settings.volume, showEnd]);
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
  return /* @__PURE__ */ import_react5.default.createElement(
    "dialog",
    {
      ref: dialog,
      className: "bs-player",
      "data-testid": "player",
      "data-phase": phase,
      "aria-label": phase === "end" ? "DeepSeek \u6807\u9898\u754C\u9762" : `\u5F00\u673A\u52A8\u753B\uFF1A${clip.name}`,
      tabIndex: -1,
      onCancel: (e) => {
        e.preventDefault();
        advance();
      },
      onPointerDown: (e) => {
        if (!e.target.closest("[data-bs-control]")) advance();
      }
    },
    phase === "end" ? /* @__PURE__ */ import_react5.default.createElement(EndTitle, { settings }) : /* @__PURE__ */ import_react5.default.createElement(import_react5.default.Fragment, null, clip.kind === "sequence" ? /* @__PURE__ */ import_react5.default.createElement(StartupSequence, { sound: settings.sound, volume: settings.volume, onEnded: showEnd }) : /* @__PURE__ */ import_react5.default.createElement(
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
    ), blocked && /* @__PURE__ */ import_react5.default.createElement("button", { "data-bs-control": true, type: "button", className: "bs-play-manual", onClick: playManually }, "\u25B6 \u70B9\u51FB\u64AD\u653E"), mutedFallback && /* @__PURE__ */ import_react5.default.createElement("button", { "data-bs-control": true, type: "button", className: "bs-sound", onClick: enableSound }, "\u266A \u5F00\u542F\u58F0\u97F3"), /* @__PURE__ */ import_react5.default.createElement("p", { className: "bs-intro-prompt" }, "\u6309\u4EFB\u610F\u952E\u8DF3\u8FC7\u52A8\u753B"))
  );
}
function Toggle({ label, description, checked, onChange, disabled }) {
  return /* @__PURE__ */ import_react5.default.createElement("label", { className: "bs-toggle-row" }, /* @__PURE__ */ import_react5.default.createElement("span", null, /* @__PURE__ */ import_react5.default.createElement("strong", null, label), description && /* @__PURE__ */ import_react5.default.createElement("small", null, description)), /* @__PURE__ */ import_react5.default.createElement("input", { type: "checkbox", role: "switch", checked, onChange: (e) => onChange(e.target.checked), disabled }), /* @__PURE__ */ import_react5.default.createElement("span", { className: "bs-switch", "aria-hidden": "true" }));
}
function SettingsPanel({ standalone = false }) {
  useStyles();
  const [state, setState] = (0, import_react5.useState)(latestState);
  const [error, setError] = (0, import_react5.useState)("");
  const [notice, setNotice] = (0, import_react5.useState)("");
  const [busy, setBusy] = (0, import_react5.useState)(false);
  const [uploadPercent, setUploadPercent] = (0, import_react5.useState)(null);
  const [pendingDelete, setPendingDelete] = (0, import_react5.useState)(null);
  const [pendingImageDelete, setPendingImageDelete] = (0, import_react5.useState)(null);
  const [draftVolume, setDraftVolume] = (0, import_react5.useState)(70);
  const [draftBlur, setDraftBlur] = (0, import_react5.useState)(30);
  const [draftRadius, setDraftRadius] = (0, import_react5.useState)(30);
  const [appearancePreview, setAppearancePreview] = (0, import_react5.useState)(false);
  const [resetOpened, setResetOpened] = (0, import_react5.useState)(false);
  const input = (0, import_react5.useRef)(null);
  const imageInput = (0, import_react5.useRef)(null);
  const active = (0, import_react5.useRef)(true);
  const uploadRequest = (0, import_react5.useRef)(null);
  const probeCancel = (0, import_react5.useRef)(null);
  (0, import_react5.useEffect)(() => {
    active.current = true;
    const update = (v) => {
      setState(v);
      setDraftVolume(Math.round(v.settings.volume * 100));
      setDraftBlur(v.settings.updatePromptBlur ?? 30);
      setDraftRadius(v.settings.updatePromptRadius ?? 30);
    };
    subscribers.add(update);
    api("/state").then(publish).catch((e) => setError(`\u8FDE\u63A5\u5931\u8D25\uFF1A${e.message}\u3002\u8BF7\u91CD\u542F Harness \u540E\u91CD\u8BD5\u3002`));
    return () => {
      active.current = false;
      subscribers.delete(update);
      uploadRequest.current?.abort();
      probeCancel.current?.();
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
      setError(e.message);
      if (state) {
        setDraftVolume(Math.round(state.settings.volume * 100));
        setDraftBlur(state.settings.updatePromptBlur ?? 30);
        setDraftRadius(state.settings.updatePromptRadius ?? 30);
      }
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
      publish(await api("/reset", { method: "POST", body: JSON.stringify({ confirm: "reset-all-custom-data" }) }));
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
      setError(e.message);
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
      setError(e.message);
    } finally {
      if (active.current) setBusy(false);
    }
  }
  function uploadEndImage(file) {
    if (!file || busy) return;
    if (!/\.(png|jpe?g|webp)$/i.test(file.name) || !file.size || file.size > (state?.maxImageUploadBytes || 20971520)) {
      setError("\u8BF7\u9009\u62E9\u4E0D\u8D85\u8FC720 MB\u7684PNG\u3001JPEG\u6216WebP\u56FE\u7247\u3002");
      return;
    }
    setBusy(true);
    setError("");
    setNotice("\u6B63\u5728\u68C0\u67E5\u7ED3\u675F\u753B\u9762\u2026");
    const probe = new Image();
    const objectURL = URL.createObjectURL(file);
    let finished = false;
    const cleanup = () => {
      clearTimeout(timeout);
      probe.onload = null;
      probe.onerror = null;
      probe.src = "";
      URL.revokeObjectURL(objectURL);
      probeCancel.current = null;
    };
    const fail = () => {
      if (finished) return;
      finished = true;
      cleanup();
      if (active.current) {
        setBusy(false);
        setNotice("");
        setError("\u65E0\u6CD5\u8BFB\u53D6\u8FD9\u5F20\u56FE\u7247\uFF0C\u8BF7\u66F4\u6362\u6709\u6548\u7684PNG\u3001JPEG\u6216WebP\u3002");
      }
    };
    const timeout = setTimeout(fail, 1e4);
    probeCancel.current = () => {
      finished = true;
      cleanup();
    };
    probe.onerror = fail;
    probe.onload = () => {
      if (finished) return;
      finished = true;
      cleanup();
      if (!active.current) return;
      const xhr = new XMLHttpRequest();
      uploadRequest.current = xhr;
      xhr.open("POST", BASE + "/end-images");
      xhr.setRequestHeader("x-dsh-boot-studio", "1");
      xhr.setRequestHeader("x-file-name", encodeURIComponent(file.name));
      xhr.setRequestHeader("content-type", file.type || "application/octet-stream");
      xhr.timeout = 12e4;
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) setUploadPercent(Math.round(e.loaded / e.total * 100));
      };
      const done = () => {
        if (active.current) {
          setBusy(false);
          setUploadPercent(null);
        }
        uploadRequest.current = null;
      };
      xhr.onload = () => {
        try {
          const result = JSON.parse(xhr.responseText);
          if (xhr.status >= 400) throw Error(result.error || "\u4E0A\u4F20\u5931\u8D25");
          publish(result.state);
          setNotice("\u56FE\u7247\u5DF2\u4E0A\u4F20\u5E76\u8BBE\u4E3A\u7ED3\u675F\u753B\u9762");
        } catch (e) {
          setError(e.message);
          setNotice("");
        } finally {
          done();
        }
      };
      xhr.onerror = xhr.ontimeout = () => {
        if (active.current) {
          setError("\u56FE\u7247\u4E0A\u4F20\u4E2D\u65AD\uFF0C\u8BF7\u91CD\u8BD5\u3002");
          setNotice("");
        }
        done();
      };
      xhr.onabort = done;
      setUploadPercent(0);
      setNotice("\u6B63\u5728\u4E0A\u4F20\u56FE\u7247\u2026");
      xhr.send(file);
    };
    probe.src = objectURL;
  }
  function upload(file) {
    if (!file || busy) return;
    if (!/\.(mp4|m4v|webm)$/i.test(file.name)) {
      setError("\u8BF7\u9009\u62E9 MP4\u3001M4V \u6216 WebM \u89C6\u9891\u3002\u63A8\u8350 MP4\uFF08H.264 / AAC\uFF09\u3002");
      return;
    }
    if (file.size > (state?.maxUploadBytes || 209715200) || file.size === 0) {
      setError("\u89C6\u9891\u5E94\u5927\u4E8E 0 \u5B57\u8282\uFF0C\u4E14\u4E0D\u8D85\u8FC7 200 MB\u3002");
      return;
    }
    setBusy(true);
    setError("");
    setNotice("\u6B63\u5728\u68C0\u67E5\u89C6\u9891\u2026");
    const probe = document.createElement("video");
    const objectURL = URL.createObjectURL(file);
    let finished = false;
    const cleanup = () => {
      clearTimeout(timeout);
      probe.onloadeddata = null;
      probe.onerror = null;
      probe.removeAttribute("src");
      probe.load();
      URL.revokeObjectURL(objectURL);
      probeCancel.current = null;
    };
    const fail = () => {
      if (finished) return;
      finished = true;
      cleanup();
      if (active.current) {
        setBusy(false);
        setNotice("");
        setError("\u6D4F\u89C8\u5668\u65E0\u6CD5\u8BFB\u53D6\u6B64\u89C6\u9891\u3002\u8BF7\u8F6C\u6362\u4E3A MP4\uFF08H.264 / AAC\uFF09\u540E\u91CD\u8BD5\u3002");
      }
    };
    const timeout = setTimeout(fail, 12e3);
    probeCancel.current = () => {
      finished = true;
      cleanup();
    };
    probe.onerror = fail;
    probe.onloadeddata = () => {
      if (finished) return;
      finished = true;
      cleanup();
      if (!active.current) return;
      const xhr = new XMLHttpRequest();
      uploadRequest.current = xhr;
      xhr.open("POST", BASE + "/upload");
      xhr.setRequestHeader("x-dsh-boot-studio", "1");
      xhr.setRequestHeader("x-file-name", encodeURIComponent(file.name));
      xhr.setRequestHeader("content-type", file.type || "application/octet-stream");
      xhr.timeout = 18e4;
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) setUploadPercent(Math.round(e.loaded / e.total * 100));
      };
      const done = () => {
        if (active.current) {
          setBusy(false);
          setUploadPercent(null);
        }
        uploadRequest.current = null;
      };
      xhr.onload = () => {
        try {
          const result = JSON.parse(xhr.responseText);
          if (xhr.status >= 400) throw new Error(result.error || "\u4E0A\u4F20\u5931\u8D25");
          publish(result.state);
          setNotice("\u89C6\u9891\u5DF2\u5BFC\u5165\u5E76\u8BBE\u4E3A\u5F00\u673A\u52A8\u753B");
        } catch (e) {
          setError(e.message);
          setNotice("");
        } finally {
          done();
        }
      };
      xhr.onerror = xhr.ontimeout = () => {
        if (active.current) {
          setError("\u4E0A\u4F20\u4E2D\u65AD\uFF0C\u8BF7\u91CD\u8BD5\u3002");
          setNotice("");
        }
        done();
      };
      xhr.onabort = done;
      setNotice("\u6B63\u5728\u4E0A\u4F20\u2026");
      setUploadPercent(0);
      xhr.send(file);
    };
    probe.preload = "auto";
    probe.src = objectURL;
    probe.load();
  }
  const settings = state?.settings;
  const selected = state?.clips.find((c) => c.id === settings.selectedId) || state?.clips[0];
  return /* @__PURE__ */ import_react5.default.createElement("section", { className: "bs-studio", "data-testid": "settings" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "bs-heading" }, /* @__PURE__ */ import_react5.default.createElement("div", null, /* @__PURE__ */ import_react5.default.createElement("div", { className: "bs-eyebrow" }, "DSH LEWIS ENCHANT"), /* @__PURE__ */ import_react5.default.createElement("h1", null, "\u9644\u9B54\u53F0", /* @__PURE__ */ import_react5.default.createElement("span", null, "\u5F00\u673A\u52A8\u753B")), /* @__PURE__ */ import_react5.default.createElement("p", null, "\u81EA\u5B9A\u4E49\u4F60\u7684\u5F00\u573A\uFF0C\u5C01\u9762\u4E0E\u58F0\u97F3\u3002")), /* @__PURE__ */ import_react5.default.createElement("span", { className: "bs-version" }, "V", VERSION2)), /* @__PURE__ */ import_react5.default.createElement("div", { className: "bs-toolbar" }, /* @__PURE__ */ import_react5.default.createElement("span", { className: "bs-status" }, /* @__PURE__ */ import_react5.default.createElement("i", null), settings ? settings.enabled ? "\u542F\u52A8\u65F6\u81EA\u52A8\u64AD\u653E" : "\u81EA\u52A8\u64AD\u653E\u5DF2\u5173\u95ED" : "\u6B63\u5728\u8FDE\u63A5\u2026"), /* @__PURE__ */ import_react5.default.createElement("button", { className: "bs-primary", type: "button", disabled: !selected || busy, onClick: () => preview(selected, settings) }, "\u25B6 \u9884\u89C8\u5F53\u524D\u52A8\u753B")), error && /* @__PURE__ */ import_react5.default.createElement("div", { className: "bs-alert", role: "alert" }, error, /* @__PURE__ */ import_react5.default.createElement("button", { type: "button", onClick: () => {
    setError("");
    api("/state").then(publish).catch((e) => setError(e.message));
  } }, "\u91CD\u8BD5")), /* @__PURE__ */ import_react5.default.createElement("div", { className: "bs-notice", role: "status", "aria-live": "polite" }, busy ? uploadPercent !== null ? `\u6B63\u5728\u4E0A\u4F20 ${uploadPercent}%` : notice || "\u6B63\u5728\u4FDD\u5B58\u2026" : notice), settings && /* @__PURE__ */ import_react5.default.createElement(import_react5.default.Fragment, null, /* @__PURE__ */ import_react5.default.createElement("div", { className: "bs-section-title" }, /* @__PURE__ */ import_react5.default.createElement("h2", null, "\u52A8\u753B\u7247\u5E93"), /* @__PURE__ */ import_react5.default.createElement("span", null, state.clips.length, " \u6BB5\u52A8\u753B \xB7 \u9009\u62E9\u540E\u81EA\u52A8\u4FDD\u5B58")), /* @__PURE__ */ import_react5.default.createElement("div", { className: "bs-library" }, state.clips.map((clip, index) => /* @__PURE__ */ import_react5.default.createElement("article", { key: clip.id, className: `bs-clip ${clip.id === settings.selectedId ? "is-selected" : ""}` }, /* @__PURE__ */ import_react5.default.createElement("button", { type: "button", className: `bs-thumbnail bs-tone-${index % 4}`, "aria-label": `\u9884\u89C8 ${clip.name}`, onClick: () => preview(clip, settings), disabled: busy }, clip.kind === "sequence" ? /* @__PURE__ */ import_react5.default.createElement("div", { className: "bs-sequence-thumb" }, /* @__PURE__ */ import_react5.default.createElement("svg", { viewBox: "0 0 50 50", "aria-hidden": "true" }, /* @__PURE__ */ import_react5.default.createElement("path", { d: WHALE_PATH })), /* @__PURE__ */ import_react5.default.createElement("span", null, "DEEPSEEK"), /* @__PURE__ */ import_react5.default.createElement("small", null, "TECHNICAL DOSSIER")) : /* @__PURE__ */ import_react5.default.createElement("video", { src: clip.url + "#t=0.4", muted: true, playsInline: true, preload: "metadata", tabIndex: -1 }), /* @__PURE__ */ import_react5.default.createElement("span", { className: "bs-thumbnail-shade" }), /* @__PURE__ */ import_react5.default.createElement("span", { className: "bs-play-icon" }, "\u25B6"), /* @__PURE__ */ import_react5.default.createElement("span", { className: "bs-clip-number" }, String(index + 1).padStart(2, "0")), /* @__PURE__ */ import_react5.default.createElement("span", { className: "bs-badge" }, clip.kind === "sequence" ? "\u7A0B\u5E8F\u52A8\u753B" : clip.source === "builtin" ? "\u5185\u7F6E" : "\u6211\u7684\u89C6\u9891")), /* @__PURE__ */ import_react5.default.createElement("div", { className: "bs-clip-info" }, /* @__PURE__ */ import_react5.default.createElement("h3", null, clip.name), /* @__PURE__ */ import_react5.default.createElement("span", null, clip.kind === "sequence" ? "\u539F\u7248\u89C6\u89C9\u5E8F\u5217" : (clip.bytes / 1048576).toFixed(1) + " MB")), /* @__PURE__ */ import_react5.default.createElement("div", { className: "bs-clip-actions" }, /* @__PURE__ */ import_react5.default.createElement("button", { type: "button", className: clip.id === settings.selectedId ? "bs-selected" : "", onClick: () => save({ selectedId: clip.id }), disabled: busy || clip.id === settings.selectedId }, clip.id === settings.selectedId ? "\u2713 \u5F53\u524D\u52A8\u753B" : "\u4F7F\u7528\u6B64\u52A8\u753B"), clip.source === "upload" && /* @__PURE__ */ import_react5.default.createElement("button", { className: "bs-delete", "aria-label": `\u5220\u9664 ${clip.name}`, disabled: busy, onClick: () => setPendingDelete(clip) }, "\u79FB\u9664")), pendingDelete?.id === clip.id && /* @__PURE__ */ import_react5.default.createElement("div", { className: "bs-delete-confirm" }, "\u79FB\u9664\u6B64\u89C6\u9891\uFF1F", /* @__PURE__ */ import_react5.default.createElement("button", { type: "button", disabled: busy, onClick: () => remove(clip) }, "\u786E\u8BA4\u79FB\u9664"), /* @__PURE__ */ import_react5.default.createElement("button", { type: "button", onClick: () => setPendingDelete(null) }, "\u53D6\u6D88")))), /* @__PURE__ */ import_react5.default.createElement("button", { type: "button", className: "bs-upload", disabled: busy, onClick: () => input.current?.click(), onDragOver: (e) => e.preventDefault(), onDrop: (e) => {
    e.preventDefault();
    upload(e.dataTransfer.files?.[0]);
  } }, /* @__PURE__ */ import_react5.default.createElement("span", null, "\uFF0B"), /* @__PURE__ */ import_react5.default.createElement("strong", null, "\u4E0A\u4F20\u6211\u7684\u89C6\u9891"), /* @__PURE__ */ import_react5.default.createElement("small", null, "\u70B9\u51FB\u9009\u62E9\uFF0C\u6216\u5C06\u89C6\u9891\u62D6\u5230\u8FD9\u91CC"), /* @__PURE__ */ import_react5.default.createElement("small", null, "MP4 / WebM / M4V \xB7 \u2264 200 MB"))), /* @__PURE__ */ import_react5.default.createElement("input", { ref: input, type: "file", accept: ".mp4,.m4v,.webm,video/mp4,video/webm", "aria-label": "\u4E0A\u4F20\u5F00\u673A\u89C6\u9891", hidden: true, onChange: (e) => {
    upload(e.target.files?.[0]);
    e.target.value = "";
  } }), /* @__PURE__ */ import_react5.default.createElement("div", { className: "bs-section-title" }, /* @__PURE__ */ import_react5.default.createElement("h2", null, "\u7ED3\u675F\u505C\u7559\u753B\u9762"), /* @__PURE__ */ import_react5.default.createElement("button", { className: "bs-text-button", type: "button", disabled: busy || !selected, onClick: () => preview(selected, settings, true) }, "\u9884\u89C8\u7ED3\u675F\u753B\u9762")), /* @__PURE__ */ import_react5.default.createElement("div", { className: "bs-preferences bs-ending-settings" }, /* @__PURE__ */ import_react5.default.createElement("label", { className: "bs-field" }, /* @__PURE__ */ import_react5.default.createElement("span", null, "\u64AD\u653E\u7ED3\u675F\u540E", /* @__PURE__ */ import_react5.default.createElement("small", null, "\u59CB\u7EC8\u505C\u7559\uFF0C\u6309\u4EFB\u610F\u952E\u518D\u8FDB\u5165 Harness")), /* @__PURE__ */ import_react5.default.createElement("select", { "aria-label": "\u7ED3\u675F\u753B\u9762\u7C7B\u578B", disabled: busy, value: settings.endScreen || "logo", onChange: (e) => {
    if (e.target.value === "image" && !settings.endImageId) {
      imageInput.current?.click();
      return;
    }
    save({ endScreen: e.target.value });
  } }, /* @__PURE__ */ import_react5.default.createElement("option", { value: "logo" }, "DeepSeek \u6807\u5FD7"), /* @__PURE__ */ import_react5.default.createElement("option", { value: "image" }, "\u6211\u7684\u56FE\u7247"))), !!state.logos?.length && /* @__PURE__ */ import_react5.default.createElement("div", { className: "bs-logo-options" }, state.logos.map((logo) => /* @__PURE__ */ import_react5.default.createElement("button", { type: "button", key: logo.id, disabled: busy, className: settings.endScreen === "logo" && settings.logoVariant === logo.id ? "is-selected" : "", "aria-label": `\u4F7F\u7528\u5185\u7F6E\u7ED3\u675F\u753B\u9762 ${logo.name}`, onClick: () => save({ endScreen: "logo", logoVariant: logo.id }) }, /* @__PURE__ */ import_react5.default.createElement("img", { src: logo.url, alt: "" }), /* @__PURE__ */ import_react5.default.createElement("span", null, logo.name, settings.endScreen === "logo" && settings.logoVariant === logo.id ? " \u2713" : "")))), /* @__PURE__ */ import_react5.default.createElement("div", { className: "bs-ending-preview" }, /* @__PURE__ */ import_react5.default.createElement("div", { className: "bs-ending-mini" }, /* @__PURE__ */ import_react5.default.createElement(EndTitle, { settings })), /* @__PURE__ */ import_react5.default.createElement("div", null, /* @__PURE__ */ import_react5.default.createElement("strong", null, settings.endScreen === "image" ? "\u6211\u7684\u56FE\u7247" : state.logos?.find((logo) => logo.id === settings.logoVariant)?.name || "DeepSeek \u6807\u5FD7"), /* @__PURE__ */ import_react5.default.createElement("p", null, "\u753B\u9762\u4FDD\u6301\u9759\u6B62\uFF0C\u5E95\u90E8\u63D0\u793A\u300C\u6309\u4EFB\u610F\u952E\u8FDB\u5165\u300D\u3002"), /* @__PURE__ */ import_react5.default.createElement("button", { type: "button", className: "bs-primary", disabled: busy, onClick: () => imageInput.current?.click() }, "\u4E0A\u4F20\u7ED3\u675F\u56FE\u7247"), /* @__PURE__ */ import_react5.default.createElement("small", null, "PNG / JPEG / WebP \xB7 \u2264 20 MB"))), settings.endScreen === "image" && /* @__PURE__ */ import_react5.default.createElement("label", { className: "bs-field" }, /* @__PURE__ */ import_react5.default.createElement("span", null, "\u7ED3\u675F\u56FE\u7247\u663E\u793A"), /* @__PURE__ */ import_react5.default.createElement("select", { "aria-label": "\u7ED3\u675F\u56FE\u7247\u663E\u793A", value: settings.endFit || "contain", disabled: busy, onChange: (e) => save({ endFit: e.target.value }) }, /* @__PURE__ */ import_react5.default.createElement("option", { value: "contain" }, "\u5B8C\u6574\u663E\u793A"), /* @__PURE__ */ import_react5.default.createElement("option", { value: "cover" }, "\u94FA\u6EE1\u7A97\u53E3"))), !!state.endImages?.length && /* @__PURE__ */ import_react5.default.createElement("div", { className: "bs-end-library" }, state.endImages.map((image) => /* @__PURE__ */ import_react5.default.createElement("div", { className: `bs-end-card ${settings.endScreen === "image" && settings.endImageId === image.id ? "is-selected" : ""}`, key: image.id }, /* @__PURE__ */ import_react5.default.createElement("button", { type: "button", disabled: busy, "aria-label": `\u4F7F\u7528\u7ED3\u675F\u56FE\u7247 ${image.name}`, onClick: () => save({ endImageId: image.id, endScreen: "image" }) }, /* @__PURE__ */ import_react5.default.createElement("img", { src: image.url, alt: "" }), /* @__PURE__ */ import_react5.default.createElement("span", null, image.name)), pendingImageDelete === image.id ? /* @__PURE__ */ import_react5.default.createElement("span", null, /* @__PURE__ */ import_react5.default.createElement("button", { type: "button", disabled: busy, onClick: () => removeEndImage(image) }, "\u786E\u8BA4\u79FB\u9664"), /* @__PURE__ */ import_react5.default.createElement("button", { type: "button", onClick: () => setPendingImageDelete(null) }, "\u53D6\u6D88")) : /* @__PURE__ */ import_react5.default.createElement("button", { type: "button", disabled: busy, className: "bs-delete", "aria-label": `\u79FB\u9664\u7ED3\u675F\u56FE\u7247 ${image.name}`, onClick: () => setPendingImageDelete(image.id) }, "\u79FB\u9664"))))), /* @__PURE__ */ import_react5.default.createElement("input", { ref: imageInput, type: "file", accept: ".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp", "aria-label": "\u4E0A\u4F20\u7ED3\u675F\u56FE\u7247", hidden: true, onChange: (e) => {
    uploadEndImage(e.target.files?.[0]);
    e.target.value = "";
  } }), /* @__PURE__ */ import_react5.default.createElement("div", { className: "bs-section-title" }, /* @__PURE__ */ import_react5.default.createElement("h2", null, "\u64AD\u653E\u504F\u597D"), /* @__PURE__ */ import_react5.default.createElement("span", null, "\u4FEE\u6539\u7ACB\u5373\u4FDD\u5B58")), /* @__PURE__ */ import_react5.default.createElement("div", { className: "bs-preferences" }, /* @__PURE__ */ import_react5.default.createElement(Toggle, { label: "\u542F\u52A8\u65F6\u64AD\u653E", description: "\u6BCF\u6B21\u6253\u5F00 Harness \u64AD\u653E\u4E00\u6B21\uFF0C\u5207\u6362\u4F1A\u8BDD\u4E0D\u91CD\u590D", checked: settings.enabled, disabled: busy, onChange: (enabled) => save({ enabled }) }), /* @__PURE__ */ import_react5.default.createElement(Toggle, { label: "\u64AD\u653E\u58F0\u97F3", description: "\u6D4F\u89C8\u5668\u82E5\u62E6\u622A\u6709\u58F0\u81EA\u52A8\u64AD\u653E\uFF0C\u52A8\u753B\u4ECD\u4F1A\u9759\u97F3\u5F00\u59CB", checked: settings.sound, disabled: busy, onChange: (sound) => save({ sound }) }), settings.sound && /* @__PURE__ */ import_react5.default.createElement("label", { className: "bs-field" }, /* @__PURE__ */ import_react5.default.createElement("span", null, "\u97F3\u91CF"), /* @__PURE__ */ import_react5.default.createElement("input", { "aria-label": "\u97F3\u91CF", type: "range", min: "0", max: "100", value: draftVolume, disabled: busy, onChange: (e) => setDraftVolume(Number(e.target.value)), onPointerUp: () => save({ volume: draftVolume / 100 }), onKeyUp: (e) => {
    if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) save({ volume: draftVolume / 100 });
  } }), /* @__PURE__ */ import_react5.default.createElement("output", null, draftVolume, "%")), /* @__PURE__ */ import_react5.default.createElement(Toggle, { label: "\u968F\u673A\u5F00\u573A", description: "\u6BCF\u6B21\u542F\u52A8\u4ECE\u7247\u5E93\u968F\u673A\u9009\u62E9\uFF1B\u5173\u95ED\u540E\u4F7F\u7528\u5F53\u524D\u52A8\u753B", checked: settings.shuffle, disabled: busy, onChange: (shuffle) => save({ shuffle }) })), /* @__PURE__ */ import_react5.default.createElement("div", { className: "bs-help" }, /* @__PURE__ */ import_react5.default.createElement("strong", null, "\u50CF\u6E38\u620F\u4E00\u6837\u5F00\u542F\u3002"), /* @__PURE__ */ import_react5.default.createElement("p", null, "\u52A8\u753B\u4E2D\u6309\u4EFB\u610F\u952E\u8DF3\u5230\u6807\u9898\u9875\uFF0C\u518D\u6309\u4EFB\u610F\u952E\u8FDB\u5165\u3002\u4E5F\u652F\u6301\u9F20\u6807\u70B9\u51FB\u4E0E\u89E6\u5C4F\uFF1B\u957F\u6309\u4E0D\u4F1A\u8FDE\u8DF3\u3002\u89C6\u9891\u548C\u7ED3\u675F\u56FE\u7247\u90FD\u4FDD\u5B58\u5728\u672C\u673A\u3002"), /* @__PURE__ */ import_react5.default.createElement("span", null, "\u89C6\u9891\uFF1Adsh-boot-animation \xB7 BSD-3-Clause\u3000\u6280\u672F\u6863\u6848\uFF1Adsh-startup-screen \xB7 MIT")), /* @__PURE__ */ import_react5.default.createElement(UpdatePanel, { request: api, standalone }), /* @__PURE__ */ import_react5.default.createElement("div", { className: "bs-section-title" }, /* @__PURE__ */ import_react5.default.createElement("h2", null, "\u66F4\u65B0\u63D0\u9192\u5916\u89C2"), /* @__PURE__ */ import_react5.default.createElement("button", { className: "bs-text-button", type: "button", onClick: () => setAppearancePreview(true) }, "\u9884\u89C8\u66F4\u65B0\u63D0\u9192")), /* @__PURE__ */ import_react5.default.createElement("div", { className: "bs-preferences" }, /* @__PURE__ */ import_react5.default.createElement("label", { className: "bs-field" }, /* @__PURE__ */ import_react5.default.createElement("span", null, "\u78E8\u7802\u5EA6", /* @__PURE__ */ import_react5.default.createElement("small", null, "\u8C03\u6574\u66F4\u65B0\u5F39\u7A97\u7684\u80CC\u666F\u6A21\u7CCA\u7A0B\u5EA6")), /* @__PURE__ */ import_react5.default.createElement("input", { "aria-label": "\u66F4\u65B0\u5F39\u7A97\u78E8\u7802\u5EA6", type: "range", min: "0", max: "48", step: "1", value: draftBlur, disabled: busy, onChange: (e) => setDraftBlur(Number(e.target.value)), onPointerUp: (e) => save({ updatePromptBlur: Number(e.currentTarget.value) }), onKeyUp: (e) => {
    if (["ArrowLeft", "ArrowRight", "Home", "End", "PageUp", "PageDown"].includes(e.key)) save({ updatePromptBlur: Number(e.currentTarget.value) });
  } }), /* @__PURE__ */ import_react5.default.createElement("output", null, draftBlur, "px")), /* @__PURE__ */ import_react5.default.createElement("label", { className: "bs-field" }, /* @__PURE__ */ import_react5.default.createElement("span", null, "\u5F39\u7A97\u5706\u89D2", /* @__PURE__ */ import_react5.default.createElement("small", null, "\u8C03\u6574\u66F4\u65B0\u5F39\u7A97\u8FB9\u89D2\u7684\u5706\u6DA6\u7A0B\u5EA6")), /* @__PURE__ */ import_react5.default.createElement("input", { "aria-label": "\u66F4\u65B0\u5F39\u7A97\u5706\u89D2", type: "range", min: "12", max: "40", step: "1", value: draftRadius, disabled: busy, onChange: (e) => setDraftRadius(Number(e.target.value)), onPointerUp: (e) => save({ updatePromptRadius: Number(e.currentTarget.value) }), onKeyUp: (e) => {
    if (["ArrowLeft", "ArrowRight", "Home", "End", "PageUp", "PageDown"].includes(e.key)) save({ updatePromptRadius: Number(e.currentTarget.value) });
  } }), /* @__PURE__ */ import_react5.default.createElement("output", null, draftRadius, "px"))), /* @__PURE__ */ import_react5.default.createElement("div", { className: "bs-section-title bs-entry-title" }, /* @__PURE__ */ import_react5.default.createElement("h2", null, "\u8FDB\u5165\u65B9\u5F0F")), /* @__PURE__ */ import_react5.default.createElement("div", { className: "bs-preferences" }, /* @__PURE__ */ import_react5.default.createElement(Toggle, { label: "\u663E\u793A\u4FA7\u680F\u5FEB\u6377\u5165\u53E3", description: "\u5728\u5934\u50CF\u4E0A\u65B9\u663E\u793A\u201C\u5F00\u673A\u52A8\u753B\u201D\uFF1B\u5173\u95ED\u540E\u4ECD\u53EF\u4ECE\u8BBE\u7F6E\u8FDB\u5165\u3002\u9644\u9B54\u53F0\u7CFB\u5217\u6700\u591A\u663E\u793A17\u4E2A\u5FEB\u6377\u5165\u53E3\u3002", checked: settings.showShortcut ?? false, disabled: busy, onChange: (showShortcut) => save({ showShortcut }) })), appearancePreview && /* @__PURE__ */ import_react5.default.createElement(UpdatePrompt, { request: api, status: { currentVersion: VERSION2 }, settings: { ...settings, updatePromptBlur: draftBlur, updatePromptRadius: draftRadius }, preview: true, onDismiss: () => setAppearancePreview(false) }), /* @__PURE__ */ import_react5.default.createElement("div", { className: "bs-reset-area" }, /* @__PURE__ */ import_react5.default.createElement("div", null, /* @__PURE__ */ import_react5.default.createElement("strong", null, "\u6062\u590D\u9ED8\u8BA4"), /* @__PURE__ */ import_react5.default.createElement("p", null, "\u91CD\u7F6E\u6240\u6709\u8BBE\u7F6E\uFF0C\u6C38\u4E45\u5220\u9664\u5168\u90E8\u4E0A\u4F20\u7684\u89C6\u9891\u548C\u56FE\u7247\uFF0C\u4EC5\u4FDD\u7559\u5185\u7F6E\u7D20\u6750\u3002")), /* @__PURE__ */ import_react5.default.createElement("button", { className: "bs-reset-open", type: "button", disabled: busy, onClick: () => setResetOpened(true) }, "\u6062\u590D\u9ED8\u8BA4")), resetOpened && /* @__PURE__ */ import_react5.default.createElement(ResetDialog, { settings, onCancel: () => setResetOpened(false), onConfirm: restoreDefaults })), !state && !error && /* @__PURE__ */ import_react5.default.createElement("div", { className: "bs-loading" }, "\u6B63\u5728\u52A0\u8F7D\u7247\u5E93\u2026"));
}
function BootRoot() {
  useStyles();
  const [play, setPlay] = (0, import_react5.useState)(null);
  const [opened, setOpened] = (0, import_react5.useState)(false);
  const [message, setMessage] = (0, import_react5.useState)("");
  const [launchSettled, setLaunchSettled] = (0, import_react5.useState)(launchDecisionSettled);
  const [launchState, setLaunchState] = (0, import_react5.useState)(latestState);
  const [updateSnapshot, setUpdateSnapshot] = (0, import_react5.useState)(() => startupUpdateSession.getSnapshot());
  const [offerUpdate, setOfferUpdate] = (0, import_react5.useState)(false);
  const trigger = (0, import_react5.useCallback)((value) => setPlay({ ...value, key: Date.now() }), []);
  (0, import_react5.useEffect)(() => {
    const playEvent = (e) => trigger(e.detail);
    const open = () => setOpened(true);
    window.addEventListener(PLAY, playEvent);
    window.addEventListener(OPEN, open);
    return () => {
      window.removeEventListener(PLAY, playEvent);
      window.removeEventListener(OPEN, open);
    };
  }, [trigger]);
  (0, import_react5.useEffect)(() => {
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
  (0, import_react5.useEffect)(() => {
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
      if (value.settings.enabled) {
        const clip = value.clip || value.clips.find((c) => c.id === value.settings.selectedId) || value.clips[0];
        if (clip) trigger({ clip, settings: value.settings });
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
  (0, import_react5.useEffect)(() => {
    setOfferUpdate(false);
    if (!launchSettled || play || opened || updateSnapshot.dismissed || !isAvailableUpdate(updateSnapshot.status)) return;
    let timer = null;
    let alive = true;
    const blocked = () => Array.from(document.querySelectorAll('dialog[open],[role="dialog"][aria-modal="true"]')).some((element) => {
      if (element.matches('[data-testid="startup-update"]:not([data-preview])')) return false;
      return element.getClientRects().length > 0 && getComputedStyle(element).visibility !== "hidden";
    });
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
    observer?.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["open", "hidden", "style", "aria-hidden"] });
    schedule();
    return () => {
      alive = false;
      clearTimeout(timer);
      observer?.disconnect();
    };
  }, [launchSettled, play, opened, updateSnapshot]);
  const onClose = (0, import_react5.useCallback)((reason) => {
    setPlay(null);
    if (["media-error", "load-error", "play-error", "timeout"].includes(reason)) {
      setMessage("\u52A8\u753B\u672A\u80FD\u64AD\u653E\uFF0C\u5DF2\u4E3A\u4F60\u8FDB\u5165 Harness\u3002\u53EF\u5728\u8BBE\u7F6E\u4E2D\u66F4\u6362\u89C6\u9891\u3002");
      setTimeout(() => setMessage(""), 6500);
    }
  }, []);
  (0, import_react5.useEffect)(() => {
    if (!opened) return;
    const key = (e) => {
      if (e.key === "Escape" && !play && !document.querySelector("dialog[open]")) setOpened(false);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [opened, play]);
  return /* @__PURE__ */ import_react5.default.createElement(import_react5.default.Fragment, null, opened && /* @__PURE__ */ import_react5.default.createElement("div", { className: "bs-modal", onClick: (e) => {
    if (e.target === e.currentTarget) setOpened(false);
  } }, /* @__PURE__ */ import_react5.default.createElement("div", { role: "dialog", "aria-modal": "true", "aria-label": "\u5F00\u673A\u52A8\u753B\u8BBE\u7F6E", className: "bs-modal-body" }, /* @__PURE__ */ import_react5.default.createElement("button", { type: "button", className: "bs-modal-close", onClick: () => setOpened(false) }, "\u5173\u95ED \xD7"), /* @__PURE__ */ import_react5.default.createElement(SettingsPanel, null))), play && /* @__PURE__ */ import_react5.default.createElement(Player, { key: play.key, clip: play.clip, settings: play.settings, endOnly: play.endOnly, onClose }), offerUpdate && !play && !opened && !updateSnapshot.dismissed && isAvailableUpdate(updateSnapshot.status) && /* @__PURE__ */ import_react5.default.createElement(UpdatePrompt, { request: api, status: updateSnapshot.status, settings: launchState?.settings, onDismiss: () => startupUpdateSession.dismiss(), onUpdated: (version) => startupUpdateSession.updated(version) }), message && /* @__PURE__ */ import_react5.default.createElement("div", { className: "bs-toast", role: "status" }, message));
}
function ShortcutAction() {
  const [state, setState] = (0, import_react5.useState)(latestState);
  const registry = getShortcutRegistry();
  const [budget, setBudget] = (0, import_react5.useState)(() => registry.getSnapshot());
  const enabled = state?.settings.showShortcut === true;
  (0, import_react5.useEffect)(() => {
    const changed = (value) => setState(value);
    subscribers.add(changed);
    if (latestState) setState(latestState);
    else api("/state").then(publish).catch(() => {
    });
    return () => subscribers.delete(changed);
  }, []);
  (0, import_react5.useEffect)(() => registry.subscribe(() => setBudget(registry.getSnapshot())), [registry]);
  (0, import_react5.useEffect)(() => {
    if (!enabled) return;
    return registry.acquire("dsh-openup-lewis");
  }, [enabled, registry]);
  if (!enabled || !budget.visibleIds.includes("dsh-openup-lewis")) return null;
  return /* @__PURE__ */ import_react5.default.createElement("button", { type: "button", title: "\u5F00\u673A\u52A8\u753B", "aria-label": "\u5F00\u673A\u52A8\u753B", onClick: openSettings, style: { border: 0, background: "transparent", color: "inherit", cursor: "pointer", padding: 8 } }, "\u25B7");
}
function apply(ctx) {
  const wire = (ready) => {
    const register = () => {
      ready.slots.inject("shell.overlay", () => ready.slots.register({ name: "shell.overlay", id: "dsh-boot-studio-overlay", order: 950 }, () => import_react5.default.createElement(BootRoot)));
      ready.slots.inject("settings.section", () => ready.slots.register({ name: "settings.section", id: "dsh-boot-studio-settings", order: 80, label: () => "\u5F00\u673A\u52A8\u753B" }, () => import_react5.default.createElement(SettingsPanel)));
      ready.slots.inject("sidebar.footer.action", () => ready.slots.register({ name: "sidebar.footer.action", id: "dsh-boot-studio-shortcut", order: 42, label: () => "\u5F00\u673A\u52A8\u753B" }, () => import_react5.default.createElement(ShortcutAction)));
    };
    if (typeof ready.effect === "function") ready.effect(register, "dsh-boot-studio: slots");
    else register();
  };
  if (typeof ctx.inject === "function") ctx.inject(["slots"], wire);
  else if (ctx.slots) wire(ctx);
}
return module.exports; } });
