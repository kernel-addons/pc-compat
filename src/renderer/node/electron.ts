export const ipcRenderer: Electron.IpcRenderer = PCCompatNative.executeJS(`PCCompatNative.cloneObject(require("electron").ipcRenderer)`);

export const shell: Electron.Shell = PCCompatNative.executeJS(`require("electron").shell`);
export const clipboard: Electron.Clipboard = PCCompatNative.executeJS(`require("electron").clipboard`);
export const contextBridge: Electron.ContextBridge = {
    exposeInMainWorld(name: string, value: any) {
        window[name] = value;
    }
};

export let remote: typeof import("@electron/remote/renderer") = null;

// @ts-ignore
export const electron: {
    ipcRenderer: Electron.IpcRenderer,
    shell: Electron.Shell,
    clipboard: Electron.Clipboard,
    contextBridge: Electron.ContextBridge,
    remote: typeof import("@electron/remote/renderer")
} = {
    ipcRenderer,
    shell,
    contextBridge,
    clipboard,
    get remote() {return remote;}
};

export function setRemote(module: any) {
    remote = module;
};

export default electron;