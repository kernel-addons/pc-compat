import {DiscordModules} from "../../modules";
import SettingsRenderer from "../../modules/settings";
import {cache} from "../classes/settings";

export function registerSettings(id: string, options: any) {
    SettingsRenderer.registerPanel(id, {
        label: options.label,
        render: typeof(options.render)
            ? (() => DiscordModules.React.createElement(options.render, cache.get(id).makeProps())) 
            : options.render
    });
};

export function unregisterSettings(id: string) {
    SettingsRenderer.unregisterPanel(id);
};