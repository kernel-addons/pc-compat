// @ts-ignore
export const electron: {
    ipcRenderer: Electron.IpcRenderer,
    shell: Electron.Shell,
    clipboard: Electron.Clipboard,
    contextBridge: Electron.ContextBridge,
} = (window.process?.contextIsolated ?? true) ? {
    ipcRenderer: PCCompatNative.executeJS(`PCCompatNative.cloneObject(require("electron").ipcRenderer)`),
    shell: PCCompatNative.executeJS(`require("electron").shell`),
    clipboard: PCCompatNative.executeJS(`require("electron").clipboard`),
    contextBridge: {
        exposeInMainWorld(name: string, value: any) {
            window[name] = value;
        }
    },
} : window.require("electron");

export default electron;