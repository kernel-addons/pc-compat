import AddonPanel from "@ui/components/addonpanel";
import {DataStore, DiscordModules} from "@modules";
import SettingsRenderer from "@modules/settings";
import LoggerModule from "@modules/logger";
import {fs, Module, path, require as Require} from "@node";
import Emitter from "../classes/staticemitter";
import Plugin from "@powercord/classes/plugin";

const Logger = LoggerModule.create("StyleManager");

export default class StyleManager extends Emitter {
    static get folder() {return path.resolve(DataStore.baseDir, "themes")};

    static mainFiles = ["manifest.json", "powercord_manifest.json"];

    static themes = new Map();

    static states: object;

    static initialize() {
        SettingsRenderer.registerPanel("themes", {
            label: "Themes",
            order: 1,
            render: () => DiscordModules.React.createElement(AddonPanel, {type: "theme", manager: this})
        });

        this.states = DataStore.tryLoadData("themes");

        this.loadAllThemes();
    }

    static loadAllThemes() {
        if (!fs.existsSync(this.folder)) {
            try {
                fs.mkdirSync(this.folder);
            } catch (error) {
                return void Logger.error("StyleManager", `Failed to create themes folder:`, error);
            }
        }

        if (!fs.statSync(this.folder).isDirectory()) return void Logger.error("StyleManager", `Plugins dir isn't a folder.`);
        Logger.log("StyleManager", "Loading themes...");
        for (const file of fs.readdirSync(this.folder, "utf8")) {
            const location = path.resolve(this.folder, file);
            if (!fs.statSync(location).isDirectory()) continue;
            if (!fs.existsSync(path.join(location, "manifest.json"))) continue;
            if (!fs.statSync(path.join(location, "manifest.json")).isFile()) continue;
            if (!this.mainFiles.some(f => fs.existsSync(path.join(location, f)))) continue;

            try {
                this.loadTheme(location);
            } catch (error) {
                Logger.error(`Failed to load theme ${file}:`, error);
            }
        }
    }

    static clearCache(theme: string) {
        if (!path.isAbsolute(theme)) theme = path.resolve(this.folder, theme)

        let current;
        while (current = Require.resolve(theme)) {
            delete Module.cache[current];
        }
    }

    static resolve(themeOrName: any): Plugin {
        if (typeof (themeOrName) === "string") return this.themes.get(themeOrName);

        return themeOrName;
    }

    static saveData() {
        DataStore.trySaveData("themes", this.states);
    }

    static isEnabled(addon: any) {
        const theme = this.resolve(addon);
        if (!theme) return;

        return Boolean(this.states[theme.entityID]);
    }

    static loadTheme(location: string, log = true) {
        const _path = path.resolve(location, this.mainFiles.find(f => fs.existsSync(path.resolve(location, f))));
        const manifest = Object.freeze(Require(path.resolve(location, "manifest.json")));
        if (this.themes.get(manifest.name)) throw new Error(`Theme with name ${manifest.name} already exists!`);

        let exports = {};
        try {
            this.clearCache(location);
            const data = Require(_path);

            Object.defineProperties(data.prototype, {
                entityID: {
                    value: path.basename(location),
                    configurable: false,
                    writable: false
                },
                manifest: {
                    value: manifest,
                    configurable: false,
                    writable: false
                },
                settings: {
                    value: null,
                    configurable: false,
                    writable: false
                },
                path: {
                    value: location,
                    configurable: false,
                    writable: false
                }
            });
            exports = new data(path.basename(location), location);
        } catch (error) {
            return void Logger.error(`Failed to compile ${manifest.name || path.basename(location)}:`, error);
        }

        if (log) {
            Logger.log(`${manifest.name} was loaded!`);
        }

        this.themes.set(path.basename(location), exports);

        if (this.isEnabled(path.basename(location))) {
            // this.startPlugin(exports);
        }
    }
}