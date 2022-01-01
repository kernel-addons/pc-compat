import Module from "module";
import path from "path";

// @ts-ignore
Module.globalPaths.push(path.resolve(__dirname, "..", "..", "node_modules"));

import "./debug";
import "./events";
import "./initRemote";