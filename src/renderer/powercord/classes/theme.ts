import {DOM, memoize, Utilities} from "../../modules";
import {fs, path, require as Require} from "../../node";
import ThemeManager from "../stylemanager";
import {getSettings} from './settings';

export type ThemeManifest = {
    effectiveTheme: string;
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

    themeIdentifier?: string;

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

    // "Internals" :zere_zoom:
    _load() {

    }

    _unload() {
        console.log(this.stylesheets);
    }

    // Getters
    get displayName() {return this.manifest.name;}
}