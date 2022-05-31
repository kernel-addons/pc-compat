/// <reference path="../../types.d.ts" />
import {Constants} from "@data";
import {DOM} from "@modules";
import {require as Require, path} from "@node";
import {init as initializeWebpack} from "@powercord/webpack";
import PluginManager from "@powercord/pluginmanager";
import StyleManager from "@powercord/stylemanager";
import SettingsRenderer from "@modules/settings";
import {promise} from "@modules/discord";
import * as Internals from "./modules";
import manifest from "../../index.json";
import {Modals} from "./ui";
import DiscordIcon from "@ui/discordicon";
import Updater from "@ui/updater";
import "./styles/index";
import Events from "@modules/events";
import DevServer from "@modules/devserver";
import {setBuffer} from "@node/buffer";

const Logger = Internals.Logger.create("Core");

export default new class PCCompat {
    promises = {
        cancelled: false,
        cancel() {this.cancelled = true;}
    }

    start() {
        Logger.log("Loading");
        promise.then(this.onStart.bind(this));
    }

    async onStart() {
        StyleManager.initialize();
        setBuffer(Internals.Webpack.findByProps("Buffer"));
        this.expose("powercord", Require("powercord"));
        this.expose("PCInternals", Internals);
        await initializeWebpack();

        powercord.api.commands.initialize();

        Object.defineProperty(window, "powercord_require", {
            value: Require,
            configurable: false,
            writable: false
        });

        {
            const stylePath = path.resolve(PCCompatNative.getBasePath(), ...(PCCompatNative.isPacked ? ["style.css"] : ["dist", "style.css"]));
            DOM.injectCSS("core", Require(stylePath));
            DOM.injectCSS("font-awesome", Constants.FONTAWESOME_BASEURL, {type: "URL", documentHead: true});
        }

        SettingsRenderer.patchSettingsView();
        PluginManager.initialize();
        Updater.initialize();

        // if (__NODE_ENV__ === "DEVELOPMENT") DevServer.initialize();

        this.checkForChangelog();
        this.patchSettingsHeader();

        Events.addEventListener("reload-core", () => {
            DOM.clearCSS("core");
            DOM.clearCSS("font-awesome");
        });
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

            Modals.showChangeLog("PCCompat Changelog", manifest.changelog as unknown as any);
        }
    }

    async patchSettingsHeader() {
        const {Webpack, DiscordModules: {Button, Tooltips}} = Internals;
        const SettingsComponents = await Webpack.findLazy(Webpack.Filters.byProps("Header", "Panel"));
        if (this.promises.cancelled) return;

        const cancel = Internals.Patcher.after("SettingsHeader", SettingsComponents.default, "Header", (_, [props], ret) => {
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
                    onClick: () => {Modals.showChangeLog("PCCompat Changelog", manifest.changelog as unknown as any);},
                    children: React.createElement(DiscordIcon, {name: "Info"})
                }))
            ];
        });

        Events.addEventListener("reload-core", () => {
            cancel();
        });
    }

    stop() {}
}