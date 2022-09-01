import * as IPCEvents from "../common/ipcevents";
import {cloneObject, getKeys} from "../common/util";
import createIPC from "./ipc";
import path from "path";

const callbacks = new Map<string, Set<Function>>();
const {IPC} = createIPC();

const Process: NodeJS.Process = cloneObject(process, {}, getKeys(process).filter(e => e !== "config")) as any;

const initializeCallbacks = function (event: string) {
    callbacks.set(event, new Set());

    process.on(event, (...args) => {
        IPC.emit(IPCEvents.HANDLE_CALLBACK, event, args);
    });
};

IPC.on(IPCEvents.HANDLE_CALLBACK, (event: string, ...args: any[]) => {
    if (!callbacks.has(event)) return;

    for (const callback of callbacks.get(event)) {
        try {
            callback(...args);
        } catch (error) {
            console.error(error);
        }
    }
});

// We need to override that because using electron's contextBridge to expose the process freezes the client.
Object.assign(Process, {
    on: (event: string, listener: Function) => {
        if (!callbacks.has(event)) initializeCallbacks(event);

        callbacks
            .get(event)
            .add(listener);
    },
    off: (event: string, listener: Function) => {
        if (!callbacks.has(event)) return;

        return callbacks
            .get(event)
            .delete(listener);
    }
});

export default Process;
