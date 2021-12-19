'use strict';

var electron = require('electron');
var Module = require('module');
var path = require('path');
var fs = require('fs');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Module__default = /*#__PURE__*/_interopDefaultLegacy(Module);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);

// Main
const MAIN_EVENT = "pccompat-main-event";
const COMPILE_SASS = "pccompat-compile-sass";
const GET_APP_PATH = "pccompat-get-app-path";
const SET_DEV_TOOLS = "pccompat-open-devtools";
const GET_WINDOW_DATA = "pccompat-get-window-data";
// Preload
const EXPOSE_PROCESS_GLOBAL = "pccompat-expose-process-global";

const events = {
};
const IPC = {
    on (event, callback) {
        if (!events[event]) events[event] = new Set();
        return events[event].add(callback), IPC.off.bind(null, event, callback);
    },
    off (event, callback) {
        if (!events[event]) return;
        events[event].delete(callback);
    },
    once (event, callback) {
        const unsubscribe = IPC.on(event, (...args)=>{
            unsubscribe();
            return callback(...args);
        });
    },
    dispatch (event, ...args) {
        if (!events[event]) return;
        for (const callback of events[event]){
            try {
                callback(...args);
            } catch (error) {
                console.error(error);
            }
        }
    },
    sendMain (event, ...args) {
        return electron.ipcRenderer.sendSync(MAIN_EVENT, event, ...args);
    }
};

function getKeys(object) {
    const keys = [];
    for(const key in object)keys.push(key);
    return keys;
}
function cloneObject(target, newObject = {
}, keys) {
    if (!Array.isArray(keys)) keys = getKeys(target);
    return keys.reduce((clone, key)=>{
        if (typeof target[key] === "object" && !Array.isArray(target[key]) && target[key] !== null) clone[key] = cloneObject(target[key], {
        });
        else if (typeof target[key] === "function") clone[key] = target[key].bind(target);
        else clone[key] = target[key];
        return clone;
    }, newObject);
}

// @ts-nocheck
function handleSplash(API) {
    const { windowOptions  } = electron.ipcRenderer.sendSync(GET_WINDOW_DATA);
    if (!windowOptions.webPreferences.nativeWindowOpen) {
        Module__default["default"]._extensions[".scss"] = (module, filename)=>{
            const content = electron.ipcRenderer.sendSync(COMPILE_SASS, filename);
            module.filecontent = content;
            module.exports = content;
            return content;
        };
        Module__default["default"]._extensions[".css"] = (module, filename)=>{
            const content = fs__default["default"].readFileSync(filename, "utf8");
            module.filecontent = content;
            module.exports = content;
            return module.exports;
        }, window.onload = ()=>{
            let themes = {
            };
            try {
                const settings = path__default["default"].resolve(API.getBasePath(), "config", "themes.json");
                if (fs__default["default"].existsSync(settings)) themes = JSON.parse(fs__default["default"].readFileSync(settings, {
                    encoding: "utf-8"
                }));
            } catch (e) {
                console.error("Couldn't read theme settings file, is it corrupt?", e);
            }
            for (const [theme, enabled] of Object.entries(themes)){
                if (!enabled) continue;
                try {
                    const folder = path__default["default"].resolve(API.getBasePath(), "themes", theme);
                    const manifestPath = path__default["default"].resolve(folder, "powercord_manifest.json");
                    const manifest = JSON.parse(fs__default["default"].readFileSync(manifestPath, {
                        encoding: "utf-8"
                    }));
                    if (!manifest?.splashTheme) continue;
                    const styles = require(path__default["default"].resolve(folder, manifest.splashTheme));
                    const stylesheet = document.createElement("style");
                    stylesheet.id = theme;
                    stylesheet.innerHTML = styles;
                    document.head.appendChild(stylesheet);
                } catch (e) {
                    console.error(`Couldn't initialize ${theme}`, e);
                }
            }
        };
    }
}

const nodeModulesPath = path__default["default"].resolve(process.cwd(), "resources", "app-original.asar", "node_modules");
// @ts-ignore - Push modules
if (!Module__default["default"].globalPaths.includes(nodeModulesPath)) Module__default["default"].globalPaths.push(nodeModulesPath);
const API = {
    getAppPath () {
        return electron.ipcRenderer.sendSync(GET_APP_PATH);
    },
    getBasePath () {
        return path__default["default"].resolve(__dirname, "..");
    },
    executeJS (js) {
        return eval(js);
    },
    setDevtools (opened) {
        return electron.ipcRenderer.invoke(SET_DEV_TOOLS, opened);
    },
    IPC: IPC
};
// Splash screen
handleSplash(API);
// Expose Native bindings and cloned process global.
Object.defineProperties(window, {
    PCCompatNative: {
        value: Object.assign({
        }, API, {
            cloneObject,
            getKeys
        }),
        configurable: false,
        writable: false
    },
    PCCompatEvents: {
        value: events,
        configurable: false,
        writable: false
    }
});
electron.contextBridge.exposeInMainWorld("PCCompatNative", API);
IPC.on(EXPOSE_PROCESS_GLOBAL, ()=>{
    try {
        if (!process.contextIsolated) {
            Object.defineProperty(window, "process", {
                value: cloneObject(process),
                configurable: true
            });
        } else {
            electron.contextBridge.exposeInMainWorld("process", cloneObject(process));
        }
    } catch (error) {
        error.name = "NativeError";
        console.error("Failed to expose process global:", error);
    }
});
//# sourceMappingURL=preload.js.map
