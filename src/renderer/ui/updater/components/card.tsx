import DataStore from "@modules/datastore";
import DiscordModules from "@modules/discord";
import makeLazy from "@modules/makelazy";
import Git from "@modules/simplegit";
import {joinClassNames} from "@modules/utilities";
import Divider from "@powercord/components/divider";
import DiscordIcon from "@ui/discordicon";
import Icon from "@ui/icons";
import {UpdatesStore} from "../store";

const [useUpdatesStore] = UpdatesStore;

const basePath = PCCompatNative.getBasePath();

export const LoadingSpinner = () => {
    return React.createElement(DiscordModules.Spinner, {
        type: DiscordModules.Spinner.Type.LOW_MOTION,
        className: "pc-spinner"
    });
};

export const CurrentBranch = makeLazy(async () => {
    const {Link} = DiscordModules;

    const branch = await Git.getBranchName(basePath);

    return (
        <Link href={`https://github.com/strencher-kernel/pc-compat/tree/${branch}`}>{branch}</Link>
    );
}, LoadingSpinner);

export const CurrentCommitHash = makeLazy(async () => {
    const {Text, Link} = DiscordModules;

    const hash: any = await Git.getLatestCommit(basePath, await Git.getBranchName(basePath));

    if (hash.hasError) return (
        <Text color={Text.Colors.RED}>error</Text>
    );

    return (
        <Link href={`https://github.com/strencher-kernel/pc-compat/tree/${hash.full}`}>{hash.short}</Link>
    );
}, LoadingSpinner);

export const defaultInfo = {latestUsedVersion: "0.0.0", lastCheckedUpdate: "---"};

export default function UpdaterCard({hasPendingUpdates, onUpdate}) {
    const {Flex, Text, Moment, Button} = DiscordModules;
    
    const updaterInfo = DataStore.useEvent("updates" as any, () => {
        return DataStore.tryLoadData("info", defaultInfo);
    }, (name) => name === "info");
    const isFetching = useUpdatesStore(u => u.isFetching);

    const headerText = React.useMemo(() => {
        if (isFetching) return "Fetching updates...";
        if (hasPendingUpdates) return "Something needs to be updated!";
        
        return "Everything is up to date.";
    }, [isFetching, updaterInfo, hasPendingUpdates]);

    const headerIcon = React.useMemo(() => {
        if (isFetching) return (
            <DiscordIcon name="UpdateAvailable" width="70" height="70" className="pcu-shield" />
        );

        return (
            <Icon
                name={hasPendingUpdates ? "WarningShield" : "VerifiedShield"}
                size="70"
                className={joinClassNames("pcu-shield", hasPendingUpdates ? "pcu-shield-warn" : "pcu-shield-ok")}
            />
        );
    }, [isFetching, updaterInfo, hasPendingUpdates]);
    
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
                            {updaterInfo.lastCheckedUpdate !== "---" && updaterInfo.lastCheckedUpdate != null
                                ? " " + Moment(updaterInfo.lastCheckedUpdate).calendar()
                                : " " + updaterInfo.lastCheckedUpdate
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
            <Flex direction={Flex.Direction.HORIZONTAL}>
                <Button
                    disabled={isFetching}
                    color={Button.Colors.BRAND}
                    size={Button.Sizes.SMALL}
                    onClick={onUpdate}
                >
                    Check for Updates
                </Button>
            </Flex>
        </Flex>
    );
}