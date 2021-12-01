import AddonPanel from "../ui/components/addonpanel";
import {DataStore, DiscordModules} from "../modules";
import Logger from "../modules/logger";
import SettingsRenderer from "../modules/settings";
import {fs, path, require as Require, Module} from "../node";
import Plugin from "./classes/plugin";
import Emitter from "../classes/staticemitter";

export default class PluginManager extends Emitter {
    static get folder() {return path.resolve(DataStore.baseDir, "plugins")};

    static mainFiles = ["index.js", "index.jsx"];

    static plugins = new Map();

    static states: object;

    static get addons() {return Array.from(this.plugins, e => e[1]);}

    static initialize() {
        SettingsRenderer.registerPanel("plugins", {
            label: "Plugins",
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

            try {
                this.loadPlugin(location);
            } catch (error) {
                Logger.error("PluginsManager", `Failed to load ${file}:`, error);
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
        const manifest = Require(path.resolve(location, "manifest.json"));
        if (this.plugins.get(manifest.name)) throw new Error(`Plugin with name ${manifest.name} already exists!`);

        let exports = {};
        try {
            this.clearCache(location);
            const data = Require(_path);
            exports = new data(path.basename(location), location);
            Object.assign(exports, {manifest, path: location});
        } catch (error) {
            return void Logger.error("PluginsManager", `Failed to compile ${manifest.name || path.basename(location)}:`, error);
        }

        if (log) {
            Logger.log("PluginsManager", `${manifest.name} was loaded!`);
        }

        this.plugins.set(path.basename(location), exports);

        if (this.isEnabled(path.basename(location))) {
            this.startPlugin(exports);
        }
    }

    static unloadAddon(addon: any, log = true) {
        const plugin = this.resolve(addon);
        if (!addon) return;

        this.stopPlugin(plugin);
        this.plugins.delete(plugin.entityID);
        if (log) {
            Logger.log("PluginsManager", `${plugin.displayName} was unloaded!`);
        }
    }

    static reloadPlugin(addon: any) {
        const plugin = this.resolve(addon);
        if (!addon) return;

        const success = this.stopPlugin(plugin, false);
        if (!success) {
            return Logger.error("PluginsManager", `Something went wrong while trying to enable ${plugin.displayName}:`);
        }
        this.startPlugin(plugin, false);
        Logger.log("PluginsManager", `Finished reloading ${plugin.displayName}.`);
    }

    static startPlugin(addon: any, log = true) {
        const plugin = this.resolve(addon);
        if (!plugin) return;

        try {
            if (typeof (plugin.startPlugin) === "function") plugin.startPlugin();
            if (log) {
                Logger.log("PluginsManager", `${plugin.displayName} has been started!`);
            }
        } catch (error) {
            Logger.error("PluginsManager", `Could not start ${plugin.displayName}:`, error);
        }

        return true;
    }

    static stopPlugin(addon: any, log = true) {
        const plugin = this.resolve(addon);
        if (!plugin) return;

        try {
            if (typeof (plugin.pluginWillUnload) === "function") plugin.pluginWillUnload();
            if (log) {
                Logger.log("PluginsManager", `${plugin.displayName} has been stopped!`);
            }
        } catch (error) {
            Logger.error("PluginsManager", `Could not stop ${plugin.displayName}:`, error);
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
            Logger.log("PluginsManager", `${plugin.displayName} has been enabled!`);
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
            Logger.log("PluginsManager", `${plugin.displayName} has been disabled!`);
            this.emit("toggle", plugin.entityID, false);
        }
    }

    static toggle(addon: any) {
        const plugin = this.resolve(addon);
        if (!plugin) return;

        if (this.isEnabled(plugin.entityID)) this.disable(plugin);
        else this.enable(plugin);
    }
    
    static get enable() {return this.enablePlugin;}
    static get disable() {return this.disablePlugin;} 
    static get reload() {return this.reloadPlugin;}
}