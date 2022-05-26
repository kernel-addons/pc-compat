import electron from "electron";
import {cloneObject} from "../util";

const {contextIsolated = true} = process;

export type ElectronAPI = {
    ipcRenderer: Electron.IpcRenderer,
    shell: Electron.Shell,
    clipboard: Electron.Clipboard,
    contextBridge: Electron.ContextBridge,
};

export const newElectron: ElectronAPI = contextIsolated ? {
    ipcRenderer: cloneObject(electron.ipcRenderer) as unknown as Electron.IpcRenderer,
    shell: electron.shell,
    clipboard: electron.clipboard,
    contextBridge: electron.contextBridge
} : require("electron");

export default newElectron;