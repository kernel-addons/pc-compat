import * as IPCEvents from "@common/ipcevents";
import electron from "@node/electron";

export default class SASS {
    static compile(file: string) {
        return electron.ipcRenderer.sendSync(IPCEvents.COMPILE_SASS, file);
    }
}