// @ts-nocheck

import * as IPCEvents from "../common/ipcevents";
import {ipcRenderer} from "electron";
import path from "path";
import fs from "fs";

export default function handleSplash (API) {
    const {windowOptions} = ipcRenderer.sendSync(IPCEvents.GET_WINDOW_DATA);

    if (!windowOptions.webPreferences.nativeWindowOpen) {
        window.onload = () => {
            let themes = {};

            try {
                const settings = path.resolve(API.getBasePath(), "config", "themes.json");
                if (fs.existsSync(settings)) themes = JSON.parse(fs.readFileSync(settings, {encoding: "utf-8"}));
            } catch(e) {
                console.error("Couldn't read theme settings file, is it corrupt?", e);
            }

            for (const [theme, enabled] of Object.entries(themes)) {
                if (!enabled) continue;

                try {
                    const folder = path.resolve(API.getBasePath(), "themes", theme);
                    const manifestPath = path.resolve(folder, "powercord_manifest.json");
                    const manifest: any = JSON.parse(fs.readFileSync(manifestPath, { encoding: "utf-8"}));

                    if (!manifest?.splashTheme) continue;

                    const stylePath = require.resolve(folder, manifest.splashTheme);
                    const ext = path.extname(stylePath);
                    const styles = ext === ".scss" ?
                       ipcRenderer.sendSync(IPCEvents.COMPILE_SASS, stylePath) :
                       fs.readFileSync(stylePath, "utf8");

                    const stylesheet = document.createElement("style");
                    stylesheet.id = theme;
                    stylesheet.innerHTML = styles;
                    document.head.appendChild(stylesheet);
                } catch(e) {
                    console.error(`Couldn't initialize ${theme}`, e);
                }
            }
        }
    }
}