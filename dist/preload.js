var __webpack_modules__={967:(e,_,t)=>{t.d(_,{GQ:()=>p,SV:()=>r,XA:()=>n,ac:()=>c,iD:()=>o,iP:()=>a,lG:()=>i,yd:()=>s});const r="pccompat-main-event",o="pccompat-compile-sass",n="pccompat-get-app-path",s="pccompat-open-devtools",c="pccompat-get-window-data",a="pccompat-run-command",i="pccompat-expose-process-global",p="pccompat-handle-callback"},27:(e,_,t)=>{function r(e){const _=[];for(const t in e)_.push(t);return _}function o(e,_={},t){return Array.isArray(t)||(t=r(e)),t.reduce(((_,t)=>("object"!=typeof e[t]||Array.isArray(e[t])||null===e[t]?"function"==typeof e[t]?_[t]=e[t].bind(e):_[t]=e[t]:_[t]=o(e[t],{}),_)),_)}t.d(_,{RR:()=>r,kI:()=>o})},50:(e,_,t)=>{t.r(_),t.d(_,{crypto:()=>m,electron:()=>O,fs:()=>N,http:()=>s,https:()=>n,native:()=>o,net:()=>C,os:()=>F(),path:()=>I(),querystring:()=>i(),stream:()=>w,tls:()=>T(),updater:()=>r,url:()=>c,util:()=>k(),zlib:()=>B()});var r={};t.r(r),t.d(r,{update:()=>H});var o={};t.r(o),t.d(o,{loadLibrary:()=>J});var n={};t.r(n),t.d(n,{get:()=>V,request:()=>X});var s={};t.r(s),t.d(s,{get:()=>re,request:()=>oe});var c={};t.r(c),t.d(c,{parse:()=>se});const a=require("querystring");var i=t.n(a),p=t(496),d=t.n(p),l=t(922);const{contextIsolated:u=!0}=process,E=(0,l.kI)(d().ipcRenderer),P=u?{ipcRenderer:Object.assign(E,{_events:null,_listeners:()=>Object.keys(d().ipcRenderer._events),_isArray:e=>Array.isArray(d().ipcRenderer._events[e]),removeListener(e,_){if(_.$$type!==Symbol.for("PC_IPC_RENDERER_LISTENER"))throw new Error("Listener is not a valid electron listener.");const{event:t,index:r}=_,o=d().ipcRenderer.listeners(t);d().ipcRenderer.removeListener(t,o[r])},removeAllListeners(e){d().ipcRenderer.removeAllListeners(e)}}),shell:d().shell,clipboard:d().clipboard,contextBridge:d().contextBridge}:t(496),O=P,f=require("crypto");var b=t.n(f);const m=Object.fromEntries(Object.keys(b()).map((e=>[e,b()[e]]))),M=require("stream");var D=t.n(M);const v={default:D()};for(const e in D())v[e]=D()[e];const w=v,h=require("net");var g=t.n(h);const C=Object.fromEntries(Object.keys(g()).map((e=>[e,g()[e]])));var y=t(423),I=t.n(y);const R=require("util");var k=t.n(R);const A=require("zlib");var B=t.n(A);const L=require("tls");var T=t.n(L),q=t(231),U=t.n(q);const{contextIsolated:W=!0}=process,K={},x=new Set(["stat","statSync"]),j=e=>{if("object"!=typeof e||null===e)return e;let _={};for(const t in e)_[t]="function"==typeof e[t]?e[t].bind(e):e[t];return _},S=(e="",_=!1,t=new Set)=>{const r={},o=e?U()[e]:U();for(const e of Object.keys(o))t.has(e)||("function"==typeof o[e]?r[e]=x.has(e)?(...t)=>{if(_)return o[e](...t).then(j);if(e.endsWith("Sync"))return j(o[e](...t));{const _=t[t.length-1];t[t.length-1]=(...e)=>_(...e.map(j)),o[e](...t)}}:(..._)=>o[e](..._):r[e]=o[e]);Object.assign(K,e?{[e]:r}:r)};S(void 0,void 0,new Set(["promises"])),S("promises",!0);const N=W?K:U(),Z=require("os");var F=t.n(Z);const G=require("https");var z=t.n(G);const H=async(e,_,r)=>{const{promises:o}=await Promise.resolve().then(t.t.bind(t,788,23)),n=await new Promise((_=>{const t=function(e){z().get(e,{headers:{"User-Agent":"Kernel-mod pc-compat",Accept:r}},(e=>{if(301===e.statusCode||302===e.statusCode)return t(e.headers.location);const r=[];e.on("data",(e=>r.push(e))),e.on("end",(()=>{_(Buffer.concat(r))}))}))};t(e)}));return o.writeFile(_,n)};function J(e){return t(6)(e)}const Q=["data","end","close"],$=["statusCode","statusMessage","url","headers","method","aborted","complete","rawHeaders","end"];function V(...e){const _=(0,l.C6)(),t=z().get(...e,(e=>{for(const t of Q)e.on(t,((...r)=>{"end"===t&&r.unshift(Object.fromEntries($.map((_=>[_,e[_]])))),_.emit(t,...r)}))}));return Object.assign(_,{end:()=>t.end()}),_}const X=V,Y=require("http");var ee=t.n(Y);const _e=["data","end","close"],te=["statusCode","statusMessage","url","headers","method","aborted","complete","rawHeaders","end"];function re(e,_){const t=(0,l.C6)(),r=ee().get(e,_,(e=>{for(const _ of _e)e.on(_,((...r)=>{"end"===_&&r.unshift(Object.fromEntries(te.map((_=>[_,e[_]])))),t.emit(_,...r)}))}));return Object.assign(t,{end:()=>r.end()}),t}const oe=re,ne=require("url"),se=t.n(ne)().parse},278:(e,_,t)=>{t.d(_,{Z:()=>n});var r=t(496),o=t(967);const n=function(){const e={},_={on:(t,r)=>(e[t]||(e[t]=new Set),e[t].add(r),_.off.bind(null,t,r)),off(_,t){e[_]&&e[_].delete(t)},once(e,t){const r=_.on(e,((...e)=>(r(),t(...e))))},dispatch(_,...t){if(e[_])for(const r of e[_])try{r(...t)}catch(e){console.error(e)}},sendMain:(e,..._)=>r.ipcRenderer.sendSync(o.SV,e,..._),emit:(e,...t)=>_.dispatch(e,...t)};return{IPC:_,events:e}}},196:(e,_,t)=>{t.d(_,{Z:()=>d});var r=t(967),o=t(27),n=t(423),s=t.n(n),c=t(278);const a=new Map,{IPC:i}=(0,c.Z)(),p=(0,o.kI)(process);i.on(r.GQ,((e,..._)=>{if(a.has(e))for(const t of a.get(e))try{t(..._)}catch(e){console.error(e)}})),Object.assign(p.env,{injDir:s().resolve(__dirname,"..","..","bd-compat")}),Object.assign(p,{on:(e,_)=>{a.has(e)||function(e){a.set(e,new Set),process.on(e,((..._)=>{i.emit(r.GQ,e,_)}))}(e),a.get(e).add(_)},off:(e,_)=>{if(a.has(e))return a.get(e).delete(_)}});const d=p},637:(e,_,t)=>{t.d(_,{Z:()=>d});var r=t(496),o=t(423),n=t.n(o),s=t(231),c=t.n(s),a=t(967),i=t(472),p=t.n(i);function d(e){const{windowOptions:_}=r.ipcRenderer.sendSync(a.ac);_.webPreferences.nativeWindowOpen||(p()._extensions[".scss"]=(e,_)=>{const t=r.ipcRenderer.sendSync(a.iD,_);return e.filecontent=t,e.exports=t,t},p()._extensions[".css"]=(e,_)=>{const t=c().readFileSync(_,"utf8");return e.filecontent=t,e.exports=t,e.exports},window.onload=()=>{let _={};try{const t=n().resolve(e.getBasePath(),"config","themes.json");c().existsSync(t)&&(_=JSON.parse(c().readFileSync(t,{encoding:"utf-8"})))}catch(e){console.error("Couldn't read theme settings file, is it corrupt?",e)}for(const[r,o]of Object.entries(_))if(o)try{const _=n().resolve(e.getBasePath(),"themes",r),o=n().resolve(_,"powercord_manifest.json"),s=JSON.parse(c().readFileSync(o,{encoding:"utf-8"}));if(!s?.splashTheme)continue;const a=t(380)(n().resolve(_,s.splashTheme)),i=document.createElement("style");i.id=r,i.innerHTML=a,document.head.appendChild(i)}catch(e){console.error(`Couldn't initialize ${r}`,e)}})}},922:(e,_,t)=>{t.d(_,{BC:()=>s,C6:()=>a,kI:()=>n.kI,sb:()=>c});var r=t(423),o=t.n(r),n=t(27);const s="dist"!==o().basename(__dirname),c=s?__dirname:o().resolve(__dirname,"..");function a(){const e={},_={on:(_,t)=>(e[_]||(e[_]=new Set),e[_].add(t),()=>e[_].delete(t)),off:(_,t)=>Boolean(e[_]?.delete(t)),emit(t,...r){if("all"!==t&&"all"in e&&_.emit("all",t,...r),t in e)for(const _ of e[t])_(...r)},events:()=>Object.keys(e)};return _}},6:e=>{function _(e){var _=new Error("Cannot find module '"+e+"'");throw _.code="MODULE_NOT_FOUND",_}_.keys=()=>[],_.resolve=_,_.id=6,e.exports=_},380:e=>{function _(e){var _=new Error("Cannot find module '"+e+"'");throw _.code="MODULE_NOT_FOUND",_}_.keys=()=>[],_.resolve=_,_.id=380,e.exports=_},496:e=>{e.exports=require("electron")},231:e=>{e.exports=require("fs")},472:e=>{e.exports=require("module")},788:e=>{e.exports=require("original-fs")},423:e=>{e.exports=require("path")}},__webpack_module_cache__={},leafPrototypes,getProto;function __webpack_require__(e){var _=__webpack_module_cache__[e];if(void 0!==_)return _.exports;var t=__webpack_module_cache__[e]={exports:{}};return __webpack_modules__[e](t,t.exports,__webpack_require__),t.exports}__webpack_require__.n=e=>{var _=e&&e.__esModule?()=>e.default:()=>e;return __webpack_require__.d(_,{a:_}),_},getProto=Object.getPrototypeOf?e=>Object.getPrototypeOf(e):e=>e.__proto__,__webpack_require__.t=function(e,_){if(1&_&&(e=this(e)),8&_)return e;if("object"==typeof e&&e){if(4&_&&e.__esModule)return e;if(16&_&&"function"==typeof e.then)return e}var t=Object.create(null);__webpack_require__.r(t);var r={};leafPrototypes=leafPrototypes||[null,getProto({}),getProto([]),getProto(getProto)];for(var o=2&_&&e;"object"==typeof o&&!~leafPrototypes.indexOf(o);o=getProto(o))Object.getOwnPropertyNames(o).forEach((_=>r[_]=()=>e[_]));return r.default=()=>e,__webpack_require__.d(t,r),t},__webpack_require__.d=(e,_)=>{for(var t in _)__webpack_require__.o(_,t)&&!__webpack_require__.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:_[t]})},__webpack_require__.o=(e,_)=>Object.prototype.hasOwnProperty.call(e,_),__webpack_require__.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var __webpack_exports__={};(()=>{__webpack_require__.r(__webpack_exports__);var _ipc__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(278),electron__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(496),electron__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_1__),_common_util__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__(27),module__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__(472),module__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(module__WEBPACK_IMPORTED_MODULE_2__),path__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__(423),path__WEBPACK_IMPORTED_MODULE_3___default=__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_3__),_common_ipcevents__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__(967),_splash__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__(637),_process__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__(196),_util__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__(922),_bindings__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__(50);const{IPC,events}=(0,_ipc__WEBPACK_IMPORTED_MODULE_0__.Z)(),nodeModulesPath=path__WEBPACK_IMPORTED_MODULE_3___default().resolve(process.cwd(),"resources","app-original.asar","node_modules");module__WEBPACK_IMPORTED_MODULE_2___default().globalPaths.includes(nodeModulesPath)||module__WEBPACK_IMPORTED_MODULE_2___default().globalPaths.push(nodeModulesPath);const API={isPacked:_util__WEBPACK_IMPORTED_MODULE_6__.BC,getAppPath:()=>electron__WEBPACK_IMPORTED_MODULE_1__.ipcRenderer.sendSync(_common_ipcevents__WEBPACK_IMPORTED_MODULE_8__.XA),getBasePath:()=>_util__WEBPACK_IMPORTED_MODULE_6__.sb,executeJS(js){return eval(js)},setDevtools:e=>electron__WEBPACK_IMPORTED_MODULE_1__.ipcRenderer.invoke(_common_ipcevents__WEBPACK_IMPORTED_MODULE_8__.yd,e),runCommand:(e,_)=>electron__WEBPACK_IMPORTED_MODULE_1__.ipcRenderer.invoke(_common_ipcevents__WEBPACK_IMPORTED_MODULE_8__.iP,e,_),getBinding:e=>_bindings__WEBPACK_IMPORTED_MODULE_7__[e],IPC,cloneObject:_common_util__WEBPACK_IMPORTED_MODULE_9__.kI,getKeys:_common_util__WEBPACK_IMPORTED_MODULE_9__.RR};(0,_splash__WEBPACK_IMPORTED_MODULE_4__.Z)(API),Object.defineProperties(window,{PCCompatNative:{value:Object.assign({},API,{cloneObject:_common_util__WEBPACK_IMPORTED_MODULE_9__.kI,getKeys:_common_util__WEBPACK_IMPORTED_MODULE_9__.RR}),configurable:!0,writable:!0},PCCompatEvents:{value:events,configurable:!0,writable:!0}}),process.contextIsolated&&electron__WEBPACK_IMPORTED_MODULE_1__.contextBridge.exposeInMainWorld("PCCompatNative",API),IPC.on(_common_ipcevents__WEBPACK_IMPORTED_MODULE_8__.lG,(()=>{try{process.contextIsolated?electron__WEBPACK_IMPORTED_MODULE_1__.contextBridge.exposeInMainWorld("process",_process__WEBPACK_IMPORTED_MODULE_5__.Z):Object.defineProperty(window,"process",{value:_process__WEBPACK_IMPORTED_MODULE_5__.Z,configurable:!0})}catch(e){e.name="NativeError",console.error("Failed to expose process global:",e)}}))})();var __webpack_export_target__=exports;for(var i in __webpack_exports__)__webpack_export_target__[i]=__webpack_exports__[i];__webpack_exports__.__esModule&&Object.defineProperty(__webpack_export_target__,"__esModule",{value:!0});