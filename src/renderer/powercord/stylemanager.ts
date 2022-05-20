import AddonPanel from "@ui/components/addonpanel";
import {DataStore, DiscordModules} from "@modules";
import SettingsRenderer from "@modules/settings";
import LoggerModule from "@modules/logger";
import {fs, Module, path, require as Require} from "@node";
import Emitter from "../classes/staticemitter";
import Theme from "@powercord/classes/theme";
import Events from "@modules/events";

const Logger = LoggerModule.create("StyleManager");

export default class StyleManager extends Emitter {
    static get folder() {return path.resolve(DataStore.baseDir, "powercord", "themes")};

    static mainFiles = ["powercord_manifest.json", "manifest.json"];

    static themes = new Map<string, Theme>((window as any).__PC_THEMES__ ?? []);

    static states: object;

    static get addons() {return Array.from(this.themes, e => e[1]);}

    static initialize() {
        const basePath = PCCompatNative.getBasePath();
        const previous = path.join(basePath, "themes");

        if (!fs.existsSync(this.folder)) {
            try {
                fs.mkdirSync(this.folder, {recursive: true});
            } catch (error) {
                return void Logger.error("StyleManager", `Failed to create themes folder:`, error);
            }
        }

        if (fs.existsSync(previous) && !DataStore.getMisc("migratedThemes", false)) {
            Logger.log(`Old addon folder detected, migrating ${path.basename(previous)}.`)
            const files = fs.readdirSync(previous);

            for (const file of files) {
                // Prepare the paths for moving the old items to the new directory
                const current = path.join(previous, file);
                const to = path.join(this.folder, file);

                // Make sure we don't overwrite any themes.
                if (fs.existsSync(to)) continue;

                // Move the file
                Logger.log(`Migrating ${path.basename(basePath)}/${path.basename(previous)}/${file}`);
                fs.renameSync(current, to);
            }

            DataStore.setMisc(void 0, "migratedThemes", true);
            Logger.log("Migration completed.");
        }

        SettingsRenderer.registerPanel("pc-moduleManager-themes", {
            label: "Themes",
            order: 2,
            render: () => DiscordModules.React.createElement(AddonPanel, {type: "theme", manager: this})
        });

        this.states = DataStore.tryLoadData("themes");

        if (!(window as any).__PC_THEMES__) this.loadAll();

        Events.addEventListener("reload-core", () => {
            (window as any).__PC_PLUGINS__ = Array.from(this.themes);
        });
    }

    static loadAll(missing = false) {
        if (!fs.statSync(this.folder).isDirectory()) return void Logger.error("StyleManager", `Plugins dir isn't a folder.`);
        if  (!missing) Logger.log("StyleManager", "Loading themes...");

        const missingEntities = [];
        for (const file of fs.readdirSync(this.folder, "utf8")) {
            const location = path.resolve(this.folder, file);
            if (!fs.statSync(location).isDirectory()) continue;
            if (!this.mainFiles.some(f => fs.existsSync(path.join(location, f)))) continue;

            try {
                if (missing) {
                    const theme = this.resolve(file);
                    if (theme) continue;

                    this.loadTheme(location);
                    missingEntities.push(this.resolve(file).displayName);
                } else {
                    this.loadTheme(location);
                }
            } catch (error) {
                Logger.error(`Failed to load theme ${file}:`, error);
            }
        }

        if (missing && missingEntities.length) {
            powercord.api.notices.sendToast(null, {
                content: `The following themes were loaded: ${missingEntities.join(', ')}`,
                header: "Missing themes found",
                type: "success"
            });

            this.emit("entityChange");
        } else if (missing && !missingEntities.length) {
            powercord.api.notices.sendToast(null, {
                content: "Couldn't find any themes that aren't already loaded.",
                header: "Missing themes not found",
                type: "danger"
            });
        }
    }

