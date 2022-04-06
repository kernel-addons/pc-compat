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
import VersionTag from "@ui/components/versiontag";
import "./styles/index";
import Events from "@modules/events";
import DevServer from "@modules/devserver";

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
        this.expose("powercord", Require("powercord"));
        this.expose("PCInternals", Internals);
        await initializeWebpack();

        powercord.api.commands.initialize();

        Object.defineProperty(window, "powercord_require", {
            value: Require,
            configurable: false,
            writable: false
        });

        DOM.injectCSS("core", Require(path.resolve(PCCompatNative.getBasePath(), "dist", "style.css")));
        DOM.injectCSS("font-awesome", Constants.FONTAWESOME_BASEURL, {type: "URL", documentHead: true});

        SettingsRenderer.patchSettingsView();
        Updater.initialize();
        PluginManager.initialize();

        if (__NODE_ENV__ === "DEVELOPMENT") DevServer.initialize();

        this.checkForChangelog();
        this.patchSettingsHeader();
        this.patchVersionTag();

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

    async patchVersionTag(): Promise<void> {
        const ClientDebugInfo = await Internals.Webpack.findLazy(Internals.Webpack.Filters.byDisplayName("ClientDebugInfo", true));

        const cancel = Internals.Patcher.after("DebugInfo", ClientDebugInfo, "default", (_, [props], res) => {
            const childs = res.props.children;
            if (!Array.isArray(childs)) return res;

            childs.push(React.createElement(VersionTag, {kernel: !props.hasKernelTag}));
            props.hasKernelTag ??= true;
        });

        Events.addEventListener("reload-core", () => {
            cancel();
        });
    }

    stop() {}
}