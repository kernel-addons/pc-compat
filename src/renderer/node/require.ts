import {createRequire} from "./module";
import path from "./path";
import {setBuffer} from "./buffer";
import * as IPCEvents from "@common/ipcevents";

if (!window.process) {
    try {
        PCCompatNative.IPC.dispatch(IPCEvents.EXPOSE_PROCESS_GLOBAL);
    } catch (error) {
        console.error(error);
    }
}

const require: any = process.contextIsolated ? createRequire(path.resolve(PCCompatNative.getBasePath(), "plugins"), null) : window.require;

const modulesToInitialize = [
    process.contextIsolated && ["buffer/", setBuffer]
].filter(Boolean);

for (let i = 0; i < modulesToInitialize.length; i++) {
    const [namespace, load] = modulesToInitialize[i] as any;

    try {
        load(require(namespace));
    } catch (error) {
        console.error(`Failed to require "${namespace}":`, error);
    }
}

export default require;