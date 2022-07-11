import * as IPCEvents from "../common/ipcevents";
import {ipcRenderer} from "electron";

const createIPC = function () {
    const events = {};

    const IPC = {
        on(event: string, callback: Function) {
            if (!events[event]) events[event] = new Set();

            return events[event].add(callback), IPC.off.bind(null, event, callback);
        },
        off(event: string, callback: Function) {
            if (!events[event]) return;

            events[event].delete(callback);
        },
        once(event: string, callback: Function) {
            const unsubscribe = IPC.on(event, (...args) => {
                unsubscribe();
                return callback(...args);
            });
        },
        dispatch(event: string, ...args: any[]) {
            if (!events[event]) return;

            for (const callback of events[event]) {
                try {callback(...args);}
                catch (error) {console.error(error);}
            }
        },
        sendMain(event: string, ...args: any[]) {
            return ipcRenderer.sendSync(IPCEvents.MAIN_EVENT, event, ...args);
        },
        emit(event: string, ...args: any[]) {return IPC.dispatch(event, ...args);}
    };

    return {IPC, events};
};

export default createIPC;