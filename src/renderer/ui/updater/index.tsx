import SettingsRenderer from "@modules/settings";
import UpdaterPanel from "./components/panel";

export default class Updater {
    static initialize() {
        SettingsRenderer.registerPanel(this.constructor.name, {
            label: "Updater",
            order: 3,
            render: () => (
                <UpdaterPanel />
            )
        });
    }
}