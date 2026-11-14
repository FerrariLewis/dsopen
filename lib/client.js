window.__ModuleLoader__.load({ id: "dsh-boot-studio", factory: (require) => { var module = { exports: {} }; var exports = module.exports;
var dr=Object.create;var hn=Object.defineProperty;var lr=Object.getOwnPropertyDescriptor;var cr=Object.getOwnPropertyNames;var ur=Object.getPrototypeOf,pr=Object.prototype.hasOwnProperty;var r=(e,n)=>hn(e,"name",{value:n,configurable:!0});var fr=(e,n)=>{for(var t in n)hn(e,t,{get:n[t],enumerable:!0})},ut=(e,n,t,i)=>{if(n&&typeof n=="object"||typeof n=="function")for(let s of cr(n))!pr.call(e,s)&&s!==t&&hn(e,s,{get:()=>n[s],enumerable:!(i=lr(n,s))||i.enumerable});return e};var ye=(e,n,t)=>(t=e!=null?dr(ur(e)):{},ut(n||!e||!e.__esModule?hn(t,"default",{value:e,enumerable:!0}):t,e)),br=e=>ut(hn({},"__esModule",{value:!0}),e);var Ur={};fr(Ur,{BootRoot:()=>dt,EndTitle:()=>Tn,Player:()=>jn,SettingsPanel:()=>mn,ShortcutAction:()=>lt,api:()=>te,apply:()=>Br,openSettings:()=>Bn,playbackStages:()=>sn});module.exports=br(Ur);var Cn=ye(require("react"),1);var ln="dsh-boot-studio",_e="dsh-openup-lewis",Ue=`/${ln}`;var Vr=80*1024*1024,Fr=Object.freeze(["https://registry.npmjs.org","https://registry.npmmirror.com"]),Ce=Object.freeze({telemetryWithdraw:25e3,request:7e3,updateCheck:2e4,updatePrepare:2100*1e3,uploadVideo:18e4,uploadImage:12e4,reset:18e4,install:12e4});var ft=/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;function cn(e){if(typeof e!="string"||!ft.test(e))return null;let n=e.split(".").map(Number);return n.every(Number.isSafeInteger)?n:null}r(cn,"parseVersion");function pt(e){if(typeof e!="string"||!ft.test(e))throw Object.assign(new Error("\u7EF4\u62A4\u7248\u672C\u5FC5\u987B\u4F7F\u7528 X.Y.Z \u7A33\u5B9A\u7248\u672C\u53F7\u3002"),{code:"BOOT_VERSION_INVALID"});let n=cn(e);if(!n)throw Object.assign(new Error("\u7248\u672C\u53F7\u8FC7\u5927\u3002"),{code:"BOOT_VERSION_INVALID"});return n}r(pt,"versionParts");function mr(e,n){let t=pt(e),i=pt(n);for(let s=0;s<t.length;s++)if(t[s]!==i[s])return t[s]>i[s]?1:-1;return 0}r(mr,"compareVersions");function bt(e,n){return mr(e,n)>0}r(bt,"isNewerVersion");function he(e,n,t={}){return Object.assign(new Error(n),{code:e,...t})}r(he,"clientError");var mt=r(e=>/^(?:application\/json|application\/[\w.+-]+\+json)(?:\s*;|$)/i.test(String(e||"").trim()),"jsonType");function Nn(e,{status:n=200,contentType:t}={}){let i=n>=200&&n<300,s=r(()=>he(i?"BOOT_RESPONSE_INVALID":"BOOT_HTTP_ERROR",i?"\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6CD5\u8BC6\u522B\u7684\u5185\u5BB9\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002":`\u8BF7\u6C42\u5931\u8D25 (${n})`,{status:n}),"fallback");if(!mt(t))throw s();let d;try{d=JSON.parse(e)}catch{throw s()}if(!i){let u=typeof d?.error=="string"&&d.error.trim()?d.error:`\u8BF7\u6C42\u5931\u8D25 (${n})`,f=typeof d?.code=="string"?d.code:typeof d?.errorCode=="string"?d.errorCode:"BOOT_HTTP_ERROR";throw he(f,u,{status:n,details:d?.details})}if(!d||typeof d!="object"||Array.isArray(d))throw s();return d}r(Nn,"parseJSONResponse");async function $n(e){let n=e.status,t=e.headers?.get?.("content-type");return mt(t)?Nn(await e.text(),{status:n,contentType:t}):Nn("",{status:n,contentType:t})}r($n,"readJSONResponse");function hr(e){return e==="/telemetry/withdraw"?Ce.telemetryWithdraw:e==="/updates/prepare"?Ce.updatePrepare:e==="/updates/check"?Ce.updateCheck:e==="/upload"?Ce.uploadVideo:e==="/end-images"?Ce.uploadImage:e==="/reset"?Ce.reset:Ce.request}r(hr,"requestTimeout");function gr({basePath:e=Ue,fetchImpl:n=r((...i)=>fetch(...i),"fetchImpl"),timeoutForPath:t=hr}={}){return r(async function(s,d={}){let u=new AbortController,f=!1,o=r(()=>u.abort(),"abort"),l=setTimeout(()=>{f=!0,u.abort()},t(s));d.signal?.aborted?u.abort():d.signal?.addEventListener("abort",o,{once:!0});try{let m=await n(e+s,{...d,signal:u.signal,headers:{"x-dsh-boot-studio":"1",...typeof d.body=="string"?{"content-type":"application/json"}:{},...d.headers}});return await $n(m)}catch(m){throw f?he("BOOT_REQUEST_TIMEOUT","\u8BF7\u6C42\u8D85\u65F6\uFF0C\u8BF7\u68C0\u67E5\u8FDE\u63A5\u540E\u91CD\u8BD5\u3002",{cause:m}):u.signal.aborted?he("BOOT_REQUEST_CANCELLED","\u8BF7\u6C42\u5DF2\u53D6\u6D88\u3002",{cause:m}):m?.code?m:he("BOOT_NETWORK_ERROR","\u65E0\u6CD5\u8FDE\u63A5\u5F00\u673A\u52A8\u753B\u670D\u52A1\uFF0C\u8BF7\u68C0\u67E5\u8FDE\u63A5\u6216\u91CD\u542F Harness \u540E\u91CD\u8BD5\u3002",{cause:m})}finally{clearTimeout(l),d.signal?.removeEventListener("abort",o)}},"api")}r(gr,"createAPIClient");var te=gr();var vr=new Set([_e,ln]);function Le(e){if(!e||e.available!==!0||e.channelReady!==!0||!vr.has(e.packageName))return!1;let n=cn(e.latestVersion),t=cn(e.currentVersion);return!n||!t||e.manifest&&e.manifest.version!==e.latestVersion?!1:bt(e.latestVersion,e.currentVersion)}r(Le,"isAvailableUpdate");function yr(){let e={checking:!1,checked:!1,status:null,dismissed:!1},n,t,i=new Set;function s(d){return e={...e,...d},i.forEach(u=>{try{u(e)}catch{}}),e}return r(s,"publish"),{getSnapshot:r(()=>e,"getSnapshot"),subscribe(d){return i.add(d),()=>i.delete(d)},check(d){return n||(s({checking:!0}),n=Promise.resolve().then(()=>d("/updates/check",{method:"POST",body:"{}"})).then(u=>{let f=t&&u?{...u,currentVersion:t}:u;return s({checking:!1,checked:!0,status:Le(f)?f:null}),e.status},()=>(s({checking:!1,checked:!0,status:null}),null)),n)},dismiss(){s({dismissed:!0})},updated(d){cn(d)&&(t=d,s({dismissed:!0,status:e.status?{...e.status,available:!1,currentVersion:d}:null}))}}}r(yr,"createStartupUpdateSession");var qe=yr();function gt(e){return typeof e=="string"&&e.length<8192&&!/[\u0000-\u001f\u007f]/.test(e)&&(/^[A-Za-z]:[\\/]/.test(e)||/^\/(?!\/)/.test(e)||/^\\\\[^\\/]+[\\/][^\\/]+[\\/]/.test(e))&&!e.split(/[\\/]/).includes("..")&&e.endsWith(".tgz")}r(gt,"absoluteArchivePath");function xr(e,n){if(!Le(n)||!e||e.version!==n.latestVersion||e.requiresRestart!==!0||!/^[a-f0-9]{64}$/.test(e.sha256||"")||!gt(e.spec))throw Error("\u66F4\u65B0\u5305\u51C6\u5907\u7ED3\u679C\u65E0\u6548\uFF0C\u672A\u8BF7\u6C42\u5B89\u88C5\u3002");let t=e.spec.split(/[\\/]/),i=`${n.packageName}-${e.version}-${e.sha256}.tgz`;if(t.at(-1)!==i||t.at(-2)!=="update-cache")throw Error("\u66F4\u65B0\u5305\u8DEF\u5F84\u4E0E\u5DF2\u6821\u9A8C\u7684\u540D\u79F0\u3001\u7248\u672C\u6216 SHA-256 \u4E0D\u4E00\u81F4\uFF0C\u672A\u8BF7\u6C42\u5B89\u88C5\u3002");return e}r(xr,"validatePreparedUpdate");var Zn=new Set;function Pn(e={}){let n={pluginManager:typeof e.pluginManager?.installBundle=="function"?e.pluginManager:null,pluginNavigation:typeof e.pluginNavigation?.openBundle=="function"||typeof e.pluginNavigation?.openList=="function"?e.pluginNavigation:null};return!n.pluginManager&&!n.pluginNavigation?()=>{}:(Zn.add(n),()=>Zn.delete(n))}r(Pn,"bindHarnessServices");function Jn(e){return[...Zn].reverse().find(n=>n[e])?.[e]||null}r(Jn,"harnessService");function vt(){return!!Jn("pluginNavigation")}r(vt,"canOpenHarnessPluginManager");function yt(e=_e){let n=Jn("pluginNavigation");return n?(typeof n.openBundle=="function"?n.openBundle(e):n.openList(),!0):!1}r(yt,"openHarnessPluginManager");var Kn=new WeakSet;function Re(e,n,t){let i=he(e,n,t);return Kn.add(i),i}r(Re,"installError");function Ln(e){return Re("BOOT_HARNESS_INSTALL_UNCERTAIN","\u66F4\u65B0\u54CD\u5E94\u8D85\u65F6\u3002\u8BF7\u5728\u63D2\u4EF6\u7BA1\u7406\u4E2D\u6838\u5BF9\u5B9E\u9645\u7248\u672C\u540E\u91CD\u8BD5\u3002",{...e,uncertain:!0})}r(Ln,"uncertainInstall");function ht(e,n){if(!e||e.ok!==!0)throw Ln({details:e?.error});let t=e.value;if(t&&["failed","cancelled"].includes(t.application))throw Re("BOOT_HARNESS_INSTALL_FAILED","\u66F4\u65B0\u672A\u5B8C\u6210\uFF0C\u8BF7\u5728\u63D2\u4EF6\u7BA1\u7406\u4E2D\u67E5\u770B\u8BE6\u60C5\u3002",{details:t?.error});if(!t||!["applied","restart-required"].includes(t.application)||t.error)throw Ln({details:t?.error});if(t.version&&t.version!==n)throw Re("BOOT_HARNESS_INSTALL_VERSION","Harness \u8FD4\u56DE\u7684\u7248\u672C\u4E0E\u66F4\u65B0\u76EE\u6807\u4E0D\u4E00\u81F4\uFF0C\u8BF7\u67E5\u770B\u63D2\u4EF6\u7BA1\u7406\u3002",{uncertain:!0});return t}r(ht,"installedResult");async function xt(e,n,{fetchImpl:t=fetch,pluginManager:i=Jn("pluginManager"),timeout:s=Ce.install}={}){if(!gt(e)||!cn(n))throw Error("\u66F4\u65B0\u5305\u8DEF\u5F84\u6216\u7248\u672C\u65E0\u6548\uFF0C\u672A\u8BF7\u6C42\u5B89\u88C5\u3002");let d=globalThis.crypto?.randomUUID?.()||`lewis-enchant-${Date.now()}-${Math.random().toString(16).slice(2)}`,u=new AbortController,f,o=new Promise((l,m)=>{f=setTimeout(()=>{u.abort(),m(Re("BOOT_HARNESS_INSTALL_UNCERTAIN","\u66F4\u65B0\u54CD\u5E94\u8D85\u65F6\u3002\u8BF7\u5728\u63D2\u4EF6\u7BA1\u7406\u4E2D\u6838\u5BF9\u5B9E\u9645\u7248\u672C\u540E\u91CD\u8BD5\u3002",{uncertain:!0}))},s)});try{if(i){let c=await Promise.race([i.installBundle(e,{enabled:!0,saveExact:!0,requestId:d}),o]);return ht(c,n)}let l=await Promise.race([t("/api/pluginManager/installBundle",{method:"POST",credentials:"same-origin",signal:u.signal,headers:{"content-type":"application/json"},body:JSON.stringify({type:"client-request",rpcId:d,method:"pluginManager/installBundle",payload:{args:{spec:e,options:{enabled:!0,saveExact:!0,requestId:d}}}})}),o]);if(l.status===401||l.status===403)throw Re("BOOT_HARNESS_INSTALL_PERMISSION","\u5F53\u524D\u8FDE\u63A5\u6CA1\u6709\u7BA1\u7406\u63D2\u4EF6\u7684\u6743\u9650\uFF0C\u8BF7\u4F7F\u7528 Harness \u4E3B\u7A97\u53E3\u7684\u62E5\u6709\u8005\u8FDE\u63A5\u3002");if(l.status===404||l.status===405)throw Re("BOOT_HARNESS_INSTALL_UNAVAILABLE","\u5F53\u524D Harness \u4E0D\u652F\u6301\u81EA\u52A8\u5B89\u88C5\u6B64\u66F4\u65B0\uFF0C\u8BF7\u6253\u5F00\u63D2\u4EF6\u7BA1\u7406\u5B8C\u6210\u66F4\u65B0\u3002");if(!l.ok)throw Ln({status:l.status});let m;try{m=await Promise.race([$n(l),o])}catch(c){throw Kn.has(c)?c:Re("BOOT_HARNESS_INSTALL_RESPONSE","Harness \u672A\u63A5\u53D7\u66F4\u65B0\u8BF7\u6C42\uFF0C\u8BF7\u5728\u63D2\u4EF6\u7BA1\u7406\u4E2D\u67E5\u770B\u8BE6\u60C5\u3002",{cause:c,uncertain:!0})}if(m.type!=="server-response"||m.rpcId!==d||typeof m.result?.ok!="boolean")throw Re("BOOT_HARNESS_INSTALL_RESPONSE","Harness \u672A\u63A5\u53D7\u66F4\u65B0\u8BF7\u6C42\uFF0C\u8BF7\u5728\u63D2\u4EF6\u7BA1\u7406\u4E2D\u67E5\u770B\u8BE6\u60C5\u3002",{uncertain:!0});return ht(m.result,n)}catch(l){throw u.signal.aborted?Re("BOOT_HARNESS_INSTALL_UNCERTAIN","\u66F4\u65B0\u54CD\u5E94\u8D85\u65F6\u3002\u8BF7\u5728\u63D2\u4EF6\u7BA1\u7406\u4E2D\u6838\u5BF9\u5B9E\u9645\u7248\u672C\u540E\u91CD\u8BD5\u3002",{cause:l,uncertain:!0}):Kn.has(l)?l:Ln({cause:l})}finally{clearTimeout(f)}}r(xt,"installVerifiedUpdate");var Xe=new Map,In=new Map,Yn=new Map,_n=new Map,wt=r(e=>`${e?.packageName}@${e?.latestVersion}`,"updateKey");function St(e){return In.get(wt(e))||null}r(St,"appliedUpdate");async function Qn(e){for(let[n,t]of _n)t.promise||(t.promise=Promise.resolve().then(()=>e("/updates/installed",{method:"POST",body:JSON.stringify({version:t.version,spec:t.spec})})).then(()=>{t.value.cleanupPending=!1,_n.get(n)===t&&_n.delete(n)}).catch(()=>{}).finally(()=>{t.promise=null})),await t.promise}r(Qn,"retryUpdateAcknowledgements");function Et(){let e=0;for(let[n,t]of Xe)t.installStarted||t.canceled||(t.canceled=!0,t.stopPolling?.(),Xe.get(n)===t&&Xe.delete(n),e++);return e}r(Et,"cancelPendingUpdates");async function Xn(e,n,{onPhase:t,onProgress:i,install:s=xt,pollInterval:d=500}={}){if(!Le(n))throw Error("\u66F4\u65B0\u7248\u672C\u65E0\u6548\u6216\u5C1A\u672A\u516C\u5F00\uFF0C\u8BF7\u91CD\u65B0\u68C0\u67E5\u66F4\u65B0\u3002");let u=wt(n);if(In.has(u))return In.get(u);if(Yn.has(u))throw Yn.get(u);let f=Xe.get(u);if(!f){f={observers:new Set,progressObservers:new Set,phase:"prepare",progress:{version:n.latestVersion,phase:"prepare",downloadedBytes:0,totalBytes:null,percent:null},promise:null,canceled:!1,installStarted:!1,stopPolling:null},Xe.set(u,f);let o=r(m=>{f.phase=m,f.observers.forEach(c=>{try{c(m)}catch{}})},"emit"),l=r(m=>{f.progress=m,f.progressObservers.forEach(c=>{try{c(m)}catch{}})},"emitProgress");f.promise=Promise.resolve().then(async()=>{let m=!1,c;f.stopPolling=()=>{m=!0,clearTimeout(c)};let w=r(()=>{if(f.canceled)throw Error("\u66F4\u65B0\u5DF2\u53D6\u6D88\uFF1A\u63D2\u4EF6\u5DF2\u505C\u7528\u6216\u5378\u8F7D\uFF0C\u672A\u8BF7\u6C42\u5B89\u88C5\u3002")},"assertActive");async function h(){try{let A=await e("/updates/progress");!m&&A?.version===n.latestVersion&&["checking","downloading","verifying","ready"].includes(A.phase)&&l(A)}catch{}m||(c=setTimeout(h,d))}r(h,"poll");try{w();let A=e("/updates/prepare",{method:"POST",body:JSON.stringify({version:n.latestVersion})});h();let I=xr(await A,n);w(),f.stopPolling(),o("install"),l({...f.progress,...Number.isSafeInteger(I.bytes)&&I.bytes>0?{downloadedBytes:I.bytes,totalBytes:I.bytes}:{},...typeof I.fromCache=="boolean"?{fromCache:I.fromCache}:{},phase:"install",percent:null}),w(),f.installStarted=!0;let y=await s(I.spec,I.version),R={version:I.version,result:y};return In.set(u,R),R.cleanupPending=!0,_n.set(u,{version:I.version,spec:I.spec,value:R}),Qn(e),o("complete"),l({...f.progress,phase:"complete",percent:100}),R}catch(A){throw A?.uncertain&&Yn.set(u,A),l({...f.progress,phase:f.canceled?"canceled":"error",percent:null}),A}finally{f.stopPolling()}}).finally(()=>{Xe.get(u)===f&&Xe.delete(u)})}if(typeof t=="function"){f.observers.add(t);try{t(f.phase)}catch{}}if(typeof i=="function"){f.progressObservers.add(i);try{i(f.progress)}catch{}}try{return await f.promise}finally{f.observers.delete(t),f.progressObservers.delete(i)}}r(Xn,"prepareAndInstallUpdate");var Tt=new WeakMap,Mn=Object.freeze({light:Object.freeze({labelPrimary:"#20242c",labelSecondary:"#5f6876",labelTertiary:"#7b8492",borderColor:"#c7ccd4",panelColor:"#ffffff",baseColor:"#f5f6f8",hoverColor:"#20242c0d",accent:"#4d6bfe",accentText:"#ffffff"}),dark:Object.freeze({labelPrimary:"#eef0f5",labelSecondary:"#b5bdc9",labelTertiary:"#8b95a5",borderColor:"#616b7b",panelColor:"#222832",baseColor:"#141820",hoverColor:"#ffffff14",accent:"#7c96ff",accentText:"#101827"})});function un(e,n){return e?.getPropertyValue(n).trim()||""}r(un,"property");function wr(e,n,t){return!n||/[;{}<>\u0000-\u001f]/.test(n)?t:!e?.CSS?.supports||e.CSS.supports("color",n)?n:t}r(wr,"safeColor");function et(e,n="#ffffff"){let t;return/^#[a-f\d]{6}(?:[a-f\d]{2})?$/i.test(e)?t=[1,3,5].map(i=>parseInt(e.slice(i,i+2),16)):/^#[a-f\d]{3}$/i.test(e)?t=[1,2,3].map(i=>parseInt(e[i]+e[i],16)):/^rgba?\(/i.test(e)&&(t=e.match(/[\d.]+/g)?.slice(0,3).map(Number)),!t||t.length!==3||!t.every(Number.isFinite)?n:t.reduce((i,s,d)=>i+s*[.299,.587,.114][d],0)>=155?"#142c2c":"#f4fbf8"}r(et,"contrastText");function kt(e){let n=e?.defaultView,t=e?.documentElement,i=e?.body,s=n?.getComputedStyle?.(i||t),d=n?.getComputedStyle?.(t),u=d?.colorScheme||s?.colorScheme||"",f=i?.hasAttribute("data-ds-dark-theme")||t?.hasAttribute("data-ds-dark-theme")||u==="dark"?"dark":u==="light"?"light":n?.matchMedia?.("(prefers-color-scheme: dark)").matches?"dark":"light",o=Mn[f],l=r((y,R)=>wr(n,un(s,y)||un(d,y),R),"get"),m=parseFloat(un(s,"--dsh-content-font-size")||un(d,"--dsh-content-font-size")),c=Number.isFinite(m)?Math.max(10,Math.min(22,m)):14,w=un(s,"--dsh-font-family-text"),h=un(s,"--dsw-font-family")||(w?`${w}, system-ui, sans-serif`:s?.fontFamily)||"system-ui, sans-serif",A=l("--dsw-alias-brand-primary-new-colorprimary-new-color",o.accent),I={colorScheme:f,fontSize:c,fontFamily:h,labelPrimary:l("--dsw-alias-label-primary",o.labelPrimary),labelSecondary:l("--dsw-alias-label-secondary",o.labelSecondary),labelTertiary:l("--dsw-alias-label-tertiary",o.labelTertiary),borderColor:l("--dsw-alias-border-l2",o.borderColor),panelColor:l("--dsw-alias-bg-layer-2",o.panelColor),baseColor:l("--dsw-alias-bg-base",l("--dsw-alias-bg-layer-1",o.baseColor)),hoverColor:l("--dsw-alias-interactive-bg-hover",o.hoverColor),accent:A,accentText:et(A,l("--dsw-alias-label-primary-foreground",o.accentText))};return Object.freeze(I)}r(kt,"readHostAppearance");function Sr(e){let n=kt(e),t,i=null,s,d=new Set,u=e?.defaultView;function f(){i=null;let c=kt(e);if(JSON.stringify(c)!==JSON.stringify(n)){n=c;for(let w of[...d])try{w()}catch{}}}r(f,"refresh");function o(){i===null&&(typeof u?.requestAnimationFrame=="function"?i=u.requestAnimationFrame(f):f())}r(o,"schedule");function l(){let c=u?.MutationObserver;if(typeof c=="function"){t=new c(o);for(let w of[e.documentElement,e.body].filter(Boolean))t.observe(w,{attributes:!0,attributeFilter:["style","class","data-ds-dark-theme"]});e.head&&t.observe(e.head,{subtree:!0,childList:!0,characterData:!0,attributes:!0})}s=u?.matchMedia?.("(prefers-color-scheme: dark)"),s?.addEventListener?.("change",o),u?.addEventListener?.("resize",o),e.fonts?.addEventListener?.("loadingdone",o),f()}r(l,"connect");function m(){t?.disconnect(),t=void 0,s?.removeEventListener?.("change",o),u?.removeEventListener?.("resize",o),e.fonts?.removeEventListener?.("loadingdone",o),i!==null&&u?.cancelAnimationFrame?.(i),i=null}return r(m,"disconnect"),Object.freeze({getSnapshot:r(()=>n,"getSnapshot"),subscribe(c){if(typeof c!="function")throw new TypeError("Host appearance listener must be a function.");d.add(c),d.size===1&&l();let w=!0;return()=>{w&&(w=!1,d.delete(c),d.size||m())}}})}r(Sr,"createStore");function Ct(e){if(!e||typeof e!="object")throw new TypeError("Host appearance needs a document.");let n=Tt.get(e);return n||(n=Sr(e),Tt.set(e,n)),n}r(Ct,"getHostAppearanceStore");var At=Symbol.for("dsh.lewis.enchant.v1"),zn=Object.freeze({appearanceMode:"follow-host",effect:"frosted",accent:null,surface:null,colorScheme:null,fontSize:null,fontFamily:null,blur:30,radius:30}),Er=/^[a-z0-9][a-z0-9._-]{0,127}$/,Tr=/^#[a-f0-9]{6}$/i,kr=new Set(["appearanceMode","effect","accent","surface","colorScheme","fontSize","fontFamily","blur","radius"]),Ot=new WeakMap;function vn(e){if(!e||typeof e!="object"||Array.isArray(e))return!1;let n=Object.getPrototypeOf(e);return n===null||n===Object.prototype}r(vn,"plain");function gn(e){if(typeof e!="string"||!Er.test(e))throw new TypeError("\u9644\u9B54\u53F0\u9700\u8981\u7A33\u5B9A\u7684\u63D2\u4EF6\u6216\u8BBE\u7F6E\u5165\u53E3 ID\u3002");return e}r(gn,"identifier");function Cr(e){if(typeof e!="string"||!e.trim()||e.length>256)return!1;let n=e.split(",");return n.length<=16&&n.every(t=>{let i=t.trim();if(i[0]==='"'||i[0]==="'"){if(i.at(-1)!==i[0])return!1;i=i.slice(1,-1)}return/^[-\p{L}\p{N} _]+$/u.test(i)&&new RegExp("\\p{L}","u").test(i)})}r(Cr,"validFontFamily");function Dn(e,n=zn){if(!vn(e))throw new TypeError("\u9644\u9B54\u53F0\u4E3B\u9898\u5FC5\u987B\u662F\u5BF9\u8C61\u3002");let t={...n};for(let[i,s]of Object.entries(e)){if(!kr.has(i))throw new TypeError("\u4E0D\u652F\u6301\u7684\u9644\u9B54\u53F0\u4E3B\u9898\u5C5E\u6027\u3002");if(i==="effect"&&!["frosted","liquid-glass"].includes(s))throw new TypeError("\u4E0D\u652F\u6301\u7684\u9644\u9B54\u53F0\u6750\u8D28\u3002");if(i==="appearanceMode"&&!["follow-host","custom"].includes(s))throw new TypeError("\u5916\u89C2\u6A21\u5F0F\u987B\u4E3A\u8DDF\u968F\u901A\u7528\u8BBE\u7F6E\u6216\u81EA\u5B9A\u4E49\u3002");if(i==="colorScheme"&&s!==null&&!["light","dark"].includes(s))throw new TypeError("\u81EA\u5B9A\u4E49\u914D\u8272\u987B\u4E3A\u6D45\u8272\u6216\u6DF1\u8272\u3002");if(i==="fontSize"&&s!==null&&!(Number.isInteger(s)&&s>=10&&s<=32))throw new TypeError("\u81EA\u5B9A\u4E49\u5B57\u53F7\u987B\u4E3A10\u523032\u4E4B\u95F4\u7684\u6574\u6570\u3002");if(i==="fontFamily"&&s!==null&&!Cr(s))throw new TypeError("\u81EA\u5B9A\u4E49\u5B57\u4F53\u987B\u4E3A\u6709\u6548\u7684\u5B57\u4F53\u540D\u79F0\u5217\u8868\u3002");if(["accent","surface"].includes(i)&&s!==null&&(typeof s!="string"||!Tr.test(s)))throw new TypeError("\u4E3B\u9898\u989C\u8272\u987B\u4E3A\u516D\u4F4D\u5341\u516D\u8FDB\u5236\u989C\u8272\u3002");if(i==="blur"&&!(Number.isInteger(s)&&s>=0&&s<=48))throw new TypeError("\u4E3B\u9898\u78E8\u7802\u5EA6\u987B\u4E3A 0 \u5230 48 \u7684\u6574\u6570\u3002");if(i==="radius"&&!(Number.isInteger(s)&&s>=12&&s<=40))throw new TypeError("\u4E3B\u9898\u5706\u89D2\u987B\u4E3A 12 \u5230 40 \u7684\u6574\u6570\u3002");t[i]=typeof s=="string"&&["accent","surface"].includes(i)?s.toLowerCase():s}return!Object.hasOwn(e,"appearanceMode")&&["accent","surface","colorScheme","fontSize","fontFamily"].some(i=>Object.hasOwn(e,i)&&e[i]!==null)&&(t.appearanceMode="custom"),Object.freeze(t)}r(Dn,"themeValue");function Nt(e=zn,n){let t=Dn(e),i={"--lewis-blur":`${t.blur}px`,"--lewis-radius":`${t.radius}px`},s=t.appearanceMode==="custom",d=s&&t.colorScheme?t.colorScheme:n?.colorScheme||"light",u=s&&t.colorScheme?Mn[d]:n||Mn[d],f=s&&t.accent?t.accent:u.accent,o=s&&t.surface?t.surface:u.panelColor;return Object.assign(i,{"--lewis-font-size":`${s&&t.fontSize!==null?t.fontSize:n?.fontSize||14}px`,"--lewis-font-family":s&&t.fontFamily?t.fontFamily:n?.fontFamily||"system-ui, sans-serif","--lewis-label-primary":u.labelPrimary,"--lewis-label-secondary":u.labelSecondary,"--lewis-label-tertiary":u.labelTertiary,"--lewis-border-color":u.borderColor,"--lewis-panel-color":o,"--lewis-base-color":u.baseColor,"--lewis-hover-color":u.hoverColor,"--lewis-accent":f,"--lewis-accent-text":s&&t.accent?et(t.accent):u.accentText}),s&&t.surface&&(i["--lewis-surface"]=t.surface),{"data-lewis-effect":t.effect,"data-lewis-appearance-mode":t.appearanceMode,"data-lewis-color-scheme":d,"data-lewis-themed":"true",style:i}}r(Nt,"themeAttributes");function Ar(){let e=new Map,n=new Set,t=null,i=0,s=Object.freeze({version:1,revision:i,theme:zn,controller:null,plugins:Object.freeze([])});function d(l=t){if(!l)return!1;try{return l.isEntryReady()===!0}catch{return!1}}r(d,"entryReady");function u(){let l=d();s=Object.freeze({version:1,revision:++i,theme:t&&l?t.theme:zn,controller:t?Object.freeze({id:t.id,sectionId:t.sectionId,ready:l}):null,plugins:Object.freeze([...e.values()].map(m=>[...m.values()].at(-1)))});for(let m of[...n])try{m()}catch{}}r(u,"publish");function f(){let l=d();!!s.controller?.ready!==l&&u()}r(f,"refresh");function o(l){return e.has(l)&&d()&&![...e.get(l).values()].some(m=>m.sectionId===t.sectionId)}return r(o,"shouldGroupSettings"),Object.freeze({version:1,appearanceModes:Object.freeze(["follow-host","custom"]),getSnapshot:r(()=>s,"getSnapshot"),subscribe(l){if(typeof l!="function")throw new TypeError("\u9644\u9B54\u53F0\u76D1\u542C\u5668\u5FC5\u987B\u662F\u51FD\u6570\u3002");n.add(l);let m=!0;return()=>{m&&(m=!1,n.delete(l))}},refresh:f,registerPlugin(l){if(!vn(l))throw new TypeError("\u9644\u9B54\u53F0\u63D2\u4EF6\u4FE1\u606F\u5FC5\u987B\u662F\u5BF9\u8C61\u3002");let{id:m,name:c,sectionId:w,renderSettings:h,openSettings:A}=l;if(gn(m),gn(w),typeof c!="string"||!c.trim()||c.length>80||/[\x00-\x1f\x7f]/.test(c))throw new TypeError("\u9644\u9B54\u53F0\u63D2\u4EF6\u540D\u79F0\u65E0\u6548\u3002");if(typeof h!="function"||typeof A!="function")throw new TypeError("\u9644\u9B54\u53F0\u63D2\u4EF6\u9700\u8981\u53EF\u7528\u7684\u8BBE\u7F6E\u7EC4\u4EF6\u4E0E\u6253\u5F00\u65B9\u6CD5\u3002");let I=e.get(m)||new Map,y=[...I.values()][0];if(y&&(y.name!==c||y.sectionId!==w))throw new Error("\u9644\u9B54\u53F0\u63D2\u4EF6 ID \u5DF2\u88AB\u53E6\u4E00\u9879\u5360\u7528\u3002");let R=Symbol(m);I.set(R,Object.freeze({id:m,name:c,sectionId:w,renderSettings:h,openSettings:A})),e.set(m,I),u();let B=!0;return()=>{B&&(B=!1,I.delete(R),I.size||e.delete(m),u())}},acquireController(l){if(t)throw new Error("\u9644\u9B54\u53F0\u5DF2\u7ECF\u6709\u4E00\u4E2A\u6D3B\u52A8\u7684\u63A7\u5236\u5668\u3002");if(!vn(l))throw new TypeError("\u9644\u9B54\u53F0\u63A7\u5236\u5668\u4FE1\u606F\u5FC5\u987B\u662F\u5BF9\u8C61\u3002");let{id:m,sectionId:c,openSettings:w,isEntryReady:h}=l;if(gn(m),gn(c),typeof w!="function"||typeof h!="function")throw new TypeError("\u63A7\u5236\u5668\u9700\u8981\u53EF\u7528\u4E14\u53EF\u9A8C\u8BC1\u7684\u8BBE\u7F6E\u5165\u53E3\u3002");if([...e.values()].some(B=>[...B.values()].some(O=>O.sectionId===c)))throw new Error("\u63A7\u5236\u5668\u5FC5\u987B\u4F7F\u7528\u72EC\u7ACB\u7684\u8BBE\u7F6E\u5165\u53E3\u3002");let A=Symbol(m);t={id:m,sectionId:c,openSettings:w,isEntryReady:h,token:A,theme:Dn(l.theme===void 0?{}:l.theme)},u();let y=!0,R=r(()=>{if(!y||t?.token!==A)throw new Error("\u9644\u9B54\u53F0\u63A7\u5236\u5668\u5DF2\u7ECF\u91CA\u653E\u3002")},"assertActive");return Object.freeze({setTheme(B){R();let O=Dn(B,t.theme);t.theme=O,u()},refresh(){R(),f()},release(){y&&(y=!1,t?.token===A&&(t=null,u()))}})},shouldGroupSettings:o,openControllerSettings(l){if(!o(l))return!1;try{return t.openSettings(l)!==!1}catch{return!1}}})}r(Ar,"createRegistry");function en(e=globalThis){if((!e||typeof e!="object")&&typeof e!="function")throw new TypeError("\u9644\u9B54\u53F0\u9700\u8981\u5171\u4EAB\u7A97\u53E3\u4F5C\u7528\u57DF\u3002");let n=e[At];if(n||(n=Ar(),Object.defineProperty(e,At,{value:n,enumerable:!1})),n.version!==1||!["getSnapshot","subscribe","registerPlugin","acquireController","shouldGroupSettings","openControllerSettings","refresh"].every(s=>typeof n[s]=="function"))throw new Error("\u9644\u9B54\u53F0\u5171\u4EAB\u534F\u8BAE\u4E0D\u517C\u5BB9\u3002");if(n.appearanceModes?.includes("custom"))return n;let t=Ot.get(n);if(t)return t;let i=r(s=>{if(!vn(s))throw new TypeError("\u9644\u9B54\u53F0\u4E3B\u9898\u5FC5\u987B\u662F\u5BF9\u8C61\u3002");if(Dn(s),s.appearanceMode==="custom"||!Object.hasOwn(s,"appearanceMode")&&["colorScheme","fontSize","fontFamily"].some(u=>Object.hasOwn(s,u)))throw new Error("\u8BF7\u91CD\u65B0\u6253\u5F00 Harness\uFF0C\u4EE5\u542F\u7528\u65B0\u7248\u672C\u7684\u81EA\u5B9A\u4E49\u5916\u89C2\u63A5\u53E3\u3002");let d=Object.fromEntries(Object.entries(s).filter(([u])=>["effect","accent","surface","blur","radius"].includes(u)));return s.appearanceMode==="follow-host"&&Object.assign(d,{accent:null,surface:null}),d},"legacyTheme");return t=Object.freeze({version:1,appearanceModes:Object.freeze(["follow-host"]),requiresReloadForCustomAppearance:!0,getSnapshot:n.getSnapshot.bind(n),subscribe:n.subscribe.bind(n),registerPlugin:n.registerPlugin.bind(n),refresh:n.refresh.bind(n),shouldGroupSettings:n.shouldGroupSettings.bind(n),openControllerSettings:n.openControllerSettings.bind(n),acquireController(s){if(!vn(s))throw new TypeError("\u9644\u9B54\u53F0\u63A7\u5236\u5668\u4FE1\u606F\u5FC5\u987B\u662F\u5BF9\u8C61\u3002");let d=n.acquireController({...s,theme:i(s.theme===void 0?{}:s.theme)});return Object.freeze({setTheme(u){d.setTheme(i(u))},refresh:d.refresh.bind(d),release:d.release.bind(d)})}}),Ot.set(n,t),t}r(en,"getEnchantRegistry");function It({slots:e,registry:n=en(),pluginId:t,register:i}){if(gn(t),typeof i!="function")throw new TypeError("\u9644\u9B54\u53F0\u9700\u8981\u8BBE\u7F6E\u5165\u53E3\u6CE8\u518C\u65B9\u6CD5\u3002");if(typeof e?.entries!="function"||typeof e?.subscribe!="function"){let c=i(),w=!0;return()=>{w&&(w=!1,typeof c=="function"&&c())}}let s=!0,d=null,u=!1;function f(){if(!n.shouldGroupSettings(t))return!1;let c=n.getSnapshot().controller;try{return e.entries("settings.section").some(w=>w.options?.id===c?.sectionId)}catch{return!1}}r(f,"shouldGroup");function o(){if(!(!s||u)){u=!0;try{if(n.refresh(),f()){if(d){let c=d;d=null,c()}}else if(!d){d=r(()=>{},"slot");let c=i();if(typeof c!="function")throw new TypeError("Harness \u8BBE\u7F6E\u5165\u53E3\u6CA1\u6709\u8FD4\u56DE\u6E05\u7406\u65B9\u6CD5\u3002");d=c}}finally{u=!1}}}r(o,"sync");let l=n.subscribe(o),m=e.subscribe("settings.section",o);try{o()}catch(c){throw s=!1,l(),m(),d?.(),c}return()=>{if(!s)return;s=!1,l(),m();let c=d;d=null,c?.()}}r(It,"bindSettingsEntry");var Dt=require("react");var _t=new WeakMap,nt=new Set,yn=null;function Lt(e){return/^zh(?:-|$)/i.test(String(e||""))?"zh":e?"en":null}r(Lt,"language");function Me(e=globalThis.document){try{let n=Lt(yn?.getSnapshot?.().active);if(n)return n}catch{}return Lt(e?.documentElement?.lang)||"zh"}r(Me,"readHostLocale");function xn(e){if(!e||typeof e.getSnapshot!="function"||typeof e.subscribe!="function")return()=>{};let n=yn;yn=e;let t=r(()=>{for(let d of[...nt])d()},"refresh"),i=e.subscribe(t);t();let s=!1;return()=>{s||(s=!0,i?.(),yn===e&&(yn=n,t()))}}r(xn,"bindHostLocale");function wn(e=globalThis.document){if(!e||typeof e!="object")return Or;let n=_t.get(e);if(n)return n;let t=new Set,i=Me(e),s,d=r(()=>{let u=Me(e);if(i!==u){i=u;for(let f of[...t])f()}},"refresh");return n=Object.freeze({getSnapshot:r(()=>Me(e),"getSnapshot"),subscribe(u){if(t.add(u),t.size===1){i=Me(e),nt.add(d);let o=e.defaultView?.MutationObserver;typeof o=="function"&&e.documentElement&&(s=new o(d),s.observe(e.documentElement,{attributes:!0,attributeFilter:["lang"]}))}let f=!1;return()=>{f||(f=!0,t.delete(u),t.size||(nt.delete(d),s?.disconnect(),s=null))}}}),_t.set(e,n),n}r(wn,"getHostLocaleStore");function Pt(e,n=globalThis.document){return wn(n).subscribe(e)}r(Pt,"subscribeHostLocale");var Or=Object.freeze({getSnapshot:r(()=>Me(),"getSnapshot"),subscribe:r(()=>()=>{},"subscribe")});function nn(e,n){return Me()==="en"?n:e}r(nn,"translate");var Mt=Object.freeze({brand:"Beginning",cyberpunk:"Digital Life",awakening:"Punk",startup:"Half Face","whale-girl":"Whale Girl","deepseek-title":"DeepSeek","deepseek-dance":"Dance","deepseek-sea":"Sea","startup-screen":"Rhine Lab",silver:"Distant Mountains",gold:"Black and Gold",ice:"Blue Mist","assassins-creed":"Assassin\u2019s Creed","cyberpunk-2077":"Cyberpunk 2077",gta6:"GTA6",horizon6:"Forza Horizon 6",horizon5:"Forza Horizon 5",horizon4:"Forza Horizon 4",classic:"Classic"});function fe(e){if(!e)return"";let n=e.source==="builtin"||!e.source&&Object.hasOwn(Mt,e.id);return Me()==="en"&&n&&Mt[e.id]||e.name}r(fe,"localizedName");var zt=Object.freeze({"\u6570\u636E\u5171\u4EAB\u6388\u6743\u5B57\u6BB5\u65E0\u6548\u3002":"The data-sharing authorization fields are invalid.","\u5F00\u53D1\u8005\u5C1A\u672A\u914D\u7F6E\u6570\u636E\u63A5\u6536\u670D\u52A1\uFF0C\u5F53\u524D\u4E0D\u4F1A\u53D1\u9001\u4EFB\u4F55\u6570\u636E\u3002":"The developer has not configured a collector. No data is currently sent.","\u6682\u65F6\u65E0\u6CD5\u8BFB\u53D6\u63D2\u4EF6\u7248\u672C\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002":"The plugin version is unavailable. Please try again later.","\u8BF7\u9605\u8BFB\u5E76\u660E\u786E\u540C\u610F\u5F53\u524D\u7248\u672C\u7684\u6570\u636E\u5171\u4EAB\u8BF4\u660E\u3002":"Read and explicitly agree to the current data-sharing notice.","\u6B64\u524D\u7684\u6570\u636E\u5220\u9664\u8BF7\u6C42\u5C1A\u672A\u5B8C\u6210\uFF0C\u8BF7\u5148\u91CD\u8BD5\u5220\u9664\u3002":"The previous deletion request is incomplete. Retry deletion first.","\u6570\u636E\u63A5\u6536\u670D\u52A1\u5DF2\u53D8\u66F4\uFF0C\u8BF7\u5148\u505C\u6B62\u5171\u4EAB\u5E76\u5220\u9664\u539F\u670D\u52A1\u4E2D\u7684\u6570\u636E\u3002":"The collector has changed. Stop sharing and delete data from the previous collector first.","\u8BBE\u7F6E\u5DF2\u4FDD\u5B58\uFF0C\u4E0B\u6B21\u542F\u52A8\u751F\u6548":"Settings saved. Changes take effect on the next launch.","\u5DF2\u6062\u590D\u9ED8\u8BA4\uFF0C\u5168\u90E8\u4E0A\u4F20\u7684\u89C6\u9891\u548C\u56FE\u7247\u5DF2\u5220\u9664\u3002":"Defaults restored. All uploaded videos and images have been deleted.",\u89C6\u9891\u5DF2\u79FB\u9664:"Video removed.",\u7ED3\u675F\u753B\u9762\u5DF2\u79FB\u9664:"End screen removed.","\u8BF7\u9009\u62E9\u4E0D\u8D85\u8FC720 MB\u7684PNG\u3001JPEG\u6216WebP\u56FE\u7247\u3002":"Choose a PNG, JPEG or WebP image up to 20 MB.","\u6B63\u5728\u68C0\u67E5\u7ED3\u675F\u753B\u9762\u2026":"Checking the end screen\u2026","\u65E0\u6CD5\u8BFB\u53D6\u8FD9\u5F20\u56FE\u7247\uFF0C\u8BF7\u66F4\u6362\u6709\u6548\u7684PNG\u3001JPEG\u6216WebP\u3002":"Could not read this image. Choose a valid PNG, JPEG or WebP image.",\u4E0A\u4F20\u5931\u8D25:"Upload failed.",\u56FE\u7247\u5DF2\u4E0A\u4F20\u5E76\u8BBE\u4E3A\u7ED3\u675F\u753B\u9762:"Image uploaded and set as the end screen.","\u56FE\u7247\u4E0A\u4F20\u4E2D\u65AD\uFF0C\u8BF7\u91CD\u8BD5\u3002":"The image upload was interrupted. Please try again.","\u6B63\u5728\u4E0A\u4F20\u56FE\u7247\u2026":"Uploading the image\u2026","\u8BF7\u9009\u62E9 MP4\u3001M4V \u6216 WebM \u89C6\u9891\u3002\u63A8\u8350 MP4\uFF08H.264 / AAC\uFF09\u3002":"Choose an MP4, M4V or WebM video. MP4 (H.264 / AAC) is recommended.","\u89C6\u9891\u5E94\u5927\u4E8E 0 \u5B57\u8282\uFF0C\u4E14\u4E0D\u8D85\u8FC7 200 MB\u3002":"The video must be larger than 0 bytes and no larger than 200 MB.","\u6B63\u5728\u68C0\u67E5\u89C6\u9891\u2026":"Checking the video\u2026","\u6D4F\u89C8\u5668\u65E0\u6CD5\u8BFB\u53D6\u6B64\u89C6\u9891\u3002\u8BF7\u8F6C\u6362\u4E3A MP4\uFF08H.264 / AAC\uFF09\u540E\u91CD\u8BD5\u3002":"The browser could not read this video. Convert it to MP4 (H.264 / AAC) and try again.",\u89C6\u9891\u5DF2\u5BFC\u5165\u5E76\u8BBE\u4E3A\u5F00\u673A\u52A8\u753B:"Video imported and set as the startup animation.","\u4E0A\u4F20\u4E2D\u65AD\uFF0C\u8BF7\u91CD\u8BD5\u3002":"The upload was interrupted. Please try again.","\u6B63\u5728\u4E0A\u4F20\u2026":"Uploading\u2026","\u8BBE\u7F6E\u5FC5\u987B\u662F JSON \u5BF9\u8C61\u3002":"Settings must be a JSON object.","\u5DF2\u53D6\u6D88\u64AD\u653E\u65F6\u957F\u8BBE\u7F6E\uFF0C\u52A8\u753B\u6309\u539F\u59CB\u957F\u5EA6\u5B8C\u6574\u64AD\u653E\u3002":"Playback duration settings have been removed. Animations play at their full original length.","\u5DF2\u53D6\u6D88\u753B\u9762\u663E\u793A\u8BBE\u7F6E\uFF0C\u5F00\u673A\u52A8\u753B\u59CB\u7EC8\u94FA\u6EE1\u5F53\u524D\u7A97\u53E3\u3002":"Display settings have been removed. Startup animations always fill the current window.","\u66F4\u65B0\u63D0\u9192\u4F7F\u7528\u7EDF\u4E00\u5916\u89C2\uFF0C\u5DF2\u53D6\u6D88\u5355\u72EC\u8C03\u8282\u3002":"Update prompts use the shared appearance and no longer have separate controls.","\u97F3\u91CF\u987B\u5728 0 \u5230 1 \u4E4B\u95F4\u3002":"Volume must be between 0 and 1.","\u6240\u9009\u52A8\u753B\u4E0D\u5B58\u5728\uFF0C\u8BF7\u5237\u65B0\u7247\u5E93\u3002":"The selected animation is unavailable. Refresh the library.","\u7ED3\u675F\u5C01\u9762\u987B\u4E3A logo \u6216 image\u3002":"The end cover must be logo or image.","\u6240\u9009\u5C01\u9762\u56FE\u7247\u4E0D\u5B58\u5728\uFF0C\u8BF7\u91CD\u65B0\u4E0A\u4F20\u3002":"The selected cover image is unavailable. Upload it again.","\u4E0D\u652F\u6301\u6B64\u7ED3\u675F\u753B\u9762\u3002":"This end screen is not supported.","\u5C01\u9762\u9002\u914D\u987B\u4E3A cover \u6216 contain\u3002":"Cover fit must be cover or contain.","\u8BF7\u5148\u4E0A\u4F20\u4E00\u5F20\u7ED3\u675F\u5C01\u9762\u56FE\u7247\u3002":"Upload an end cover image first.","\u5199\u5165\u8BF7\u6C42\u7F3A\u5C11\u63D2\u4EF6\u6807\u8BC6\u3002":"The write request is missing the plugin identifier.","\u65E0\u6548\u6765\u6E90\u3002":"Invalid request origin.","\u4E0D\u5141\u8BB8\u8DE8\u7AD9\u4FEE\u6539\u8BBE\u7F6E\u3002":"Settings cannot be changed from another site.","\u8BF7\u4F7F\u7528 application/json\u3002":"Use application/json.","\u8BBE\u7F6E\u5185\u5BB9\u8FC7\u5927\u3002":"The settings payload is too large.","JSON \u683C\u5F0F\u4E0D\u6B63\u786E\u3002":"Invalid JSON format.","\u6587\u4EF6\u4E0A\u4F20\u5DF2\u4E2D\u65AD\u3002":"The upload was interrupted.","\u4E0A\u4F20\u7B49\u5F85\u8D85\u65F6\uFF0C\u8BF7\u91CD\u8BD5\u3002":"The upload timed out. Please try again.","\u8BF7\u6C42\u5185\u5BB9\u8D85\u8FC7\u5927\u5C0F\u9650\u5236\u3002":"The request exceeds the size limit.","\u65E0\u6548\u7684\u89C6\u9891\u5B57\u8282\u8303\u56F4\u3002":"Invalid video byte range.","\u8BBE\u7F6E\u6587\u4EF6\u65E0\u6CD5\u8BFB\u53D6\u3002\u8BF7\u5907\u4EFD\u5E76\u68C0\u67E5 boot-studio/settings.json\u3002":"Could not read the settings file. Back up and check boot-studio/settings.json.","\u8BBE\u7F6E\u6587\u4EF6\u7248\u672C\u6216\u7247\u5E93\u683C\u5F0F\u4E0D\u6B63\u786E\u3002":"The settings file version or library format is invalid.","\u7ED3\u675F\u5C01\u9762\u7247\u5E93\u683C\u5F0F\u4E0D\u6B63\u786E\u3002":"The end cover library format is invalid.","\u5DF2\u4FDD\u5B58\u7684\u8BBE\u7F6E\u683C\u5F0F\u4E0D\u6B63\u786E\uFF0C\u8BF7\u5907\u4EFD\u5E76\u68C0\u67E5 settings.json\u3002":"The saved settings are invalid. Back up and check settings.json.","\u91CD\u7F6E\u6E05\u7406\u8DEF\u5F84\u8D85\u51FA\u6570\u636E\u76EE\u5F55\u3002":"The reset cleanup path is outside the data directory.","\u5185\u7F6E\u7D20\u6750\u76EE\u5F55\u4E0E\u81EA\u5B9A\u4E49\u6570\u636E\u6E05\u7406\u8303\u56F4\u91CD\u53E0\uFF0C\u672A\u4FEE\u6539\u8BBE\u7F6E\u6216\u7D20\u6750\u3002":"Built-in assets overlap the custom data cleanup path. Settings and assets were left unchanged.","\u91CD\u7F6E\u9694\u79BB\u76EE\u5F55\u4E0D\u662F\u5B89\u5168\u7684\u672C\u5730\u6587\u4EF6\u5939\uFF0C\u672A\u4FEE\u6539\u8BBE\u7F6E\u6216\u7D20\u6750\u3002":"The reset quarantine directory is not a safe local folder. Settings and assets were left unchanged.","\u91CD\u7F6E\u9694\u79BB\u76EE\u5F55\u8D85\u51FA\u6570\u636E\u76EE\u5F55\uFF0C\u672A\u4FEE\u6539\u8BBE\u7F6E\u6216\u7D20\u6750\u3002":"The reset quarantine directory is outside the data directory. Settings and assets were left unchanged.","\u6587\u4EF6\u540D\u7F16\u7801\u65E0\u6548\u3002":"Invalid filename encoding.","\u652F\u6301 PNG\u3001JPEG \u548C WebP \u56FE\u7247\uFF0C\u4E0D\u63A5\u53D7 SVG\u3002":"PNG, JPEG and WebP images are supported. SVG is not supported.","\u652F\u6301 MP4\u3001M4V \u548C WebM \u89C6\u9891\u3002":"MP4, M4V and WebM videos are supported.","\u56FE\u7247\u683C\u5F0F\u65E0\u6548\uFF0C\u8BF7\u4E0A\u4F20 PNG\u3001JPEG \u6216 WebP \u56FE\u7247\u3002":"Invalid image format. Upload a PNG, JPEG or WebP image.","\u6587\u4EF6\u4E0D\u662F\u6709\u6548\u7684 MP4 / WebM \u5BB9\u5668\u3002\u8BF7\u4F18\u5148\u4F7F\u7528 H.264 + AAC \u7684 MP4\u3002":"The file is not a valid MP4 / WebM container. An MP4 with H.264 + AAC is recommended.","\u5C01\u9762\u56FE\u7247\u4E0D\u5B58\u5728\u6216\u6587\u4EF6\u5DF2\u88AB\u79FB\u8D70\u3002":"The cover image is unavailable or its file has been moved.","\u52A8\u753B\u4E0D\u5B58\u5728\u6216\u6587\u4EF6\u5DF2\u88AB\u79FB\u8D70\u3002":"The animation is unavailable or its file has been moved.","\u63A5\u53E3\u4E0D\u5B58\u5728\u3002":"This endpoint does not exist.","\u8BF7\u5148\u68C0\u67E5\u5E76\u9009\u62E9\u66F4\u65B0\u7248\u672C\u3002":"Check for updates and select a version first.","\u66F4\u65B0\u5305\u51C6\u5907\u5931\u8D25\u3002":"Could not prepare the update package.","\u52A8\u753B\u4E0D\u5B58\u5728\u3002":"The animation does not exist.","\u5C01\u9762\u56FE\u7247\u4E0D\u5B58\u5728\u3002":"The cover image does not exist.","\u5185\u7F6E\u7ED3\u675F\u5C01\u9762\u4E0D\u5B58\u5728\u3002":"The built-in end cover does not exist.","\u4E0D\u652F\u6301\u6B64\u8BF7\u6C42\u65B9\u6CD5\u3002":"This request method is not supported.","\u8BF7\u5148\u786E\u8BA4\u5220\u9664\u5168\u90E8\u81EA\u5B9A\u4E49\u89C6\u9891\u3001\u56FE\u7247\u548C\u504F\u597D\u3002":"Confirm deletion of all custom videos, images and preferences first.","\u53EA\u80FD\u5220\u9664\u81EA\u5DF1\u4E0A\u4F20\u7684\u5C01\u9762\u56FE\u7247\u3002":"Only uploaded cover images can be deleted.","\u53EA\u80FD\u5220\u9664\u81EA\u5DF1\u4E0A\u4F20\u7684\u52A8\u753B\u3002":"Only uploaded animations can be deleted.","\u6587\u4EF6\u64CD\u4F5C\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u6570\u636E\u76EE\u5F55\u6743\u9650\u548C\u53EF\u7528\u7A7A\u95F4\u3002":"The file operation failed. Check data directory permissions and available space.","\u66F4\u65B0\u5305\u4E0B\u8F7D\u8D85\u8FC7 15 \u5206\u949F\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC\u540E\u91CD\u8BD5\u3002":"The update download exceeded 15 minutes. Check your connection and try again.","\u8FDE\u63A5\u66F4\u65B0\u4E0B\u8F7D\u670D\u52A1\u8D85\u65F6\u3002":"The update download connection timed out.","\u66F4\u65B0\u5305\u4E0B\u8F7D\u957F\u65F6\u95F4\u6CA1\u6709\u8FDB\u5C55\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC\u540E\u91CD\u8BD5\u3002":"The update download has stalled. Check your connection and try again.","npm \u66F4\u65B0\u8BF7\u6C42\u79BB\u5F00\u4E86\u5141\u8BB8\u7684\u6CE8\u518C\u8868\u3002":"The npm update request left the allowed registries.","\u8FDE\u63A5 npm \u6CE8\u518C\u8868\u8D85\u65F6\u3002":"The npm registry connection timed out.","\u65E0\u6CD5\u8FDE\u63A5 npm \u6CE8\u518C\u8868\u3002":"Could not connect to the npm registry.","npm \u6CE8\u518C\u8868\u8FD4\u56DE\u4E86\u65E0\u6548\u8DF3\u8F6C\u3002":"The npm registry returned an invalid redirect.","npm \u6CE8\u518C\u8868\u8DF3\u8F6C\u6B21\u6570\u8FC7\u591A\u3002":"The npm registry returned too many redirects.","\u8BFB\u53D6 npm \u6CE8\u518C\u8868\u5185\u5BB9\u5931\u8D25\u3002":"Could not read the npm registry response.","npm \u66F4\u65B0\u5305\u6807\u8BC6\u4E0E\u5F53\u524D\u63D2\u4EF6\u4E0D\u4E00\u81F4\u3002":"The npm package identifier does not match this plugin.","npm \u66F4\u65B0\u5305\u7684\u4ED3\u5E93\u6807\u8BC6\u4E0D\u5C5E\u4E8E\u672C\u9879\u76EE\u3002":"The npm package repository does not belong to this project.","\u4E0D\u652F\u6301\u7684 npm \u6CE8\u518C\u8868\u3002":"This npm registry is not supported.","npm \u66F4\u65B0\u5305\u5730\u5740\u4E0D\u5C5E\u4E8E\u5141\u8BB8\u7684\u6CE8\u518C\u8868\u548C\u7248\u672C\u3002":"The npm package URL does not match an allowed registry and version.","npm \u66F4\u65B0\u5305\u7F3A\u5C11\u6709\u6548\u7684 SHA-512 \u5B8C\u6574\u6027\u4FE1\u606F\u3002":"The npm package is missing valid SHA-512 integrity information.","npm \u66F4\u65B0\u5305 SHA-512 \u6821\u9A8C\u5931\u8D25\uFF0C\u672A\u6267\u884C\u66F4\u65B0\u3002":"The npm package failed SHA-512 verification. The update was not applied.","\u7EF4\u62A4\u7248\u672C\u5FC5\u987B\u4F7F\u7528 X.Y.Z \u7A33\u5B9A\u7248\u672C\u53F7\u3002":"Release versions must use a stable X.Y.Z version number.","\u7248\u672C\u53F7\u8FC7\u5927\u3002":"The version number is too large.","\u7EF4\u62A4\u6E05\u5355\u683C\u5F0F\u4E0D\u6B63\u786E\u3002":"The update manifest format is invalid.","\u66F4\u65B0\u5305\u6807\u8BC6\u4E0E\u5F53\u524D\u63D2\u4EF6\u4E0D\u4E00\u81F4\u3002":"The update package identifier does not match this plugin.","\u66F4\u65B0\u63D0\u4EA4\u6216 SHA-256 \u65E0\u6548\u3002":"The update commit or SHA-256 is invalid.","\u66F4\u65B0\u5305\u5927\u5C0F\u8D85\u51FA\u9650\u5236\u3002":"The update package exceeds the size limit.","\u7EF4\u62A4\u6E05\u5355\u7F3A\u5C11\u53D1\u5E03\u65F6\u95F4\u6216\u91CD\u542F\u58F0\u660E\u3002":"The update manifest is missing its publication time or restart declaration.","\u53EA\u63A5\u53D7\u672C\u9879\u76EE\u56FA\u5B9A\u7248\u672C\u7684 GitHub Release \u66F4\u65B0\u5305\u3002":"Only versioned GitHub Release packages from this project are accepted.","\u66F4\u65B0\u5305 TAR \u6821\u9A8C\u5931\u8D25\u3002":"The update package failed TAR verification.","\u66F4\u65B0\u5305 TAR \u957F\u5EA6\u65E0\u6548\u3002":"The update package TAR length is invalid.","\u66F4\u65B0\u5305\u5185\u5BB9\u4E0D\u5B8C\u6574\u3002":"The update package is incomplete.","\u66F4\u65B0\u5305\u6269\u5C55\u5934\u65E0\u6548\u3002":"The update package extension header is invalid.","\u66F4\u65B0\u5305\u6269\u5C55\u5934\u957F\u5EA6\u65E0\u6548\u3002":"The update package extension header length is invalid.","\u66F4\u65B0\u5305\u542B\u91CD\u590D package.json\uFF0C\u672A\u6267\u884C\u66F4\u65B0\u3002":"The update package contains duplicate package.json entries. The update was not applied.","\u66F4\u65B0\u5305 package.json \u65E0\u6548\u3002":"The update package package.json is invalid.","\u66F4\u65B0\u5305\u5305\u542B\u8FC7\u591A TAR \u6761\u76EE\uFF0C\u672A\u6267\u884C\u66F4\u65B0\u3002":"The update package contains too many TAR entries. The update was not applied.","\u66F4\u65B0\u5305\u4E2D\u6CA1\u6709 package/package.json\u3002":"The update package is missing package/package.json.","\u7EF4\u62A4\u6587\u4EF6\u8BFB\u53D6\u5DF2\u4E2D\u65AD\u3002":"Reading the update file was interrupted.","\u7EF4\u62A4\u6587\u4EF6\u8D85\u8FC7\u5141\u8BB8\u5927\u5C0F\u3002":"The update file exceeds the size limit.","\u7EF4\u62A4\u6587\u4EF6\u5185\u5BB9\u4E3A\u7A7A\u3002":"The update file is empty.","\u66F4\u65B0\u5305\u672A\u5B8C\u6574\u4E0B\u8F7D\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC\u540E\u91CD\u8BD5\u3002":"The update download is incomplete. Check your connection and try again.","npm \u7248\u672C\u5C1A\u672A\u53D1\u5E03\uFF0C\u5F53\u524D\u7248\u672C\u53EF\u4EE5\u7EE7\u7EED\u4F7F\u7528\u3002":"The npm version is not published yet. You can keep using the current version.","\u6709\u65B0\u7248\u672C\u53EF\u7528\u3002":"A new version is available.","\u5F53\u524D\u5DF2\u662F\u6700\u65B0\u7248\u672C\u3002":"You are up to date.","\u7EF4\u62A4\u901A\u9053\u5C1A\u672A\u53D1\u5E03\uFF0C\u5F53\u524D\u7248\u672C\u53EF\u4EE5\u7EE7\u7EED\u4F7F\u7528\u3002":"The update channel is not published yet. You can keep using the current version.","\u8FDE\u63A5\u7EF4\u62A4\u901A\u9053\u8D85\u65F6\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002":"The update channel connection timed out. Please try again later.","\u53E6\u4E00\u4E2A\u7248\u672C\u6B63\u5728\u51C6\u5907\uFF0C\u8BF7\u7A0D\u540E\u91CD\u65B0\u68C0\u67E5\u3002":"Another version is being prepared. Check again later.","\u66F4\u65B0\u7248\u672C\u5DF2\u53D8\u5316\u6216\u5C1A\u672A\u53D1\u5E03\uFF0C\u8BF7\u91CD\u65B0\u68C0\u67E5\u66F4\u65B0\u3002":"The update version has changed or is not published yet. Check for updates again.","\u66F4\u65B0\u5305 SHA-256 \u6216\u5927\u5C0F\u6821\u9A8C\u5931\u8D25\uFF0C\u672A\u6267\u884C\u66F4\u65B0\u3002":"The update package failed SHA-256 or size verification. The update was not applied.","\u66F4\u65B0\u5305\u7684\u540D\u79F0\u3001\u7248\u672C\u6216\u63D2\u4EF6\u58F0\u660E\u4E0D\u5339\u914D\u3002":"The update package name, version or plugin declaration does not match.","\u66F4\u65B0\u5305\u4E2D\u7684\u4F5C\u8005\u8BF4\u660E\u4E0E\u672C\u6B21\u68C0\u67E5\u7ED3\u679C\u4E0D\u4E00\u81F4\uFF0C\u8BF7\u91CD\u65B0\u68C0\u67E5\u66F4\u65B0\u3002":"The update package release notes do not match the checked version. Check for updates again.","\u7EF4\u62A4\u5305\u5305\u542B\u5B89\u88C5\u811A\u672C\uFF0C\u8BF7\u901A\u8FC7 Harness \u63D2\u4EF6\u7BA1\u7406\u5668\u4EBA\u5DE5\u68C0\u67E5\u3002":"The update package contains installation scripts. Review it in the Harness plugin manager.","npm \u66F4\u65B0\u5305\u5FC5\u987B\u5C5E\u4E8E\u672C\u9879\u76EE\u4E14\u4E0D\u542B\u8FD0\u884C\u4F9D\u8D56\u3002":"The npm update package must belong to this project and contain no runtime dependencies.","\u66F4\u65B0\u5305\u51C6\u5907\u7ED3\u679C\u65E0\u6548\uFF0C\u672A\u8BF7\u6C42\u5B89\u88C5\u3002":"The prepared update is invalid. Installation was not requested.","\u66F4\u65B0\u5305\u8DEF\u5F84\u4E0E\u5DF2\u6821\u9A8C\u7684\u540D\u79F0\u3001\u7248\u672C\u6216 SHA-256 \u4E0D\u4E00\u81F4\uFF0C\u672A\u8BF7\u6C42\u5B89\u88C5\u3002":"The update path does not match the verified name, version or SHA-256. Installation was not requested.","\u66F4\u65B0\u5305\u8DEF\u5F84\u6216\u7248\u672C\u65E0\u6548\uFF0C\u672A\u8BF7\u6C42\u5B89\u88C5\u3002":"The update path or version is invalid. Installation was not requested.","\u5F53\u524D\u8FDE\u63A5\u6CA1\u6709\u7BA1\u7406\u63D2\u4EF6\u7684\u6743\u9650\uFF0C\u8BF7\u4F7F\u7528 Harness \u4E3B\u7A97\u53E3\u7684\u62E5\u6709\u8005\u8FDE\u63A5\u3002":"This connection cannot manage plugins. Use the owner connection in the main Harness window.","Harness \u672A\u63A5\u53D7\u66F4\u65B0\u8BF7\u6C42\uFF0C\u8BF7\u5728\u63D2\u4EF6\u7BA1\u7406\u4E2D\u67E5\u770B\u8BE6\u60C5\u3002":"Harness did not accept the update request. See the plugin manager for details.","\u66F4\u65B0\u672A\u5B8C\u6210\uFF0C\u8BF7\u5728\u63D2\u4EF6\u7BA1\u7406\u4E2D\u67E5\u770B\u8BE6\u60C5\u3002":"The update did not complete. See the plugin manager for details.","Harness \u8FD4\u56DE\u7684\u7248\u672C\u4E0E\u66F4\u65B0\u76EE\u6807\u4E0D\u4E00\u81F4\uFF0C\u8BF7\u67E5\u770B\u63D2\u4EF6\u7BA1\u7406\u3002":"The version returned by Harness does not match the update target. Check the plugin manager.","\u66F4\u65B0\u54CD\u5E94\u8D85\u65F6\u3002\u8BF7\u5728\u63D2\u4EF6\u7BA1\u7406\u4E2D\u6838\u5BF9\u5B9E\u9645\u7248\u672C\u540E\u91CD\u8BD5\u3002":"The update response timed out. Check the installed version in the plugin manager before retrying.","\u66F4\u65B0\u7248\u672C\u65E0\u6548\u6216\u5C1A\u672A\u516C\u5F00\uFF0C\u8BF7\u91CD\u65B0\u68C0\u67E5\u66F4\u65B0\u3002":"The update version is invalid or not public yet. Check for updates again.","\u66F4\u65B0\u5DF2\u53D6\u6D88\uFF1A\u63D2\u4EF6\u5DF2\u505C\u7528\u6216\u5378\u8F7D\uFF0C\u672A\u8BF7\u6C42\u5B89\u88C5\u3002":"The update was canceled because the plugin was disabled or uninstalled. Installation was not requested.","\u6682\u65F6\u65E0\u6CD5\u6062\u590D\u9ED8\u8BA4\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002":"Could not restore defaults. Please try again later.","\u6062\u590D\u9ED8\u8BA4\u672A\u5B8C\u6210\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002":"Restoring defaults did not complete. Please try again later.","\u6682\u65F6\u65E0\u6CD5\u68C0\u67E5\u66F4\u65B0\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002":"Could not check for updates. Please try again later.","\u66F4\u65B0\u672A\u5B8C\u6210\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002":"The update did not complete. Please try again later.","\u53D1\u5E03\u524D\u8BF7\u5148\u8BE2\u95EE\u4F5C\u8005\u5E76\u586B\u5199\u672C\u7248\u672C\u7ED9\u7528\u6237\u5C55\u793A\u7684\u66F4\u65B0\u8BF4\u660E\u3002":"Ask the author for this version\u2019s release notes before publishing.","\u66F4\u65B0\u8BF4\u660E\u987B\u5305\u542B\u4E14\u4EC5\u5305\u542B version \u548C notes\u3002":"Release notes must contain only version and notes.","\u4F5C\u8005\u66F4\u65B0\u8BF4\u660E\u7684\u7248\u672C\u5FC5\u987B\u4E0E\u5B9E\u9645\u5B89\u88C5\u5305\u7248\u672C\u5B8C\u5168\u4E00\u81F4\u3002":"The release notes version must match the package version exactly.","\u4F5C\u8005\u66F4\u65B0\u8BF4\u660E\u987B\u4E3A 1 \u5230 2000 \u5B57\u7684\u7EAF\u6587\u672C\uFF0C\u4E0D\u63A5\u53D7\u63A7\u5236\u5B57\u7B26\u3002":"Release notes must contain 1 to 2000 plain-text characters without control characters.","\u5B89\u88C5\u5305\u5143\u6570\u636E\u4E0D\u5B58\u5728\uFF0C\u65E0\u6CD5\u6838\u5BF9\u4F5C\u8005\u66F4\u65B0\u8BF4\u660E\u3002":"Package metadata is unavailable. Release notes could not be verified."}),tt=Object.freeze({BOOT_SETTINGS_OBJECT:["\u8BBE\u7F6E\u5FC5\u987B\u662F JSON \u5BF9\u8C61\u3002","Settings must be a JSON object."],BOOT_SETTING_RETIRED_DURATION:["\u5DF2\u53D6\u6D88\u64AD\u653E\u65F6\u957F\u8BBE\u7F6E\uFF0C\u52A8\u753B\u6309\u539F\u59CB\u957F\u5EA6\u5B8C\u6574\u64AD\u653E\u3002","Playback duration settings have been removed. Animations play at their full original length."],BOOT_SETTING_RETIRED_FIT:["\u5DF2\u53D6\u6D88\u753B\u9762\u663E\u793A\u8BBE\u7F6E\uFF0C\u5F00\u673A\u52A8\u753B\u59CB\u7EC8\u94FA\u6EE1\u5F53\u524D\u7A97\u53E3\u3002","Display settings have been removed. Startup animations always fill the current window."],BOOT_SETTING_RETIRED_UPDATE_APPEARANCE:["\u66F4\u65B0\u63D0\u9192\u4F7F\u7528\u7EDF\u4E00\u5916\u89C2\uFF0C\u5DF2\u53D6\u6D88\u5355\u72EC\u8C03\u8282\u3002","Update prompts use the shared appearance and no longer have separate controls."],BOOT_SETTING_UNSUPPORTED:["\u4E0D\u652F\u6301\u6B64\u8BBE\u7F6E\uFF0C\u8BF7\u5237\u65B0\u8BBE\u7F6E\u9875\u540E\u91CD\u8BD5\u3002","This setting is not supported. Refresh Settings and try again."],BOOT_SETTING_BOOLEAN:["\u8BBE\u7F6E\u503C\u5FC5\u987B\u662F\u5F00\u5173\u3002","The setting must be a boolean."],BOOT_SETTING_VOLUME:["\u97F3\u91CF\u987B\u5728 0 \u5230 1 \u4E4B\u95F4\u3002","Volume must be between 0 and 1."],BOOT_SETTING_VIDEO_MISSING:["\u6240\u9009\u52A8\u753B\u4E0D\u5B58\u5728\uFF0C\u8BF7\u5237\u65B0\u7247\u5E93\u3002","The selected animation is unavailable. Refresh the library."],BOOT_SETTING_END_SCREEN:["\u7ED3\u675F\u5C01\u9762\u987B\u4E3A logo \u6216 image\u3002","The end cover must be logo or image."],BOOT_SETTING_IMAGE_MISSING:["\u6240\u9009\u5C01\u9762\u56FE\u7247\u4E0D\u5B58\u5728\uFF0C\u8BF7\u91CD\u65B0\u4E0A\u4F20\u3002","The selected cover image is unavailable. Upload it again."],BOOT_SETTING_LOGO:["\u4E0D\u652F\u6301\u6B64\u7ED3\u675F\u753B\u9762\u3002","This end screen is not supported."],BOOT_SETTING_END_FIT:["\u5C01\u9762\u9002\u914D\u987B\u4E3A cover \u6216 contain\u3002","Cover fit must be cover or contain."],BOOT_SETTING_IMAGE_REQUIRED:["\u8BF7\u5148\u4E0A\u4F20\u4E00\u5F20\u7ED3\u675F\u5C01\u9762\u56FE\u7247\u3002","Upload an end cover image first."],BOOT_WRITE_IDENTIFIER:["\u5199\u5165\u8BF7\u6C42\u7F3A\u5C11\u63D2\u4EF6\u6807\u8BC6\u3002","The write request is missing the plugin identifier."],BOOT_WRITE_ORIGIN_INVALID:["\u65E0\u6548\u6765\u6E90\u3002","Invalid request origin."],BOOT_WRITE_CROSS_SITE:["\u4E0D\u5141\u8BB8\u8DE8\u7AD9\u4FEE\u6539\u8BBE\u7F6E\u3002","Settings cannot be changed from another site."],BOOT_JSON_CONTENT_TYPE:["\u8BF7\u4F7F\u7528 application/json\u3002","Use application/json."],BOOT_SETTINGS_TOO_LARGE:["\u8BBE\u7F6E\u5185\u5BB9\u8FC7\u5927\u3002","The settings payload is too large."],BOOT_JSON_INVALID:["JSON \u683C\u5F0F\u4E0D\u6B63\u786E\u3002","Invalid JSON format."],BOOT_UPLOAD_INTERRUPTED:["\u4E0A\u4F20\u4E2D\u65AD\uFF0C\u8BF7\u91CD\u8BD5\u3002","The upload was interrupted. Please try again."],BOOT_UPLOAD_TIMEOUT:["\u4E0A\u4F20\u7B49\u5F85\u8D85\u65F6\uFF0C\u8BF7\u91CD\u8BD5\u3002","The upload timed out. Please try again."],BOOT_BODY_TOO_LARGE:["\u8BF7\u6C42\u5185\u5BB9\u8D85\u8FC7\u5927\u5C0F\u9650\u5236\u3002","The request exceeds the size limit."],BOOT_RANGE_INVALID:["\u65E0\u6548\u7684\u89C6\u9891\u5B57\u8282\u8303\u56F4\u3002","Invalid video byte range."],BOOT_SETTINGS_READ:["\u8BBE\u7F6E\u6587\u4EF6\u65E0\u6CD5\u8BFB\u53D6\u3002\u8BF7\u5907\u4EFD\u5E76\u68C0\u67E5 boot-studio/settings.json\u3002","Could not read the settings file. Back up and check boot-studio/settings.json."],BOOT_LIBRARY_FORMAT:["\u8BBE\u7F6E\u6587\u4EF6\u7248\u672C\u6216\u7247\u5E93\u683C\u5F0F\u4E0D\u6B63\u786E\u3002","The settings file version or library format is invalid."],BOOT_IMAGE_LIBRARY_FORMAT:["\u7ED3\u675F\u5C01\u9762\u7247\u5E93\u683C\u5F0F\u4E0D\u6B63\u786E\u3002","The end cover library format is invalid."],BOOT_SAVED_SETTINGS_INVALID:["\u5DF2\u4FDD\u5B58\u7684\u8BBE\u7F6E\u683C\u5F0F\u4E0D\u6B63\u786E\uFF0C\u8BF7\u5907\u4EFD\u5E76\u68C0\u67E5 settings.json\u3002","The saved settings are invalid. Back up and check settings.json."],BOOT_RESET_PATH:["\u91CD\u7F6E\u6E05\u7406\u8DEF\u5F84\u8D85\u51FA\u6570\u636E\u76EE\u5F55\u3002","The reset cleanup path is outside the data directory."],BOOT_RESET_ASSETS_OVERLAP:["\u5185\u7F6E\u7D20\u6750\u76EE\u5F55\u4E0E\u81EA\u5B9A\u4E49\u6570\u636E\u6E05\u7406\u8303\u56F4\u91CD\u53E0\uFF0C\u672A\u4FEE\u6539\u8BBE\u7F6E\u6216\u7D20\u6750\u3002","Built-in assets overlap the custom data cleanup path. Settings and assets were left unchanged."],BOOT_RESET_QUARANTINE:["\u91CD\u7F6E\u9694\u79BB\u76EE\u5F55\u4E0D\u662F\u5B89\u5168\u7684\u672C\u5730\u6587\u4EF6\u5939\uFF0C\u672A\u4FEE\u6539\u8BBE\u7F6E\u6216\u7D20\u6750\u3002","The reset quarantine directory is not a safe local folder. Settings and assets were left unchanged."],BOOT_RESET_CLEANUP:["\u9ED8\u8BA4\u8BBE\u7F6E\u5DF2\u6062\u590D\uFF0C\u4F46\u81EA\u5B9A\u4E49\u6587\u4EF6\u5C1A\u672A\u5168\u90E8\u6E05\u7406\u3002\u8BF7\u518D\u6B21\u6062\u590D\u9ED8\u8BA4\u91CD\u8BD5\u3002","Defaults were restored, but some custom files remain. Restore defaults again to retry cleanup."],BOOT_FILENAME_ENCODING:["\u6587\u4EF6\u540D\u7F16\u7801\u65E0\u6548\u3002","Invalid filename encoding."],BOOT_IMAGE_TYPE:["\u652F\u6301 PNG\u3001JPEG \u548C WebP \u56FE\u7247\uFF0C\u4E0D\u63A5\u53D7 SVG\u3002","PNG, JPEG and WebP images are supported. SVG is not supported."],BOOT_VIDEO_TYPE:["\u652F\u6301 MP4\u3001M4V \u548C WebM \u89C6\u9891\u3002","MP4, M4V and WebM videos are supported."],BOOT_IMAGE_TOO_LARGE:["\u56FE\u7247\u5E94\u5927\u4E8E 0 \u5B57\u8282\uFF0C\u4E14\u4E0D\u8D85\u8FC7 20 MB\u3002","The image must be larger than 0 bytes and no larger than 20 MB."],BOOT_VIDEO_TOO_LARGE:["\u89C6\u9891\u5E94\u5927\u4E8E 0 \u5B57\u8282\uFF0C\u4E14\u4E0D\u8D85\u8FC7 200 MB\u3002","The video must be larger than 0 bytes and no larger than 200 MB."],BOOT_IMAGE_INVALID:["\u56FE\u7247\u683C\u5F0F\u65E0\u6548\uFF0C\u8BF7\u4E0A\u4F20 PNG\u3001JPEG \u6216 WebP \u56FE\u7247\u3002","Invalid image format. Upload a PNG, JPEG or WebP image."],BOOT_VIDEO_INVALID:["\u6587\u4EF6\u4E0D\u662F\u6709\u6548\u7684 MP4 / WebM \u5BB9\u5668\u3002\u8BF7\u4F18\u5148\u4F7F\u7528 H.264 + AAC \u7684 MP4\u3002","The file is not a valid MP4 / WebM container. An MP4 with H.264 + AAC is recommended."],BOOT_IMAGE_DECODE:["\u65E0\u6CD5\u8BFB\u53D6\u8FD9\u5F20\u56FE\u7247\uFF0C\u8BF7\u66F4\u6362\u6709\u6548\u7684PNG\u3001JPEG\u6216WebP\u3002","Could not read this image. Choose a valid PNG, JPEG or WebP image."],BOOT_VIDEO_DECODE:["\u6D4F\u89C8\u5668\u65E0\u6CD5\u8BFB\u53D6\u6B64\u89C6\u9891\u3002\u8BF7\u8F6C\u6362\u4E3A MP4\uFF08H.264 / AAC\uFF09\u540E\u91CD\u8BD5\u3002","The browser could not read this video. Convert it to MP4 (H.264 / AAC) and try again."],BOOT_IMAGE_NOT_FOUND:["\u5C01\u9762\u56FE\u7247\u4E0D\u5B58\u5728\u3002","The cover image does not exist."],BOOT_VIDEO_NOT_FOUND:["\u52A8\u753B\u4E0D\u5B58\u5728\u3002","The animation does not exist."],BOOT_LOGO_NOT_FOUND:["\u5185\u7F6E\u7ED3\u675F\u5C01\u9762\u4E0D\u5B58\u5728\u3002","The built-in end cover does not exist."],BOOT_ROUTE_NOT_FOUND:["\u63A5\u53E3\u4E0D\u5B58\u5728\u3002","This endpoint does not exist."],BOOT_METHOD_NOT_ALLOWED:["\u4E0D\u652F\u6301\u6B64\u8BF7\u6C42\u65B9\u6CD5\u3002","This request method is not supported."],BOOT_UPDATE_VERSION_REQUIRED:["\u8BF7\u5148\u68C0\u67E5\u5E76\u9009\u62E9\u66F4\u65B0\u7248\u672C\u3002","Check for updates and select a version first."],BOOT_UPDATE_PREPARE_FAILED:["\u66F4\u65B0\u5305\u51C6\u5907\u5931\u8D25\u3002","Could not prepare the update package."],BOOT_UPDATE_INVALID:["\u66F4\u65B0\u4FE1\u606F\u6216\u5B89\u88C5\u5305\u58F0\u660E\u65E0\u6548\uFF0C\u8BF7\u91CD\u65B0\u68C0\u67E5\u66F4\u65B0\u3002","The update information or package declaration is invalid. Check for updates again."],BOOT_UPDATE_NETWORK:["\u65E0\u6CD5\u8FDE\u63A5\u66F4\u65B0\u670D\u52A1\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC\u540E\u91CD\u8BD5\u3002","Could not connect to the update service. Check your connection and try again."],BOOT_UPDATE_TIMEOUT:["\u68C0\u67E5\u66F4\u65B0\u8D85\u65F6\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002","The update check timed out. Please try again later."],BOOT_UPDATE_INTEGRITY:["\u66F4\u65B0\u5305\u5B8C\u6574\u6027\u6821\u9A8C\u5931\u8D25\uFF0C\u672A\u6267\u884C\u66F4\u65B0\u3002","The update package failed integrity verification. The update was not applied."],BOOT_UPDATE_ARCHIVE:["\u66F4\u65B0\u5305\u65E0\u6CD5\u5B89\u5168\u8BFB\u53D6\uFF0C\u672A\u6267\u884C\u66F4\u65B0\u3002","The update package could not be read safely. The update was not applied."],BOOT_UPDATE_CACHE:["\u66F4\u65B0\u7F13\u5B58\u76EE\u5F55\u4E0D\u53EF\u7528\uFF0C\u8BF7\u68C0\u67E5\u6570\u636E\u76EE\u5F55\u6743\u9650\u548C\u53EF\u7528\u7A7A\u95F4\u3002","The update cache is unavailable. Check data directory permissions and available space."],BOOT_UPDATE_INSTALL_ACK_INVALID:["\u65E0\u6CD5\u786E\u8BA4\u66F4\u65B0\u7F13\u5B58\u7684\u6E05\u7406\u8BF7\u6C42\u3002","The update cache cleanup request could not be acknowledged."],BOOT_RESET_CONFIRM:["\u8BF7\u5148\u786E\u8BA4\u5220\u9664\u5168\u90E8\u81EA\u5B9A\u4E49\u89C6\u9891\u3001\u56FE\u7247\u548C\u504F\u597D\u3002","Confirm deletion of all custom videos, images and preferences first."],BOOT_IMAGE_DELETE_ONLY:["\u53EA\u80FD\u5220\u9664\u81EA\u5DF1\u4E0A\u4F20\u7684\u5C01\u9762\u56FE\u7247\u3002","Only uploaded cover images can be deleted."],BOOT_VIDEO_DELETE_ONLY:["\u53EA\u80FD\u5220\u9664\u81EA\u5DF1\u4E0A\u4F20\u7684\u52A8\u753B\u3002","Only uploaded animations can be deleted."],BOOT_MEDIA_STORAGE_LIMIT:["\u81EA\u5B9A\u4E49\u7D20\u6750\u603B\u5927\u5C0F\u5DF2\u8FBE\u4E0A\u9650\uFF0C\u8BF7\u5148\u79FB\u9664\u4E0D\u9700\u8981\u7684\u89C6\u9891\u6216\u56FE\u7247\u3002","Custom media has reached its storage limit. Remove unused videos or images first."],BOOT_MEDIA_COUNT_LIMIT:["\u81EA\u5B9A\u4E49\u7D20\u6750\u6570\u91CF\u5DF2\u8FBE\u4E0A\u9650\uFF0C\u8BF7\u5148\u79FB\u9664\u4E0D\u9700\u8981\u7684\u89C6\u9891\u6216\u56FE\u7247\u3002","Custom media has reached its file limit. Remove unused videos or images first."],BOOT_FILE_OPERATION_FAILED:["\u6587\u4EF6\u64CD\u4F5C\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u6570\u636E\u76EE\u5F55\u6743\u9650\u548C\u53EF\u7528\u7A7A\u95F4\u3002","The file operation failed. Check data directory permissions and available space."],BOOT_HTTP_ERROR:["\u8BF7\u6C42\u5931\u8D25\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002","The request failed. Please try again later."],BOOT_RESPONSE_INVALID:["\u670D\u52A1\u8FD4\u56DE\u4E86\u65E0\u6CD5\u8BC6\u522B\u7684\u5185\u5BB9\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002","The service returned an unrecognized response. Please try again later."],BOOT_REQUEST_TIMEOUT:["\u8BF7\u6C42\u8D85\u65F6\uFF0C\u8BF7\u68C0\u67E5\u8FDE\u63A5\u540E\u91CD\u8BD5\u3002","The request timed out. Check your connection and try again."],BOOT_REQUEST_CANCELLED:["\u8BF7\u6C42\u5DF2\u53D6\u6D88\u3002","The request was canceled."],BOOT_NETWORK_ERROR:["\u65E0\u6CD5\u8FDE\u63A5\u5F00\u673A\u52A8\u753B\u670D\u52A1\uFF0C\u8BF7\u68C0\u67E5\u8FDE\u63A5\u6216\u91CD\u542F Harness \u540E\u91CD\u8BD5\u3002","Could not connect to the startup animation service. Check your connection or restart Harness and try again."],BOOT_HARNESS_INSTALL_PERMISSION:["\u5F53\u524D\u8FDE\u63A5\u6CA1\u6709\u7BA1\u7406\u63D2\u4EF6\u7684\u6743\u9650\uFF0C\u8BF7\u4F7F\u7528 Harness \u4E3B\u7A97\u53E3\u7684\u62E5\u6709\u8005\u8FDE\u63A5\u3002","This connection cannot manage plugins. Use the owner connection in the main Harness window."],BOOT_HARNESS_INSTALL_UNAVAILABLE:["\u5F53\u524D Harness \u4E0D\u652F\u6301\u81EA\u52A8\u5B89\u88C5\u6B64\u66F4\u65B0\uFF0C\u8BF7\u6253\u5F00\u63D2\u4EF6\u7BA1\u7406\u5B8C\u6210\u66F4\u65B0\u3002","This Harness version cannot install this update automatically. Open the plugin manager to update."],BOOT_HARNESS_INSTALL_FAILED:["\u66F4\u65B0\u672A\u5B8C\u6210\uFF0C\u8BF7\u5728\u63D2\u4EF6\u7BA1\u7406\u4E2D\u67E5\u770B\u8BE6\u60C5\u3002","The update did not complete. See the plugin manager for details."],BOOT_HARNESS_INSTALL_RESPONSE:["Harness \u672A\u63A5\u53D7\u66F4\u65B0\u8BF7\u6C42\uFF0C\u8BF7\u5728\u63D2\u4EF6\u7BA1\u7406\u4E2D\u67E5\u770B\u8BE6\u60C5\u3002","Harness did not accept the update request. See the plugin manager for details."],BOOT_HARNESS_INSTALL_VERSION:["Harness \u8FD4\u56DE\u7684\u7248\u672C\u4E0E\u66F4\u65B0\u76EE\u6807\u4E0D\u4E00\u81F4\uFF0C\u8BF7\u67E5\u770B\u63D2\u4EF6\u7BA1\u7406\u3002","The version returned by Harness does not match the update target. Check the plugin manager."],BOOT_HARNESS_INSTALL_UNCERTAIN:["\u66F4\u65B0\u7ED3\u679C\u5C1A\u672A\u786E\u8BA4\uFF0C\u8BF7\u5728\u63D2\u4EF6\u7BA1\u7406\u4E2D\u6838\u5BF9\u5B9E\u9645\u7248\u672C\u540E\u518D\u64CD\u4F5C\u3002","The update result could not be confirmed. Check the installed version in the plugin manager before continuing."],BOOT_VERSION_INVALID:["\u7EF4\u62A4\u7248\u672C\u5FC5\u987B\u4F7F\u7528 X.Y.Z \u7A33\u5B9A\u7248\u672C\u53F7\u3002","Release versions must use a stable X.Y.Z version number."],BOOT_TELEMETRY_CONSENT_FIELDS:["\u6570\u636E\u5171\u4EAB\u6388\u6743\u5B57\u6BB5\u65E0\u6548\u3002","The data-sharing authorization fields are invalid."],BOOT_TELEMETRY_UNCONFIGURED:["\u5F00\u53D1\u8005\u5C1A\u672A\u914D\u7F6E\u6570\u636E\u63A5\u6536\u670D\u52A1\uFF0C\u5F53\u524D\u4E0D\u4F1A\u53D1\u9001\u4EFB\u4F55\u6570\u636E\u3002","The developer has not configured a collector. No data is currently sent."],BOOT_TELEMETRY_VERSION_UNAVAILABLE:["\u6682\u65F6\u65E0\u6CD5\u8BFB\u53D6\u63D2\u4EF6\u7248\u672C\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002","The plugin version is unavailable. Please try again later."],BOOT_TELEMETRY_AUTHORIZATION_REQUIRED:["\u8BF7\u9605\u8BFB\u5E76\u660E\u786E\u540C\u610F\u5F53\u524D\u7248\u672C\u7684\u6570\u636E\u5171\u4EAB\u8BF4\u660E\u3002","Read and explicitly agree to the current data-sharing notice."],BOOT_TELEMETRY_DELETION_PENDING:["\u6B64\u524D\u7684\u6570\u636E\u5220\u9664\u8BF7\u6C42\u5C1A\u672A\u5B8C\u6210\uFF0C\u8BF7\u5148\u91CD\u8BD5\u5220\u9664\u3002","The previous deletion request is incomplete. Retry deletion first."],BOOT_TELEMETRY_COLLECTOR_CHANGED:["\u6570\u636E\u63A5\u6536\u670D\u52A1\u5DF2\u53D8\u66F4\uFF0C\u8BF7\u5148\u505C\u6B62\u5171\u4EAB\u5E76\u5220\u9664\u539F\u670D\u52A1\u4E2D\u7684\u6570\u636E\u3002","The collector has changed. Stop sharing and delete data from the previous collector first."],BOOT_TELEMETRY_CONSENT:["\u6570\u636E\u5171\u4EAB\u6388\u6743\u672A\u5B8C\u6210\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002","Data-sharing authorization did not complete. Please try again later."]}),ls=Object.freeze(Object.keys(tt));function rt(e){if(Object.hasOwn(zt,e))return zt[e];let n;return(n=/^不支持的设置：(.+)$/.exec(e))?`Unsupported setting: ${n[1]}`:(n=/^(.+) 必须是开关。$/.exec(e))?`${n[1]} must be a boolean.`:(n=/^(图片|视频)不能超过 (\d+) MB。$/.exec(e))?`${n[1]==="\u56FE\u7247"?"Images":"Videos"} cannot exceed ${n[2]} MB.`:(n=/^默认设置已恢复，但自定义文件尚未全部清理。请再次恢复默认重试(?:（(.+)）)?。$/.exec(e))?`Default settings were restored, but some custom files remain. Restore defaults again${n[1]?` (${n[1]})`:""}.`:(n=/^暂时无法检查更新：([\s\S]+)$/.exec(e))?`Could not check for updates: ${rt(n[1])}`:(n=/^npm 注册表返回 HTTP (\d+)。$/.exec(e))?`The npm registry returned HTTP ${n[1]}.`:(n=/^维护服务返回 HTTP (\d+)。$/.exec(e))?`The update service returned HTTP ${n[1]}.`:(n=/^(npm )?更新包下载失败（HTTP (\d+)）。$/.exec(e))?`${n[1]?"The npm update package":"The update package"} download failed (HTTP ${n[2]}).`:(n=/^Harness 更新请求失败（HTTP (\d+)）。$/.exec(e))?`The Harness update request failed (HTTP ${n[1]}).`:(n=/^请求失败 \((\d+)\)$/.exec(e))?`Request failed (${n[1]})`:(n=/^连接失败：([\s\S]+)。请重启 Harness 后重试。$/.exec(e))?`Connection failed: ${rt(n[1])}. Restart Harness and try again.`:e}r(rt,"englishMessage");function ze(e){let n=e&&typeof e=="object"?e.code||e.errorCode:null,t=Object.hasOwn(tt,n)?tt[n]:null,i=String(e&&typeof e=="object"?e.message||e.error||"":e??"");if(t){let[s,d]=t;return Me()==="en"?d:s}return Me()==="en"?rt(i):i}r(ze,"localizeMessage");function ne(){let e=wn(),n=(0,Dt.useSyncExternalStore)(e.subscribe,e.getSnapshot,()=>"zh");return(t,i)=>n==="en"?i:t}r(ne,"useI18n");var pn=`${ln}:open`,Hn=`${ln}:play`,Pe={bootClaimed:!1,request:null,telemetryRequest:null,decisionSettled:!1},Ve=null,De=new Set,st="1.4.3";function ke(e){return Ve=e,De.forEach(n=>n(e)),e}r(ke,"publish");function Bn(){en().openControllerSettings(_e)||window.dispatchEvent(new Event(pn))}r(Bn,"openSettings");function Un(e,n,t=!1,i=!1){window.dispatchEvent(new CustomEvent(Hn,{detail:{clip:e,settings:n,endOnly:t,clipOnly:i}}))}r(Un,"preview");var E=ye(require("react"),1);var Rt=require("react");var Rn=`

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
.bs-sharing-dialog {max-height:calc(100dvh - 32px);overflow:auto}
.bs-sharing-dialog .bs-sharing-card {max-width:620px;padding-top:36px}
.bs-sharing-notice {font-size:calc(var(--bs-f)*.8571);line-height:1.75;color:var(--bs-secondary)}
.bs-sharing-notice h3 {font-size:1em;color:var(--bs-text);margin:16px 0 8px}
.bs-sharing-notice ul {padding-left:1.5em;margin:8px 0}
.bs-sharing-notice p {margin:12px 0}
.bs-sharing-consent {display:flex;align-items:flex-start;gap:9px;margin:18px 0;font-size:calc(var(--bs-f)*.8571);line-height:1.6}
.bs-sharing-consent input {flex:0 0 auto;margin:5px 0 0;accent-color:var(--bs-accent)}
.bs-sharing-unconfigured {padding:12px;border:1px solid var(--bs-line);border-radius:10px;color:var(--bs-secondary);font-size:calc(var(--bs-f)*.8571);line-height:1.6}
.bs-sharing-endpoint {overflow-wrap:anywhere;color:var(--bs-tertiary);font-size:calc(var(--bs-f)*.7857)}
.bs-sharing-active {color:var(--bs-accent);font-size:calc(var(--bs-f)*.8571);line-height:1.6}

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
`;var Ht="dsh-boot-studio-style",Bt=2026102603;function Nr(e){let n=2166136261;for(let t=0;t<e.length;t++)n=Math.imul(n^e.charCodeAt(t),16777619);return(n>>>0).toString(16)}r(Nr,"fingerprint");function Ut(e){if(!e?.head)return null;let n=e.getElementById(Ht);return n||(n=e.createElement("style"),n.id=Ht,e.head.appendChild(n)),(Number(n.getAttribute("data-lewis-style-revision"))||0)>Bt||(n.textContent!==Rn&&(n.textContent=Rn),n.setAttribute("data-lewis-style-revision",String(Bt)),n.setAttribute("data-lewis-style-fingerprint",Nr(Rn))),n}r(Ut,"ensureStudioStyles");function xe(){(0,Rt.useLayoutEffect)(()=>{Ut(document)},[])}r(xe,"useStudioStyles");var de=ye(require("react"),1);var D=ye(require("react"),1);var fn=require("react");function be(){let e=en(),n=Ct(document),[t,i]=(0,fn.useState)(()=>e.getSnapshot()),[s,d]=(0,fn.useState)(()=>n.getSnapshot());return(0,fn.useLayoutEffect)(()=>{let u=r(()=>i(e.getSnapshot()),"refresh"),f=e.subscribe(u);return u(),f},[e]),(0,fn.useLayoutEffect)(()=>{let u=r(()=>d(n.getSnapshot()),"refresh"),f=n.subscribe(u);return u(),f},[n]),Nt(t.theme,s)}r(be,"useEnchantAppearance");var at=ye(require("react"),1);function Ze(){return at.default.createElement("svg",{className:"bs-close-icon",viewBox:"0 0 24 24",width:"14",height:"14",fill:"none",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round","aria-hidden":"true",focusable:"false"},at.default.createElement("path",{d:"m6 6 12 12M18 6 6 18"}))}r(Ze,"CloseIcon");var tn=ye(require("react"),1);var it=r(e=>`${(e/1e6).toFixed(2)} MB`,"mb");function qt({progress:e={},completed:n=!1}){let t=ne(),i=n?"complete":e.phase,s=i==="downloading",d=Number.isFinite(e.totalBytes)&&e.totalBytes>0,u=Number.isFinite(e.downloadedBytes)&&e.downloadedBytes>=0?e.downloadedBytes:0,f=s&&d,o=e.fromCache===!0,l=n?100:f?Math.min(99,Math.max(0,Math.floor(u/e.totalBytes*100))):null,m=n?t("\u66F4\u65B0\u5B8C\u6210","Update complete"):i==="install"?t("\u6B63\u5728\u5E94\u7528\u66F4\u65B0","Applying update"):i==="verifying"?o?t("\u6B63\u5728\u6821\u9A8C\u7F13\u5B58","Verifying cached update"):t("\u6B63\u5728\u6821\u9A8C\u66F4\u65B0\u5305","Verifying update package"):i==="ready"?t("\u66F4\u65B0\u5305\u5DF2\u5C31\u7EEA","Update package ready"):s?t("\u6B63\u5728\u4E0B\u8F7D\u66F4\u65B0\u5305","Downloading update package"):t("\u6B63\u5728\u51C6\u5907\u66F4\u65B0","Preparing update"),c;n?c=t("\u89C6\u9891\u3001\u56FE\u7247\u548C\u8BBE\u7F6E\u5DF2\u4FDD\u7559","Videos, images and settings have been kept"):s?c=`${it(u)}${d?` / ${it(e.totalBytes)}`:t(" \xB7 \u6B63\u5728\u63A5\u6536"," \xB7 Receiving")}`:i==="verifying"?c=o?t("\u6B63\u5728\u68C0\u67E5\u7F13\u5B58\u66F4\u65B0\u5305\u7684\u5B8C\u6574\u6027\u3002","Checking cached package integrity."):t("\u4E0B\u8F7D\u5DF2\u5B8C\u6210\uFF0C\u6B63\u5728\u68C0\u67E5\u5B89\u88C5\u5305\u7684\u5B8C\u6574\u6027\u3002","Download complete. Checking package integrity."):i==="ready"||i==="install"?(c=o?t("\u590D\u7528\u5DF2\u6821\u9A8C\u66F4\u65B0\u5305\uFF0C\u65E0\u9700\u91CD\u590D\u4E0B\u8F7D\u3002","Reusing the verified update package. No download needed."):i==="ready"?t("\u66F4\u65B0\u5305\u6821\u9A8C\u5B8C\u6210\uFF0C\u6B63\u5728\u51C6\u5907\u5B89\u88C5\u3002","Package verified. Preparing to install."):"",i==="install"&&(c+=`${c?" ":""}${t("\u6B63\u5728\u901A\u8FC7 Harness \u5B89\u5168\u5E94\u7528\u66F4\u65B0\uFF0C\u8BF7\u7A0D\u5019\u3002","Applying the update through Harness. Please wait.")}`)):c=t("\u6B63\u5728\u8FDE\u63A5\u66F4\u65B0\u670D\u52A1\uFF0C\u8BF7\u7A0D\u5019\u3002","Connecting to the update service. Please wait."),!n&&!s&&d&&(c=`${it(e.totalBytes)} \xB7 ${c}`);let w=n?void 0:s?`${u}${d?` / ${e.totalBytes}`:""}`:d?String(e.totalBytes):void 0;return tn.default.createElement("div",{className:"bs-update-progress","data-testid":"update-progress","data-phase":i||"prepare"},tn.default.createElement("div",{className:"bs-update-progress-heading"},tn.default.createElement("span",null,m),l!==null&&tn.default.createElement("strong",null,l,"%")),tn.default.createElement("progress",{"aria-label":n?t("\u66F4\u65B0\u5B8C\u6210","Update complete"):s?t("\u66F4\u65B0\u5305\u4E0B\u8F7D\u8FDB\u5EA6","Update package download progress"):m,max:"100",...l!==null?{value:l}:{}}),tn.default.createElement("div",{className:"bs-update-progress-detail",title:w===void 0?void 0:`${w} ${t("\u5B57\u8282","bytes")}`},c))}r(qt,"UpdateProgress");function qn({request:e,status:n={},onDismiss:t,onUpdated:i,preview:s=!1,kind:d="update",checkError:u,install:f}){let o=ne();xe();let l=be(),m=(0,D.useRef)(null),c=(0,D.useRef)(!0),w=(0,D.useRef)(!1),[h,A]=(0,D.useState)(!1),[I,y]=(0,D.useState)({phase:"prepare",downloadedBytes:0,totalBytes:null}),[R,B]=(0,D.useState)(""),[O,V]=(0,D.useState)(()=>d==="update"?St(n):null),M=(0,D.useCallback)(()=>{w.current||(O&&!s&&i?.(O.version,O.result),t?.())},[O,t,i,s]);(0,D.useEffect)(()=>{c.current=!0;let C=m.current,F=document.activeElement;return typeof C.showModal=="function"?C.open||C.showModal():C.setAttribute("open",""),()=>{c.current=!1,C.open&&typeof C.close=="function"&&C.close(),F?.isConnected&&F.focus?.()}},[]);async function P(){if(!(s||w.current||O||R?.uncertain||!Le(n))){w.current=!0,A(!0),B("");try{let C=await Xn(e,n,{install:f,onProgress:r(F=>{c.current&&y(F)},"onProgress")});c.current&&V(C)}catch(C){c.current&&B(C||"\u66F4\u65B0\u672A\u5B8C\u6210\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002")}finally{w.current=!1,c.current&&A(!1)}}}r(P,"accept");let a=d==="error",$=d==="current",re=typeof n.manifest?.releaseNotes=="string"?n.manifest.releaseNotes:"",me=typeof n.manifest?.releaseNotesEn=="string"&&n.manifest.releaseNotesEn.trim()?n.manifest.releaseNotesEn:re,pe=o(re,me),g=$?o("\u5DF2\u7ECF\u662F\u6700\u65B0\u7248\u672C","You are up to date"):a?o("\u6682\u65F6\u65E0\u6CD5\u68C0\u67E5\u66F4\u65B0\u3002","Unable to check for updates."):O?o("\u65B0\u7684\u5F00\u573A\uFF0C\u5DF2\u51C6\u5907\u5C31\u7EEA\u3002","Your new opening is ready."):o("\u51C6\u5907\u597D\u65B0\u7684\u5F00\u573A","A new opening awaits"),x=$?o("\u4F60\u7684\u5F00\u673A\u52A8\u753B\u5DF2\u662F\u6700\u65B0\uFF0C\u5FEB\u53BB\u4F53\u9A8C\u5427","Your startup animation is up to date. Enjoy!"):a?ze(u||(n.message?n:o("\u8BF7\u68C0\u67E5\u7F51\u7EDC\u8FDE\u63A5\uFF0C\u7A0D\u540E\u518D\u8BD5\u3002","Check your network connection and try again later."))):s?o("\u8FD9\u91CC\u53EA\u9884\u89C8\u5F39\u7A97\u5916\u89C2\uFF0C\u4E0D\u4F1A\u4E0B\u8F7D\u6216\u5B89\u88C5\u66F4\u65B0\u3002","This preview only shows the dialog. No updates will be downloaded or installed."):O?o("\u66F4\u65B0\u5DF2\u5B8C\u6210\uFF0C\u8BF7\u5B8C\u5168\u9000\u51FA\u5E76\u91CD\u65B0\u6253\u5F00 Harness\uFF0C\u4EE5\u5E94\u7528\u65B0\u7248\u672C\u3002","Update complete. Fully quit and reopen Harness to apply the new version."):o("\u53D1\u73B0\u5F00\u673A\u52A8\u753B\u7684\u65B0\u7248\u672C\uFF0C\u4E3A\u4E0B\u4E00\u6B21\u542F\u52A8\u6DFB\u4E00\u70B9\u65B0\u610F","A new startup animation version is available for your next launch.");return D.default.createElement("dialog",{ref:m,className:"bs-startup-update","data-testid":"startup-update","data-kind":d,"data-preview":s||void 0,...l,"aria-labelledby":"bs-startup-update-title","aria-describedby":"bs-startup-update-description",onCancel:C=>{C.preventDefault(),M()}},D.default.createElement("div",{className:"bs-startup-update-card"},D.default.createElement("button",{className:"bs-startup-update-close",type:"button","aria-label":o("\u5173\u95ED\u66F4\u65B0\u63D0\u793A","Close update notification"),disabled:h,onClick:M},D.default.createElement(Ze,null)),D.default.createElement("div",{className:"bs-startup-update-glyph","aria-hidden":"true"},$?"\u2713":a?"!":"\u2727"),D.default.createElement("p",{className:"bs-startup-update-brand"},"DSH LEWIS ENCHANTMENT",s&&D.default.createElement("span",null,o(" \xB7 \u66F4\u65B0\u63D0\u9192\u5916\u89C2\u9884\u89C8"," \xB7 Update notification preview"))),D.default.createElement("h2",{id:"bs-startup-update-title"},g),D.default.createElement("p",{id:"bs-startup-update-description",className:"bs-startup-update-copy"},x),$?D.default.createElement("div",{className:"bs-startup-update-versions"},D.default.createElement("strong",null,n.currentVersion?`v${n.currentVersion}`:o("\u7248\u672C\u4FE1\u606F\u6682\u4E0D\u53EF\u7528","Version unavailable")),D.default.createElement("span",null,o("\u5F53\u524D\u7248\u672C","Current version"))):!a&&D.default.createElement("div",{className:"bs-startup-update-versions"},D.default.createElement("span",null,n.currentVersion?`v${n.currentVersion}`:o("\u5F53\u524D\u7248\u672C","Current version")),D.default.createElement("span",{"aria-hidden":"true"},"\u2192"),D.default.createElement("strong",null,n.latestVersion?`v${n.latestVersion}`:s?o("\u540E\u7EED\u7248\u672C","Future version"):o("\u65B0\u7248\u672C","New version"))),!a&&!$&&!h&&!O&&D.default.createElement("div",{className:"bs-release-notes","aria-label":o("\u672C\u6B21\u66F4\u65B0","What\u2019s new")},D.default.createElement("h3",null,o("\u672C\u6B21\u66F4\u65B0","What\u2019s new")),pe.trim()?D.default.createElement("p",null,pe):D.default.createElement("p",{className:"bs-release-notes-empty"},s?o("\u66F4\u65B0\u8BF4\u660E\u5F85\u4F5C\u8005\u586B\u5199\uFF08\u4EC5\u672C\u5730\u9884\u89C8\uFF09","Awaiting the author\u2019s release notes (local preview only)"):o("\u6B64\u7248\u672C\u672A\u63D0\u4F9B\u66F4\u65B0\u8BF4\u660E\u3002","No release notes were provided for this version."))),!a&&!$&&!O&&D.default.createElement("p",{className:"bs-startup-update-restart"},o("\u66F4\u65B0\u5B8C\u6210\u540E\uFF0C\u8BF7\u5B8C\u5168\u9000\u51FA\u5E76\u91CD\u65B0\u6253\u5F00 Harness\uFF0C\u4EE5\u5E94\u7528\u65B0\u7248\u672C\u3002","After updating, fully quit and reopen Harness to apply the new version.")),!a&&!$&&!O&&D.default.createElement("p",{className:"bs-startup-update-retain"},o("\u4F60\u7684\u89C6\u9891\u3001\u56FE\u7247\u548C\u8BBE\u7F6E\u90FD\u4F1A\u4FDD\u7559","Your videos, images and settings will be kept")),(h||O)&&D.default.createElement(qt,{progress:I,completed:!!O}),R&&D.default.createElement("p",{className:"bs-startup-update-error",role:"alert"},ze(R)),R?.code?.startsWith("BOOT_HARNESS_INSTALL")&&vt()&&D.default.createElement("button",{type:"button",disabled:h,onClick:()=>{yt(n.packageName)&&t?.()}},o("\u6253\u5F00\u63D2\u4EF6\u7BA1\u7406","Open plugin manager")),D.default.createElement("div",{className:"bs-startup-update-actions"},$||a?D.default.createElement("button",{className:"bs-startup-update-primary",type:"button",onClick:M},o("\u77E5\u9053\u4E86","Got it")):s?D.default.createElement("button",{className:"bs-startup-update-primary",type:"button",onClick:M},o("\u5173\u95ED\u9884\u89C8","Close preview")):O?D.default.createElement("button",{className:"bs-startup-update-primary",type:"button",disabled:h,onClick:M},o("\u77E5\u9053\u4E86","Got it")):D.default.createElement(D.default.Fragment,null,D.default.createElement("button",{type:"button",disabled:h,onClick:M},o("\u7A0D\u540E\u518D\u8BF4","Later")),!R?.uncertain&&D.default.createElement("button",{className:"bs-startup-update-primary",type:"button",disabled:h,onClick:P},h?o("\u6B63\u5728\u66F4\u65B0\u2026","Updating\u2026"):R?o("\u91CD\u8BD5\u66F4\u65B0","Retry update"):o(`\u66F4\u65B0\u5230 ${n.latestVersion}`,`Update to ${n.latestVersion}`))))))}r(qn,"UpdatePrompt");function Vt({request:e,standalone:n=!1,install:t}){let i=ne(),[s,d]=(0,de.useState)(null),[u,f]=(0,de.useState)(!1),[o,l]=(0,de.useState)(null);(0,de.useEffect)(()=>{let w=!0;return e("/updates/status").then(h=>{w&&d(h)}).catch(()=>{}),()=>{w=!1}},[e]);async function m(){if(!u){f(!0);try{Qn(e);let w=await e("/updates/check",{method:"POST",body:"{}"});d(w),l({kind:Le(w)?"update":w?.channelReady?"current":"error",status:w})}catch(w){d(h=>({...h,available:!1,channelReady:!1})),l({kind:"error",status:s||{},message:w||"\u6682\u65F6\u65E0\u6CD5\u68C0\u67E5\u66F4\u65B0\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002"})}finally{f(!1)}}}r(m,"check");function c(w){qe.updated(w),d(h=>({...h,available:!1,currentVersion:w}))}return r(c,"updated"),de.default.createElement("div",{className:"bs-update-area","data-testid":"update-panel"},de.default.createElement("div",{className:"bs-section-title"},de.default.createElement("h2",null,i("\u7248\u672C\u4E0E\u66F4\u65B0","Version and updates")),de.default.createElement("span",null,s?.currentVersion?`v${s.currentVersion}`:"DSH LEWIS ENCHANTMENT")),de.default.createElement("div",{className:"bs-update-card"},de.default.createElement("div",null,de.default.createElement("strong",null,i("\u4E00\u6B21\u5B89\u88C5\uFF0C\u6301\u7EED\u7115\u65B0","Install once, keep it fresh")),de.default.createElement("p",null,i("\u66F4\u65B0\u4F1A\u4FDD\u7559\u4F60\u7684\u89C6\u9891\u3001\u7ED3\u675F\u56FE\u7247\u548C\u64AD\u653E\u504F\u597D\u3002","Updates keep your videos, end screen images and playback preferences.")),n&&de.default.createElement("small",null,i("\u5F53\u524D\u4E3A\u72EC\u7ACB\u9884\u89C8\uFF0C\u68C0\u67E5\u7ED3\u679C\u4EC5\u7528\u4E8E\u5C55\u793A\u3002","This is a standalone preview. Update results are for display only."))),de.default.createElement("div",{className:"bs-update-actions"},de.default.createElement("button",{type:"button",disabled:u,onClick:m},u?i("\u6B63\u5728\u68C0\u67E5\u2026","Checking\u2026"):Le(s)?i("\u67E5\u770B\u66F4\u65B0","View update"):s?.channelReady?i("\u5DF2\u662F\u6700\u65B0","Up to date"):i("\u68C0\u67E5\u66F4\u65B0","Check for updates")))),o&&de.default.createElement(qn,{request:e,status:o.status,kind:o.kind,checkError:o.message,install:t,preview:n&&o.kind==="update"&&!t,onDismiss:()=>l(null),onUpdated:c}))}r(Vt,"UpdatePanel");var K=ye(require("react"),1);function Ft({onCancel:e,onConfirm:n}){let t=ne();xe();let i=be(),s=(0,K.useRef)(null),d=(0,K.useRef)(null),u=(0,K.useRef)(!0),f=(0,K.useRef)(!1),[o,l]=(0,K.useState)(!1),[m,c]=(0,K.useState)("");(0,K.useEffect)(()=>{u.current=!0;let A=s.current,I=document.activeElement;return typeof A.showModal=="function"?A.open||A.showModal():A.setAttribute("open",""),d.current?.focus(),()=>{u.current=!1,A.open&&typeof A.close=="function"&&A.close(),I?.isConnected&&I.focus?.()}},[]);function w(){f.current||e?.()}r(w,"cancel");async function h(){if(!f.current){f.current=!0,l(!0),c("");try{if(typeof n!="function")throw Error("\u6682\u65F6\u65E0\u6CD5\u6062\u590D\u9ED8\u8BA4\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002");await n()}catch(A){u.current&&c(A||"\u6062\u590D\u9ED8\u8BA4\u672A\u5B8C\u6210\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002");return}finally{f.current=!1,u.current&&l(!1)}u.current&&e?.()}}return r(h,"confirm"),K.default.createElement("dialog",{ref:s,className:"bs-startup-update bs-reset-dialog","data-testid":"reset-dialog",...i,"aria-labelledby":"bs-reset-title","aria-describedby":"bs-reset-description bs-reset-warning","aria-busy":o,onCancel:A=>{A.preventDefault(),w()}},K.default.createElement("div",{className:"bs-startup-update-card bs-reset-card"},K.default.createElement("button",{className:"bs-startup-update-close",type:"button","aria-label":t("\u53D6\u6D88\u6062\u590D\u9ED8\u8BA4","Cancel reset"),disabled:o,onClick:w},K.default.createElement(Ze,null)),K.default.createElement("div",{className:"bs-startup-update-glyph bs-reset-glyph","aria-hidden":"true"},"\u21BA"),K.default.createElement("p",{className:"bs-startup-update-brand"},"DSH LEWIS ENCHANTMENT"),K.default.createElement("h2",{id:"bs-reset-title"},t("\u56DE\u5230\u6700\u521D\u7684\u5F00\u573A\uFF1F","Back to the original opening?")),K.default.createElement("p",{id:"bs-reset-description",className:"bs-startup-update-copy"},t("\u6062\u590D\u9ED8\u8BA4\u540E\uFF0C\u5F00\u673A\u52A8\u753B\u5C06\u56DE\u5230\u5B89\u88C5\u65F6\u7684\u72B6\u6001\u3002","Reset the startup animation to its original settings.")),K.default.createElement("div",{className:"bs-startup-update-summary bs-reset-summary"},K.default.createElement("p",null,t("\u5220\u9664\u5168\u90E8\u4E0A\u4F20\u7684\u89C6\u9891\u548C\u56FE\u7247","Delete all uploaded videos and images")),K.default.createElement("p",null,t("\u91CD\u7F6E\u64AD\u653E\u3001\u58F0\u97F3\u53CA\u7ED3\u675F\u753B\u9762\u7B49\u504F\u597D","Reset playback, sound and end screen preferences")),K.default.createElement("p",null,t("\u91CD\u7F6E\u4FA7\u680F\u5FEB\u6377\u5165\u53E3","Reset the sidebar shortcut"))),K.default.createElement("p",{className:"bs-startup-update-retain bs-reset-retain"},t("\u5B89\u88C5\u5305\u81EA\u5E26\u7684\u52A8\u753B\u548C\u5C01\u9762\u4F1A\u4FDD\u7559\u3002","Built-in animations and covers will be kept.")),K.default.createElement("p",{id:"bs-reset-warning",className:"bs-reset-warning"},t("\u6B64\u64CD\u4F5C\u4E0D\u53EF\u64A4\u9500\uFF0C\u8BF7\u5148\u5907\u4EFD\u9700\u8981\u4FDD\u7559\u7684\u7D20\u6750\u3002","This cannot be undone. Back up any media you want to keep first.")),o&&K.default.createElement("p",{className:"bs-startup-update-status",role:"status","aria-live":"polite"},t("\u6B63\u5728\u79FB\u9664\u81EA\u5B9A\u4E49\u7D20\u6750\u5E76\u6062\u590D\u9ED8\u8BA4\u2026","Removing custom media and restoring defaults\u2026")),m&&K.default.createElement("p",{className:"bs-startup-update-error",role:"alert"},ze(m)),K.default.createElement("div",{className:"bs-startup-update-actions bs-reset-actions"},K.default.createElement("button",{ref:d,type:"button",autoFocus:!0,disabled:o,onClick:w},t("\u53D6\u6D88","Cancel")),K.default.createElement("button",{className:"bs-reset-confirm",type:"button",disabled:o,onClick:h},o?t("\u6B63\u5728\u6062\u590D\u2026","Resetting\u2026"):t("\u786E\u8BA4\u6062\u590D\u9ED8\u8BA4","Restore defaults")))))}r(Ft,"ResetDialog");var ge=ye(require("react"),1);function jt({onClose:e}){let n=ne();xe();let t=be(),i=(0,ge.useRef)(null),s=(0,ge.useRef)(null),[d,u]=(0,ge.useState)(!1);(0,ge.useEffect)(()=>{let o=i.current,l=document.activeElement;return typeof o.showModal=="function"?o.open||o.showModal():o.setAttribute("open",""),s.current?.focus(),()=>{o.open&&typeof o.close=="function"&&o.close(),l?.isConnected&&l.focus?.()}},[]);function f(o){if(o.target!==o.currentTarget)return;let l=o.currentTarget.getBoundingClientRect();(o.clientX<l.left||o.clientX>l.right||o.clientY<l.top||o.clientY>l.bottom)&&e()}return r(f,"backdropClick"),ge.default.createElement("dialog",{ref:i,className:"bs-startup-update bs-author-dialog","data-testid":"author-dialog",...t,"aria-label":n("\u4F5C\u8005\u56FE\u7247","Author image"),onCancel:o=>{o.preventDefault(),e()},onClick:f},ge.default.createElement("div",{className:"bs-startup-update-card bs-author-card"},ge.default.createElement("button",{ref:s,className:"bs-startup-update-close",type:"button","aria-label":n("\u5173\u95ED\u4F5C\u8005\u4FE1\u606F","Close author information"),onClick:e},ge.default.createElement(Ze,null)),d?ge.default.createElement("span",{className:"bs-visually-hidden",role:"alert"},n("\u56FE\u7247\u6682\u65F6\u65E0\u6CD5\u663E\u793A\uFF0C\u8BF7\u5173\u95ED\u540E\u91CD\u8BD5\u3002","The image is unavailable. Close this dialog and try again.")):ge.default.createElement("div",{className:"bs-author-image-frame"},ge.default.createElement("img",{className:"bs-author-image",src:`${Ue}/author-image`,alt:n("\u4F5C\u8005\u63D0\u4F9B\u7684\u5FAE\u4FE1\u6536\u6B3E\u7801","WeChat payment QR code provided by the author"),onError:()=>u(!0)}))))}r(jt,"AuthorDialog");var _=ye(require("react"),1);var Vn=null;function Gt(e){return Vn=e,()=>{Vn===e&&(Vn=null)}}r(Gt,"bindTelemetryRuntime");function Sn(){let e=null;try{e=Vn?.modules?.manifest?.release?.version}catch{}return{harnessVersion:typeof e=="string"&&e.length<=64?e:null,locale:document.documentElement.lang||navigator.language||"unknown"}}r(Sn,"telemetryMetadata");function Wt({onClose:e,onStatus:n}){let t=ne();xe();let i=be(),s=(0,_.useRef)(null),d=(0,_.useRef)(null),u=(0,_.useRef)(!0),f=(0,_.useRef)(!1),o=(0,_.useRef)({sequence:0}),[l,m]=(0,_.useState)(null),[c,w]=(0,_.useState)(!1),[h,A]=(0,_.useState)(!1),[I,y]=(0,_.useState)(""),[R,B]=(0,_.useState)(!1);(0,_.useEffect)(()=>{u.current=!0;let x=!0,C=new AbortController,F=o.current,q=s.current,ve=document.activeElement;return typeof q.showModal=="function"?q.open||q.showModal():q.setAttribute("open",""),d.current?.focus(),te("/telemetry",{signal:C.signal}).then(Q=>{x&&(m(Q),n?.(Q))}).catch(()=>{x&&y("load")}),()=>{x=!1,u.current=!1,F.sequence++,C.abort(),q.open&&typeof q.close=="function"&&q.close(),ve?.isConnected&&ve.focus?.()}},[n]);let O=!!(l?.enabled&&(l.reporting||l.lastResult==null));(0,_.useEffect)(()=>{if(!O||h)return;let x=!0,C,F,q=o.current.sequence;B(!1);let ve=r(()=>x&&u.current&&o.current.sequence===q,"current");function Q(){x=!1,clearTimeout(C),F?.abort(),clearTimeout(se)}r(Q,"stop");let se=setTimeout(()=>{ve()&&B(!0),Q()},9e4);function an(){C=setTimeout(async()=>{if(ve()){F=new AbortController;try{let ae=await te("/telemetry",{signal:F.signal});if(!ve())return;m(ae),n?.(ae),ae.enabled&&(ae.reporting||ae.lastResult==null)?an():Q()}catch{ve()&&y("refresh"),Q()}}},1e3)}return r(an,"schedule"),an(),Q},[O,h,n]);async function V(x,C){if(f.current)return;f.current=!0;let F=++o.current.sequence;A(!0),y(""),B(!1);try{let q=await te(x,{method:"POST",body:JSON.stringify(C)});u.current&&F===o.current.sequence&&(m(q),w(!1),n?.(q))}catch{u.current&&F===o.current.sequence&&y("change")}finally{f.current=!1,u.current&&A(!1)}}r(V,"change");let M=r(()=>{f.current||e()},"close"),P=l&&!l.enabled&&l.lastResult?.withdrawn,a=l?.lastResult,$=l?.lastSentAt&&new Date(l.lastSentAt),re=$&&Number.isFinite($.getTime())?$.toLocaleString(t("zh-CN","en-US")):t("\u5C1A\u65E0\u6210\u529F\u4E0A\u62A5","No successful report yet"),me=/^(?:HTTP_[1-5]\d\d|ECONNRESET|ETIMEDOUT|ENOTFOUND|AbortError|TimeoutError|TypeError|Error)$/.test(a?.failureCode||"")?a.failureCode:null,pe=Number.isInteger(a?.httpStatus)&&a.httpStatus>=100&&a.httpStatus<=599?a.httpStatus:null,g=a?.sent===!0?a.accountIdentified===!0?t("\u4E0A\u62A5\u6210\u529F\uFF0C\u5DF2\u8BC6\u522B DeepSeek \u8D26\u6237\u3002","Report sent; the DeepSeek account was identified."):t("\u4E0A\u62A5\u6210\u529F\uFF0C\u4EC5\u5305\u542B\u5B89\u88C5\u6570\u636E\uFF0C\u672A\u8BC6\u522B\u5DF2\u767B\u5F55\u8D26\u6237\u3002","Report sent with installation data only; no signed-in account was identified."):a?.sent===!1?t("\u6700\u8FD1\u4E00\u6B21\u4E0A\u62A5\u672A\u6210\u529F\uFF0C\u53EF\u91CD\u8BD5\u4E0A\u62A5\u3002","The latest report was not sent. You can retry reporting."):null;return _.default.createElement("dialog",{ref:s,className:"bs-startup-update bs-sharing-dialog","data-testid":"data-sharing-dialog",...i,"aria-labelledby":"bs-sharing-title","aria-describedby":"bs-sharing-description bs-sharing-region","aria-busy":h,onCancel:x=>{x.preventDefault(),M()}},_.default.createElement("div",{className:"bs-startup-update-card bs-sharing-card"},_.default.createElement("button",{ref:d,className:"bs-startup-update-close",type:"button",disabled:h,"aria-label":t("\u5173\u95ED\u6570\u636E\u5171\u4EAB\u8BF4\u660E","Close data-sharing notice"),onClick:M},_.default.createElement(Ze,null)),_.default.createElement("p",{className:"bs-startup-update-brand"},"DSH LEWIS ENCHANTMENT"),_.default.createElement("h2",{id:"bs-sharing-title"},t("\u4E0E\u5F00\u53D1\u8005\u5171\u4EAB\u6570\u636E","Share data with the developer")),_.default.createElement("p",{id:"bs-sharing-description",className:"bs-startup-update-copy"},t("\u7531 FerrariLewis \u63A5\u6536\uFF0C\u7528\u4E8E\u4E86\u89E3\u63D2\u4EF6\u4F7F\u7528\u89C4\u6A21\u548C\u7248\u672C\u5206\u5E03\u3002\u9ED8\u8BA4\u5173\u95ED\uFF0C\u62D2\u7EDD\u4E0D\u4F1A\u5F71\u54CD\u4EFB\u4F55\u63D2\u4EF6\u529F\u80FD\u3002","FerrariLewis receives this data to understand plugin usage and version distribution. Sharing is off by default and is optional.")),_.default.createElement("p",{id:"bs-sharing-region",className:"bs-sharing-unconfigured"},t("OpenAI\u4E0D\u652F\u6301\u7684\u5730\u533A\uFF0C\u4E0E\u5F00\u53D1\u8005\u5171\u4EAB\u6570\u636E\u6682\u4E0D\u53EF\u7528\u3002","Sharing data with the developer is currently unavailable in regions not supported by OpenAI.")),_.default.createElement("div",{className:"bs-sharing-notice"},_.default.createElement("h3",null,t("\u4F60\u540C\u610F\u540E\u5C06\u5171\u4EAB","Shared after you agree")),_.default.createElement("ul",null,_.default.createElement("li",null,t("\u5DF2\u767B\u5F55 DeepSeek \u7684\u6635\u79F0\u4E0E\u8D26\u6237\u6807\u8BC6\u3002\u8D26\u6237\u6807\u8BC6\u4F20\u81F3\u63A5\u6536\u670D\u52A1\u540E\u7528\u670D\u52A1\u7AEF\u5BC6\u94A5 HMAC \u53BB\u91CD\uFF0C\u539F\u59CB\u6807\u8BC6\u4E0D\u843D\u76D8\u3002","The signed-in DeepSeek nickname and account ID. The collector derives an HMAC key for deduplication; raw account IDs are not stored.")),_.default.createElement("li",null,t("\u63D2\u4EF6\u53CA Harness \u7248\u672C\u3001\u64CD\u4F5C\u7CFB\u7EDF\u3001\u5904\u7406\u5668\u67B6\u6784\u548C\u754C\u9762\u8BED\u8A00\u3002","Plugin and Harness versions, operating system, processor architecture and interface language.")),_.default.createElement("li",null,t("\u9996\u6B21\u4E0E\u6700\u8FD1\u6D3B\u8DC3\u65F6\u95F4\uFF0C\u4EE5\u53CA\u7528\u4E8E\u53BB\u91CD\u7684\u968F\u673A\u5B89\u88C5\u6807\u8BC6\u3002\u6B63\u5E38\u4F7F\u7528\u4E2D\u6700\u591A\u6BCF\u5929\u81EA\u52A8\u4E0A\u62A5\u4E00\u6B21\u3002","First and most recent activity times and a random installation identifier. Normal automatic reporting is limited to once per day."))),_.default.createElement("p",null,t("\u4E0D\u4F1A\u6536\u96C6\u767B\u5F55\u4EE4\u724C\u3001API Key\u3001\u8054\u7CFB\u65B9\u5F0F\u3001\u804A\u5929\u5185\u5BB9\u6216\u4F59\u989D\uFF1B\u6CA1\u6709\u53EF\u7528\u7684\u4F1A\u5458\u7B49\u7EA7\u63A5\u53E3\uFF0C\u4F1A\u5458\u7B49\u7EA7\u7EDF\u4E00\u672A\u77E5\u3002","Login tokens, API keys, contact information, conversations and balances are excluded. Membership level has no supported data source and remains unknown.")),_.default.createElement("p",null,t("\u672A\u767B\u5F55\u6216\u63A5\u53E3\u4E0D\u53EF\u7528\u65F6\u53EA\u4E0A\u62A5\u5B89\u88C5\u6570\u636E\u3002\u8D26\u6237\u4FE1\u606F\u7531\u5BA2\u6237\u7AEF\u81EA\u62A5\uFF0C\u672A\u7ECF DeepSeek \u8EAB\u4EFD\u9A8C\u8BC1\uFF1B\u8D26\u6237\u6570\u548C\u5B89\u88C5\u6570\u5747\u4E0D\u7B49\u4E8E\u81EA\u7136\u4EBA\u6570\u3002","Without an available signed-in profile, only installation data is reported. Account information is client-reported, not verified by DeepSeek; accounts and installations do not equal people.")),_.default.createElement("p",null,t("\u53EF\u968F\u65F6\u4ECE\u6B64\u5165\u53E3\u505C\u6B62\u5171\u4EAB\u5E76\u8BF7\u6C42\u5220\u9664\u8BE5\u5B89\u88C5\u5173\u8054\u6570\u636E\u3002\u540C\u8D26\u6237\u4ECD\u6709\u5176\u4ED6\u5DF2\u6388\u6743\u5B89\u88C5\u65F6\uFF0C\u5176\u4F59\u5B89\u88C5\u6570\u636E\u4F1A\u4FDD\u7559\u3002","You can stop sharing and request deletion for this installation here. Data from other authorized installations of the same account remains."))),!l&&!I&&_.default.createElement("p",{role:"status"},t("\u6B63\u5728\u8BFB\u53D6\u5171\u4EAB\u72B6\u6001\u2026","Loading sharing status\u2026")),l&&!l.configured&&_.default.createElement("p",{className:"bs-sharing-unconfigured",role:"status"},t("\u5F00\u53D1\u8005\u5C1A\u672A\u914D\u7F6E\u6570\u636E\u63A5\u6536\u670D\u52A1\uFF0C\u5F53\u524D\u4E0D\u4F1A\u53D1\u9001\u4EFB\u4F55\u6570\u636E\u3002","The developer has not configured a collector. No data is currently sent.")),_.default.createElement("p",{className:"bs-sharing-endpoint"},_.default.createElement("a",{href:"https://dsopen-console-lewis.lewiszhouyichen.chatgpt.site",target:"_blank",rel:"noopener noreferrer"},t("\u4F5C\u8005\u540E\u53F0\uFF08\u4EC5\u4F5C\u8005\u53EF\u8BBF\u95EE\uFF09","Author dashboard (author access only)")),_.default.createElement("br",null),t("\u8BF7\u4F7F\u7528\u4F5C\u8005\u7684 OpenAI / ChatGPT \u8D26\u6237\u767B\u5F55\u3002","Sign in with the author's OpenAI / ChatGPT account.")),l?.enabled&&_.default.createElement("div",{className:"bs-sharing-active",role:"status","data-testid":"sharing-report-status"},_.default.createElement("p",null,t("\u6570\u636E\u5171\u4EAB\u5DF2\u5F00\u542F\u3002\u4E4B\u540E\u5C06\u6309\u4E0A\u8FF0\u8303\u56F4\u81EA\u52A8\u4E0A\u62A5\u3002","Sharing is enabled. Future reports follow the scope above.")),(l.reporting||a==null)&&!R&&_.default.createElement("p",null,l.lastSentAt?t("\u6B63\u5728\u4E0A\u62A5\uFF0C\u8BF7\u7A0D\u5019\u2026","Reporting; please wait\u2026"):t("\u9996\u6B21\u4E0A\u62A5\u4E2D\uFF0C\u8BF7\u7A0D\u5019\u2026","Sending the first report; please wait\u2026")),_.default.createElement("p",null,t("\u4E0A\u6B21\u6210\u529F\u4E0A\u62A5\uFF1A","Last successful report: "),re),g&&_.default.createElement("p",null,g),a?.sent===!1&&(me||pe)&&_.default.createElement("p",null,t("\u8BCA\u65AD\u6458\u8981\uFF1A","Diagnostic summary: "),[me,pe&&`HTTP ${pe}`].filter(Boolean).join(" \xB7 ")),R&&_.default.createElement("p",null,t("\u7B49\u5F85\u4E0A\u62A5\u7ED3\u679C\u5DF2\u8D85\u8FC7 90 \u79D2\uFF0C\u8BF7\u7A0D\u540E\u91CD\u65B0\u6253\u5F00\u6B64\u7A97\u53E3\u67E5\u770B\u72B6\u6001\u3002","Waiting for the report exceeded 90 seconds. Reopen this window later to check its status."))),l?.authorizationRequired&&_.default.createElement("p",{role:"status"},t("\u63A5\u6536\u670D\u52A1\u6216\u8BF4\u660E\u5DF2\u53D8\u66F4\uFF0C\u9700\u8981\u91CD\u65B0\u6388\u6743\u3002","The collector or notice changed. Fresh authorization is required.")),l?.withdrawalPending&&_.default.createElement("p",{className:"bs-startup-update-error",role:"status"},t("\u5DF2\u505C\u6B62\u5171\u4EAB\uFF1B\u8FDC\u7A0B\u5220\u9664\u5C1A\u672A\u786E\u8BA4\uFF0C\u8BF7\u91CD\u8BD5\u5220\u9664\u3002","Sharing has stopped. Remote deletion is unconfirmed; retry deletion.")),P&&!l.withdrawalPending&&_.default.createElement("p",{className:"bs-sharing-active",role:"status"},t("\u5DF2\u505C\u6B62\u5171\u4EAB\uFF0C\u5DF2\u786E\u8BA4\u5220\u9664\u8BE5\u5B89\u88C5\u5173\u8054\u7684\u8FDC\u7A0B\u6570\u636E\u3002","Sharing has stopped and deletion of this installation\u2019s remote data is confirmed.")),I&&_.default.createElement("p",{className:"bs-startup-update-error",role:"alert"},I==="load"?t("\u6682\u65F6\u65E0\u6CD5\u8BFB\u53D6\u5171\u4EAB\u72B6\u6001\uFF0C\u8BF7\u5173\u95ED\u540E\u91CD\u8BD5\u3002","Sharing status is unavailable. Close this window and try again."):I==="refresh"?t("\u6682\u65F6\u65E0\u6CD5\u5237\u65B0\u4E0A\u62A5\u72B6\u6001\uFF0C\u8BF7\u7A0D\u540E\u91CD\u65B0\u6253\u5F00\u6B64\u7A97\u53E3\u67E5\u770B\u3002","Report status could not be refreshed. Reopen this window later to check it."):t("\u64CD\u4F5C\u672A\u5B8C\u6210\uFF0C\u8BF7\u68C0\u67E5\u7F51\u7EDC\u8FDE\u63A5\u540E\u91CD\u8BD5\u3002","The operation did not complete. Check your connection and try again.")),l&&!l.enabled&&!l.withdrawalPending&&_.default.createElement("label",{className:"bs-sharing-consent"},_.default.createElement("input",{type:"checkbox",checked:c,onChange:x=>w(x.target.checked),disabled:!l.configured||h}),_.default.createElement("span",null,t("\u6211\u5DF2\u9605\u8BFB\u5E76\u540C\u610F\u4E0A\u8FF0\u6570\u636E\u8303\u56F4\u3001\u7528\u9014\u548C\u64A4\u56DE\u65B9\u5F0F\u3002","I have read and agree to the data scope, purpose and withdrawal process above."))),_.default.createElement("div",{className:"bs-startup-update-actions"},_.default.createElement("button",{type:"button",disabled:h,onClick:M},t("\u5173\u95ED","Close")),l?.enabled&&_.default.createElement("button",{type:"button",disabled:h||!!l.reporting,onClick:()=>V("/telemetry/retry",Sn())},t("\u91CD\u8BD5\u4E0A\u62A5","Retry reporting")),l&&(l.enabled||l.withdrawalPending||l.authorizationRequired)?_.default.createElement("button",{type:"button",disabled:h,onClick:()=>V("/telemetry/withdraw",{})},h?t("\u6B63\u5728\u5904\u7406\u2026","Processing\u2026"):l.withdrawalPending?t("\u91CD\u8BD5\u5220\u9664","Retry deletion"):t("\u505C\u6B62\u5171\u4EAB\u5E76\u8BF7\u6C42\u5220\u9664","Stop sharing and request deletion")):_.default.createElement("button",{type:"button",className:"bs-startup-update-primary",disabled:!l?.configured||!c||h,onClick:()=>V("/telemetry/consent",{confirmed:!0,policyVersion:l.policyVersion,...Sn()})},h?t("\u6B63\u5728\u4FDD\u5B58\u2026","Saving\u2026"):t("\u540C\u610F\u5E76\u5F00\u542F","Agree and enable")))))}r(Wt,"DataSharingDialog");var En=Object.freeze({video:{extension:/\.(mp4|m4v|webm)$/i,maxBytes:209715200,path:"/upload",timeout:"uploadVideo"},image:{extension:/\.(png|jpe?g|webp)$/i,maxBytes:20971520,path:"/end-images",timeout:"uploadImage"}}),bn=r(()=>he("BOOT_REQUEST_CANCELLED","\u8BF7\u6C42\u5DF2\u53D6\u6D88\u3002"),"cancelled"),Ir=3600*1e3;function _r(e,n,t=En[n]?.maxBytes){let i=En[n];if(!i)throw TypeError("Unknown media kind");if(!e||!i.extension.test(e.name||""))throw he(n==="image"?"BOOT_IMAGE_TYPE":"BOOT_VIDEO_TYPE",n==="image"?"\u8BF7\u9009\u62E9\u4E0D\u8D85\u8FC720 MB\u7684PNG\u3001JPEG\u6216WebP\u56FE\u7247\u3002":"\u8BF7\u9009\u62E9 MP4\u3001M4V \u6216 WebM \u89C6\u9891\u3002\u63A8\u8350 MP4\uFF08H.264 / AAC\uFF09\u3002");if(!Number.isFinite(e.size)||e.size<=0||e.size>t)throw he(n==="image"?"BOOT_IMAGE_TOO_LARGE":"BOOT_VIDEO_TOO_LARGE",n==="image"?"\u8BF7\u9009\u62E9\u4E0D\u8D85\u8FC720 MB\u7684PNG\u3001JPEG\u6216WebP\u56FE\u7247\u3002":"\u89C6\u9891\u5E94\u5927\u4E8E 0 \u5B57\u8282\uFF0C\u4E14\u4E0D\u8D85\u8FC7 200 MB\u3002")}r(_r,"validateMediaFile");function Lr(e,n,{signal:t,documentImpl:i=globalThis.document,ImageImpl:s=globalThis.Image,urlImpl:d=globalThis.URL}={}){return new Promise((u,f)=>{if(t?.aborted){f(bn());return}let o,l,m,c=!1,w=r(()=>{clearTimeout(m),t?.removeEventListener("abort",A),o&&(o.onload=o.onloadeddata=o.onerror=null,n==="video"?(o.removeAttribute("src"),o.load()):o.src=""),l&&d.revokeObjectURL(l)},"cleanup"),h=r(y=>{c||(c=!0,w(),y?f(y):u())},"finish"),A=r(()=>h(bn()),"abort"),I=r(()=>h(he(n==="image"?"BOOT_IMAGE_DECODE":"BOOT_VIDEO_DECODE",n==="image"?"\u65E0\u6CD5\u8BFB\u53D6\u8FD9\u5F20\u56FE\u7247\uFF0C\u8BF7\u66F4\u6362\u6709\u6548\u7684PNG\u3001JPEG\u6216WebP\u3002":"\u6D4F\u89C8\u5668\u65E0\u6CD5\u8BFB\u53D6\u6B64\u89C6\u9891\u3002\u8BF7\u8F6C\u6362\u4E3A MP4\uFF08H.264 / AAC\uFF09\u540E\u91CD\u8BD5\u3002")),"fail");try{o=n==="image"?new s:i.createElement("video"),l=d.createObjectURL(e),t?.addEventListener("abort",A,{once:!0}),m=setTimeout(I,n==="image"?1e4:12e3),o.onerror=I,n==="image"?o.onload=()=>h():(o.onloadeddata=()=>h(),o.preload="auto"),o.src=l,n==="video"&&o.load()}catch{I()}})}r(Lr,"probeMediaFile");function Pr(e,n,{signal:t,basePath:i,onProgress:s,xhrFactory:d}){return new Promise((u,f)=>{if(t.aborted){f(bn());return}let o=d(),l=!1,m,c,w=0,h=!1,A=Ce[En[n].timeout],I=r((M,P)=>{l||(l=!0,clearTimeout(m),clearTimeout(c),t.removeEventListener("abort",R),o.onload=o.onerror=o.ontimeout=o.onabort=null,o.upload.onprogress=o.upload.onload=null,M?f(M):u(P))},"finish"),y=r(M=>{if(!l){I(M);try{o.abort()}catch{}}},"stop"),R=r(()=>y(bn()),"abort"),B=r(()=>y(he("BOOT_UPLOAD_TIMEOUT","\u4E0A\u4F20\u7B49\u5F85\u8D85\u65F6\uFF0C\u8BF7\u91CD\u8BD5\u3002")),"timeout"),O=r(()=>{clearTimeout(m),m=setTimeout(B,A)},"touch"),V=r(()=>{l||h||(h=!0,O())},"waitForResponse");t.addEventListener("abort",R,{once:!0}),o.open("POST",i+En[n].path),o.setRequestHeader("x-dsh-boot-studio","1"),o.setRequestHeader("x-file-name",encodeURIComponent(e.name)),o.setRequestHeader("content-type",e.type||"application/octet-stream"),o.upload.onprogress=M=>{if(l||h||!Number.isFinite(M.loaded))return;let P=Math.min(e.size,Math.max(0,M.loaded));P<=w||(w=P,O(),M.lengthComputable&&Number.isFinite(M.total)&&M.total>0&&s?.(Math.min(100,Math.round(P/M.total*100))),P===e.size&&V())},o.upload.onload=V,o.onload=()=>{try{I(null,Nn(o.responseText,{status:o.status,contentType:o.getResponseHeader("content-type")}))}catch(M){I(M)}},o.onerror=()=>I(he("BOOT_UPLOAD_INTERRUPTED","\u4E0A\u4F20\u4E2D\u65AD\uFF0C\u8BF7\u91CD\u8BD5\u3002")),o.ontimeout=B,o.onabort=()=>I(bn());try{O(),c=setTimeout(B,Ir),o.send(e)}catch{I(he("BOOT_UPLOAD_INTERRUPTED","\u4E0A\u4F20\u4E2D\u65AD\uFF0C\u8BF7\u91CD\u8BD5\u3002"))}})}r(Pr,"sendMedia");function $t(e,{kind:n="video",maxBytes:t=En[n]?.maxBytes,basePath:i=Ue,onPhase:s,onProgress:d,probe:u=Lr,xhrFactory:f=r(()=>new XMLHttpRequest,"xhrFactory")}={}){let o=new AbortController;return{promise:Promise.resolve().then(async()=>{if(_r(e,n,t),s?.("probe"),await u(e,n,{signal:o.signal}),o.signal.aborted)throw bn();return s?.("upload"),d?.(0),Pr(e,n,{signal:o.signal,basePath:i,onProgress:d,xhrFactory:f})}),cancel:r(()=>o.abort(),"cancel")}}r($t,"createMediaUpload");var T=ye(require("react"),1);var Fn="M48.8354 10.0479C48.3232 9.79199 48.1025 10.2798 47.8032 10.5278C47.7007 10.6079 47.6143 10.7119 47.5273 10.8076C46.7793 11.624 45.9048 12.1597 44.7622 12.0957C43.0923 12 41.666 12.5356 40.4058 13.8398C40.1377 12.2319 39.2476 11.272 37.8926 10.6558C37.1836 10.3359 36.4668 10.0156 35.9702 9.31982C35.6235 8.82373 35.5293 8.27197 35.356 7.72754C35.2456 7.3999 35.1353 7.06396 34.7651 7.00781C34.3633 6.94385 34.2056 7.2876 34.0479 7.57568C33.418 8.75195 33.1733 10.0479 33.1973 11.3599C33.2524 14.312 34.4736 16.6641 36.8999 18.3359C37.1758 18.5278 37.2466 18.7197 37.1597 19C36.9946 19.5757 36.7974 20.1357 36.624 20.7119C36.5137 21.0801 36.3486 21.1597 35.9624 21C34.6309 20.4321 33.481 19.5918 32.4644 18.5757C30.7393 16.8721 29.1792 14.9917 27.2334 13.52C26.7764 13.1758 26.3193 12.856 25.8467 12.5518C23.8618 10.584 26.1069 8.96777 26.627 8.77588C27.1704 8.57568 26.8159 7.8877 25.0591 7.896C23.3022 7.90381 21.6953 8.50391 19.647 9.30371C19.3477 9.42383 19.0322 9.51172 18.7095 9.58398C16.8501 9.22363 14.9199 9.14355 12.9033 9.37598C9.10596 9.80762 6.07275 11.6396 3.84326 14.7681C1.16455 18.5278 0.53418 22.7998 1.30664 27.2559C2.11768 31.9521 4.46582 35.8398 8.07373 38.8799C11.8159 42.0322 16.1255 43.5762 21.041 43.2803C24.0269 43.104 27.3516 42.6963 31.1016 39.4561C32.0469 39.936 33.0396 40.1279 34.686 40.272C35.9546 40.3921 37.1758 40.208 38.1211 40.0078C39.6021 39.688 39.4995 38.2881 38.9639 38.0322C34.623 35.9678 35.5762 36.8081 34.71 36.1279C36.9155 33.4639 40.2402 30.6958 41.54 21.728C41.6426 21.0161 41.5557 20.5679 41.54 19.9917C41.5322 19.6396 41.6108 19.5039 42.0049 19.4639C43.0923 19.3359 44.1479 19.0317 45.1167 18.4878C47.9292 16.9199 49.064 14.3438 49.3315 11.2559C49.3711 10.7837 49.3237 10.2959 48.8354 10.0479ZM24.3262 37.8398C20.1196 34.4639 18.0791 33.3521 17.2358 33.3999C16.4482 33.4482 16.5898 34.3682 16.7632 34.9678C16.9443 35.5601 17.1812 35.9683 17.5117 36.4878C17.7402 36.832 17.8979 37.3442 17.2832 37.728C15.9282 38.584 13.5728 37.4399 13.4624 37.3838C10.7207 35.7358 8.42822 33.5601 6.81348 30.584C5.25342 27.7197 4.34766 24.6479 4.19775 21.3677C4.1582 20.5757 4.38672 20.2959 5.15869 20.1519C6.17529 19.96 7.22314 19.9199 8.23926 20.0718C12.5327 20.7119 16.1885 22.6719 19.2529 25.7759C21.002 27.5439 22.3252 29.6558 23.6885 31.7202C25.1377 33.9121 26.6978 36 28.6831 37.7119C29.3843 38.312 29.9434 38.7681 30.479 39.104C28.8643 39.2881 26.1699 39.3281 24.3262 37.8398ZM26.3433 24.6001C26.3433 24.248 26.6191 23.9678 26.9658 23.9678C27.0444 23.9678 27.1152 23.9839 27.1782 24.0078C27.2651 24.04 27.3438 24.0879 27.4067 24.1602C27.5171 24.272 27.5801 24.4321 27.5801 24.6001C27.5801 24.9521 27.3042 25.2319 26.9575 25.2319C26.6108 25.2319 26.3433 24.9521 26.3433 24.6001ZM32.6064 27.8799C32.2046 28.0479 31.8027 28.1919 31.4165 28.208C30.8179 28.2397 30.1641 27.9922 29.8096 27.688C29.2583 27.2158 28.8643 26.9521 28.6987 26.1279C28.6279 25.7759 28.6675 25.2319 28.7305 24.9199C28.8721 24.248 28.7144 23.8159 28.2495 23.4238C27.8716 23.104 27.3911 23.0161 26.8633 23.0161C26.666 23.0161 26.4849 22.9277 26.3511 22.856C26.1304 22.7441 25.9492 22.4639 26.1226 22.1201C26.1777 22.0078 26.4458 21.7358 26.5088 21.688C27.2256 21.272 28.0527 21.4077 28.8169 21.7197C29.5259 22.0161 30.0615 22.5601 30.834 23.3281C31.6216 24.2559 31.7632 24.5117 32.2124 25.208C32.5669 25.752 32.8901 26.312 33.1104 26.9521C33.2446 27.3521 33.0713 27.6802 32.6064 27.8799Z";function Yt({state:e,settings:n,busy:t,preview:i,save:s,remove:d,pendingDelete:u,setPendingDelete:f,input:o,upload:l}){let m=ne();return T.default.createElement(T.default.Fragment,null,T.default.createElement("div",{className:"bs-library"},e.clips.map((c,w)=>T.default.createElement("article",{key:c.id,className:`bs-clip ${c.id===n.selectedId?"is-selected":""}`},T.default.createElement("button",{type:"button",className:`bs-thumbnail bs-tone-${w%4}`,"aria-label":m(`\u9884\u89C8 ${fe(c)}`,`Preview ${fe(c)}`),onClick:()=>i(c,n,!1,!0),disabled:t},c.kind==="sequence"?T.default.createElement("div",{className:"bs-sequence-thumb"},T.default.createElement("svg",{viewBox:"0 0 50 50","aria-hidden":"true"},T.default.createElement("path",{d:Fn})),T.default.createElement("span",null,"DEEPSEEK"),T.default.createElement("small",null,"TECHNICAL DOSSIER")):T.default.createElement("video",{src:c.url+"#t=0.4",muted:!0,playsInline:!0,preload:"metadata",tabIndex:-1}),T.default.createElement("span",{className:"bs-thumbnail-shade"}),T.default.createElement("span",{className:"bs-play-icon"},"\u25B6"),T.default.createElement("span",{className:"bs-clip-number"},String(w+1).padStart(2,"0")),T.default.createElement("span",{className:"bs-badge"},c.kind==="sequence"?m("\u7A0B\u5E8F\u52A8\u753B","Animated sequence"):c.source==="builtin"?m("\u5185\u7F6E","Built-in"):m("\u6211\u7684\u89C6\u9891","My video"))),T.default.createElement("div",{className:"bs-clip-info"},T.default.createElement("h3",null,fe(c)),T.default.createElement("span",null,c.kind==="sequence"?m("\u539F\u7248\u89C6\u89C9\u5E8F\u5217","Original visual sequence"):(c.bytes/1048576).toFixed(1)+" MB")),T.default.createElement("div",{className:"bs-clip-actions"},T.default.createElement("button",{type:"button",className:c.id===n.selectedId?"bs-selected":"",onClick:()=>s({selectedId:c.id}),disabled:t||c.id===n.selectedId},c.id===n.selectedId?m("\u2713 \u5F53\u524D\u52A8\u753B","\u2713 Selected"):m("\u4F7F\u7528\u6B64\u52A8\u753B","Use this animation")),c.source==="upload"&&T.default.createElement("button",{className:"bs-delete","aria-label":m(`\u5220\u9664 ${fe(c)}`,`Delete ${fe(c)}`),disabled:t,onClick:()=>f(c)},m("\u79FB\u9664","Remove"))),u?.id===c.id&&T.default.createElement("div",{className:"bs-delete-confirm"},m("\u79FB\u9664\u6B64\u89C6\u9891\uFF1F","Remove this video?"),T.default.createElement("button",{type:"button",disabled:t,onClick:()=>d(c)},m("\u786E\u8BA4\u79FB\u9664","Confirm removal")),T.default.createElement("button",{type:"button",onClick:()=>f(null)},m("\u53D6\u6D88","Cancel"))))),T.default.createElement("button",{type:"button",className:"bs-upload",disabled:t,onClick:()=>o.current?.click(),onDragOver:c=>c.preventDefault(),onDrop:c=>{c.preventDefault(),l(c.dataTransfer.files?.[0])}},T.default.createElement("span",null,"\uFF0B"),T.default.createElement("strong",null,m("\u4E0A\u4F20\u6211\u7684\u89C6\u9891","Upload my video")),T.default.createElement("small",null,m("\u70B9\u51FB\u9009\u62E9\uFF0C\u6216\u5C06\u89C6\u9891\u62D6\u5230\u8FD9\u91CC","Click to select or drop a video here")),T.default.createElement("small",null,"MP4 / WebM / M4V \xB7 \u2264 200 MB"))),e.storage&&e.maxCustomMediaBytes>0&&e.maxCustomMediaFiles>0&&T.default.createElement("p",{className:"bs-hint",role:"status"},m(`\u4E2A\u4EBA\u7D20\u6750\u5DF2\u7528 ${(e.storage.bytes/1048576).toFixed(1)} / ${(e.maxCustomMediaBytes/1048576).toFixed(0)} MB\uFF08${e.storage.files} / ${e.maxCustomMediaFiles} \u4E2A\uFF09\u3002\u89C6\u9891\u4E0E\u56FE\u7247\u5171\u7528\u989D\u5EA6\uFF0C\u79FB\u9664\u4E0D\u7528\u7684\u7D20\u6750\u53EF\u91CA\u653E\u7A7A\u95F4\u3002`,`Custom media: ${(e.storage.bytes/1048576).toFixed(1)} / ${(e.maxCustomMediaBytes/1048576).toFixed(0)} MB (${e.storage.files} / ${e.maxCustomMediaFiles} files). Videos and images share this limit. Remove unused media to free space.`)),T.default.createElement("input",{ref:o,type:"file",accept:".mp4,.m4v,.webm,video/mp4,video/webm","aria-label":m("\u4E0A\u4F20\u5F00\u673A\u89C6\u9891","Upload startup video"),hidden:!0,onChange:c=>{l(c.target.files?.[0]),c.target.value=""}}))}r(Yt,"VideoLibrary");function Zt({state:e,settings:n,busy:t,preview:i,save:s,imageInput:d,uploadEndImage:u,removeEndImage:f,pendingImageDelete:o,setPendingImageDelete:l,EndTitleComponent:m}){let c=ne(),w=r((h={})=>i(null,{...n,...h},!0),"previewEnding");return T.default.createElement(T.default.Fragment,null,T.default.createElement("div",{className:"bs-preferences bs-ending-settings"},T.default.createElement("div",{className:"bs-field bs-ending-header"},T.default.createElement("h2",null,c("\u7ED3\u675F\u505C\u7559\u753B\u9762","Ending screen")),T.default.createElement("select",{"aria-label":c("\u7ED3\u675F\u753B\u9762\u7C7B\u578B","Ending screen type"),disabled:t,value:n.endScreen||"logo",onChange:h=>{if(h.target.value==="image"&&!n.endImageId){d.current?.click();return}s({endScreen:h.target.value})}},T.default.createElement("option",{value:"logo"},c("\u5185\u7F6E\u753B\u9762","Built-in screens")),T.default.createElement("option",{value:"image"},c("\u6211\u7684\u56FE\u7247","My images")))),!!e.logos?.length&&T.default.createElement("div",{className:"bs-logo-options"},e.logos.map(h=>{let A=n.endScreen==="logo"&&n.logoVariant===h.id;return T.default.createElement("article",{className:`bs-end-card ${A?"is-selected":""}`,key:h.id},T.default.createElement("button",{type:"button",className:"bs-end-preview",disabled:t,"aria-label":c(`\u9884\u89C8\u5185\u7F6E\u7ED3\u675F\u753B\u9762 ${fe(h)}`,`Preview built-in ending screen ${fe(h)}`),onClick:()=>w({endScreen:"logo",logoVariant:h.id})},T.default.createElement("img",{src:h.url,alt:"",style:{objectFit:h.fit||"cover"}}),T.default.createElement("span",null,fe(h))),T.default.createElement("div",{className:"bs-clip-actions"},T.default.createElement("button",{type:"button",className:A?"bs-selected":"",disabled:t||A,"aria-pressed":A,"aria-label":c(`\u4F7F\u7528\u5185\u7F6E\u7ED3\u675F\u753B\u9762 ${fe(h)}`,`Use built-in ending screen ${fe(h)}`),onClick:()=>s({endScreen:"logo",logoVariant:h.id})},A?c("\u2713 \u5F53\u524D\u753B\u9762","\u2713 Selected"):c("\u4F7F\u7528\u6B64\u753B\u9762","Use this screen"))))})),T.default.createElement("div",{className:"bs-ending-preview"},T.default.createElement("button",{type:"button",className:"bs-ending-mini",disabled:t,"aria-label":c("\u9884\u89C8\u5F53\u524D\u7ED3\u675F\u753B\u9762","Preview current ending screen"),onClick:()=>w()},T.default.createElement(m,{settings:n})),T.default.createElement("div",null,T.default.createElement("strong",null,n.endScreen==="image"?c("\u6211\u7684\u56FE\u7247","My image"):fe(e.logos?.find(h=>h.id===n.logoVariant))||c("DeepSeek \u6807\u5FD7","DeepSeek logo")),T.default.createElement("button",{type:"button",className:"bs-primary",disabled:t,onClick:()=>d.current?.click()},c("\u4E0A\u4F20\u7ED3\u675F\u56FE\u7247","Upload ending image")),T.default.createElement("small",null,"PNG / JPEG / WebP \xB7 \u2264 20 MB"))),n.endScreen==="image"&&T.default.createElement("label",{className:"bs-field"},T.default.createElement("span",null,c("\u7ED3\u675F\u56FE\u7247\u663E\u793A","Image fit")),T.default.createElement("select",{"aria-label":c("\u7ED3\u675F\u56FE\u7247\u663E\u793A","Image fit"),value:n.endFit||"cover",disabled:t,onChange:h=>s({endFit:h.target.value})},T.default.createElement("option",{value:"contain"},c("\u5B8C\u6574\u663E\u793A","Fit entire image")),T.default.createElement("option",{value:"cover"},c("\u94FA\u6EE1\u7A97\u53E3","Fill window")))),!!e.endImages?.length&&T.default.createElement("div",{className:"bs-end-library"},e.endImages.map(h=>T.default.createElement("div",{className:`bs-end-card ${n.endScreen==="image"&&n.endImageId===h.id?"is-selected":""}`,key:h.id},T.default.createElement("button",{type:"button",className:"bs-end-preview",disabled:t,"aria-label":c(`\u9884\u89C8\u7ED3\u675F\u56FE\u7247 ${h.name}`,`Preview ending image ${h.name}`),onClick:()=>w({endImageId:h.id,endScreen:"image"})},T.default.createElement("img",{src:h.url,alt:""}),T.default.createElement("span",null,h.name)),T.default.createElement("div",{className:"bs-clip-actions"},T.default.createElement("button",{type:"button",disabled:t||n.endScreen==="image"&&n.endImageId===h.id,className:n.endScreen==="image"&&n.endImageId===h.id?"bs-selected":"","aria-pressed":n.endScreen==="image"&&n.endImageId===h.id,"aria-label":c(`\u4F7F\u7528\u7ED3\u675F\u56FE\u7247 ${h.name}`,`Use ending image ${h.name}`),onClick:()=>s({endImageId:h.id,endScreen:"image"})},n.endScreen==="image"&&n.endImageId===h.id?c("\u2713 \u5F53\u524D\u753B\u9762","\u2713 Selected"):c("\u4F7F\u7528\u6B64\u753B\u9762","Use this screen")),o!==h.id&&T.default.createElement("button",{type:"button",disabled:t,className:"bs-delete","aria-label":c(`\u79FB\u9664\u7ED3\u675F\u56FE\u7247 ${h.name}`,`Remove ending image ${h.name}`),onClick:()=>l(h.id)},c("\u79FB\u9664","Remove"))),o===h.id?T.default.createElement("div",{className:"bs-end-delete-confirm"},T.default.createElement("button",{type:"button",disabled:t,onClick:()=>f(h)},c("\u786E\u8BA4\u79FB\u9664","Confirm removal")),T.default.createElement("button",{type:"button",onClick:()=>l(null)},c("\u53D6\u6D88","Cancel"))):null)))),T.default.createElement("input",{ref:d,type:"file",accept:".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp","aria-label":c("\u4E0A\u4F20\u7ED3\u675F\u56FE\u7247","Upload ending image"),hidden:!0,onChange:h=>{u(h.target.files?.[0]),h.target.value=""}}))}r(Zt,"EndingSettings");var U=ye(require("react"),1);var rn=ye(require("react"),1);var Kt=`/* ============================================================================\r
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
`;function Jt(e){let{window:n,document:t,setTimeout:i,clearTimeout:s,setInterval:d,clearInterval:u,requestAnimationFrame:f,cancelAnimationFrame:o,fetch:l}=e,m=e.translate||(b=>b);if(n.__DSH_STARTUP_LOADED__)return;n.__DSH_STARTUP_LOADED__=!0;var c="dsh-startup-root",w="M48.8354 10.0479C48.3232 9.79199 48.1025 10.2798 47.8032 10.5278C47.7007 10.6079 47.6143 10.7119 47.5273 10.8076C46.7793 11.624 45.9048 12.1597 44.7622 12.0957C43.0923 12 41.666 12.5356 40.4058 13.8398C40.1377 12.2319 39.2476 11.272 37.8926 10.6558C37.1836 10.3359 36.4668 10.0156 35.9702 9.31982C35.6235 8.82373 35.5293 8.27197 35.356 7.72754C35.2456 7.3999 35.1353 7.06396 34.7651 7.00781C34.3633 6.94385 34.2056 7.2876 34.0479 7.57568C33.418 8.75195 33.1733 10.0479 33.1973 11.3599C33.2524 14.312 34.4736 16.6641 36.8999 18.3359C37.1758 18.5278 37.2466 18.7197 37.1597 19C36.9946 19.5757 36.7974 20.1357 36.624 20.7119C36.5137 21.0801 36.3486 21.1597 35.9624 21C34.6309 20.4321 33.481 19.5918 32.4644 18.5757C30.7393 16.8721 29.1792 14.9917 27.2334 13.52C26.7764 13.1758 26.3193 12.856 25.8467 12.5518C23.8618 10.584 26.1069 8.96777 26.627 8.77588C27.1704 8.57568 26.8159 7.8877 25.0591 7.896C23.3022 7.90381 21.6953 8.50391 19.647 9.30371C19.3477 9.42383 19.0322 9.51172 18.7095 9.58398C16.8501 9.22363 14.9199 9.14355 12.9033 9.37598C9.10596 9.80762 6.07275 11.6396 3.84326 14.7681C1.16455 18.5278 0.53418 22.7998 1.30664 27.2559C2.11768 31.9521 4.46582 35.8398 8.07373 38.8799C11.8159 42.0322 16.1255 43.5762 21.041 43.2803C24.0269 43.104 27.3516 42.6963 31.1016 39.4561C32.0469 39.936 33.0396 40.1279 34.686 40.272C35.9546 40.3921 37.1758 40.208 38.1211 40.0078C39.6021 39.688 39.4995 38.2881 38.9639 38.0322C34.623 35.9678 35.5762 36.8081 34.71 36.1279C36.9155 33.4639 40.2402 30.6958 41.54 21.728C41.6426 21.0161 41.5557 20.5679 41.54 19.9917C41.5322 19.6396 41.6108 19.5039 42.0049 19.4639C43.0923 19.3359 44.1479 19.0317 45.1167 18.4878C47.9292 16.9199 49.064 14.3438 49.3315 11.2559C49.3711 10.7837 49.3237 10.2959 48.8354 10.0479ZM24.3262 37.8398C20.1196 34.4639 18.0791 33.3521 17.2358 33.3999C16.4482 33.4482 16.5898 34.3682 16.7632 34.9678C16.9443 35.5601 17.1812 35.9683 17.5117 36.4878C17.7402 36.832 17.8979 37.3442 17.2832 37.728C15.9282 38.584 13.5728 37.4399 13.4624 37.3838C10.7207 35.7358 8.42822 33.5601 6.81348 30.584C5.25342 27.7197 4.34766 24.6479 4.19775 21.3677C4.1582 20.5757 4.38672 20.2959 5.15869 20.1519C6.17529 19.96 7.22314 19.9199 8.23926 20.0718C12.5327 20.7119 16.1885 22.6719 19.2529 25.7759C21.002 27.5439 22.3252 29.6558 23.6885 31.7202C25.1377 33.9121 26.6978 36 28.6831 37.7119C29.3843 38.312 29.9434 38.7681 30.479 39.104C28.8643 39.2881 26.1699 39.3281 24.3262 37.8398ZM26.3433 24.6001C26.3433 24.248 26.6191 23.9678 26.9658 23.9678C27.0444 23.9678 27.1152 23.9839 27.1782 24.0078C27.2651 24.04 27.3438 24.0879 27.4067 24.1602C27.5171 24.272 27.5801 24.4321 27.5801 24.6001C27.5801 24.9521 27.3042 25.2319 26.9575 25.2319C26.6108 25.2319 26.3433 24.9521 26.3433 24.6001ZM32.6064 27.8799C32.2046 28.0479 31.8027 28.1919 31.4165 28.208C30.8179 28.2397 30.1641 27.9922 29.8096 27.688C29.2583 27.2158 28.8643 26.9521 28.6987 26.1279C28.6279 25.7759 28.6675 25.2319 28.7305 24.9199C28.8721 24.248 28.7144 23.8159 28.2495 23.4238C27.8716 23.104 27.3911 23.0161 26.8633 23.0161C26.666 23.0161 26.4849 22.9277 26.3511 22.856C26.1304 22.7441 25.9492 22.4639 26.1226 22.1201C26.1777 22.0078 26.4458 21.7358 26.5088 21.688C27.2256 21.272 28.0527 21.4077 28.8169 21.7197C29.5259 22.0161 30.0615 22.5601 30.834 23.3281C31.6216 24.2559 31.7632 24.5117 32.2124 25.208C32.5669 25.752 32.8901 26.312 33.1104 26.9521C33.2446 27.3521 33.0713 27.6802 32.6064 27.8799Z",h={enabled:!0,mode:"session",theme:"light",speed:1,requireInteraction:!0,allowSkip:!0,sound:!0,soundVolume:.5,voice:!0,voiceLang:"en",voiceName:"",voiceRate:.88,voicePitch:.85,voiceVolume:.9,voiceCue:!0,sfx:"audio",voiceSource:"asset",voiceLead:240,identity:"JOYCE MOORE",identityId:"0087",accessLevel:"3",brand1:"DEEPSEEK",brand2:"SYNTHESIZE INTELLIGENCE",brand3a:"HARNESS",brand3b:"OS",orgZh:"\u6DF1\u5EA6\u6C42\u7D22",orgEn:"DEEPSEEK",orgSub:"DEEPSEEK HARNESS",welcomeBox:"DEEPSEEK HARNESS",footer:"POWERED BY DEEPSEEK",accent:"#ff7500",glitchA:"#ff3b30",glitchB:"#2971b8"},A=[{zh:"\u9700\u8981\u8BBF\u95EE\u8BB8\u53EF",en:"ACCESS PERMISSION REQUIRED",say:"Access permission required.",audio:"line-1",log:"\u7B49\u5F85\u7528\u6237\u6388\u6743\u2026",logEn:"AWAITING OPERATOR CONSENT",badge:"AUTHORIZATION",action:"grant",btnZh:"\u6388\u4E88\u8BBF\u95EE\u6743\u9650",btnEn:"GRANT ACCESS",hold:900,progress:.34},{zh:"\u8EAB\u4EFD\u8D44\u6599\u786E\u8BA4",en:"IDENTITY VERIFICATION",say:"Identity verification.",audio:"line-2",log:"\u6838\u5BF9\u8EAB\u4EFD\u8D44\u6599\u2026",logEn:"MATCHING OPERATOR RECORD",badge:"IDENTITY",action:"confirm",btnZh:"\u786E\u8BA4\u8EAB\u4EFD",btnEn:"CONFIRM IDENTITY",hold:700,progress:.5},{zh:"\u63A5\u6536\u8BBF\u95EE\u9700\u6C42",en:"ACCESS REQUEST RECEIVED",say:"Access request received.",audio:"line-3",log:"\u63A5\u6536\u8BBF\u95EE\u9700\u6C42\uFF0C\u5EFA\u7ACB\u4F1A\u8BDD\u901A\u9053\u2026",logEn:"HANDSHAKE ESTABLISHED",badge:"REQUEST",action:"auto",hold:1200,progress:.66,assembleLogo:!0},{zh:"\u5F00\u59CB\u8BFB\u53D6\u6743\u9650",en:"PERMISSION READ STARTED",say:"Beginning permission read.",audio:"line-4",log:"\u5F00\u59CB\u8BFB\u53D6\u6743\u9650\uFF0C\u7D22\u5F15\u5DE5\u4F5C\u533A\u4E0E\u4F1A\u8BDD\u2026",logEn:"READING PERMISSION SET",badge:"READ",action:"auto",hold:1200,progress:.8,hex:!0},{zh:"\u8BFB\u53D6\u5B8C\u6BD5 \xB7 \u6838\u9A8C\u901A\u8FC7",en:"READ COMPLETE \xB7 VERIFIED",say:"Read complete. Verification passed.",audio:"line-5",log:"\u8BFB\u53D6\u5B8C\u6BD5\uFF0C\u6838\u9A8C\u901A\u8FC7\uFF0C\u6743\u9650\u5DF2\u6388\u4E88",logEn:"PERMISSION AUTHORIZED",badge:"VERIFY",action:"auto",hold:1600,progress:.93,reticle:!0}];function I(){var b=n.__DSH_STARTUP__&&typeof n.__DSH_STARTUP__=="object"?n.__DSH_STARTUP__:{},p={};for(var v in h)Object.prototype.hasOwnProperty.call(h,v)&&(p[v]=h[v]);for(var S in b)Object.prototype.hasOwnProperty.call(b,S)&&b[S]!==void 0&&b[S]!==null&&(p[S]=b[S]);return p.speed=Math.min(3,Math.max(.35,Number(p.speed)||1)),p.identity=String(p.identity||h.identity).slice(0,48),p.identityId=String(p.identityId||p.identity).toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,12),p.identityId||(p.identityId="OPERATOR"),p}r(I,"cfg");var y=I();function R(){n.__DSH_STARTUP_LOADED__=!1;var b=t.getElementById(c);b&&b.parentNode&&b.parentNode.removeChild(b),n.__DSH_STARTUP_SKIP__=!1;var p=t.createElement("script");n.__DSH_STARTUP_SCRIPT_URL__?p.src=n.__DSH_STARTUP_SCRIPT_URL__:p.src="/dsh-startup/splash.js?t="+Date.now(),t.head.appendChild(p)}if(r(R,"injectSelf"),n.__DSH_STARTUP_SKIP__===!0){n.__DSH_STARTUP_API__={replay:R,skip:r(function(){},"skip"),finish:r(function(){},"finish"),config:y};return}i(function(){try{var b=t.getElementById(c);b&&b.classList&&b.classList.contains("dsu-boot")&&(b.parentNode&&b.parentNode.removeChild(b),t.documentElement.classList.remove("dsu-lock"),t.body&&(t.body.style.overflow=""),n.__DSH_STARTUP_FAILED__=!0)}catch{}},9e3);function B(b,p,v){var S=t.createElement(b);return p&&(S.className=p),v!=null&&(S.textContent=v),S}r(B,"el");function O(b){var p="http://www.w3.org/2000/svg",v=t.createElementNS(p,"svg");v.setAttribute("viewBox","0 0 50 50"),v.setAttribute("aria-hidden","true"),b&&v.setAttribute("class",b);var S=t.createElementNS(p,"path");return S.setAttribute("d",w),S.setAttribute("fill-rule","nonzero"),v.appendChild(S),v}r(O,"svgWhale");function V(b,p,v){b.textContent="";for(var S=t.createDocumentFragment(),H=0,Y=0;Y<p.length;Y++){var ee=p.charAt(Y);if(ee===" "){S.appendChild(t.createTextNode(m("zh","en")==="en"?" ":"\xA0"));continue}var le=B("span","dsu-ch",ee);le.style.transitionDelay=Math.round(H*v)+"ms",S.appendChild(le),H++}b.appendChild(S)}r(V,"typeIn");function M(b,p,v){b&&b.classList.toggle(v||"dsu-in",!!p)}r(M,"setIn");var P=t.getElementById(c);P||(P=B("div"),P.id=c,P.className="dsu-root",t.body.appendChild(P)),P.classList.toggle("dsu-dark",y.theme==="dark"),P.style.setProperty("--dsu-speed",String(y.speed)),P.style.setProperty("--dsu-accent",y.accent),P.style.setProperty("--dsu-glitch-a",y.glitchA),P.style.setProperty("--dsu-glitch-b",y.glitchB);var a={},$=new Map;function re(b,p,v,S,H){var Y=r(function(){H?b.innerHTML=m(p,v):b.textContent=m(p,v)},"render");$.set(b,Y),typeof S=="number"?V(b,m(p,v),S):Y()}r(re,"localizedText");var me=null,pe='<div class="dsu-plate"></div><div class="dsu-vignette"></div><div class="dsu-watermark"></div><div class="dsu-grain"></div><div class="dsu-black"><div class="dsu-black-inner"></div><div class="dsu-sweep"></div></div><div class="dsu-wash"></div><header class="dsu-brand"><div class="dsu-brand-1"></div><div class="dsu-brand-2"></div><div class="dsu-brand-3"><b></b><span></span></div></header><div class="dsu-stepcount">[ 00 / 06 ] INIT</div><div class="dsu-center"><div class="dsu-status"><span class="dsu-status-zh"></span><i class="dsu-caret"></i></div><div class="dsu-sub-en"></div><div class="dsu-rule"></div><div class="dsu-logo"></div><div class="dsu-dots" hidden></div></div><div class="dsu-idline"></div><div class="dsu-reticle"></div><div class="dsu-hex"></div><div class="dsu-welcome"><div class="dsu-w1">WELCOME TO</div><div class="dsu-w2"></div><div class="dsu-w3"></div><div class="dsu-w4"></div></div><div class="dsu-action"><div class="dsu-card" hidden></div><button class="dsu-btn" type="button"><span class="dsu-btn-zh"></span><span class="dsu-btn-en"></span></button><div class="dsu-hint"></div></div><div class="dsu-frame"><i class="dsu-corner dsu-c-tl"></i><i class="dsu-corner dsu-c-tr"></i><i class="dsu-corner dsu-c-bl"></i><i class="dsu-corner dsu-c-br"></i><div class="dsu-scanline"></div></div><div class="dsu-slats"></div><div class="dsu-voice"><i></i><i></i><i></i><i></i><i></i></div><div class="dsu-meta"><span class="dsu-meta-1"></span><span class="dsu-meta-2"></span></div><div class="dsu-skip">SKIP \u25B8</div><footer class="dsu-foot"><span></span><i></i></footer><div class="dsu-subtitle"><span class="dsu-sub-zh"></span><span class="dsu-sub-en2"></span></div><div class="dsu-progress"><i></i></div><div class="dsu-bloom"></div><div class="dsu-streak"></div><div class="dsu-flash"></div>';P.innerHTML=pe;function g(b){return P.querySelector(b)}r(g,"q"),a.plate=g(".dsu-plate"),a.watermark=g(".dsu-watermark"),a.black=g(".dsu-black"),a.blackInner=g(".dsu-black-inner"),a.sweep=g(".dsu-sweep"),a.wash=g(".dsu-wash"),a.flash=g(".dsu-flash"),a.bloom=g(".dsu-bloom"),a.streak=g(".dsu-streak"),a.vignette=g(".dsu-vignette"),a.brand=g(".dsu-brand"),a.center=g(".dsu-center"),a.brand1=g(".dsu-brand-1"),a.brand2=g(".dsu-brand-2"),a.brand3b=g(".dsu-brand-3 b"),a.brand3s=g(".dsu-brand-3 span"),a.stepcount=g(".dsu-stepcount"),a.status=g(".dsu-status"),a.statusZh=g(".dsu-status-zh"),a.caret=g(".dsu-caret"),a.subEn=g(".dsu-sub-en"),a.rule=g(".dsu-rule"),a.logo=g(".dsu-logo"),a.dots=g(".dsu-dots"),a.idline=g(".dsu-idline"),a.reticle=g(".dsu-reticle"),a.hex=g(".dsu-hex"),a.welcome=g(".dsu-welcome"),a.w1=g(".dsu-w1"),a.w2=g(".dsu-w2"),a.w3=g(".dsu-w3"),a.w4=g(".dsu-w4"),a.action=g(".dsu-action"),a.card=g(".dsu-card"),a.btn=g(".dsu-btn"),a.btnZh=g(".dsu-btn-zh"),a.btnEn=g(".dsu-btn-en"),a.hint=g(".dsu-hint"),a.skip=g(".dsu-skip"),a.foot=g(".dsu-foot"),a.footText=g(".dsu-foot span"),a.subZh=g(".dsu-sub-zh"),a.subEn2=g(".dsu-sub-en2"),a.progress=g(".dsu-progress"),a.bar=g(".dsu-progress i"),a.frame=g(".dsu-frame"),a.scanline=g(".dsu-scanline"),a.slats=g(".dsu-slats"),a.voice=g(".dsu-voice"),a.meta=g(".dsu-meta"),a.meta1=g(".dsu-meta-1"),a.meta2=g(".dsu-meta-2"),a.brand1.textContent=y.brand1,a.brand2.textContent=y.brand2,a.brand3b.textContent=y.brand3a,a.brand3s.textContent=y.brand3b,a.footText.textContent=y.footer,a.w2.textContent=y.welcomeBox,re(a.w4,"\u6B22\u8FCE "+y.identity+" \u8BBF\u95EE","WELCOME, "+y.identity),a.idline.textContent="\xB7 ID CONFIRMED : "+y.identityId,r((function(){var p=a.blackInner,v=O("dsu-whale");p.appendChild(v);var S=B("div","dsu-black-zh");re(S,y.orgZh,y.orgEn),p.appendChild(S);var H=B("div","dsu-black-en",y.orgEn);p.appendChild(H),p.appendChild(B("div","dsu-black-sub",y.orgSub)),a.blackEn=H}),"blackStage")(),r((function(){a.logo.appendChild(O()),a.logo.appendChild(B("div","dsu-logolabel","D E E P S E E K"))}),"logoStage")(),r((function(){a.w3.appendChild(O()),a.w3.appendChild(B("span","dsu-w3label","D E E P S E E K  \xB7  H A R N E S S"))}),"welcomeLogo")(),r((function(){for(var p=[[.6,.02,.16,.96],[.78,.02,.16,.96],[.96,.02,.16,.96],[.05,.02,.1,.5]],v=0;v<p.length;v++){var S=p[v],H=B("div","dsu-wm");H.style.left=S[0]*100+"%",H.style.top=S[1]*100+"%",H.style.width=S[2]*100+"%",H.style.height=S[3]*100+"%",a.watermark.appendChild(H)}}),"watermark")(),r((function(){for(var p=0;p<A.length+1;p++)a.slats.appendChild(B("i","dsu-slat"));a.meta1.textContent="REV 0.1.0 \xB7 WEB PROFILE",ce(),me=d(ce,1e3)}),"slatsAndMeta")(),r((function(){var p="http://www.w3.org/2000/svg",v=t.createElementNS(p,"svg");v.setAttribute("viewBox","0 0 400 400");function S(ue,oe,k,N,L,z,X){var Ee=r(function(Ye){return(Ye-90)*Math.PI/180},"rad"),Ie=ue+k*Math.cos(Ee(N)),Te=oe+k*Math.sin(Ee(N)),We=ue+k*Math.cos(Ee(L)),dn=oe+k*Math.sin(Ee(L)),Qe=L-N>180?1:0,$e=t.createElementNS(p,"path");return $e.setAttribute("d","M"+Ie.toFixed(2)+" "+Te.toFixed(2)+" A"+k+" "+k+" 0 "+Qe+" 1 "+We.toFixed(2)+" "+dn.toFixed(2)),$e.setAttribute("class",z),X&&$e.setAttribute("stroke-linecap",X),{node:$e,x:We,y:dn,x0:Ie,y0:Te}}r(S,"arc");var H=t.createElementNS(p,"g");H.setAttribute("class","dsu-ret-rot-a");var Y=S(200,200,150,215,505,"dsu-ring-a","round");H.appendChild(Y.node);var ee=t.createElementNS(p,"circle");ee.setAttribute("class","dsu-dot-a"),ee.setAttribute("cx",Y.x.toFixed(2)),ee.setAttribute("cy",Y.y.toFixed(2)),ee.setAttribute("r","7"),H.appendChild(ee),v.appendChild(H);var le=t.createElementNS(p,"g");le.setAttribute("class","dsu-ret-rot-b");var Ne=S(200,200,104,200,490,"dsu-ring-b","round");le.appendChild(Ne.node);var Be=t.createElementNS(p,"circle");Be.setAttribute("class","dsu-dot-b"),Be.setAttribute("cx",Ne.x0.toFixed(2)),Be.setAttribute("cy",Ne.y0.toFixed(2)),Be.setAttribute("r","4"),le.appendChild(Be),v.appendChild(le);var Ge=t.createElementNS(p,"g"),Se=S(200,200,62,118,242,"dsu-bracket","round"),Z=S(200,200,62,298,62,"dsu-bracket","round");Ge.appendChild(Se.node),Ge.appendChild(Z.node),v.appendChild(Ge);for(var j=[[152,132],[252,268],[278,150]],G=0;G<j.length;G++){var ie=t.createElementNS(p,"circle");ie.setAttribute("class","dsu-dot-o"),ie.setAttribute("cx",j[G][0]),ie.setAttribute("cy",j[G][1]),ie.setAttribute("r","2.8"),v.appendChild(ie)}a.reticle.appendChild(v)}),"reticle")();var x=[],C=[],F=!1,q=!1,ve=null;function Q(b){return Math.round(b/y.speed)}r(Q,"ms");function se(b){return new Promise(function(p){if(F)return p();var v=!1;function S(){if(!v){v=!0;var Y=C.indexOf(S);Y>=0&&C.splice(Y,1),p()}}r(S,"fin");var H=i(S,Math.max(0,Q(b)));x.push(H),C.push(S)})}r(se,"wait");function an(){return new Promise(function(b){if(F||!y.requireInteraction)return b();var p=!1;function v(){p||(p=!0,Y(),b())}r(v,"fin");function S(ee){(ee.key==="Enter"||ee.key===" "||ee.key==="Spacebar")&&(ee.preventDefault(),v())}r(S,"onKey");function H(ee){ee.preventDefault(),v()}r(H,"onClick");function Y(){a.btn.removeEventListener("click",H),a.action.removeEventListener("click",H),t.removeEventListener("keydown",S);var ee=C.indexOf(v);ee>=0&&C.splice(ee,1)}r(Y,"cleanup"),a.btn.addEventListener("click",H),a.action.addEventListener("click",H),t.addEventListener("keydown",S),C.push(v)})}r(an,"waitAction");function ae(){for(var b=0;b<x.length;b++)s(x[b]);x.length=0;var p=C.slice();C.length=0;for(var v=0;v<p.length;v++)try{p[v]()}catch{}}r(ae,"releaseAll");function Ke(b){var p=Math.max(0,Math.min(1,b));a.bar.style.width=Math.round(p*100)+"%"}r(Ke,"setProgress");function on(b){for(var p=a.slats.children,v=0;v<p.length;v++){var S=v+1;p[v].classList.toggle("dsu-on",S===b),p[v].classList.toggle("dsu-past",S<b)}}r(on,"setSlats");function W(){a.scanline&&(a.scanline.classList.remove("dsu-go"),a.scanline.offsetWidth,a.scanline.classList.add("dsu-go"))}r(W,"sweep");function ce(){var b=new Date,p=r(function(v){return(v<10?"0":"")+v},"pad");a.meta2.textContent=p(b.getHours())+":"+p(b.getMinutes())+":"+p(b.getSeconds())}r(ce,"paintClock");function je(b,p){a.subZh.classList.remove("dsu-in"),a.subEn2.classList.remove("dsu-in"),i(function(){re(a.subZh,b||"",p||""),a.subEn2.textContent=p||"",a.subZh.classList.add("dsu-in"),p&&a.subEn2.classList.add("dsu-in")},Q(140))}r(je,"setSubtitle");function Je(b,p){var v=A.length+1;a.stepcount.textContent="[ "+String(b).padStart(2,"0")+" / "+String(v).padStart(2,"0")+" ] "+p}r(Je,"setStepCount");function He(){var b=12;function p(){for(var S="",H=0;H<26;H++)S+="0123456789ABCDEF".charAt(Math.floor(Math.random()*16)),H%2===1&&(S+=" ");return S}r(p,"line");function v(){for(var S=[],H=0;H<b;H++)S.push(p());a.hex.innerHTML=S.join("<br>")}r(v,"paint"),v(),a.hex.classList.add("dsu-in"),we.tickRun(),ve=d(v,110)}r(He,"startHex");function Gn(){ve&&(u(ve),ve=null),a.hex.classList.remove("dsu-in")}r(Gn,"stopHex");function Ae(b,p,v){var S=Number(b);return isFinite(S)?Math.min(v,Math.max(p,S)):p}r(Ae,"clamp01");var we=(function(){var b=null;function p(Z){if(!y.sound&&!Z)return null;try{var j=n.AudioContext||n.webkitAudioContext;return j?(b||(b=new j),b.state==="suspended"&&typeof b.resume=="function"&&b.resume(),b):null}catch{return null}}r(p,"ac");function v(Z){return Math.max(2e-4,(Z??.05)*Ae(y.soundVolume,0,1)*2)}r(v,"vol");function S(Z,j,G,ie,ue,oe){var k=p();if(k)try{var N=k.currentTime+(ue||0),L=k.createOscillator(),z=k.createGain();L.type=G||"sine",L.frequency.setValueAtTime(Z,N),oe&&L.frequency.exponentialRampToValueAtTime(oe,N+j),z.gain.setValueAtTime(1e-4,N),z.gain.exponentialRampToValueAtTime(v(ie),N+Math.min(.02,j*.3)),z.gain.exponentialRampToValueAtTime(1e-4,N+j),L.connect(z),z.connect(k.destination),L.start(N),L.stop(N+j+.03)}catch{}}r(S,"tone");function H(Z,j){var G=p();if(G)try{for(var ie=Math.floor(G.sampleRate*Z),ue=G.createBuffer(1,ie,G.sampleRate),oe=ue.getChannelData(0),k=0;k<ie;k++)oe[k]=(Math.random()*2-1)*(1-k/ie);var N=G.createBufferSource();N.buffer=ue;var L=G.createBiquadFilter();L.type="bandpass",L.frequency.value=1500,L.Q.value=.6;var z=G.createGain();z.gain.value=v(j),N.connect(L),L.connect(z),z.connect(G.destination),N.start()}catch{}}r(H,"noise");var Y={},ee={};function le(Z){if(y.sfx!=="synth"&&!(Y[Z]||ee[Z])){ee[Z]=!0;try{l("/dsh-startup/asset/"+Z+".mp3").then(function(j){return j.ok?j.arrayBuffer():null}).then(function(j){return j?p().decodeAudioData(j):null}).then(function(j){j&&(Y[Z]=j)}).catch(function(){})}catch{}}}r(le,"loadAsset");var Ne={};function Be(Z){return Y[Z]?Promise.resolve(!0):Ne[Z]?Ne[Z]:y.voiceSource==="tts"?Promise.resolve(!1):(Ne[Z]=new Promise(function(j){try{l("/dsh-startup/asset/"+Z+".mp3").then(function(G){return G.ok?G.arrayBuffer():null}).then(function(G){return G?p(!0).decodeAudioData(G):null}).then(function(G){G?(Y[Z]=G,j(!0)):j(!1)}).catch(function(){j(!1)})}catch{j(!1)}}),Ne[Z])}r(Be,"ensureAsset");function Ge(Z,j){return new Promise(function(G){var ie=p(!0),ue=Y[Z];if(!ie||!ue){G(0);return}try{var oe=ie.createBufferSource();oe.buffer=ue;var k=ie.createGain();k.gain.value=Math.min(1,(j??.85)*Ae(y.voiceVolume,0,1)*1.6),oe.connect(k),k.connect(ie.destination),oe.onended=function(){G(Math.round(ue.duration*1e3))},oe.start()}catch{G(0)}})}r(Ge,"playAssetAndWait");function Se(Z,j){var G=p();if(!G)return!1;var ie=Y[Z];if(!ie)return le(Z),!1;try{var ue=G.createBufferSource();ue.buffer=ie;var oe=G.createGain();return oe.gain.value=Math.min(1,(j??.55)*Ae(y.soundVolume,0,1)*2),ue.connect(oe),oe.connect(G.destination),ue.start(),!0}catch{return!1}}return r(Se,"playAsset"),{resume:r(function(){p(),le("sfx-tick"),le("sfx-ticks-run")},"resume"),preload:r(function(){le("sfx-tick"),le("sfx-ticks-run")},"preload"),ensureAsset:Be,playAssetAndWait:Ge,tick:r(function(){Se("sfx-tick",.45)||S(1760,.035,"square",.022)},"tick"),tickRun:r(function(){Se("sfx-ticks-run",.5)},"tickRun"),step:r(function(){Se("sfx-tick",.6)||(S(880,.05,"sine",.05),S(1320,.07,"sine",.028,.045))},"step"),hover:r(function(){S(2200,.02,"sine",.018)},"hover"),confirm:r(function(){S(660,.09,"triangle",.07),S(990,.17,"triangle",.055,.085)},"confirm"),sweep:r(function(){H(.75,.035)},"sweep"),cue:r(function(){S(1046.5,.05,"sine",.028),S(1568,.06,"sine",.02,.075)},"cue"),rise:r(function(){S(220,1.1,"sine",.032,0,990)},"rise"),chime:r(function(){S(659.25,.9,"sine",.055),S(830.61,.9,"sine",.04,.09),S(987.77,1.3,"sine",.045,.18)},"chime")}})(),Oe=(function(){var b=typeof n<"u"&&!!n.speechSynthesis&&typeof n.SpeechSynthesisUtterance=="function",p=[],v={en:null,zh:null},S=null,H=!1,Y={en:"",zh:""},ee=["natural","neural","online","premium","enhanced","siri","google"],le=["aria","jenny","michelle","emma","ava","libby","sonia","maisie","zira","samantha","karen","moira","tessa","victoria","serena","allison","susan","fiona","hazel","female","woman","xiaoxiao","xiaoyi","xiaomo","huihui","yaoyao","\u6653\u6653","\u6653\u4F0A","\u5973\u58F0"],Ne=["david","mark","guy","ryan","george","daniel","alex","fred","male","yunxi","yunjian","kangkang"];function Be(k,N){for(var L=String(k.name||"").toLowerCase(),z=String(k.lang||"").toLowerCase(),X=0,Ee=0;Ee<ee.length;Ee++)if(L.indexOf(ee[Ee])!==-1){X+=60;break}for(var Ie=0;Ie<le.length;Ie++)if(L.indexOf(le[Ie])!==-1){X+=40;break}for(var Te=0;Te<Ne.length;Te++)if(L.indexOf(Ne[Te])!==-1){X-=45;break}return z.indexOf(N)===0&&(X+=25),k.localService&&(X+=4),k.default&&(X+=3),X}r(Be,"score");function Ge(k){if(!p.length)return null;if(y.voiceName)for(var N=0;N<p.length;N++){var L=p[N];if(L.name===y.voiceName&&String(L.lang||"").toLowerCase().indexOf(k)===0)return L}for(var z=[],X=0;X<p.length;X++)String(p[X].lang||"").toLowerCase().indexOf(k)===0&&z.push(p[X]);z.length||(z=p.slice());for(var Ee=null,Ie=-1e9,Te=0;Te<z.length;Te++){var We=Be(z[Te],k);We>Ie&&(Ie=We,Ee=z[Te])}return Ee}r(Ge,"bestFor");function Se(k){S&&S.classList.toggle("dsu-on",!!k)}r(Se,"setMeter");function Z(){if(b){try{p=n.speechSynthesis.getVoices()||[]}catch{p=[]}v.en=Ge("en"),v.zh=Ge("zh")}}r(Z,"load");function j(k){return String(k||"").replace(/\S+/g,function(N){return/^[A-Z0-9.\-]+$/.test(N)&&N.length>1?N.charAt(0)+N.slice(1).toLowerCase():N})}r(j,"spokenName");function G(k,N){try{var L=new n.SpeechSynthesisUtterance(k),z=N.indexOf("zh")===0?v.zh:v.en;return z?(L.voice=z,L.lang=z.lang||N):L.lang=N,L.rate=Ae(y.voiceRate,.5,2),L.pitch=Ae(y.voicePitch,0,2),L.volume=Ae(y.voiceVolume,0,1),L.onstart=function(){Se(!0)},L.onend=function(){Se(!1)},L.onerror=function(){Se(!1)},n.speechSynthesis.speak(L),!0}catch{return!1}}r(G,"utter");function ie(k){for(var N=0,L=Ae(y.voiceRate,.5,2)||1,z=0;z<k.length;z++){var X=String(k[z].t||"");N+=/[\u4e00-\u9fa5]/.test(X)?X.length*1.7:X.length}return Math.round(N/13*1e3/L)+460}r(ie,"estimateMs");function ue(k,N){var L=new n.SpeechSynthesisUtterance(k),z=N.indexOf("zh")===0?v.zh:v.en;return z?(L.voice=z,L.lang=z.lang||N):L.lang=N,L.rate=Ae(y.voiceRate,.5,2),L.pitch=Ae(y.voicePitch,0,2),L.volume=Ae(y.voiceVolume,0,1),L}return r(ue,"buildUtter"),{supported:b,load:Z,attach:r(function(k){S=k},"attach"),line:r(function(k,N,L){return L&&y.voice&&y.voiceSource!=="tts"&&!q?we.ensureAsset(L).then(function(z){return!z||q?0:(y.voiceCue!==!1&&we.cue(),we.playAssetAndWait(L,.85).then(function(X){return X>0&&Se(!0),X}))}).then(function(z){return z>0?(H=!0,z):oe(k,N)}):oe(k,N)},"line"),tts:r(function(k,N){return oe(k,N)},"tts"),say:r(function(k,N){return this.line(k,N)},"say"),unlock:r(function(){try{b&&n.speechSynthesis.resume()}catch{}if(we.resume(),b&&!H)try{var k=new n.SpeechSynthesisUtterance(" ");k.volume=0;var N=v.en||v.zh;N&&(k.voice=N,k.lang=N.lang),n.speechSynthesis.speak(k)}catch{}!H&&y.voice&&(Y.en||Y.zh)&&this.say(Y.en,Y.zh)},"unlock"),speakName:j,current:r(function(){var k=v.en?v.en.name:"",N=v.zh?v.zh.name:"";return k===N?k:k+(N?"  /  "+N:"")},"current"),listVoices:r(function(){return p.slice()},"listVoices"),stop:r(function(){try{b&&n.speechSynthesis.cancel()}catch{}Se(!1)},"stop")};function oe(k,N){return new Promise(function(L){if(!b||!y.voice||q){L(0);return}Y={en:k||"",zh:N||""};var z=[],X=y.voiceLang;if(X==="zh"?N&&z.push({t:N,l:"zh-CN"}):X==="both"?(N&&z.push({t:N,l:"zh-CN"}),k&&z.push({t:k,l:"en-US"})):k&&z.push({t:k,l:"en-US"}),!z.length){L(0);return}H=!0,y.voiceCue!==!1&&we.cue();var Ee=Date.now(),Ie=ie(z),Te=Ae(y.voiceLead,0,1200),We=!1,dn=null;function Qe(){We||(We=!0,dn&&s(dn),Se(!1),L(Math.max(0,Date.now()-Ee)))}r(Qe,"settle"),i(function(){if(q){Qe();return}for(var $e=z.length-1,Ye=0;Ye<=$e;Ye++){var On=ue(z[Ye].t,z[Ye].l);Ye===$e&&(On.onstart=function(){Se(!0)},On.onend=Qe,On.onerror=Qe);try{n.speechSynthesis.speak(On)}catch{Ye===$e&&Qe()}}dn=i(Qe,Ie+900)},Te)})}r(oe,"ttsLine")})();Oe.attach(g(".dsu-voice")),r((function(){if(y.voiceSource!=="tts"){for(var p=0;p<A.length;p++)A[p].audio&&we.ensureAsset(A[p].audio);we.ensureAsset("line-6")}}),"preloadVoices")(),r((function(){if(Oe.load(),Oe.supported&&typeof n.speechSynthesis.addEventListener=="function")try{n.speechSynthesis.addEventListener("voiceschanged",function(){Oe.load()})}catch{}var p=!1;function v(){p||(p=!0,Oe.unlock(),t.removeEventListener("pointerdown",v,!0),t.removeEventListener("keydown",v,!0),t.removeEventListener("touchstart",v,!0))}r(v,"unlock"),t.addEventListener("pointerdown",v,!0),t.addEventListener("keydown",v,!0),t.addEventListener("touchstart",v,!0)}),"wireSound")();function ct(){return Promise.resolve().then(function(){return se(820)}).then(function(){return a.blackInner.classList.add("dsu-in"),we.rise(),se(240)}).then(function(){return a.blackEn.classList.add("dsu-tighten"),se(880)}).then(function(){return a.sweep.classList.add("dsu-go"),se(760)}).then(function(){return a.blackInner.classList.add("dsu-out"),we.sweep(),a.wash.style.transition="opacity "+Q(220)+"ms linear",a.wash.style.opacity="1",se(260)}).then(function(){return a.plate.style.transition="opacity "+Q(900)+"ms ease",a.plate.style.opacity="1",a.watermark.style.transition="opacity "+Q(1100)+"ms ease",a.watermark.style.opacity="1",a.wash.style.transition="opacity "+Q(720)+"ms cubic-bezier(.2,.9,.2,1)",a.wash.style.opacity="0",a.black.style.transition="opacity "+Q(720)+"ms ease",a.black.style.opacity="0",se(760)}).then(function(){return a.brand.classList.add("dsu-in"),a.foot.classList.add("dsu-in"),a.stepcount.classList.add("dsu-in"),a.idline.classList.add("dsu-in"),a.frame.classList.add("dsu-in"),a.slats.classList.add("dsu-in"),a.meta.classList.add("dsu-in"),a.vignette.classList.add("dsu-in"),a.voice.classList.add("dsu-in"),Ke(.12),Je(0,"BOOT"),on(0),je("\u7CFB\u7EDF\u81EA\u68C0\u4E2D\u2026","SYSTEM SELF-CHECK"),y.allowSkip&&a.skip.classList.add("dsu-in"),se(700)}).then(function(){a.black.style.display="none",W()}).then(function(){return tr()}).then(function(){return ir()}).catch(function(b){try{console.warn("[dsh-startup-screen] \u52A8\u753B\u5F02\u5E38\uFF0C\u76F4\u63A5\u63ED\u5E55\uFF1A",b)}catch{}return An()})}r(ct,"run");function tr(){var b=Promise.resolve();return A.forEach(function(p,v){b=b.then(function(){if(q)return;var S=v+1;v>=2&&a.idline.classList.remove("dsu-in"),Je(S,p.badge),on(S),Ke(p.progress),je(p.log,p.logEn),we.step();var H=Oe.line(p.say,p.zh,p.audio);a.status.classList.toggle("dsu-zhline",!0),a.status.classList.remove("dsu-in"),a.subEn.classList.remove("dsu-in"),a.status.offsetWidth,re(a.statusZh,p.zh,p.en,46),V(a.subEn,p.en,13),a.caret.classList.toggle("dsu-on",!!p.action&&p.action!=="auto"),f(function(){q||(a.status.classList.add("dsu-in"),a.subEn.classList.add("dsu-in"))}),a.rule.classList.add("dsu-in"),p.assembleLogo&&rr(),p.reticle&&(a.logo.classList.remove("dsu-in"),a.dots.hidden=!0,a.reticle.classList.add("dsu-in"),W()),p.hex&&He();function Y(ee){var le=Math.max(Q(p.hold),(ee||0)+Q(240));return se(Math.max(0,le-(ee||0)))}return r(Y,"holdFor"),p.action==="grant"||p.action==="confirm"?(sr(p),se(520).then(function(){return an()}).then(function(){return ar(),we.confirm(),a.caret.classList.remove("dsu-on"),H}).then(function(){return se(Q(320))})):p.hex?H.then(Y).then(function(){Gn()}):H.then(Y)})}),b}r(tr,"stepLoop");function rr(){a.logo.classList.add("dsu-in"),a.dots.hidden=!1;var b=a.logo.querySelector("path");if(b&&typeof b.getTotalLength=="function")try{var p=b.getTotalLength();b.style.fill="none",b.style.stroke="currentColor",b.style.strokeWidth="1.1",b.style.strokeDasharray=p,b.style.strokeDashoffset=p,b.animate([{strokeDashoffset:p},{strokeDashoffset:0}],{duration:Q(1400),easing:"cubic-bezier(.55,.06,.24,1)",fill:"forwards"}),i(function(){b.style.transition="fill "+Q(420)+"ms ease, stroke-width "+Q(420)+"ms ease",b.style.fill="",b.style.strokeWidth="0"},Q(1450))}catch{}return se(300)}r(rr,"assembleLogo");function sr(b){if(re(a.btnZh,b.btnZh,b.btnEn),a.btnEn.textContent=b.btnEn,a.card.hidden=b.action!=="confirm",b.action==="confirm"){a.card.innerHTML="";var p=[["\u8EAB\u4EFD\u540D\u79F0",y.identity,!0,"IDENTITY NAME"],["\u8EAB\u4EFD\u7F16\u53F7",y.identityId,!1,"IDENTITY ID"],["\u6743\u9650\u7B49\u7EA7",y.accessLevel,!1,"ACCESS LEVEL"]];p.forEach(function(v){var S=B("div","dsu-card-row"),H=B("span");re(H,v[0],v[3]),S.appendChild(H),S.appendChild(B("b",v[2]?"dsu-zhname":null,v[1])),a.card.appendChild(S)})}re(a.hint,"\u6309 <kbd>Enter</kbd> / <kbd>Space</kbd>\uFF0C\u6216\u70B9\u51FB\u6309\u94AE\u7EE7\u7EED","Press <kbd>Enter</kbd> / <kbd>Space</kbd>, or click to continue",void 0,!0),a.action.classList.add("dsu-in"),a.btn.classList.add("dsu-pulse")}r(sr,"showAction");function ar(){a.action.classList.remove("dsu-in"),a.btn.classList.remove("dsu-pulse")}r(ar,"hideAction");function ir(){if(q)return Promise.resolve();Je(6,"WELCOME"),on(6),Ke(1),je("\u8EAB\u4EFD\u9A8C\u8BC1\u5B8C\u6210\uFF0C\u4F1A\u8BDD\u5DF2\u5EFA\u7ACB","IDENTITY VERIFIED \xB7 SESSION ESTABLISHED"),we.chime();var b=Oe.line(null,null,"line-6");return a.status.classList.remove("dsu-in"),a.subEn.classList.remove("dsu-in"),a.rule.classList.remove("dsu-in"),a.reticle.classList.remove("dsu-in"),Gn(),a.center.classList.add("dsu-off"),a.dots.hidden=!0,se(360).then(function(){return a.welcome.classList.add("dsu-in"),a.idline.classList.remove("dsu-in"),se(420)}).then(function(){var p=[a.w1,a.w2,a.w4];return p.forEach(function(v){v.classList.add("dsu-glitch"),v.setAttribute("data-text",v.textContent)}),a.w2.classList.add("dsu-glitch-box"),a.welcome.offsetWidth,p.forEach(function(v){v.classList.add("dsu-on")}),se(640)}).then(function(){return P.classList.add("dsu-peak"),a.bloom.classList.add("dsu-go"),a.streak.classList.add("dsu-go"),se(430)}).then(function(){return a.flash.style.transition="opacity "+Q(70)+"ms linear",a.flash.style.opacity="0.72",se(90)}).then(function(){return a.flash.style.transition="opacity "+Q(340)+"ms cubic-bezier(0.4, 0, 0.2, 1)",a.flash.style.opacity="0",se(320)}).then(function(){return b}).then(function(){return P.classList.add("dsu-handoff"),se(780)}).then(function(){return An()})}r(ir,"finale");function An(){if(!q){q=!0,ae(),Gn(),Oe.stop(),me&&(u(me),me=null);try{y.mode==="session"&&n.sessionStorage.setItem("dsh-startup-screen:shown","1"),y.mode==="daily"&&n.localStorage.setItem("dsh-startup-screen:day",new Date().toISOString().slice(0,10))}catch{}t.documentElement.classList.remove("dsu-lock"),t.documentElement.style.overflow="",t.body&&(t.body.style.overflow=""),P.classList.remove("dsu-boot"),P.classList.add("dsu-gone"),i(function(){P&&P.parentNode&&P.parentNode.removeChild(P);try{n.dispatchEvent(new CustomEvent("dsh-startup:done"))}catch{}},Q(900))}}r(An,"finish");function Wn(){F||q||(F=!0,ae(),An())}r(Wn,"requestSkip"),y.allowSkip&&a.skip?(a.skip.hidden=!1,a.skip.addEventListener("click",function(b){b.stopPropagation(),Wn()}),t.addEventListener("keydown",function(b){b.key==="Escape"&&Wn()})):a.skip&&(a.skip.hidden=!0),n.__DSH_STARTUP_API__={speak:r(function(b,p){Oe.say(b,p)},"speak"),speakName:r(function(b){return Oe.speakName(b)},"speakName"),get voice(){return Oe.current()},replay:R,skip:Wn,finish:An,config:y},t.documentElement.classList.add("dsu-lock"),t.documentElement.style.overflow="hidden",t.body&&(t.body.style.overflow="hidden"),Ke(.05),P.classList.remove("dsu-boot");function or(){P.lang=m("zh-CN","en"),$.forEach(function(b){b()})}r(or,"refreshLocale"),P.lang=m("zh-CN","en"),e.subscribeLocale?.(or),t.readyState==="loading"?t.addEventListener("DOMContentLoaded",function(){ct()}):ct()}r(Jt,"mountStartupRuntime");function Mr(e,{sound:n=!1,volume:t=.7,onEnded:i}={}){let s=e.ownerDocument,d=s.defaultView,u=e.shadowRoot??e.attachShadow({mode:"open"}),f=s.createElement("style");f.textContent=Kt+`
    #dsh-startup-root[lang="en"] .dsu-status.dsu-zhline {
      font-family: var(--dsu-din); font-size: clamp(15px, 2.8vw, 32px);
      letter-spacing: .04em; text-indent: .04em; white-space: normal;
      max-width: 86vw; text-align: center; justify-content: center;
    }
  `;let o=s.createElement("div");o.style.cssText="position:absolute;inset:0;width:100%;height:100%;overflow:hidden;background:#000;",u.replaceChildren(f,o);let l=!1,m=!1,c=new Set,w=new Set,h=new Set,A=new Set,I=[],y=new EventTarget,R=new EventTarget,B=Number.isFinite(Number(t))?Math.min(1,Math.max(0,Number(t))):.7,O=n===!0&&B>0,V=r(x=>({addEventListener(C,F,q){x.addEventListener(C,F,q),I.push(()=>x.removeEventListener(C,F,q))},removeEventListener:x.removeEventListener.bind(x),dispatchEvent:x.dispatchEvent.bind(x)}),"trackEvents"),M=r(()=>{let x=new Map;return{getItem:r(C=>x.get(String(C))??null,"getItem"),setItem:r((C,F)=>x.set(String(C),String(F)),"setItem"),removeItem:r(C=>x.delete(String(C)),"removeItem")}},"storage"),P=d.AudioContext||d.webkitAudioContext;function a(...x){if(l||!O||!P)throw new Error("Audio disabled");let C=new P(...x);return A.add(C),C}r(a,"ManagedAudioContext"),P&&(a.prototype=P.prototype);let $={...V(y),__DSH_STARTUP__:{enabled:!0,mode:"always",theme:"light",speed:1,requireInteraction:!1,allowSkip:!1,sound:O,soundVolume:B,voice:!1,voiceCue:!1,voiceSource:"tts",sfx:"synth"},__DSH_STARTUP_SKIP__:!1,AudioContext:a,webkitAudioContext:a,speechSynthesis:void 0,SpeechSynthesisUtterance:void 0,sessionStorage:M(),localStorage:M()},re={...V(R),readyState:"complete",body:o,documentElement:s.createElement("div"),head:s.createElement("div"),createElement:s.createElement.bind(s),createElementNS:s.createElementNS.bind(s),createTextNode:s.createTextNode.bind(s),createDocumentFragment:s.createDocumentFragment.bind(s),getElementById:r(x=>u.getElementById(x),"getElementById")},me={window:$,document:re,translate:nn,subscribeLocale(x){let C=wn(s).subscribe(x);return I.push(C),C},setTimeout(x,C,...F){if(l)return 0;let q=d.setTimeout(()=>{c.delete(q),l||x(...F)},C);return c.add(q),q},clearTimeout(x){c.delete(x),d.clearTimeout(x)},setInterval(x,C,...F){if(l)return 0;let q=d.setInterval(()=>{l||x(...F)},C);return w.add(q),q},clearInterval(x){w.delete(x),d.clearInterval(x)},requestAnimationFrame(x){if(l)return 0;let C=d.requestAnimationFrame(F=>{h.delete(C),l||x(F)});return h.add(C),C},cancelAnimationFrame(x){h.delete(x),d.cancelAnimationFrame(x)},fetch:r(()=>Promise.reject(new Error("External startup assets are disabled")),"fetch")};function pe(){if(!l){l=!0;try{$.__DSH_STARTUP_API__?.skip()}catch{}for(let x of c)d.clearTimeout(x);for(let x of w)d.clearInterval(x);for(let x of h)d.cancelAnimationFrame(x);c.clear(),w.clear(),h.clear();for(let x of A)try{x.close().catch(()=>{})}catch{}A.clear();for(let x of I)x();I.length=0,o.getAnimations({subtree:!0}).forEach(x=>x.cancel()),u.replaceChildren()}}r(pe,"dispose");function g(){m||l||(m=!0,pe(),i?.())}r(g,"complete"),$.addEventListener("dsh-startup:done",g,{once:!0});try{Jt(me)}catch(x){throw pe(),x}return pe}r(Mr,"mountStartupSequence");function Qt({sound:e=!1,volume:n=.7,onEnded:t}){let i=(0,rn.useRef)(null),s=(0,rn.useRef)(t);return s.current=t,(0,rn.useEffect)(()=>{if(i.current)try{return Mr(i.current,{sound:e,volume:n,onEnded:r(()=>s.current?.(),"onEnded")})}catch{s.current?.()}},[e,n]),rn.default.createElement("div",{ref:i,"data-testid":"startup-sequence","aria-hidden":"true",style:{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden",background:"#000"}})}r(Qt,"StartupSequence");var zr=new Set(["Control","Meta","Alt","Shift","AltGraph","OS"]);function Xt(e,n){return e.defaultPrevented||e.ctrlKey||e.metaKey||e.altKey||e.shiftKey||zr.has(e.key)||e.isComposing?!1:(e.preventDefault(),e.stopPropagation(),e.repeat||n(),!0)}r(Xt,"handlePlayerKey");var ot=new WeakMap;function Dr(e){let n=e.documentElement,t=ot.get(e);t||(t={count:0,previous:n.getAttribute("data-lewis-player")},ot.set(e,t)),t.count++,n.setAttribute("data-lewis-player","true");let i=!1;return()=>{i||(i=!0,!--t.count&&(t.previous===null?n.removeAttribute("data-lewis-player"):n.setAttribute("data-lewis-player",t.previous),ot.delete(e)))}}r(Dr,"acquirePlayerWindow");function sn(e={},{endOnly:n=!1,clipOnly:t=!1}={}){if(n)return{video:!1,end:!0};if(t)return{video:!0,end:!1};let i=e.enabled!==!1;return{video:typeof e.videoEnabled=="boolean"?e.videoEnabled:i,end:typeof e.endEnabled=="boolean"?e.endEnabled:i}}r(sn,"playbackStages");function Tn({settings:e}){let n=ne(),[t,i]=(0,U.useState)(!1);(0,U.useEffect)(()=>i(!1),[e.endImageId,e.logoVariant,e.endScreen]);let s=e.logoVariant||"silver",d=e.endScreen==="image"&&e.endImageId&&!t,u=e.endScreen!=="image"&&s!=="classic"&&!t,f=d?`${Ue}/end-image/${encodeURIComponent(e.endImageId)}`:u?`${Ue}/logo/${encodeURIComponent(s)}`:null;return U.default.createElement("div",{className:`bs-end-title bs-end-${d?"custom":s}`,"data-testid":"end-screen","data-logo":u?s:void 0},f?U.default.createElement("img",{className:"bs-end-image","data-testid":d?"end-image":"end-logo-image",src:f,alt:d?n("\u81EA\u5B9A\u4E49\u7ED3\u675F\u753B\u9762","Custom ending screen"):n("DeepSeek \u5185\u7F6E\u7ED3\u675F\u753B\u9762","DeepSeek built-in ending screen"),style:{objectFit:d&&e.endFit||"cover"},onError:()=>i(!0)}):U.default.createElement("div",{className:"bs-end-brand"},U.default.createElement("div",{className:"bs-end-halo"}),U.default.createElement("svg",{className:"bs-end-whale",viewBox:"0 0 50 50","aria-label":n("DeepSeek \u6807\u5FD7","DeepSeek logo"),role:"img"},U.default.createElement("path",{d:Fn})),U.default.createElement("h1",null,"DEEPSEEK"),U.default.createElement("p",null,"HARNESS"),U.default.createElement("div",{className:"bs-end-rule"})),U.default.createElement("p",{className:"bs-enter-prompt"},n("\u70B9\u51FB\u8FDB\u5165 DeepSeek Harness","Click to enter DeepSeek Harness")))}r(Tn,"EndTitle");function jn({clip:e,settings:n={},onClose:t,endOnly:i=!1,clipOnly:s=!1}){let d=ne();xe();let u=be(),f=(0,U.useRef)(null),o=(0,U.useRef)(null),l=(0,U.useRef)(!1),m=(0,U.useRef)(null),c=sn(n,{endOnly:i,clipOnly:s}),w=c.video?"intro":c.end?"end":"idle",[h,A]=(0,U.useState)(w),I=(0,U.useRef)(w),y=(0,U.useRef)(-1e3),[R,B]=(0,U.useState)(!1),[O,V]=(0,U.useState)(!1),M=(0,U.useCallback)(()=>{let g=f.current;g&&(g.pause(),g.removeAttribute("src"),g.load())},[]),P=(0,U.useCallback)(g=>{l.current||(l.current=!0,M(),t(m.current||g))},[t,M]),a=(0,U.useCallback)(()=>{if(!(l.current||I.current==="end")){if(!c.end){P("complete");return}I.current="end",M(),A("end")}},[M,P,c.end]),$=(0,U.useCallback)(g=>{l.current||I.current!=="intro"||(m.current||=g,a())},[a]),re=(0,U.useCallback)(()=>{let g=performance.now();g-y.current<250||(y.current=g,I.current==="intro"?a():P("enter"))},[a,P]);(0,U.useEffect)(()=>{if(l.current=!1,I.current==="idle"){P("disabled");return}let g=o.current,x=document.activeElement,C=Dr(document);typeof g.showModal=="function"&&!g.open?g.showModal():g.setAttribute("open","");let F=r(q=>Xt(q,re),"key");return window.addEventListener("keydown",F,!0),g.focus(),()=>{l.current=!0,C(),window.removeEventListener("keydown",F,!0),g.open&&typeof g.close=="function"&&g.close(),x?.isConnected&&x.focus?.()}},[re,P]),(0,U.useEffect)(()=>{if(h!=="intro")return;if(e.kind==="sequence"){let q=setTimeout(()=>$("timeout"),12e4);return()=>clearTimeout(q)}let g=f.current;if(!g)return;let x=performance.now(),C=g.currentTime,F=setInterval(()=>{g.currentTime!==C&&(C=g.currentTime,x=performance.now()),performance.now()-x>3e4&&$("timeout")},1e3);return()=>{clearInterval(F),g.pause(),g.removeAttribute("src"),g.load()}},[h,e?.kind,$]),(0,U.useEffect)(()=>{if(h!=="intro"||e.kind==="sequence")return;let g=f.current,x=!0;return g.volume=n.volume??.7,g.muted=!n.sound,r(async()=>{try{await g.play(),(!x||l.current)&&g.pause()}catch{if(!x||l.current)return;if(n.sound&&!g.muted){g.muted=!0,V(!0);try{await g.play(),(!x||l.current)&&g.pause()}catch{x&&!l.current&&B(!0)}}else B(!0)}},"start")(),()=>{x=!1}},[e?.url,e?.kind,h,n.sound,n.volume,a]);let me=r(async g=>{g.stopPropagation();let x=f.current;x.muted=!1;try{await x.play(),V(!1),B(!1)}catch{x.muted=!0,B(!0)}},"enableSound"),pe=r(async g=>{g.stopPropagation();try{await f.current.play(),B(!1)}catch{$("play-error")}},"playManually");return h==="idle"?null:U.default.createElement("dialog",{ref:o,className:"bs-player","data-testid":"player","data-phase":h,...u,"aria-label":h==="end"?d("DeepSeek \u6807\u9898\u754C\u9762","DeepSeek title screen"):d(`\u5F00\u673A\u52A8\u753B\uFF1A${fe(e)}`,`Startup animation: ${fe(e)}`),tabIndex:-1,onCancel:g=>{g.preventDefault(),re()},onPointerDown:g=>{g.target.closest("[data-bs-control]")||re()}},h==="end"?U.default.createElement(Tn,{settings:n}):U.default.createElement(U.default.Fragment,null,e.kind==="sequence"?U.default.createElement(Qt,{sound:n.sound,volume:n.volume,onEnded:a}):U.default.createElement("video",{"data-testid":"boot-video",ref:f,src:e.url,loop:!1,playsInline:!0,preload:"auto",style:{objectFit:"cover"},onPlaying:()=>B(!1),onEnded:a,onError:()=>$("media-error")}),R&&U.default.createElement("button",{"data-bs-control":!0,type:"button",className:"bs-play-manual",onClick:pe},d("\u25B6 \u70B9\u51FB\u64AD\u653E","\u25B6 Click to play")),O&&U.default.createElement("button",{"data-bs-control":!0,type:"button",className:"bs-sound",onClick:me},d("\u266A \u5F00\u542F\u58F0\u97F3","\u266A Enable sound")),U.default.createElement("p",{className:"bs-intro-prompt"},d("\u6309\u4EFB\u610F\u952E\u8DF3\u8FC7\u52A8\u753B","Press any key to skip"))))}r(jn,"Player");function kn({label:e,description:n,checked:t,onChange:i,disabled:s}){return E.default.createElement("label",{className:"bs-toggle-row"},E.default.createElement("span",null,E.default.createElement("strong",null,e),n&&E.default.createElement("small",null,n)),E.default.createElement("input",{type:"checkbox",role:"switch",checked:t,onChange:d=>i(d.target.checked),disabled:s}),E.default.createElement("span",{className:"bs-switch","aria-hidden":"true"}))}r(kn,"Toggle");function mn({standalone:e=!1,updateTools:n}){let t=ne();xe();let i=be(),[s,d]=(0,E.useState)(Ve),[u,f]=(0,E.useState)(""),[o,l]=(0,E.useState)(""),[m,c]=(0,E.useState)(!1),[w,h]=(0,E.useState)(null),[A,I]=(0,E.useState)(null),[y,R]=(0,E.useState)(null),[B,O]=(0,E.useState)(!1),[V,M]=(0,E.useState)(!1),[P,a]=(0,E.useState)(!1),[$,re]=(0,E.useState)(null),me=(0,E.useRef)(null),pe=(0,E.useRef)(null),g=(0,E.useRef)(!0),x=(0,E.useRef)(null);(0,E.useEffect)(()=>{g.current=!0;let W=r(ce=>d(ce),"update");return De.add(W),te("/state").then(ke).catch(ce=>{g.current&&f(ce)}),te("/telemetry").then(ce=>{g.current&&re(ce)}).catch(()=>{}),()=>{g.current=!1,De.delete(W),x.current?.cancel()}},[]);async function C(W){if(!m){c(!0),f(""),l("");try{ke(await te("/settings",{method:"POST",body:JSON.stringify(W)})),l("\u8BBE\u7F6E\u5DF2\u4FDD\u5B58\uFF0C\u4E0B\u6B21\u542F\u52A8\u751F\u6548")}catch(ce){f(ce)}finally{g.current&&c(!1)}}}r(C,"save");async function F(){if(m)throw Error("\u8BF7\u7B49\u5F85\u5F53\u524D\u64CD\u4F5C\u5B8C\u6210\u540E\u518D\u6062\u590D\u9ED8\u8BA4\u3002");c(!0),f(""),l("");try{ke(await te("/reset",{method:"POST",body:JSON.stringify({confirm:"reset-all-custom-data"})})),l("\u5DF2\u6062\u590D\u9ED8\u8BA4\uFF0C\u5168\u90E8\u4E0A\u4F20\u7684\u89C6\u9891\u548C\u56FE\u7247\u5DF2\u5220\u9664\u3002")}catch(W){throw await te("/state").then(ke).catch(()=>{}),W}finally{g.current&&c(!1)}}r(F,"restoreDefaults");async function q(W){c(!0),f("");try{ke(await te("/clips/"+encodeURIComponent(W.id),{method:"DELETE"})),l("\u89C6\u9891\u5DF2\u79FB\u9664"),I(null)}catch(ce){f(ce)}finally{g.current&&c(!1)}}r(q,"remove");async function ve(W){c(!0),f("");try{ke(await te("/end-images/"+encodeURIComponent(W.id),{method:"DELETE"})),l("\u7ED3\u675F\u753B\u9762\u5DF2\u79FB\u9664"),R(null)}catch(ce){f(ce)}finally{g.current&&c(!1)}}r(ve,"removeEndImage");function Q(W,ce){if(!W||m||x.current)return;c(!0),f(""),l("");let je=ce==="image",Je=$t(W,{kind:ce,maxBytes:je?s?.maxImageUploadBytes:s?.maxUploadBytes,onPhase:r(He=>{g.current&&l(He==="probe"?je?"\u6B63\u5728\u68C0\u67E5\u7ED3\u675F\u753B\u9762\u2026":"\u6B63\u5728\u68C0\u67E5\u89C6\u9891\u2026":je?"\u6B63\u5728\u4E0A\u4F20\u56FE\u7247\u2026":"\u6B63\u5728\u4E0A\u4F20\u2026")},"onPhase"),onProgress:r(He=>{g.current&&h(He)},"onProgress")});x.current=Je,Je.promise.then(He=>{g.current&&(ke(He.state),l(je?"\u56FE\u7247\u5DF2\u4E0A\u4F20\u5E76\u8BBE\u4E3A\u7ED3\u675F\u753B\u9762":"\u89C6\u9891\u5DF2\u5BFC\u5165\u5E76\u8BBE\u4E3A\u5F00\u673A\u52A8\u753B"))}).catch(He=>{g.current&&(f(He),l(""))}).finally(()=>{x.current===Je&&(x.current=null),g.current&&(c(!1),h(null))})}r(Q,"importMedia");let se=r(W=>Q(W,"image"),"uploadEndImage"),an=r(W=>Q(W,"video"),"upload"),ae=s?.settings,Ke=s?.clips.find(W=>W.id===ae.selectedId)||s?.clips[0],on=sn(ae);return E.default.createElement("section",{className:"bs-studio","data-testid":"settings",...i},E.default.createElement("div",{className:"bs-heading"},E.default.createElement("div",null,E.default.createElement("div",{className:"bs-eyebrow"},"DSH LEWIS ENCHANTMENT"),E.default.createElement("h1",null,t("\u9644\u9B54\u53F0","Enchantment"),E.default.createElement("span",null,t("\u5F00\u673A\u52A8\u753B","Startup animation"))),E.default.createElement("p",null,t("\u81EA\u5B9A\u4E49\u4F60\u7684\u5F00\u573A\uFF0C\u5C01\u9762\u4E0E\u58F0\u97F3\u3002","Customize your intro, cover and sound."))),st&&E.default.createElement("span",{className:"bs-version"},"V",st)),E.default.createElement("div",{className:"bs-preferences bs-animation-settings"},E.default.createElement("div",{className:"bs-toolbar"},E.default.createElement("h2",null,t("\u52A8\u753B\u7247\u5E93","Animation library")),E.default.createElement("button",{className:"bs-primary",type:"button",disabled:m||!Ke,onClick:()=>Un(Ke,{...ae,enabled:!0,videoEnabled:!0,endEnabled:!0})},t("\u25B6 \u9884\u89C8\u5F53\u524D\u5F00\u573A","\u25B6 Preview current intro"))),E.default.createElement("div",{className:"bs-animation-content"},u&&E.default.createElement("div",{className:"bs-alert",role:"alert"},ze(u),E.default.createElement("button",{type:"button",onClick:()=>{f(""),te("/state").then(ke).catch(W=>f(W))}},t("\u91CD\u8BD5","Retry"))),E.default.createElement("div",{className:"bs-notice",role:"status","aria-live":"polite"},m?w!==null?t(`\u6B63\u5728\u4E0A\u4F20 ${w}%`,`Uploading ${w}%`):ze(o)||t("\u6B63\u5728\u4FDD\u5B58\u2026","Saving\u2026"):ze(o)),ae&&E.default.createElement(E.default.Fragment,null,E.default.createElement(Yt,{state:s,settings:ae,busy:m,preview:Un,save:C,remove:q,pendingDelete:A,setPendingDelete:I,input:me,upload:an})),!s&&!u&&E.default.createElement("div",{className:"bs-loading"},t("\u6B63\u5728\u52A0\u8F7D\u7247\u5E93\u2026","Loading library\u2026")))),ae&&E.default.createElement(E.default.Fragment,null,E.default.createElement(Zt,{state:s,settings:ae,busy:m,preview:Un,save:C,imageInput:pe,uploadEndImage:se,removeEndImage:ve,pendingImageDelete:y,setPendingImageDelete:R,EndTitleComponent:Tn}),E.default.createElement("div",{className:"bs-section-title"},E.default.createElement("h2",null,t("\u64AD\u653E\u504F\u597D","Playback preferences"))),E.default.createElement("div",{className:"bs-preferences"},E.default.createElement(kn,{label:t("\u5F00\u673A\u52A8\u753B","Startup animation"),checked:on.video,disabled:m,onChange:W=>C({videoEnabled:W})}),E.default.createElement(kn,{label:t("\u7ED3\u675F\u505C\u7559\u753B\u9762","Ending screen"),checked:on.end,disabled:m,onChange:W=>C({endEnabled:W})}),E.default.createElement(kn,{label:t("\u64AD\u653E\u58F0\u97F3","Play sound"),checked:ae.sound,disabled:m,onChange:W=>C({sound:W})}),E.default.createElement(kn,{label:t("\u968F\u673A\u5F00\u573A","Shuffle intros"),checked:ae.shuffle,disabled:m,onChange:W=>C({shuffle:W})})),E.default.createElement(Vt,{request:te,standalone:e,...n}),E.default.createElement("div",{className:"bs-section-title bs-entry-title"},E.default.createElement("h2",null,t("\u8FDB\u5165\u65B9\u5F0F","Quick access"))),E.default.createElement("div",{className:"bs-preferences"},E.default.createElement(kn,{label:t("\u663E\u793A\u4FA7\u680F\u5FEB\u6377\u5165\u53E3","Show sidebar shortcut"),description:t("\u5728\u5934\u50CF\u4E0A\u65B9\u663E\u793A\u201C\u5F00\u673A\u52A8\u753B\u201D\uFF1B\u5173\u95ED\u540E\u4ECD\u53EF\u4ECE\u8BBE\u7F6E\u8FDB\u5165\u3002\u9644\u9B54\u53F0\u7CFB\u5217\u6700\u591A\u663E\u793A17\u4E2A\u5FEB\u6377\u5165\u53E3\u3002","Show Startup animation above your avatar. You can always open it from Settings. The Enchantment series supports up to 17 shortcuts."),checked:ae.showShortcut??!1,disabled:m,onChange:W=>C({showShortcut:W})})),E.default.createElement("div",{className:"bs-reset-area"},E.default.createElement("div",null,E.default.createElement("strong",null,t("\u6062\u590D\u9ED8\u8BA4","Restore defaults")),E.default.createElement("p",null,t("\u91CD\u7F6E\u6240\u6709\u8BBE\u7F6E\uFF0C\u6C38\u4E45\u5220\u9664\u5168\u90E8\u4E0A\u4F20\u7684\u89C6\u9891\u548C\u56FE\u7247\uFF0C\u4EC5\u4FDD\u7559\u5185\u7F6E\u7D20\u6750\u3002","Reset all settings and permanently delete all uploaded videos and images. Built-in media will be kept."))),E.default.createElement("button",{className:"bs-reset-open",type:"button",disabled:m,onClick:()=>O(!0)},t("\u6062\u590D\u9ED8\u8BA4","Restore defaults"))),B&&E.default.createElement(Ft,{settings:ae,onCancel:()=>O(!1),onConfirm:F}),E.default.createElement("div",{className:"bs-author-entry"},E.default.createElement("span",null,t("\u70B9\u51FB\u4E86\u89E3\u66F4\u591A\u4F5C\u8005\u4FE1\u606F","Learn more about the author")),E.default.createElement("button",{type:"button","aria-label":t("\u67E5\u770B\u4F5C\u8005\u4FE1\u606F","View author information"),onClick:()=>M(!0)},t("\u67E5\u770B","View"),E.default.createElement("span",{"aria-hidden":"true"},"\u2197")),E.default.createElement("button",{type:"button","data-testid":"share-data-entry",onClick:()=>a(!0)},t("\u4E0E\u5F00\u53D1\u8005\u5171\u4EAB\u6570\u636E","Share data with the developer"),$?.enabled?t(" \xB7 \u5DF2\u5F00\u542F"," \xB7 On"):$?.withdrawalPending?t(" \xB7 \u5220\u9664\u5F85\u91CD\u8BD5"," \xB7 Deletion pending"):"")),V&&E.default.createElement(jt,{settings:ae,onClose:()=>M(!1)}),P&&E.default.createElement(Wt,{onClose:()=>a(!1),onStatus:re})))}r(mn,"SettingsPanel");var J=ye(require("react"),1);function dt(){let e=ne();xe();let n=be(),[t,i]=(0,J.useState)(null),[s,d]=(0,J.useState)(!1),[u,f]=(0,J.useState)(""),o=(0,J.useRef)(null);(0,J.useEffect)(()=>()=>clearTimeout(o.current),[]);let[l,m]=(0,J.useState)(Pe.decisionSettled),[c,w]=(0,J.useState)(Ve),[h,A]=(0,J.useState)(()=>qe.getSnapshot()),[I,y]=(0,J.useState)(!1),R=(0,J.useCallback)(O=>i({...O,key:Date.now()}),[]);(0,J.useEffect)(()=>{let O=r(M=>R(M.detail),"playEvent"),V=r(()=>d(!0),"open");return window.addEventListener(Hn,O),window.addEventListener(pn,V),()=>{window.removeEventListener(Hn,O),window.removeEventListener(pn,V)}},[R]),(0,J.useEffect)(()=>{Pe.telemetryRequest||=te("/telemetry/launch",{method:"POST",body:JSON.stringify(Sn())}).catch(()=>{});let O=r(M=>w(M),"stateChanged");De.add(O);let V=qe.subscribe(A);return A(qe.getSnapshot()),qe.check(te),()=>{De.delete(O),V()}},[]),(0,J.useEffect)(()=>{if(Pe.bootClaimed){m(!0);return}let O=!0;return Pe.request||=te("/launch"),Pe.request.then(V=>{if(!O||Pe.bootClaimed)return;Pe.bootClaimed=!0,Pe.decisionSettled=!0,ke(V);let M=sn(V.settings);if(M.video||M.end){let P=V.clip||V.clips.find(a=>a.id===V.settings.selectedId)||V.clips[0];(P||M.end)&&R({clip:P,settings:V.settings})}m(!0)}).catch(()=>{O&&(Pe.bootClaimed=!0,Pe.decisionSettled=!0,m(!0))}),()=>{O=!1}},[R]),(0,J.useEffect)(()=>{if(y(!1),!l||t||s||h.dismissed||!Le(h.status))return;let O=null,V=!0,M=r(()=>Array.from(document.querySelectorAll('dialog[open],[role="dialog"][aria-modal="true"]')).some($=>$.matches('[data-testid="startup-update"]:not([data-preview])')?!1:$.getClientRects().length>0&&getComputedStyle($).visibility!=="hidden"),"blocked"),P=r(()=>{O!==null&&(clearTimeout(O),O=null),!(!V||M())&&(O=setTimeout(()=>{O=null,V&&!M()&&(y(!0),a?.disconnect())},250))},"schedule"),a=typeof MutationObserver=="function"?new MutationObserver(P):null;return a?.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["open","hidden","style","aria-hidden"]}),P(),()=>{V=!1,clearTimeout(O),a?.disconnect()}},[l,t,s,h]);let B=(0,J.useCallback)(O=>{i(null),["media-error","load-error","play-error","timeout"].includes(O)&&(f(O),clearTimeout(o.current),o.current=setTimeout(()=>f(""),6500))},[]);return(0,J.useEffect)(()=>{if(!s)return;let O=r(V=>{V.key==="Escape"&&!t&&!document.querySelector("dialog[open]")&&d(!1)},"key");return window.addEventListener("keydown",O),()=>window.removeEventListener("keydown",O)},[s,t]),J.default.createElement(J.default.Fragment,null,s&&J.default.createElement("div",{className:"bs-modal",...n,onClick:O=>{O.target===O.currentTarget&&d(!1)}},J.default.createElement("div",{role:"dialog","aria-modal":"true","aria-label":e("\u5F00\u673A\u52A8\u753B\u8BBE\u7F6E","Startup animation settings"),className:"bs-modal-body"},J.default.createElement("button",{type:"button",className:"bs-modal-close",onClick:()=>d(!1)},e("\u5173\u95ED \xD7","Close \xD7")),J.default.createElement(mn,null))),t&&J.default.createElement(jn,{key:t.key,clip:t.clip,settings:t.settings,endOnly:t.endOnly,clipOnly:t.clipOnly,onClose:B}),I&&!t&&!s&&!h.dismissed&&Le(h.status)&&J.default.createElement(qn,{request:te,status:h.status,settings:c?.settings,onDismiss:()=>qe.dismiss(),onUpdated:O=>qe.updated(O)}),u&&J.default.createElement("div",{className:"bs-toast",...n,role:"status"},e("\u52A8\u753B\u672A\u80FD\u64AD\u653E\uFF0C\u5DF2\u4E3A\u4F60\u8FDB\u5165 Harness\u3002\u53EF\u5728\u8BBE\u7F6E\u4E2D\u66F4\u6362\u89C6\u9891\u3002","The animation could not play. Harness is ready. Choose another video in Settings.")))}r(dt,"BootRoot");var Fe=ye(require("react"),1);var er=Symbol.for("dsh.lewis.enchant.shortcuts.v1");function Hr(){let e=new Map,n=new Set,t=Object.freeze({limit:17,count:0,visibleIds:Object.freeze([]),waitingIds:Object.freeze([])});function i(){let s=[...e.keys()];t=Object.freeze({limit:17,count:Math.min(s.length,17),visibleIds:Object.freeze(s.slice(0,17)),waitingIds:Object.freeze(s.slice(17))});for(let d of[...n])try{d()}catch{}}return r(i,"publish"),Object.freeze({version:1,limit:17,getSnapshot:r(()=>t,"getSnapshot"),isVisible:r(s=>t.visibleIds.includes(s),"isVisible"),subscribe(s){if(typeof s!="function")throw new TypeError("\u5FEB\u6377\u5165\u53E3\u76D1\u542C\u5668\u5FC5\u987B\u662F\u51FD\u6570\u3002");n.add(s);let d=!0;return()=>{d&&(d=!1,n.delete(s))}},acquire(s){if(typeof s!="string"||!s||s.length>128||s!==s.trim()||/[\x00-\x1f\x7f]/.test(s))throw new TypeError("\u5FEB\u6377\u5165\u53E3\u9700\u8981\u7A33\u5B9A\u4E14\u6709\u6548\u7684\u63D2\u4EF6 ID\u3002");let d=Symbol(s),u=e.get(s);u||(u=new Set,e.set(s,u)),u.add(d),u.size===1&&i();let f=!0;return()=>{if(!f)return;f=!1;let o=e.get(s);!o||!o.delete(d)||o.size||(e.delete(s),i())}}})}r(Hr,"createRegistry");function nr(e=globalThis){if((!e||typeof e!="object")&&typeof e!="function")throw new TypeError("\u5FEB\u6377\u5165\u53E3\u9700\u8981\u5171\u4EAB\u7A97\u53E3\u4F5C\u7528\u57DF\u3002");let n=e[er];if(n||(n=Hr(),Object.defineProperty(e,er,{value:n,enumerable:!1})),n.version!==1||n.limit!==17||!["acquire","subscribe","isVisible","getSnapshot"].every(t=>typeof n[t]=="function"))throw new Error("\u9644\u9B54\u53F0\u5FEB\u6377\u5165\u53E3\u5171\u4EAB\u534F\u8BAE\u4E0D\u517C\u5BB9\u3002");return n}r(nr,"getShortcutRegistry");function lt(){let e=ne(),n=be(),[t,i]=(0,Fe.useState)(Ve),s=nr(),[d,u]=(0,Fe.useState)(()=>s.getSnapshot()),f=t?.settings.showShortcut===!0;return(0,Fe.useEffect)(()=>{let o=r(l=>i(l),"changed");return De.add(o),Ve?i(Ve):te("/state").then(ke).catch(()=>{}),()=>De.delete(o)},[]),(0,Fe.useEffect)(()=>s.subscribe(()=>u(s.getSnapshot())),[s]),(0,Fe.useEffect)(()=>{if(f)return s.acquire(_e)},[f,s]),!f||!d.visibleIds.includes(_e)?null:Fe.default.createElement("button",{type:"button",title:e("\u5F00\u673A\u52A8\u753B","Startup animation"),"aria-label":e("\u5F00\u673A\u52A8\u753B","Startup animation"),onClick:Bn,...n,style:{...n.style,border:0,background:"transparent",color:"var(--lewis-accent,currentColor)",cursor:"pointer",padding:8,font:"inherit"}},"\u25B7")}r(lt,"ShortcutAction");function Br(e){let n=r(t=>{let i=r(()=>{let s=Gt(t),d=en(),u,f=r(()=>{u?.(),u=d.registerPlugin({id:_e,name:nn("\u5F00\u673A\u52A8\u753B","Startup animation"),sectionId:"dsh-boot-studio-settings",renderSettings:r(()=>Cn.default.createElement(mn),"renderSettings"),openSettings:r(()=>window.dispatchEvent(new Event(pn)),"openSettings")})},"updateName");f();let o=Pt(f);try{return t.slots.inject("shell.overlay",()=>t.slots.register({name:"shell.overlay",id:"dsh-boot-studio-overlay",order:950},()=>Cn.default.createElement(dt))),t.slots.inject("settings.section",()=>It({slots:t.slots,registry:d,pluginId:_e,register:r(()=>t.slots.register({name:"settings.section",id:"dsh-boot-studio-settings",order:80,label:r(()=>nn("\u5F00\u673A\u52A8\u753B","Startup animation"),"label")},()=>Cn.default.createElement(mn)),"register")})),t.slots.inject("sidebar.footer.action",()=>t.slots.register({name:"sidebar.footer.action",id:"dsh-boot-studio-shortcut",order:42,label:r(()=>nn("\u5F00\u673A\u52A8\u753B","Startup animation"),"label")},()=>Cn.default.createElement(lt))),()=>{s(),Et(),o(),u()}}catch(l){throw s(),o(),u(),l}},"register");return typeof t.effect=="function"?t.effect(i,"dsh-boot-studio: slots"):i()},"wire");if(typeof e.inject=="function"){let t=r(s=>{let d=r(()=>Pn({pluginManager:s.remote?.pluginManager}),"bind");return typeof s.effect=="function"?s.effect(d,"dsh-boot-studio: installer"):d()},"bindInstaller"),i=r(s=>{let d=r(()=>Pn({pluginNavigation:s.pluginNavigation}),"bind");return typeof s.effect=="function"?s.effect(d,"dsh-boot-studio: navigation"):d()},"bindNavigation");return e.inject(["remote","remote.pluginManager"],t),e.inject(["pluginNavigation"],i),e.inject(["locale"],s=>typeof s.effect=="function"?s.effect(()=>xn(s.locale)):xn(s.locale)),e.inject(["slots"],n)}else{let t=Pn({pluginManager:e.remote?.pluginManager,pluginNavigation:e.pluginNavigation}),i=e.locale?xn(e.locale):()=>{},s=e.slots?n(e):void 0;return()=>{typeof s=="function"&&s(),i(),t()}}}r(Br,"apply");
return module.exports; } });
