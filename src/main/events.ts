import * as sucrase from "sucrase";
import * as sass from "sass";
import {ipcMain, app, BrowserWindow} from "electron";
import * as IPCEvents from "../common/ipcevents";
import fs from "fs";

/** NOTE: 
 * We have to set event.returnValue because otherwise electron will crash the process due to no returnValue.
 * We also serialize errors since sometimes it just bails out with "An object could not be cloned."
*/

const serializeError = function (error: Error) {
    return `
console.error(Object.assign(new Error(${JSON.stringify(error.message)}), {
    stack: ${JSON.stringify(error.stack)},
    name: ${JSON.stringify(error.name)}
}));`.trim();
};

ipcMain.on(IPCEvents.GET_APP_PATH, (event) => {
    event.returnValue = app.getAppPath();
});

ipcMain.on(IPCEvents.GET_WINDOW_DATA, (event) => {
    event.returnValue = (event.sender as any).kernelWindowData;
});

ipcMain.on(IPCEvents.COMPILE_SASS, (event, file) => {
    let result = "";
    try {
        result = sass.compile(file).css.toString();
    } catch (error) {
        event.sender.executeJavaScript(serializeError(error));
    }

    event.returnValue = result;
});

ipcMain.on(IPCEvents.COMPILE_JSX, (event, file) => {
    if (!fs.existsSync(file)) {
        event.returnValue = "";
        return;
    }

    const filecontent = fs.readFileSync(file, "utf8");
    const {code} = sucrase.transform(filecontent, {
        transforms: ["jsx", "imports", "typescript"],
        filePath: file
    });

    event.returnValue = code;
});

ipcMain.handle(IPCEvents.SET_DEV_TOOLS, (event, value: boolean) => {
    const win = BrowserWindow.fromWebContents(event.sender);

    if (!win) return;

    if (value && !win.webContents.isDevToolsOpened()) {
        win.webContents.openDevTools();
    } else {
        win.webContents.closeDevTools();
    }
});