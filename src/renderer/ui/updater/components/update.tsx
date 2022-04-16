import DiscordModules from "@modules/discord";
import Error from "@ui/icons/error";
import Modals from "@ui/modals";
import UpdatesStore, {CoreUpdate as CoreUpdateType, AddonUpdate as AddonUpdateType, Update as UpdateType} from "../store";
import Updater from "../updater";

export function CoreUpdate(props: UpdateType & CoreUpdateType) {
    const {Forms, Button, Tooltips, Moment, Spinner} = DiscordModules;
    const [isInstalling, setInstalling] = React.useState(false);
    const failed = UpdatesStore.useState(() => (UpdatesStore.getUpdate(props.id) as UpdateType).failed);
    const isIgnored = UpdatesStore.useState(() => UpdatesStore.isIgnored(props.type));

    const handleClick = async function () {
        const asset = props.release.assets.find(c => c.name === "powercord.asar");
        setInstalling(true);

        try {
            await Updater.installCoreUpdate(asset.url, asset.content_type);

            UpdatesStore.removeUpdate(props.id);
        } catch (error) {
            console.error(error);
            const update = UpdatesStore.getUpdate(props.id);
            if (!update) return;

            update.failed = true;
            UpdatesStore.emit("update");
            setInstalling(false);
        }
    };

    const style: any = {
        "--border": failed ? "#ed4245" : isIgnored ? "#FAA81A" : null
    };

    return (
        <div className="pc-update pc-core-update" style={style}>
            <Forms.FormItem title="Core - New Release">
                {failed && <Tooltips.Container text="Update failed!" className="pc-update-error">
                    <Error />
                </Tooltips.Container>}
                <div className="pc-release-header">
                    <img src={props.release.author.avatar_url} className="pc-update-author-img" />
                    <div className="pc-release-author">{props.release.author.login}</div>
                    {props.release.author.type === "Bot" && <div className="pc-bot-tag">Bot</div>}
                    <div className="pc-release-timestamp">{Moment(new Date(props.release.created_at)).calendar()}</div>
                </div>
                <div className="pc-update-info pc-update-version-compare">
                    <b>Version:</b>
                    <React.Fragment>
                        <span>{props.from}</span>
                        <span className="pc-update-version-arrow">
                            <svg aria-hidden="false" width="16" height="16" viewBox="0 0 24 24">
                                <polygon fill="currentColor" fill-rule="nonzero" points="13 20 11 20 11 8 5.5 13.5 4.08 12.08 12 4.16 19.92 12.08 18.5 13.5 13 8" />
                            </svg>
                        </span>
                        <span>{props.to}</span>
                    </React.Fragment>
                </div>
                <div className="pc-update-info pc-update-note">
                    <b>Note:</b>
                    <span>{props.release.body}</span>
                </div>
            </Forms.FormItem>
            <div className="pc-update-actions">
                <Tooltips.Tooltip text={isIgnored ? "Acknowledge Updates" : "Ignore Updates"}>
                    {tooltipProps => (
                        <Button
                            {...tooltipProps}
                            color={isIgnored ? Button.Colors.GREEN : Button.Colors.YELLOW}
                            size={Button.Sizes.TINY}
                            onClick={() => isIgnored ? UpdatesStore.acknowledge(props.type) : UpdatesStore.ignore(props.type)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                                <path d="M0 0h24v24H0z" fill="none" />
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z" fill="currentColor" />
                            </svg>
                        </Button>
                    )}
                </Tooltips.Tooltip>
                <Tooltips.Tooltip text="Install Update">
                    {tooltipProps => (
                        <Button
                            {...tooltipProps}
                            disabled={isInstalling}
                            color={Button.Colors.GREEN}
                            size={Button.Sizes.TINY}
                            onClick={handleClick}
                        >
                            {isInstalling ?
                                <Spinner className="pc-update-spinner" type={Spinner.Type.SPINNING_CIRCLE} />
                                : <svg x="0" y="0" className="pc-icon" width="24" height="24" viewBox="0 0 24 24">
                                    <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M16.293 9.293L17.707 10.707L12 16.414L6.29297 10.707L7.70697 9.293L11 12.586V2H13V12.586L16.293 9.293ZM18 20V18H20V20C20 21.102 19.104 22 18 22H6C4.896 22 4 21.102 4 20V18H6V20H18Z" />
                                </svg>
                            }
                        </Button>
                    )}
                </Tooltips.Tooltip>
                <Tooltips.Tooltip text="Open in Browser">
                    {tooltipProps => (
                        <Button
                            {...tooltipProps}
                            color={Button.Colors.BRAND}
                            size={Button.Sizes.TINY}
                            onClick={() => window.open(props.release.url, "_blank")}
                        >
                            <svg className="pc-icon" width="24" height="24" viewBox="0 0 24 24">
                                <g fill="none" fill-rule="evenodd">
                                    <path fill="currentColor" d="M10.59 13.41c.41.39.41 1.03 0 1.42-.39.39-1.03.39-1.42 0a5.003 5.003 0 0 1 0-7.07l3.54-3.54a5.003 5.003 0 0 1 7.07 0 5.003 5.003 0 0 1 0 7.07l-1.49 1.49c.01-.82-.12-1.64-.4-2.42l.47-.48a2.982 2.982 0 0 0 0-4.24 2.982 2.982 0 0 0-4.24 0l-3.53 3.53a2.982 2.982 0 0 0 0 4.24zm2.82-4.24c.39-.39 1.03-.39 1.42 0a5.003 5.003 0 0 1 0 7.07l-3.54 3.54a5.003 5.003 0 0 1-7.07 0 5.003 5.003 0 0 1 0-7.07l1.49-1.49c-.01.82.12 1.64.4 2.43l-.47.47a2.982 2.982 0 0 0 0 4.24 2.982 2.982 0 0 0 4.24 0l3.53-3.53a2.982 2.982 0 0 0 0-4.24.973.973 0 0 1 0-1.42z" />
                                    <rect width="24" height="24" />
                                </g>
                            </svg>
                        </Button>
                    )}
                </Tooltips.Tooltip>
            </div>
        </div>
    );
}

export function AddonUpdate(props: AddonUpdateType & UpdateType) {
    const [isInstalling, setInstalling] = React.useState(false);
    const {Forms, Button, Tooltips, Link, Spinner} = DiscordModules;
    const failed = UpdatesStore.useState(() => (UpdatesStore.getUpdate(props.id) as UpdateType).failed);
    const isIgnored = UpdatesStore.useState(() => UpdatesStore.isIgnored(props.entityId));

    const handleClick = async function (force: boolean) {
        if (force) {
            const shouldContinue = await new Promise(resolve => {
                Modals.showConfirmationModal("Are you sure?", "Are you sure you want to force the update? This will delete your local changes if you have any.", {
                    onConfirm: resolve.bind(null, true),
                    onCancel: resolve.bind(null, false),
                })
            });

            if (!shouldContinue) return;
        }

        setInstalling(true);

        try {
            await Updater.installAddonUpdate(props.path, force);

            UpdatesStore.removeUpdate(props.id);
        } catch (error) {
            console.error(error);

            const update = UpdatesStore.getUpdate(props.id);
            if (!update) return;

            update.failed = true;
            UpdatesStore.emit("update");
            setInstalling(false);
        }
    };

    const style: any = {
        "--border": failed ? "#ed4245" : isIgnored ? "#FAA81A" : null
    };

    return (
        <div className="pc-update" style={style}>
            <Forms.FormItem title={props.type === "core" ? "New Release" : props.name}>
                {failed && <Tooltips.Container text="Update failed!" className="pc-update-error">
                    <Error />
                </Tooltips.Container>}
                <ul>
                    {props.commits.map(commit => (
                        <li>
                            <div className="pc-update-commit">
                                <div className="pc-commit-hash">
                                    <Link href={`${props.repoUrl}/commit/${commit.hash}`}>{commit.hash_short}</Link>
                                </div>
                                <div className="pc-commit-message">
                                    {commit.message}
                                </div>
                                <div className="pc-commit-author">
                                    <span className="pc-commit-author-username">{commit.author}</span>
                                    <span>-</span>
                                    <span className="pc-commit-timestamp">{commit.date}</span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </Forms.FormItem>
            <div className="pc-update-actions">
                <Tooltips.Tooltip text={isIgnored ? "Acknowledge Updates" : "Ignore Updates"}>
                    {tooltipProps => (
                        <Button
                            {...tooltipProps}
                            color={isIgnored ? Button.Colors.GREEN : Button.Colors.YELLOW}
                            size={Button.Sizes.TINY}
                            onClick={() => isIgnored ? UpdatesStore.acknowledge(props.entityId) : UpdatesStore.ignore(props.entityId)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20">
                                <path d="M0 0h24v24H0z" fill="none" />
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z" fill="currentColor" />
                            </svg>
                        </Button>
                    )}
                </Tooltips.Tooltip>
                <Tooltips.Tooltip text="Open in Browser">
                    {tooltipProps => (
                        <Button
                            {...tooltipProps}
                            color={Button.Colors.BRAND}
                            size={Button.Sizes.TINY}
                            onClick={() => window.open(props.repoUrl, "_blank")}
                        >
                            <svg className="pc-icon" width="20" height="20" viewBox="0 0 24 24">
                                <g fill="none" fill-rule="evenodd">
                                    <path fill="currentColor" d="M10.59 13.41c.41.39.41 1.03 0 1.42-.39.39-1.03.39-1.42 0a5.003 5.003 0 0 1 0-7.07l3.54-3.54a5.003 5.003 0 0 1 7.07 0 5.003 5.003 0 0 1 0 7.07l-1.49 1.49c.01-.82-.12-1.64-.4-2.42l.47-.48a2.982 2.982 0 0 0 0-4.24 2.982 2.982 0 0 0-4.24 0l-3.53 3.53a2.982 2.982 0 0 0 0 4.24zm2.82-4.24c.39-.39 1.03-.39 1.42 0a5.003 5.003 0 0 1 0 7.07l-3.54 3.54a5.003 5.003 0 0 1-7.07 0 5.003 5.003 0 0 1 0-7.07l1.49-1.49c-.01.82.12 1.64.4 2.43l-.47.47a2.982 2.982 0 0 0 0 4.24 2.982 2.982 0 0 0 4.24 0l3.53-3.53a2.982 2.982 0 0 0 0-4.24.973.973 0 0 1 0-1.42z" />
                                    <rect width="24" height="24" />
                                </g>
                            </svg>
                        </Button>
                    )}
                </Tooltips.Tooltip>
                <Tooltips.Tooltip text="Compare Changes">
                    {tooltipProps => (
                        <Button
                            {...tooltipProps}
                            color={Button.Colors.BRAND}
                            size={Button.Sizes.TINY}
                            onClick={() => {
                                window.open(`${props.repoUrl.replace('.git', '')}/compare/${props.currentCommit.full}...${props.commits[0].hash}`, "_blank")
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="20" viewBox="0 0 24 24" width="20">
                                <g>
                                    <rect fill="none" height="24" width="24" />
                                </g>
                                <g>
                                    <path d="M14,2H6C4.9,2,4,2.9,4,4v16c0,1.1,0.89,2,1.99,2H15v-8h5V8L14,2z M13,9V3.5L18.5,9H13z M17,21.66V16h5.66v2h-2.24 l2.95,2.95l-1.41,1.41L19,19.41l0,2.24H17z" fill="currentColor" />
                                </g>
                            </svg>
                        </Button>
                    )}
                </Tooltips.Tooltip>
                <Tooltips.Tooltip text={failed ? "Force Update" : "Install Update"}>
                    {tooltipProps => (
                        <Button
                            {...tooltipProps}
                            disabled={isInstalling}
                            style={{marginLeft: 'auto'}}
                            color={failed ? Button.Colors.RED : Button.Colors.GREEN} size={Button.Sizes.TINY}
                            onClick={() => handleClick(failed)}
                        >
                            {isInstalling ?
                                <Spinner className="pc-update-spinner" type={Spinner.Type.SPINNING_CIRCLE} />
                                : failed
                                    ? <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20">
                                        <path d="M0 0h24v24H0z" fill="none" />
                                        <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" fill="currentColor" />
                                    </svg>
                                    : <svg x="0" y="0" className="pc-icon" width="20" height="20" viewBox="0 0 24 24">
                                    <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M16.293 9.293L17.707 10.707L12 16.414L6.29297 10.707L7.70697 9.293L11 12.586V2H13V12.586L16.293 9.293ZM18 20V18H20V20C20 21.102 19.104 22 18 22H6C4.896 22 4 21.102 4 20V18H6V20H18Z" />
                                </svg>
                            }
                        </Button>
                    )}
                </Tooltips.Tooltip>
            </div>
        </div>
    );
}

export default function Update(props: UpdateType) {
    switch (props.type) {
        case "core": return <CoreUpdate {...props as CoreUpdateType & UpdateType} />;
        case "addon": return <AddonUpdate {...props as AddonUpdateType & UpdateType} />;
    }
}