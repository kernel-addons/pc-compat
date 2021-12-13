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
import manifest from "../../index.json";
import {Modals} from "./ui";
import DiscordIcon from "@ui/discordicon";
import Updater from "@ui/updater";

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
        Updater.initialize();
        PluginManager.initialize();
        StyleManager.initialize();

        this.checkForChangelog();
        this.patchSettingsHeader();
    }

    expose(name: string, namespace: any) {
        Object.defineProperty(window, name, {
            value: namespace,
            configurable: true,
            writable: true
        });
    }

    checkForChangelog() {
        const {latestUsedVersion} = Internals.DataStore.tryLoadData("info", {latestUsedVersion: "0.0.0"});

        if (latestUsedVersion !== manifest.version) {
            Internals.DataStore.trySaveData("info", {latestUsedVersion: manifest.version});

            Modals.showChangeLog("PCCompat Changelog", manifest.changelog);
        }
    }

    patchSettingsHeader() {
        const {Webpack, DiscordModules: {Button, Tooltips}} = Internals;
        const SettingsComponents = Webpack.findByProps("Header", "Panel");

        Internals.Patcher.after("SettingsHeade", SettingsComponents.default, "Header", (_, [props], ret) => {
            if (props.children !== "Powercord") return ret;

            ret.props.children = [
                ret.props.children,
                React.createElement(Tooltips.Tooltip, {
                    text: "Changelog",
                    position: "top"
                }, props => React.createElement(Button, {
                    ...props,
                    look: Button.Looks.BLANK,
                    size: Button.Sizes.NONE,
                    className: "pc-changelog-button",
                    onClick: () => {Modals.showChangeLog("PCCompat Changelog", manifest.changelog);},
                    children: React.createElement(DiscordIcon, {name: "Info"})
                }))
            ];
        });
    }

    stop() {}
}