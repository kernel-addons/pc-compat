import UpdaterCard from "./card";
import Update from "./update";
import UpdatesStore from "../store";
import Updater from "../updater";
import Git from "@modules/simplegit";
import DiscordModules from "@modules/discord";

export function usePromise<T>(promise: Promise<T>): null | T {
    const [state, setState] = React.useState(null);

    React.useEffect(() => {
        promise.then(value => setState(value));
    }, []);

    return state;
}

export default function UpdaterPanel() {
    const {Forms: {FormNotice}} = DiscordModules;
    const updates = UpdatesStore.useState(() => UpdatesStore.getUpdates());
    const hasGit = usePromise(Git.hasGitInstalled());

    const handleFetchStart = function () {
        Updater.fetchAllUpdates();
    };
    
    return (
        <div>
            {hasGit === false && (
                <FormNotice
                    className="pc-margin-bottom-20"
                    type={FormNotice.Types.DANGER}
                    title="Git installation not found!"
                    imageData={{src: "/assets/6e97f6643e7df29b26571d96430e92f4.svg", width: 60, height: 60}}
                    body="It seems like you don't have git installed locally. The updater will not work properly."
                />
            )}
            <UpdaterCard hasPendingUpdates={updates.length > 0} onUpdate={handleFetchStart} />
            {updates.map((update,  i) => <Update {...update} key={update.id + "-" + i} />)}
        </div>
    );
}