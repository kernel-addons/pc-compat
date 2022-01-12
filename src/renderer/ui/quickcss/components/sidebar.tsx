import DataStore from "@modules/datastore";
import DiscordModules from "@modules/discord";
import LoggerModule from "@modules/logger";
import {joinClassNames} from "@modules/utilities";
import {fs, path} from "@node";
import DiscordIcon from "@ui/discordicon";
import Icon from "@ui/icons";
import Modals from "@ui/modals";
import {PanelAPI, usePanelStore} from "../store";
import {createStorage, filesPath, openFile} from "../util";
import {cache} from "./editor";
import FileIcon from "./fileicon";

const Logger = LoggerModule.create("QuickCSS");

export function SideBarButton({label, icon, selected, onClick, className = ""}) {
    const {Tooltips} = DiscordModules;

    return (
        <div className={joinClassNames("pc-quickcss-sidebar-icon", [selected, "pc-quickcss-selected"], className)} onClick={onClick} key={label}>
            <Tooltips.Tooltip text={label} position="right">
                {props => (
                    typeof icon === "string" ? <Icon name={icon} {...props} /> : React.createElement(icon, props)
                )}
            </Tooltips.Tooltip>
        </div>
    );
};

export function SideBarFile({filepath, selected}) {
    return (
        <div className={joinClassNames("pc-quickcss-sidebar-files-file", [selected, "pc-quickcss-selected"])} onClick={() => {
            if (selected) return;

            openFile(filepath);
            PanelAPI.setState({selectedFile: filepath});
        }} key={filepath}>
            <FileIcon ext={path.extname(filepath)} width="16" height="16" />
            <div className="pc-quickcss-filename">{path.basename(filepath)}</div>
        </div>
    );
};

export function ControlButton({label, action, children: icon}) {
    const {Tooltips, Button} = DiscordModules;

    return (
        <Tooltips.Tooltip text={label}>
            {props => (
                <Button {...props} className="pc-quickcss-controlbutton" onClick={action} look={Button.Looks.BLANK} size={Button.Sizes.NONE}>
                    {icon}
                </Button>
            )}
        </Tooltips.Tooltip>
    );
}

export default function SideBar() {
    const state = usePanelStore();
    const files = (fs.existsSync(filesPath) ? fs.readdirSync(filesPath, "utf8") : createStorage())
        .map(file => path.resolve(filesPath, file));

    const handleSaveFile = function () {
        if (!cache.has(state.selectedFile)) return;

        fs.writeFileSync(state.selectedFile, cache.get(state.selectedFile), "utf8");
        DataStore.emit("QUICK_CSS_UPDATE", state.selectedFile);

        powercord.api.notices.sendToast(null, {
            content: "Your changes to the current file were saved.",
            header: "Changes saved",
            type: "success",
            timeout: 1500
        })
    };

    const handleCreateFile = function () {
        Modals.prompt("Create File", "Filename of the file you want to create", {
            onInput: (value: string) => {
                try {
                    const location = path.resolve(filesPath, value);
                    fs.writeFileSync(location, "", "utf8");
                    PanelAPI.setState({selectedFile: location});
                } catch (error) {
                    Logger.error("QuickCSS", "Failed to create file " + value, error);
                }
            }
        });
    };

    return (
        <div className={joinClassNames("pc-quickcss-sidebar", [state.sidebarVisible, "pc-visible"])}>
            <div className="pc-quickcss-sidebar-iconsrow">
                <SideBarButton
                    label="Files"
                    key="FILES"
                    selected={state.panel === "files"}
                    icon={(state.panel === "files" && state.sidebarVisible) ? "FolderOpened" : "Folder"}
                    onClick={() => {
                        if (state.panel === "files") {
                            PanelAPI.setState({sidebarVisible: !state.sidebarVisible});
                            setImmediate(() => {
                                DiscordModules.Dispatcher.dirtyDispatch({type: "PCCOMPAT_UPDATE_POSITION"});
                            });
                        } else {
                            PanelAPI.setState({panel: "files"});
                        }
                    }}
                />
                <SideBarButton
                    label="Snippets"
                    key="SNIPPETS"
                    selected={state.panel === "snippets"}
                    icon="PaintBrush"
                    onClick={() => {
                        PanelAPI.setState({panel: "snippets"});
                    }}
                />
                <SideBarButton
                    label="Settings"
                    key="SETTINGS"
                    icon={props => <DiscordIcon name="Gear" {...props} />}
                    selected={state.panel === "settings"}
                    className="pc-align-bottom"
                    onClick={() => {
                        PanelAPI.setState({panel: "settings"});
                    }}
                />
            </div>
            {state.panel === "files" && <div className="pc-quickcss-sidebar-content">
                <div className="pc-quickcss-controls">
                    <ControlButton label="Save" action={handleSaveFile}>
                        <Icon name="Save" />
                    </ControlButton>
                    <ControlButton label="Create File" action={handleCreateFile}>
                        <DiscordIcon name="Plus" />
                    </ControlButton>
                </div>
                {files.map(file => (
                    <SideBarFile key={file} filepath={file} selected={state.selectedFile === file} />
                ))}
            </div>}
        </div>
    );
}