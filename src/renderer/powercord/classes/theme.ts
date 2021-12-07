import {DOM, memoize, Utilities} from "../../modules";
import {fs, path, require as Require} from "../../node";
import ThemeManager from "../stylemanager";
import {getSettings} from './settings';

export type ThemeManifest = {
    dependencies?: string[];
    name: string;
    description: string;
    version: string;
    author: string;
    license: string;
};

export default class Theme {
    path: string;

    stylesheets: {[id: string]: HTMLElement} = {};

    get color() {return "#7289da"};

    manifest: ThemeManifest;

    entityID: string;

    settings: any;

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
        console.log(`%c[Powercord:Theme:${this.constructor.name}]`, `color: ${this.color};`, ...messages);
    }

    debug(...messages: any[]): void {
        console.debug(`%c[Powercord:Theme:${this.constructor.name}]`, `color: ${this.color};`, ...messages);
    }

    warn(...messages: any[]): void {
        console.warn(`%c[Powercord:Theme:${this.constructor.name}]`, `color: ${this.color};`, ...messages);
    }

    error(...messages: any[]): void {
        console.error(`%c[Powercord:Theme:${this.constructor.name}]`, `color: ${this.color};`, ...messages);
    }

    // "Internals" :zere_zoom:
    _load() {
        // ThemeManager.startPlugin(this);
    }

    _unload() {
        // ThemeManager.stopPlugin(this);
    }

    // Getters
    get displayName() {return this.manifest.name;}
}