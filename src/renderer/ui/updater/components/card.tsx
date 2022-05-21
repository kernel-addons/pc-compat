import { SettingsContext } from "@ui/components/settingspanel";
import Divider from "@powercord/components/divider";
import { joinClassNames } from "@modules/utilities";
import { memoizeValue } from "@modules/memoize";
import DiscordModules from "@modules/discord";
import DiscordIcon from "@ui/discordicon";
import makeLazy from "@modules/makelazy";
import SettingsPanel from "./settings";
import Git from "@modules/simplegit";
import UpdatesStore from "../store";
import Updater from "../updater";
import Icon from "@ui/icons";
import path from "@node/path";
import fs from "@node/fs";
import BranchModal from "./branch";

const basePath = PCCompatNative.getBasePath();

const localGitInfo = memoizeValue(() => {
    const gitInfoPath = path.resolve(basePath, "git.json");
    if (!fs.existsSync(gitInfoPath)) return null;

    return JSON.parse(fs.readFileSync(gitInfoPath, "utf8"));
});

export const LoadingSpinner = () => {
    return React.createElement(DiscordModules.Spinner, {
        type: DiscordModules.Spinner.Type.LOW_MOTION,
        className: "pc-spinner"
    });
};

export const CurrentBranch = makeLazy(async () => {
    const {Link} = DiscordModules;
    const branch = PCCompatNative.isPacked ? localGitInfo().branchName : (await Git.getBranchName(basePath));

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        BranchModal.open();
    };

    return (
        <Link href={`https://github.com/strencher-kernel/pc-compat/tree/${branch}`} onClick={handleClick}>{branch}</Link>
    );
}, LoadingSpinner);

export const CurrentCommitHash = makeLazy(async () => {
    const {Text, Link} = DiscordModules;

    const hash: any = PCCompatNative.isPacked ? localGitInfo().latestCommit : (await Git.getLatestCommit(basePath, await Git.getBranchName(basePath)));

    if (hash.hasError) return (
        <Text color={Text.Colors.RED}>error</Text>
    );

    return (
        <Link href={`https://github.com/strencher-kernel/pc-compat/tree/${hash.full}`}>{hash.short}</Link>
    );
}, LoadingSpinner);

export function usePromise<T>(promise: Promise<T>): null | T {
    const [state, setState] = React.useState(null);

    React.useEffect(() => {
        promise.then(value => setState(value));
    }, []);

    return state;
}

export default function UpdaterCard({hasPendingUpdates, onUpdate}) {
    const ViewAPI = React.useContext<any>(SettingsContext);
    const {Flex, Text, Moment, Button, Tooltips} = DiscordModules;

    const hasGit = usePromise(Git.hasGitInstalled());
    const isFetching = UpdatesStore.useState(() => UpdatesStore.isFetching());
    const isUpdatingAll = UpdatesStore.useState(() => UpdatesStore.isUpdatingAll());
    const lastCheckedUpdate = UpdatesStore.useState(() => UpdatesStore.getLastCheckedUpdate());

    const headerText = React.useMemo(() => {
        if (isFetching) return "Fetching updates...";
        if (hasPendingUpdates) return "Something needs to be updated!";
        if (isUpdatingAll) return "Updating...";

        return "Everything is up to date.";
    }, [isFetching, isUpdatingAll, hasPendingUpdates]);

    const headerIcon = React.useMemo(() => {
        if (isFetching || isUpdatingAll) return (
            <DiscordIcon name="UpdateAvailable" width="70" height="70" className="pcu-shield" />
        );

        return (
            <Icon
                name={hasPendingUpdates ? "WarningShield" : "VerifiedShield"}
                size="70"
                className={joinClassNames("pcu-shield", hasPendingUpdates ? "pcu-shield-warn" : "pcu-shield-ok")}
            />
        );
    }, [isFetching, hasPendingUpdates]);

    return (
        <Flex className="pcu-card" direction={Flex.Direction.VERTICAL}>
            <Flex justify={Flex.Justify.BETWEEN} align={Flex.Align.CENTER}>
                <Flex className="pcu-shield-container" direction={Flex.Direction.HORIZONTAL} align={Flex.Align.START} justify={Flex.Justify.CENTER}>
                    {headerIcon}
                    <Flex.Child>
                        <Text size={Text.Sizes.SIZE_24} color={Text.Colors.HEADER_PRIMARY}>
                            {headerText}
                        </Text>
                        <Text size={Text.Sizes.SIZE_14} color={Text.Colors.HEADER_SECONDARY}>
                            Last Checked:
                            {lastCheckedUpdate !== "---" && lastCheckedUpdate != null
                                ? " " + Moment(lastCheckedUpdate).calendar()
                                : " " + lastCheckedUpdate
                            }
                        </Text>
                    </Flex.Child>
                </Flex>
                <div className="pcu-git-info">
                    <Text className="pcu-git-info-item">Branch: <CurrentBranch /></Text>
                    <Text className="pcu-git-info-item">Commit: <CurrentCommitHash /></Text>
                </div>
            </Flex>
            <Divider />
            <Flex direction={Flex.Direction.HORIZONTAL} className="pc-updater-card-actions">
                {hasPendingUpdates && <Button
                    color={Button.Colors.GREEN}
                    size={Button.Sizes.SMALL}
                    onClick={() => Updater.updateAll()}
                >Update All</Button>}
                <Button
                    disabled={!hasGit || isFetching}
                    color={Button.Colors.BRAND}
                    size={Button.Sizes.SMALL}
                    onClick={onUpdate}
                >Check for Updates</Button>
                <Tooltips.Tooltip text="Settings">
                    {props => (
                        <Button
                            {...props}
                            size={Button.Sizes.NONE}
                            look={Button.Looks.BLANK}
                            className="pc-updater-settings-button"
                            onClick={() => {
                                ViewAPI.setPage({
                                    label: "Settings",
                                    render: () => <SettingsPanel />
                                });
                            }}
                        >
                            <DiscordIcon name="Gear" width="20" height="20" />
                        </Button>
                    )}
                </Tooltips.Tooltip>
            </Flex>
        </Flex>
    );
}