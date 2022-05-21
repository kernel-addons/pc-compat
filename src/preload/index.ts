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
    isPacked: path.basename(__dirname) !== "dist",
    getAppPath() {
        return ipcRenderer.sendSync(IPCEvents.GET_APP_PATH);
    },
    getBasePath() {
        return !API.isPacked ? path.resolve(__dirname, "..") : __dirname;
    },
    executeJS(js: string) {
        return eval(js);
    },
    setDevtools(opened: boolean) {
        return ipcRenderer.invoke(IPCEvents.SET_DEV_TOOLS, opened);
    },
    runCommand: (cmd: string, cwd?: string) => ipcRenderer.invoke(IPCEvents.RUN_COMMAND, cmd, cwd),
    IPC: IPC,
    cloneObject,
    getKeys
};

// Splash screen
handleSplash(API);

// Expose Native bindings and cloned process global.
Object.defineProperties(window, {
    PCCompatNative: {
        value: Object.assign({}, API, {cloneObject, getKeys}),
        configurable: true,
        writable: true
    },
    PCCompatEvents: {
        value: events,
        configurable: true,
        writable: true
    }
});

if (process.contextIsolated) {
    contextBridge.exposeInMainWorld("PCCompatNative", API);
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