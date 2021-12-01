import {DOM, memoize, Utilities} from "../../modules";
import {fs, path, require as Require} from "../../node";
import PluginManager from "../pluginmanager";
import {getSettings} from './settings';

export type PluginManifest = {
    dependencies?: string[];
    name: string;
    description: string;
    version: string;
    author: string;
    license: string;
};

export default class Plugin {
    get entityID() {return memoize(this, "entityID", path.basename(this.path));}

    get settings() {return memoize(this, "settings", getSettings(this.entityID));}

    path: string;   

    stylesheets: {[id: string]: HTMLElement} = {};

    get color() {return "#7289da"};

    manifest: PluginManifest;

    startPlugin?: Function;

    pluginWillUnload?: Function;

    loadStylesheet(_path: string): void {
        const stylePath = path.isAbsolute(_path) ? _path : path.resolve(this.path, _path);
        try {
            if (!fs.existsSync(stylePath)) throw new Error(`Stylesheet not found at ${stylePath}`);
            const content = Require(stylePath);
            const id = `${this.entityID}-${Utilities.random()}`;

            this.stylesheets[id] = DOM.injectCSS(id, content);
        } catch (error) {
            console.error(`Could not load stylesheet:`, error);            
        }
    }

    log(...messages: any[]): void {
        console.log(`%c[Powercord:Plugin:${this.constructor.name}]`, `color: ${this.color};`, ...messages);
    }
    
    debug(...messages: any[]): void {
        console.debug(`%c[Powercord:Plugin:${this.constructor.name}]`, `color: ${this.color};`, ...messages);
    }

    warn(...messages: any[]): void {
        console.warn(`%c[Powercord:Plugin:${this.constructor.name}]`, `color: ${this.color};`, ...messages);
    }

    error(...messages: any[]): void {
        console.error(`%c[Powercord:Plugin:${this.constructor.name}]`, `color: ${this.color};`, ...messages);
    }

    // "Internals" :zere_zoom:
    _load() {
        PluginManager.startPlugin(this);
    }

    _unload() {
        PluginManager.stopPlugin(this);
    }

    // Getters
    get displayName() {return this.manifest.name;}
}