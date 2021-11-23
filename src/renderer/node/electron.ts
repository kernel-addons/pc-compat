const ipcRenderer: typeof import("electron/renderer").ipcRenderer = PCCompatNative.executeJS(`Object.keys(require("electron").ipcRenderer)`).slice(3).reduce((newElectron: object, key: string) => {
    newElectron[key] = PCCompatNative.executeJS(`require("electron").ipcRenderer[${JSON.stringify(key)}].bind(require("electron").ipcRenderer)`);

    return newElectron;
}, {});

const shell: typeof import("electron").shell = PCCompatNative.executeJS(`require("electron").shell`);

const electron = {ipcRenderer, shell};

export default electron;