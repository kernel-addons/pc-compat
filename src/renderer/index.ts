import Webpack from "./modules/webpack";
import * as IPCEvents from "../common/ipcevents";
import Require from "./node/require";
import {init as initializeWebpack} from "./powercord/webpack";
import PluginManager from "./powercord/pluginmanager";
import SettingsRenderer from "./modules/settings";
import {path} from "./node";
import {DiscordModules, DOM} from "./modules";

if (!("process" in window)) {
    PCCompatNative.IPC.dispatch(IPCEvents.EXPOSE_PROCESS_GLOBAL);
}

export default new class PCCompat {
    start() {Webpack.wait(this.onStart.bind(this));}

    async onStart() {
        this.expose("React", DiscordModules.React);
        this.expose("powercord", Require("powercord"));
        await initializeWebpack();

        powercord.api.commands.initialize();

        Object.defineProperty(window, "powercord_require", {
            value: Require,
            configurable: false,
            writable: false
        });

        DOM.injectCSS("core", Require(path.resolve(PCCompatNative.getBasePath(), "src/renderer/styles", "index.scss")));

        SettingsRenderer.patchSettingsView();
        PluginManager.initialize();
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