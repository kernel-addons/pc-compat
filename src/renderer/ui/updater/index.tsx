import DataStore from "@modules/datastore";
import DiscordModules from "@modules/discord";
import Events from "@modules/events";
import LoggerModule from "@modules/logger";
import Patcher from "@modules/patcher";
import SettingsRenderer from "@modules/settings";
import Webpack from "@modules/webpack";
import {getOwnerInstance, wrapInHooks} from "@powercord/util";
import Notices from "@ui/notices";
import UpdatesBadge from "./components/badge";
import UpdaterPanel from "./components/panel";
import UpdatesStore, {DEFAULT_CONFIG} from "./store";
import {default as UpdaterModule} from "./updater";

const Logger = new LoggerModule("Updater");

export default class Updater {
    static config: any = {};

    static settings = ["fetchPeriod", "autoFetch"];

    static clearPeriod = () => {};

    static getName() {return this.constructor.name;}

    static getPeriod() {return this.config.fetchPeriod * 6e4;}

    static get shouldAutomaticallyFetch() {return this.config.autoFetch;}

    static loadData() {return DataStore.tryLoadData("updater", DEFAULT_CONFIG);}

    static initialize() {
        this.config = this.loadData();

        SettingsRenderer.registerPanel("pc-updater", {
            label: "Updater",
            order: 3,
            icon: <UpdatesBadge type="sidebar" />,
            render: () => (
                <UpdaterPanel />
            )
        });

        Events.addEventListener("reload-core", () => {
            Patcher.unpatchAll(this.getName());
        });

        try {
            this.patchPanelButton();
        } catch (error) {
            Logger.error("Failed to patch settings button:", error);
        }

        this.startFetchInterval();

        DataStore.on("data-update", (id: string) => {
            if (id !== "updater") return;

            const newConfig = this.loadData();
            if (this.settings.every(id => this.config[id] === newConfig[id])) return;
            this.config = newConfig;

            this.clearPeriod();
            this.startFetchInterval();
        });
    }

    static patchPanelButton() {
        const ConnectedAccount = Webpack.findByDisplayName("AccountConnected");
        const Account = wrapInHooks(ConnectedAccount)({})?.type;
        let originalPanelButton = null;
        let errorCount = 0;

        function PatchedPanelButton() {
            const rendered = originalPanelButton.apply(this, arguments);
            if (errorCount > 10) return rendered;

            try {
                const tooltip = rendered?.props?.children;
                if (!tooltip) return rendered;

                rendered.props.children = (props: any) => {
                    const button = tooltip.call(null, props);

                    try {
                        button?.props?.children?.unshift(
                            <UpdatesBadge className="pc-settings-update-badge" type="gear" />
                        );
                    } catch (error) {
                        Logger.error("Error in PanelButton patch:", error);
                    }

                    return button;
                };
            } catch (error) {
                Logger.error("Error in PanelButton patch:", error);
                errorCount++;
            }

            return rendered;
        }

        Patcher.after(this.getName(), Account.prototype, "renderSettingsGear", (_, __, ret) => {
            if (!ret) return;

            originalPanelButton ??= ret.type;
            ret.type = PatchedPanelButton;
        });

        this.forceUpdateAccount();
    }

    static startFetchInterval() {
        if (!this.shouldAutomaticallyFetch) return;

        const interval = () => {
            Logger.log("Fetching for updates...");

            UpdaterModule.fetchAllUpdates().then(() => {
                if (!UpdatesStore.getPendingUpdateCount()) return;
                if (Notices.isShown("update-notice")) return;

                Notices.show({
                    timeout: 0,
                    icon: "wrench",
                    id: "update-notice",
                    header: "Updates Available",
                    content: "Updates are available! Go check them out in the updater panel.",
                    buttons: [
                        {
                            text: "Update Now",
                            color: "green",
                            onClick() {
                                Notices.close("update-notice");
                            }
                        },
                        {
                            text: "Open Updater",
                            color: "blue",
                            onClick() {
                                DiscordModules.UserSettingsWindow.open("pc-updater");
                                Notices.close("update-notice");
                            }
                        }
                    ]
                });
            });
        };

        interval();

        this.clearPeriod = clearInterval.bind(null, setInterval(interval, this.getPeriod()));
    }

    static forceUpdateAccount() {
        const accountContainerClasses = Webpack.findByProps("container", "hasBuildOverride");
        const [element] = document.getElementsByClassName(accountContainerClasses?.container ?? "");
        if (!element) return;

        const node = getOwnerInstance(element, e => e?.constructor?.displayName === "Account");
        if (!node) return;

        node.forceUpdate?.();
    }
}