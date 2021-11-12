import electron from "../../node/electron";
import * as IPCEvents from "../../../common/ipcevents";

export default class SASS {
    static compile(file: string) {
        return electron.ipcRenderer.sendSync(IPCEvents.COMPILE_SASS, file);
    }
}