    static clearCache(theme: string) {
        if (!path.isAbsolute(theme)) theme = path.resolve(this.folder, theme)

        const object = !window.process || process.contextIsolated ? Module : window.require
        const cache = Object.keys(object.cache).filter(c => ~c.indexOf(theme));
        for(const item of cache) {
            delete object.cache[item];
        }
    }

    static resolve(themeOrName: any): Theme {
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
        const manifest = Object.freeze(Require(_path));
        const entityID = path.basename(location);
        if (this.themes.get(entityID)) throw new Error(`Theme with ID ${entityID} already exists!`);

        let data = new Theme();
        try {
            this.clearCache(location);

            Object.defineProperties(data, {
                entityID: {
                    value: entityID,
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
        } catch (error) {
            return void Logger.error(`Failed to compile ${manifest.name || path.basename(location)}:`, error);
        }

        if (log) {
            Logger.log(`${manifest.name} was loaded!`);
        }

        this.themes.set(path.basename(location), data);

        if (this.isEnabled(path.basename(location))) {
            this.startTheme(data);
        }
    }

    static unloadAddon(addon: any, log = true) {
        const theme = this.resolve(addon);
        if (!addon) return;

        const success = this.stopTheme(theme);
        this.clearCache(theme.path);

        if (log) {
            Logger.log(`${theme.displayName} was unloaded!`);
        }

        return success;
    }

    static reloadTheme(addon: any) {
        const theme = this.resolve(addon);
        if (!addon) return;

        const success = this.unloadAddon(theme, false);
        if (!success) {
            return Logger.error(`Something went wrong while trying to unload ${theme.displayName}:`);
        }
        this.startTheme(theme, false);
        Logger.log(`Finished reloading ${theme.displayName}.`);
    }

    static startTheme(addon: any, log = true) {
        const theme = this.resolve(addon);
        if (!theme) return;

        try {
            theme._load();
            if (log) {
                Logger.log(`${theme.displayName} has been loaded!`);
            }
        } catch (error) {
            Logger.error(`Could not load ${theme.displayName}:`, error);
        }

        return true;
    }

    static stopTheme(addon: any, log = true) {
        const theme = this.resolve(addon);
        if (!theme) return;

        try {
            theme._unload();
            if (log) {
                Logger.log(`${theme.displayName} has been stopped!`);
            }
        } catch (error) {
            Logger.error(`Could not stop ${theme.displayName}:`, error);
            return false;
        }

        return true;
    }

    static enableTheme(addon: any, log = true) {
        const theme: Theme = this.resolve(addon);
        if (!theme) return;

        this.states[theme.entityID] = true;
        DataStore.trySaveData("themes", this.states);
        this.startTheme(theme, false);

        if (log) {
            Logger.log(`${theme.displayName} has been enabled!`);
            this.emit("toggle", theme.entityID, true);
        }
    }

    static disableTheme(addon: any, log = true) {
        const theme: Theme = this.resolve(addon);
        if (!theme) return;

        this.states[theme.entityID] = false;
        DataStore.trySaveData("themes", this.states);
        this.stopTheme(theme, false);

        if (log) {
            Logger.log(`${theme.displayName} has been disabled!`);
            this.emit("toggle", theme.entityID, false);
        }
    }

    static delete(addon: any) {
        const theme: Theme = this.resolve(addon);
        if (!theme) return;

        this.unloadAddon(theme);
        this.themes.delete(theme.entityID);
        PCCompatNative.executeJS(`require("electron").shell.trashItem(${JSON.stringify(theme.path)})`);
        this.emit("delete", theme)
    }

    static toggle(addon: any) {
        const theme = this.resolve(addon);
        if (!theme) return;

        if (this.isEnabled(theme.entityID)) this.disable(theme);
        else this.enable(theme);
    }

    static get(name: string) {
        return this.themes.get(name);
    }

    static get enable() {return this.enableTheme;}
    static get disable() {return this.disableTheme;}
    static get reload() {return this.reloadTheme;}
    static get remount() {return this.reloadTheme;}
    static get getThemes() {return [...this.themes.keys()];}
    static get loadAllThemes() {return this.loadAll;}
}