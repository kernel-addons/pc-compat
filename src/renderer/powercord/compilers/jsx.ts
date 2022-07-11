import * as IPCEvents from "@common/ipcevents";
import electron from "@node/electron";

export default class JSXCompiler {
    static compile(file: string): string {
        return electron.ipcRenderer.sendSync(IPCEvents.COMPILE_JSX, file);
    }
}