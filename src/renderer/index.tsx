/// <reference path="../../types.d.ts" />
import {init as initializeWebpack} from "@powercord/webpack";
import PluginManager from "@powercord/pluginmanager";
import StyleManager from "@powercord/stylemanager";
import {require as Require, path, fs} from "@node";
import SettingsRenderer from "@modules/settings";
import {promise} from "@modules/discord";
import manifest from "../../index.json";
import * as Internals from "./modules";
import {setBuffer} from "@node/buffer";
import Events from "@modules/events";
import Updater from "@ui/updater";
import {Constants} from "@data";
import {DOM} from "@modules";
import {Modals} from "./ui";
import "./styles/index";

declare global {
    interface Window {
        [key: PropertyKey]: any;
    }
}

const Logger = Internals.Logger.create("Core");

export default new class PCCompat {
    _flush = [];
    promises = {
        cancelled: false,
        cancel() {this.cancelled = true;}
    };

    start() {
        Logger.log("Initializing...");
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

        const stylePath = path.resolve(PCCompatNative.getBasePath(), ...(PCCompatNative.isPacked ? ["style.css"] : ["dist", "style.css"]));
        DOM.injectCSS("core", fs.readFileSync(stylePath, 'utf-8'));
        DOM.injectCSS("font-awesome", Constants.FONTAWESOME_BASEURL, {type: "URL", documentHead: true});

        this.injectSettings();
        PluginManager.initialize();
        Updater.initialize();

        Logger.log("Initialized.");

        this.checkForChangelog();

        Events.addEventListener("reload-core", () => {
            DOM.clearCSS("core");
            DOM.clearCSS("font-awesome");
        });
    }

    async injectSettings() {
        if (window.isUnbound) return;

        if ("SettingsNative" in window) {
            if (typeof window.KernelSettings === "undefined") await new Promise<void>(resolve => {
                const listener = () => {
                    resolve();
                    Internals.DiscordModules.Dispatcher.unsubscribe("KERNEL_SETTINGS_INIT", listener);
                };

                Internals.DiscordModules.Dispatcher.subscribe("KERNEL_SETTINGS_INIT", listener);
            });

            SettingsRenderer.injectPanels();
        } else {
            const {ModalsApi, Text, Button, ConfirmationModal} = Internals.DiscordModules;
            ModalsApi.openModal((props) =>
                <ConfirmationModal
                    {...props}
                    header="Missing Dependency"
                    confirmText="Okay"
                    cancelText={null}
                    onCancel={props.onClose}
                    confirmButtonColor={Button.Colors.BRAND}
                >
                    <Text>
                        Powercord Compatibility requires the <a onClick={() => {
                            open("https://github.com/strencher-kernel/settings");
                        }}>settings</a> package to register its settings tabs.
                    </Text>
                </ConfirmationModal>
            );
        }
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

            Modals.showChangeLog({
                title: "Powercord Changelog",
                items: manifest.changelog.items as unknown as any,
                image: manifest.changelog.image,
                date: manifest.changelog.date
            });
        }
    }

    stop() {}
};
