import DataStore from "@modules/datastore";
import DiscordModules from "@modules/discord";
import {joinClassNames} from "@modules/utilities";
import {fs, path} from "@node";
import DiscordIcon from "@ui/discordicon";
import Editor from "./editor";
import {PanelAPI, usePanelStore} from "../store";
import {closeFile, getFiles} from "../util";
import SideBar from "./sidebar";
import Snippets from "./snippets";

export const Settings = [
    {
        type: "switch",
        name: "Example Setting",
        note: "Example.",
        value: true,
        id: "example"
    },
    {
        type: "switch",
        name: "Example Setting2",
        note: "Example 2.",
        value: false,
        id: "example2"
    }
];

export function SettingsPanel() {
    const {SwitchItem} = DiscordModules;

    return (
        <div className="pc-quickcss-panel pc-quickcss-settings">
            <h3 className="pc-settings-title">Settings</h3>
            {Settings.map(setting => {
                switch (setting.type) {
                    case "switch": return (
                        <SwitchItem
                            key={setting.id}
                            note={setting.note}
                            value={setting.value}
                            onChange={() => {}}
                        >{setting.name}</SwitchItem>
                    );

                    default: return null;
                }
            })}
        </div>
    )
}

export function renderTopbarFile(filepath: string, selected: boolean) {
    const {Button} = DiscordModules;

    const handleClick = function () {
        PanelAPI.setState({selectedFile: filepath});
    };

    // TODO: Render file icons with material file icon list
    return (
        <div className={joinClassNames("pc-quickcss-topbar-file", [selected, "pc-quickcss-selected"])} key={filepath} onClick={handleClick}>
            <Button size={Button.Sizes.NONE} look={Button.Looks.BLANK} className="pc-quickcss-close" onClick={() => {
                closeFile(filepath);
            }}>
                <DiscordIcon name="Close" />
            </Button>            
            <div className="pc-quickcss-filename">
                {path.basename(filepath)}
            </div>
        </div> 
    );
};

export default function QuickCSSPanel() {
    const tabs = DataStore.useEvent("data-update", () => getFiles());
    const state = usePanelStore();
    
    return (
        <div className="pc-quickcss">
            <SideBar />
            <div className="pc-quickcss-content">
                {(() => {
                    switch (state.panel) {
                        case "files": return [
                            <div className="pc-quickcss-topbar">
                                {tabs.map(tab => renderTopbarFile(tab, state.selectedFile === tab))}
                            </div>,
                            state.selectedFile
                                ? < Editor filename = {state.selectedFile} onChange = {(value) => {
                                    // console.log("Change:", value);
                                }} />
                                : <p className="pc-quickcss-notice">Open a File and start editing.</p>
                        ];

                        case "snippets": return (
                            <Snippets />
                        );

                        case "settings": return (
                            <SettingsPanel />
                        );

                        default: return (
                            <p className="pc-quickcss-notice">Welcome to PCCompat's QuickCSS editor.</p>
                        );
                    }
                })()}
            </div>
        </div>
    );
}