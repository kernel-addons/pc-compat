// @ts-nocheck

import {ipcRenderer} from "electron";
import path from "path";
import fs from "fs";
import * as IPCEvents from "../common/ipcevents";
import Module from "module";

export default function handleSplash (API) {
    const {windowOptions} = ipcRenderer.sendSync(IPCEvents.GET_WINDOW_DATA);

    if (!windowOptions.webPreferences.nativeWindowOpen) {
        Module._extensions[".scss"] = (module: Module, filename: string) => {
            const content = ipcRenderer.sendSync(IPCEvents.COMPILE_SASS, filename);
            module.filecontent = content;
            module.exports = content;

            return content;
        }

        Module._extensions[".css"] = (module: Module, filename: string) => {
            const content = fs.readFileSync(filename, "utf8");
            module.filecontent = content;
            module.exports = content;

            return module.exports;
        },

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
                    const styles = require(path.resolve(folder, manifest.splashTheme));

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