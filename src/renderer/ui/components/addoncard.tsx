import Modals from "../modals";
import DiscordModules from "@modules/discord";
import DiscordIcon from "@ui/discordicon";
import {SettingsContext} from "./settingspanel";
import {settings} from "@powercord/api/settings";
import {cache} from "@powercord/classes/settings";

export function ToolButton({label, icon, onClick, danger = false, disabled = false}) {
    const {Button, Tooltips: {Tooltip}} = DiscordModules;

    return (
        <Tooltip text={label} position="top">
            {props => (
                <Button
                    {...props}
                    className="pc-settings-toolbutton"
                    look={Button.Looks.BLANK}
                    size={Button.Sizes.NONE}
                    onClick={onClick}
                    disabled={disabled}
                >
                    <DiscordIcon name={icon} color={danger ? "#ed4245" : void 0} width="20" height="20" />
                </Button>
            )}
        </Tooltip>
    );
};

export function ButtonWrapper({value, onChange, disabled = false}) {
    const {Switch} = DiscordModules;
    const [isChecked, setChecked] = React.useState(value);

    return (
        <Switch
            className="pc-settings-addons-switch"
            checked={isChecked}
            disabled={disabled}
            onChange={() => {
                onChange(!isChecked);
                setChecked(!isChecked);
            }}
        />
    );
};

function getPanel(id) {
    const get = settings.get(id);
    if (get) return get;

    for(const [key, options] of settings.entries()) {
        if (options.category == id) return settings.get(key);
    }

    return null;
}

export default function AddonCard({addon, manager, openSettings, hasSettings, type}) {
    const {Markdown} = DiscordModules;
    const [, forceUpdate] = React.useReducer(n => n + 1, 0);
    const SettingsApi = React.useContext<any>(SettingsContext);

    React.useEffect(() => {
        manager.on("toggle", (name: string) => {
            if (name !== addon.entityID) return;

            forceUpdate();
        });
    }, [addon, manager]);

    return (
        <div style={({"--plugin-color": addon.color} as any)} className={"pc-settings-addon-card " + addon.manifest.name?.replace(/ /g, "-")}>
            <div className="pc-settings-card-header">
                <div className="pc-settings-card-field pc-settings-card-name">{addon.manifest.name}</div>
                {"version" in addon.manifest && <div className="pc-settings-card-field">v{addon.manifest.version}</div>}
                {"author" in addon.manifest && <div className="pc-settings-card-field"> by {addon.manifest.author}</div>}
                <div className="pc-settings-card-controls">
                    {getPanel(addon.entityID) && <ToolButton
                        label="Settings"
                        icon="Gear"
                        onClick={() => {
                            const Settings = getPanel(addon.entityID);

                            SettingsApi.setPage({
                                label: addon.manifest.name,
                                render: typeof(Settings.render) === "function"
                                    ? (() => DiscordModules.React.createElement(Settings.render, cache.get(addon.entityID).makeProps()))
                                    : Settings.render
                            });
                        }}
                    />}
                    <ToolButton label="Reload" icon="Replay" disabled={!manager.isEnabled?.(addon) ?? true} onClick={() => manager.reload(addon)} />
                    <ToolButton label="Open Path" icon="Folder" onClick={() => {
                        PCCompatNative.executeJS(`require("electron").shell.showItemInFolder(${JSON.stringify(addon.path)})`);
                    }} />
                    <ToolButton label="Delete" icon="Trash" onClick={() => {
                        Modals.showConfirmationModal("Are you sure?", `Are you sure that you want to delete the ${type} "${addon.manifest.name}"?`, {
                            danger: true,
                            onConfirm: () => {
                                manager.delete(addon.entityID)
                            }
                        });
                    }} />
                    <ButtonWrapper value={manager.isEnabled?.(addon) ?? false} onChange={() => {
                        manager.toggle(addon);
                    }} />
                </div>
            </div>
            {addon.manifest.description && (
                <div className="pc-settings-card-desc">
                    <Markdown>{addon.manifest.description}</Markdown>
                </div>
            )}
        </div>
    );
}