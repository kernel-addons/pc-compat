import sucrase from "sucrase";
import sass from "sass";
import {ipcMain, app} from "electron";
import * as IPCEvents from "../common/ipcevents";
import fs from "fs";

ipcMain.on(IPCEvents.GET_APP_PATH, (event) => {
    event.returnValue = app.getAppPath();
});

ipcMain.on(IPCEvents.COMPILE_SASS, (event, file) => {
    let result = "";
    try {
        // @ts-ignore
        let abc = sass.renderSync({file});
        result = abc.css.toString();
    } catch (error) {
        console.error(error);
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