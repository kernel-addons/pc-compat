import {DOM, Utilities} from "@modules";
import {fs, path, require as Require} from "../../node";
import * as IPCEvents from "@common/ipcevents";
import electron from "@node/electron";

export type ThemeManifest = {
    name: string;
    description: string;
    version: string;
    author: string;
    license: string;
    theme: string;
    splashTheme: string;
};

export default class Theme {
    path: string;

    stylesheets: {[id: string]: HTMLElement} = {};

    get color() {return "#7289da"};

    manifest: ThemeManifest;

    entityID: string;

    settings: any;

    themeIdentifier?: string;

    // "Internals" :zere_zoom:
    _loadStylesheet(_path: string): void {
        const stylePath = path.isAbsolute(_path) ? _path : path.resolve(this.path, _path);
        try {
            if (!fs.existsSync(stylePath)) throw new Error(`Stylesheet not found at ${stylePath}`);
            const content = path.extname(stylePath) === '.scss' ?
               electron.ipcRenderer.sendSync(IPCEvents.COMPILE_SASS, stylePath) :
               fs.readFileSync(stylePath, 'utf-8');
            const id = `${this.entityID}-${Utilities.random()}`;

            this.stylesheets[id] = DOM.injectCSS(id, content);
        } catch (error) {
            console.error(`Could not load stylesheet:`, error);
        }
    }

    _load() {
        this._loadStylesheet(path.resolve(this.path, this.manifest.theme))
    }

    _unload() {
        const keys = Object.keys(this.stylesheets);

        for (let i = 0; i < keys.length; i++) {
            this.stylesheets[keys[i]].remove();
            delete this.stylesheets[keys[i]];
        }
    }

    // Getters
    get displayName() {return this.manifest.name;}
}