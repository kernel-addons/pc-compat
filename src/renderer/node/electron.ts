// @ts-ignore
export const electron: {
    ipcRenderer: Electron.IpcRenderer,
    shell: Electron.Shell,
    clipboard: Electron.Clipboard,
    contextBridge: Electron.ContextBridge,
    remote: typeof import("@electron/remote/renderer")
} = (window.process?.contextIsolated ?? true) ? {
    ipcRenderer: PCCompatNative.executeJS(`PCCompatNative.cloneObject(require("electron").ipcRenderer)`),
    shell: PCCompatNative.executeJS(`require("electron").shell`),
    clipboard: PCCompatNative.executeJS(`require("electron").clipboard`),
    contextBridge: {
        exposeInMainWorld(name: string, value: any) {
            window[name] = value;
        }
    },
    remote: null
} : window.require("electron");

export function setRemote(module: any) {
    electron.remote = module;
};

export default electron;