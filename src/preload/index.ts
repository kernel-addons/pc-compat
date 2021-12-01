import IPC, {events} from "./ipc";
import {contextBridge, ipcRenderer, webFrame} from "electron";
import {cloneObject} from "../common/util";
import Module from "module";
import path from "path";
import * as IPCEvents from "../common/ipcevents";

const nodeModulesPath = path.resolve(process.cwd(), "resources", "app-original.asar", "node_modules");
// @ts-ignore - Push modules
if (!Module.globalPaths.includes(nodeModulesPath)) Module.globalPaths.push(nodeModulesPath);

const API = {
    getAppPath() {
        return ipcRenderer.sendSync(IPCEvents.GET_APP_PATH);
    },
    getBasePath() {
        return path.resolve(__dirname, "..");
    },
    executeJS(js: string) {
        return eval(js);
    },
    IPC: IPC
};

// Expose Native bindings and cloned process global.
Object.defineProperties(window, {
    PCCompatNative: {
        value: API,
        configurable: false,
        writable: false
    },
    PCCompatEvents: {
        value: events,
        configurable: false,
        writable: false
    }
});

if(webFrame?.top?.context != null) {
    webFrame.top.context.window.PCCompatNative = API;
    webFrame.top.context.window.require = require;
    webFrame.top.context.window.Buffer = Buffer;
} else {
    contextBridge.exposeInMainWorld("PCCompatNative", API);
}

IPC.on(IPCEvents.EXPOSE_PROCESS_GLOBAL, () => {
    try {
        if(!process.contextIsolated) {
            window.process = cloneObject(process);
        } else if(webFrame?.top?.context != null) {
            webFrame.top.context.window.process = cloneObject(process);
        } else {
            contextBridge.exposeInMainWorld("process", cloneObject(process));
        }
    } catch (error) {
        error.name = "NativeError";
        console.error("Failed to expose process global:", error);
    }
});