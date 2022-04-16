import UpdaterCard from "./card";
import Update from "./update";
import UpdatesStore from "../store";
import Updater from "../updater";

export default function UpdaterPanel() {
    const updates = UpdatesStore.useState(() => UpdatesStore.getUpdates());

    const handleFetchStart = function () {
        Updater.fetchAllUpdates();
    };
    
    return (
        <div>
            <UpdaterCard hasPendingUpdates={updates.length > 0} onUpdate={handleFetchStart} />
            {updates.map((update,  i) => <Update {...update} key={update.id + "-" + i} />)}
        </div>
    );
}