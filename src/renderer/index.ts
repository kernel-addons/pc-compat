/// <reference path="../../types.d.ts" />
import {Constants} from "@data";
import {DiscordModules, DOM} from "@modules";
import * as IPCEvents from "@common/ipcevents";
import {require as Require, path} from "@node";
import {init as initializeWebpack} from "@powercord/webpack";
import PluginManager from "@powercord/pluginmanager";
import StyleManager from "@powercord/stylemanager";
import SettingsRenderer from "@modules/settings";
import {promise} from "@modules/discord";
import QuickCSS from "@ui/quickcss";
import * as Internals from "./modules";

if (!("process" in window)) {
    PCCompatNative.IPC.dispatch(IPCEvents.EXPOSE_PROCESS_GLOBAL);
}

export default new class PCCompat {
    start() {promise.then(this.onStart.bind(this));}

    async onStart() {
        this.expose("React", DiscordModules.React);
        this.expose("powercord", Require("powercord"));
        this.expose("PCInternals", Internals);
        await initializeWebpack();
        
        powercord.api.commands.initialize();
        
        Object.defineProperty(window, "powercord_require", {
            value: Require,
            configurable: false,
            writable: false
        });

        DOM.injectCSS("core", Require(path.resolve(PCCompatNative.getBasePath(), "src/renderer/styles", "index.scss")));
        DOM.injectCSS("font-awesome", Constants.FONTAWESOME_BASEURL, {type: "URL", documentHead: true});

        SettingsRenderer.patchSettingsView();
        QuickCSS.initialize();
        PluginManager.initialize();
        StyleManager.initialize();
    }

    expose(name: string, namespace: any) {
        Object.defineProperty(window, name, {
            value: namespace,
            configurable: true,
            writable: true
        });
    }

    stop() {
    }
}