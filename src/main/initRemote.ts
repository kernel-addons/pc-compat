import {enable, initialize} from "@electron/remote/main"; 
import {BrowserWindow, app} from "electron";

initialize();

export const enableRemoteModule = function (webContents: Electron.WebContents) {
    console.log("[Powercord] Enabling remote module for", webContents.id);

    enable(webContents);
};

for (const {webContents} of BrowserWindow.getAllWindows()) {
    enableRemoteModule(webContents);
}

app.on("browser-window-created", (_, {webContents}) => {
    enableRemoteModule(webContents);
});