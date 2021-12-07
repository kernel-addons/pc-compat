import AddonPanel from "@ui/components/addonpanel";
import {DataStore, DiscordModules} from "@modules";
import LoggerModule from "@modules/logger";
import SettingsRenderer from "../modules/settings";
import {fs, path, require as Require, Module} from "@node";
import Plugin from "./classes/plugin";
import Emitter from "../classes/staticemitter";
import {globalPaths} from "@node/module";
import {getSettings} from "./classes/settings";

const Logger = LoggerModule.create("PluginManager");

export default class PluginManager extends Emitter {
    static get folder() {return path.resolve(DataStore.baseDir, "plugins")};

    static mainFiles = ["index.js", "index.jsx"];

    static plugins = new Map();

    static states: object;

    static get addons() {return Array.from(this.plugins, e => e[1]);}

    static initialize() {
        SettingsRenderer.registerPanel("plugins", {
            label: "Plugins",
            order: 1,
            render: () => DiscordModules.React.createElement(AddonPanel, {type: "plugin", manager: this})
        });

        this.states = DataStore.tryLoadData("plugins");

        this.loadAllPlugins();
    }

    static loadAllPlugins() {
        if (!fs.existsSync(this.folder)) {
            try {
                fs.mkdirSync(this.folder);
            } catch (error) {
                return void Logger.error("PluginsManager", `Failed to create plugins folder:`, error);
            }
        }

        if (!fs.statSync(this.folder).isDirectory()) return void Logger.error("PluginsManager", `Plugins dir isn't a folder.`);
        Logger.log("PluginsManager", "Loading plugins...");
        for (const file of fs.readdirSync(this.folder, "utf8")) {
            const location = path.resolve(this.folder, file);
            if (!fs.statSync(location).isDirectory()) continue;
            if (!fs.existsSync(path.join(location, "manifest.json"))) continue;
            if (!fs.statSync(path.join(location, "manifest.json")).isFile()) continue;
            if (!this.mainFiles.some(f => fs.existsSync(path.join(location, f)))) continue;
            if (fs.existsSync(path.join(location, "node_modules"))) globalPaths.push(path.join(location, "node_modules"));

            try {
                this.loadPlugin(location);
            } catch (error) {
                Logger.error(`Failed to load ${file}:`, error);
            }
        }
    }

    static clearCache(plugin: string) {
        if (!path.isAbsolute(plugin)) plugin = path.resolve(this.folder, plugin)

        let current;
        while (current = Require.resolve(plugin)) {
            delete Module.cache[current];
        }
    }

    static resolve(pluginOrName: any): Plugin {
        if (typeof (pluginOrName) === "string") return this.plugins.get(pluginOrName);

        return pluginOrName;
    }

    static saveData() {
        DataStore.trySaveData("plugins", this.states);
    }

    static isEnabled(addon: any) {
        const plugin = this.resolve(addon);
        if (!plugin) return;

        return Boolean(this.states[plugin.entityID]);
    }

    static loadPlugin(location: string, log = true) {
        const _path = path.resolve(location, this.mainFiles.find(f => fs.existsSync(path.resolve(location, f))));
        const manifest = Object.freeze(Require(path.resolve(location, "manifest.json")));
        if (this.plugins.get(manifest.name)) throw new Error(`Plugin with name ${manifest.name} already exists!`);

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
                    value: getSettings(path.basename(location)),
                    configurable: true,
                    writable: true
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

        this.plugins.set(path.basename(location), exports);

        if (this.isEnabled(path.basename(location))) {
            this.startPlugin(exports);
        }
    }

    static unloadAddon(addon: any, log = true) {
        const plugin = this.resolve(addon);
        if (!addon) return;

        const success = this.stopPlugin(plugin);
        this.plugins.delete(plugin.entityID);
        this.clearCache(plugin.path);

        if (log) {
            Logger.log(`${plugin.displayName} was unloaded!`);
        }

        return success;
    }

    static reloadPlugin(addon: any) {
        const plugin = this.resolve(addon);
        if (!addon) return;

        const success = this.unloadAddon(plugin, false);
        if (!success) {
            return Logger.error(`Something went wrong while trying to unload ${plugin.displayName}:`);
        }
        this.loadPlugin(plugin.path, false);
        Logger.log(`Finished reloading ${plugin.displayName}.`);
    }

    static startPlugin(addon: any, log = true) {
        const plugin = this.resolve(addon);
        if (!plugin) return;

        try {
            if (typeof (plugin.startPlugin) === "function") plugin.startPlugin();
            if (log) {
                Logger.log(`${plugin.displayName} has been started!`);
            }
        } catch (error) {
            Logger.error(`Could not start ${plugin.displayName}:`, error);
        }

        return true;
    }

    static stopPlugin(addon: any, log = true) {
        const plugin = this.resolve(addon);
        if (!plugin) return;

        try {
            if (typeof (plugin.pluginWillUnload) === "function") plugin.pluginWillUnload();
            if (log) {
                Logger.log(`${plugin.displayName} has been stopped!`);
            }
        } catch (error) {
            Logger.error(`Could not stop ${plugin.displayName}:`, error);
            return false;
        }

        return true;
    }

    static enablePlugin(addon: any, log = true) {
        const plugin: Plugin = this.resolve(addon);
        if (!plugin) return;

        this.states[plugin.entityID] = true;
        DataStore.trySaveData("plugins", this.states);
        this.startPlugin(plugin, false);

        if (log) {
            Logger.log(`${plugin.displayName} has been enabled!`);
            this.emit("toggle", plugin.entityID, true);
        }
    }

    static disablePlugin(addon: any, log = true) {
        const plugin: Plugin = this.resolve(addon);
        if (!plugin) return;

        this.states[plugin.entityID] = false;
        DataStore.trySaveData("plugins", this.states);
        this.stopPlugin(plugin, false);

        if (log) {
            Logger.log(`${plugin.displayName} has been disabled!`);
            this.emit("toggle", plugin.entityID, false);
        }
    }

    static delete(addon: any) {
        const plugin: Plugin = this.resolve(addon);
        if (!plugin) return;

        this.unloadAddon(plugin);
        PCCompatNative.executeJS(`require("electron").shell.trashItem(${JSON.stringify(plugin.path)})`);
        this.emit("delete", plugin)
    }

    static toggle(addon: any) {
        const plugin = this.resolve(addon);
        if (!plugin) return;

        if (this.isEnabled(plugin.entityID)) this.disable(plugin);
        else this.enable(plugin);
    }

    static get(name: string) {
        return this.plugins.get(name);
    }

    static get enable() {return this.enablePlugin;}
    static get disable() {return this.disablePlugin;}
    static get reload() {return this.reloadPlugin;}
    static get remount() {return this.reloadPlugin;}
    static get getPlugins() {return [...this.plugins.keys()];}
}
