import UpdatesStore, {DEFAULT_CONFIG} from "../store";
import DiscordModules from "@modules/discord";
import DataStore from "@modules/datastore";

export default function UpdatesBadge({className = "", type}) {
    const {Badges} = DiscordModules;
    const updatesCount = UpdatesStore.useState(() => UpdatesStore.getPendingUpdateCount());
    const shouldShow = DataStore.useEvent("data-update", () => {
        let id = "";

        switch (type) {
            case "sidebar": {
                id = "updateCountOnSettingsTab";
            } break;

            case "gear": {
                id = "updateCountOnSettingsGear";
            } break;
        }

        return DataStore.tryLoadData("updater", DEFAULT_CONFIG)[id];
    }, id => id === "updater");

    if (updatesCount < 1 || !shouldShow) return null;

    return (
        <Badges.Number className={className} count={updatesCount} />
    );
}