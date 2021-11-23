import electron from "../../node/electron";
import * as IPCEvents from "../../../common/ipcevents";

export default class JSXCompiler {
    static compile(file: string): string {
        return electron.ipcRenderer.sendSync(IPCEvents.COMPILE_JSX, file);
    }
}