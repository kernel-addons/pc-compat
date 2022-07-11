import {execSync} from "child_process";
import {app} from "electron";
import Module from "module";
import path from "path";
import fs from "fs";

app.whenReady().then(() => {
   // @ts-ignore
   const {whitelist} = __non_webpack_require__('#kernel/core/patchers/CSPWhitelist');
   console.log(whitelist)
   whitelist("pc-compat", /.*/);
})

const node_modules = path.resolve(
    path.basename(__dirname) === "dist" ? path.resolve(__dirname, "..") : __dirname,
    "node_modules"
);

// Some people are incapable of running `pnpm install`.
if (!fs.existsSync(node_modules) && !__dirname.includes(".asar")) {
    try {
        execSync("npm install --production", {
            cwd: __dirname
        });
    } catch (error) {
        console.error("Failed to automatically install node modules:", error);
    }
}

// @ts-ignore
Module.globalPaths.push(node_modules);

import "./debug";
import "./events";