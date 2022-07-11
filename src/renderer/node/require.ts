import * as IPCEvents from "@common/ipcevents";
import {createRequire} from "./module";
import path from "./path";

if (!window.process) {
    try {
        PCCompatNative.IPC.dispatch(IPCEvents.EXPOSE_PROCESS_GLOBAL);
    } catch (error) {
        console.error(error);
    }
}

const require: any = !window.process || process.contextIsolated ? createRequire(path.resolve(PCCompatNative.getBasePath(), "plugins"), null) : window.require;

export default require;
