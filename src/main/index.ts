import Module from "module";
import path from "path";
import {execSync} from "child_process";
import fs from "fs";

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