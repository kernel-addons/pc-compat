import DataStore from "@modules/datastore";
import Git from "@modules/simplegit";
import {UpdatesStore} from "../store";
import UpdaterCard from "./card";

const [useUpdatesStore, UpdatesApi] = UpdatesStore;

const basePath = PCCompatNative.getBasePath();

export function useCommitDiff() {
    const [diff, setDiff] = React.useState([]);

    React.useEffect(() => {
        Git.getBranchName(basePath).then(branch => {
            Git.getDiff(basePath, branch).then(setDiff);
        });
    }, []);

    return diff;
}

export default function UpdaterPanel() {
    const commitDiff = useCommitDiff();

    const handleFetchStart = function () {
        UpdatesApi.setState({isFetching: true});

        setTimeout(() => {
            const data = DataStore.tryLoadData("info", {});
            UpdatesApi.setState({isFetching: false});
            DataStore.trySaveData("info", {
                ...data,
                lastCheckedUpdate: new Date().toJSON()
            }, true, "updates");
        }, 5000);
    };

    return (
        <div>
            <UpdaterCard hasPendingUpdates={commitDiff.length > 0} onUpdate={handleFetchStart} />
        </div>
    );
}