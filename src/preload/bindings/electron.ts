import {cloneObject} from "../util";
import electron from "electron";

const {contextIsolated = true} = process;

export type ElectronAPI = {
    ipcRenderer: Electron.IpcRenderer,
    shell: Electron.Shell,
    clipboard: Electron.Clipboard,
    contextBridge: Electron.ContextBridge,
};

const ipcRenderer = cloneObject(electron.ipcRenderer) as unknown as Electron.IpcRenderer;

export const newElectron: ElectronAPI = contextIsolated ? {
    ipcRenderer: Object.assign(ipcRenderer, {
        _events: null,
        _listeners() {return Object.keys((electron.ipcRenderer as any)._events);},
        _isArray(event) {
            return Array.isArray((electron.ipcRenderer as any)._events[event]);
        },
        removeListener(_, listener) {
            if (listener.$$type !== Symbol.for("PC_IPC_RENDERER_LISTENER")) {
                throw new Error("Listener is not a valid electron listener.");
            }
            const {event, index} = listener;

            const events = electron.ipcRenderer.listeners(event);

            electron.ipcRenderer.removeListener(event, events[index] as (...args: any[]) => void);
        },
        removeAllListeners(channel) {
            electron.ipcRenderer.removeAllListeners(channel);
        }
    }),
    shell: electron.shell,
    clipboard: electron.clipboard,
    contextBridge: electron.contextBridge
} : require("electron");

export default newElectron;
