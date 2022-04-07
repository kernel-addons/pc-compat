import DataStore from "@modules/datastore";
import DiscordModules from "@modules/discord";
import {path} from "@node";
import {getConfig, getFiles, setConfig} from "../util";
import FileIcon from "./fileicon";

export function Snippet({filepath}) {
    const {Switch} = DiscordModules;
    const isEnabled = DataStore.useEvent("QUICK_CSS_UPDATE" as any, () => {
        const config = getConfig();
        return config.states[filepath] ?? false;
    });

    return (
        <div className="pc-quickcss-snippet">
            <div className="pc-quickcss-snippet-header">
                <div className="pc-file-icon">
                    <FileIcon ext={path.extname(filepath)} />
                </div>
                <div className="pc-quickcss-snippet-name">{path.basename(filepath)}</div>
                <div className="pc-quickcss-snippet-controls">
                    <Switch
                        checked={isEnabled}
                        onChange={() => {
                            setConfig({
                                states: {[filepath]: !isEnabled}
                            });
                        }}
                    />
                </div>
            </div>
        </div>
    );  
}

export default function Snippets() {
    return (
        <div className="pc-quickcss-panel pc-quickcss-snippets">
            <h3 className="pc-settings-title">Snippets</h3>
            {getFiles().map(file => (
                <Snippet filepath={file} key={file} />
            ))}
        </div>
    );
}