"use strict";var Module=require("module"),path=require("path"),inspector=require("inspector"),sucrase=require("sucrase"),sass=require("sass"),electron=require("electron"),fs=require("fs"),main=require("@electron/remote/main");function _interopDefaultLegacy(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var Module__default=_interopDefaultLegacy(Module),path__default=_interopDefaultLegacy(path),sucrase__default=_interopDefaultLegacy(sucrase),sass__default=_interopDefaultLegacy(sass),fs__default=_interopDefaultLegacy(fs);process.argv.join("").includes("--debug")&&(inspector.open(),inspector.waitForDebugger());const COMPILE_SASS="pccompat-compile-sass",COMPILE_JSX="pccompat-compile-jsx",GET_APP_PATH="pccompat-get-app-path",SET_DEV_TOOLS="pccompat-open-devtools",GET_WINDOW_DATA="pccompat-get-window-data";electron.ipcMain.on(GET_APP_PATH,e=>{e.returnValue=electron.app.getAppPath()}),electron.ipcMain.on(GET_WINDOW_DATA,e=>{e.returnValue=e.sender.kernelWindowData}),electron.ipcMain.on(COMPILE_SASS,(e,t)=>{let o="";try{let e=sass__default.default.renderSync({file:t});o=e.css.toString()}catch(e){console.error(e)}e.returnValue=o}),electron.ipcMain.on(COMPILE_JSX,(e,t)=>{var o;fs__default.default.existsSync(t)?(o=fs__default.default.readFileSync(t,"utf8"),t=sucrase__default.default.transform(o,{transforms:["jsx","imports","typescript"],filePath:t}).code,e.returnValue=t):e.returnValue=""}),electron.ipcMain.handle(SET_DEV_TOOLS,(e,t)=>{const o=electron.BrowserWindow.fromWebContents(e.sender);o&&(t&&!o.webContents.isDevToolsOpened()?o.webContents.openDevTools():o.webContents.closeDevTools())}),main.initialize();const enableRemoteModule=function(e){console.log("[Powercord] Enabling remote module for",e.id),main.enable(e)};for(const{webContents:q}of electron.BrowserWindow.getAllWindows())enableRemoteModule(q);electron.app.on("browser-window-created",(e,{webContents:t})=>{enableRemoteModule(t)}),Module__default.default.globalPaths.push(path__default.default.resolve(__dirname,"..","..","node_modules"));
