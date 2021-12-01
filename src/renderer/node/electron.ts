const ipcRenderer: typeof import("electron/renderer").ipcRenderer = PCCompatNative.executeJS(`Object.keys(require("electron").ipcRenderer)`).slice(3).reduce((newElectron: object, key: string) => {
    newElectron[key] = PCCompatNative.executeJS(`require("electron").ipcRenderer[${JSON.stringify(key)}].bind(require("electron").ipcRenderer)`);

    return newElectron;
}, {});

const shell: typeof import("electron").shell = PCCompatNative.executeJS(`require("electron").shell`);
const clipboard: typeof import("electron").clipboard = PCCompatNative.executeJS(`require("electron").clipboard`);
const contextBridge: typeof import("electron").contextBridge = {
    exposeInMainWorld(name: string, value: any) {
        window[name] = value;
    }
};

const electron = {ipcRenderer, shell, contextBridge, clipboard};

export default electron;