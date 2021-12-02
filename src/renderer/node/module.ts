import fs from "./fs";
import path from "./path";
import * as powercord from "../powercord/index";
import {JSX, SASS} from "../powercord/compilers";
import electron from "./electron";
import errorboundary from "../powercord/components/errorboundary";
import DiscordModules from "@modules/discord";

export const cache = {};
export const globalPaths = [];
export const extensions = {
    ".js": (module: Module, filename: string) => {
        const fileContent = fs.readFileSync(filename, "utf8");
        module.filecontent = fileContent;
        module._compile(fileContent);
        return module.exports;
    },
    ".json": (module: Module, filename: string) => {
        const filecontent = fs.readFileSync(filename, "utf8");
        module.filecontent = filecontent;
        module.exports = JSON.parse(filecontent);

        return module.exports;
    },
    ".jsx": (module: Module, filename: string) => {
        const code = JSX.compile(filename);
        module.filecontent = code;
        module._compile(code);
        return module.exports;
    },
    ".scss": (module: Module, filename: string) => {
        const content = SASS.compile(filename);
        module.filecontent = content;
        module.exports = content;

        return content;
    },
    ".css": (module: Module, filename: string) => {
        const content = fs.readFileSync(filename, "utf8");
        module.filecontent = content;
        module.exports = content;

        return module.exports;
    },
    // I haven't tested this - I assume it works.
    // TODO: Make this not shitty
    ".node": (module: Module, filename: string) => {
        const thing = PCCompatNative.executeJS(`require(${JSON.stringify(filename)})`);
        module.exports = thing;

        return thing;
    }
};

export class Module {
    public id: string;
    public path: string;
    public exports: any;
    public parent: Module | null;
    public filename: string;
    public loaded: boolean;
    public children: Module[];
    public require: any;
    public filecontent?: string;

    constructor(id: string, parent: Module, require: any) {
        this.id = id;
        this.path = path.dirname(id);
        this.exports = {};
        this.parent = parent;
        this.filename = id;
        this.loaded = false;
        this.children = [];
        this.require = require;

        if (parent) parent.children.push(this);
    }

    _compile(code: string) {
        const wrapped = window.eval(`((${["require", "module", "exports", "__filename", "__dirname", "global"].join(", ")}) => {
            ${code}
            //# sourceURL=${JSON.stringify(this.filename).slice(1, -1)}
        })`);
        wrapped(this.require, this, this.exports, this.filename, this.path, window);
    }
};

export function resolve(path: string) {
    for (const key in cache) {
        if (key.startsWith(path)) return key;
    }
};

export function getExtension(mod: string) {
    return path.extname(mod) || Object.keys(extensions).find(ext => fs.existsSync(mod + ext)) || "";
};

export type Require = CallableFunction & {
    resolve(path: string): string;
    cache: object;
};

export function createRequire(_path: string): Require {
    const require = (mod: string) => {
        if (typeof (mod) !== "string") return;

        switch (mod) {
            case "powercord": return powercord;
            case "path": return path;
            case "fs": return fs;
            case "module": return NodeModule;
            case "electron": return electron;
            case "http": return window.require('http');
            case "react": return DiscordModules.React;
            case "react-dom": return DiscordModules.ReactDOM;

            default: {
                if (mod.startsWith("powercord/")) {
                    const value = mod.split("/").slice(1).reduce((value, key) => value[key], powercord);
                    if (value) return value;
                }

                return load(_path, mod);
            }
        }
    };

    Object.assign(require, {cache, resolve});

    // @ts-ignore
    return require;
};

export function resolveMain(_path: string, mod: string): string {
    const parent = path.extname(_path) ? path.dirname(_path) : path.resolve(_path, mod);
    if (!fs.existsSync(parent)) throw new Error(`Cannot find module ${mod}`);
    const files = fs.readdirSync(parent, "utf8");

    for (const file of files) {
        const ext = path.extname(file);

        if (file === "package.json") {
            const pkg = JSON.parse(fs.readFileSync(path.resolve(parent, file), "utf8"));
            if (!Reflect.has(pkg, "main")) continue;

            return path.resolve(parent, pkg.main);
        }

        if (file.slice(0, -ext.length) === "index" && extensions[ext]) return path.resolve(parent, file);
    }
};

export function getFilePath(_path: string, mod: string): string {
    mod = path.resolve(_path, mod);
    const pth = mod + getExtension(mod);
    if (fs.existsSync(pth) && fs.statSync(pth).isFile()) return pth;
    if (!path.extname(mod)) return resolveMain(_path, mod);

    return mod;
};

export function load(_path: string, mod: string, req = null) {
    if (mod.includes("pc-settings/components/ErrorBoundary")) return errorboundary;
    const file = getFilePath(_path, mod);
    if (!fs.existsSync(file)) throw new Error(`Cannot find module ${mod}`);
    if (cache[file]) return cache[file].exports;
    const stats = fs.statSync(file, "utf8");
    if (stats.isDirectory()) mod = resolveMain(_path, mod);
    const ext = getExtension(file);
    const loader = extensions[ext];

    if (!loader) throw new Error(`Cannot find module ${file}`);
    const module = cache[file] = new Module(file, req, createRequire(path.dirname(file)));
    loader(module, file);

    return module.exports;
};

// TODO: Add globalPaths support
const NodeModule = {_extensions: extensions, cache, _load: load, globalPaths: globalPaths};

export default NodeModule;