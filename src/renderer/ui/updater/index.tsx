import SettingsRenderer from "@modules/settings";
import UpdaterPanel from "./components/panel";

export default class Updater {
    static initialize() {
        SettingsRenderer.registerPanel("pc-updater", {
            label: "Updater",
            order: 3,
            render: () => (
                <UpdaterPanel />
            )
        });
    }
}