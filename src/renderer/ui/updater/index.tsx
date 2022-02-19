import DataStore from "@modules/datastore";
import DiscordModules from "@modules/discord";
import LoggerModule from "@modules/logger";
import Patcher from "@modules/patcher";
import SettingsRenderer from "@modules/settings";
import Webpack from "@modules/webpack";
import UpdaterPanel from "./components/panel";

const Logger = new LoggerModule("Updater");

export default class Updater {
    static getName() {return this.constructor.name;}

    static initialize() {
        SettingsRenderer.registerPanel("pc-updater", {
            label: "Updater",
            order: 3,
            predicate() {
                return DataStore.getMisc("developerMode", false);
            },
            render: () => (
                <UpdaterPanel />
            )
        });
    }

    static patchPanelButton() {
        const {Messages} = DiscordModules.LocaleManager;
        const PanelButton = Webpack.findByDisplayName("PanelButton", {default: true});

        Patcher.after(this.getName(), PanelButton, "default", (_, [{tooltipText}], ret) => {
            if (tooltipText.indexOf(Messages.USER_SETTINGS) < -1) return ret;

            const tooltip = ret.children;
            ret.children = (props: any) => {
                const rendered = tooltip.apply(null, props);

                try {
                    rendered?.props?.children?.push();
                } catch (error) {
                    Logger.error("Error in PanelButton patch:", error);
                }

                return tooltip;
            }
        });
    }
}