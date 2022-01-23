import createIPC from "./ipc";
import {contextBridge, ipcRenderer} from "electron";
import {cloneObject, getKeys} from "../common/util";
import Module from "module";
import path from "path";
import * as IPCEvents from "../common/ipcevents";
import handleSplash from './splash';
import Process from "./process";

const {IPC, events} = createIPC();

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
    setDevtools(opened: boolean) {
        return ipcRenderer.invoke(IPCEvents.SET_DEV_TOOLS, opened);
    },
    IPC: IPC,
    cloneObject,
    getKeys
};

// Splash screen
handleSplash(API);

// Expose Native bindings and cloned process global.
contextBridge.exposeInMainWorld("PCCompatNative", API);
contextBridge.exposeInMainWorld("PCCompatEvents", API);

if (process.contextIsolated) {
    Object.defineProperties(window, {
        PCCompatNative: {
            value: Object.assign({}, API, {cloneObject, getKeys}),
            configurable: false,
            writable: false
        },
        PCCompatEvents: {
            value: events,
            configurable: false,
            writable: false
        }
    });
}

IPC.on(IPCEvents.EXPOSE_PROCESS_GLOBAL, () => {
    try {
        if (!process.contextIsolated) {
            Object.defineProperty(window, "process", {
                value: Process,
                configurable: true
            });
        } else {
            contextBridge.exposeInMainWorld("process", Process);
        }
    } catch (error) {
        error.name = "NativeError";
        console.error("Failed to expose process global:", error);
    }
});