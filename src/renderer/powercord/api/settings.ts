import {DiscordModules} from "../../modules";
import {promise} from "../../modules/discord";
import SettingsRenderer from "../../modules/settings";
import {cache, getSettings} from "../classes/settings";

export let store = null;

promise.then(() => {
    setImmediate(() => {
        store = getSettings("powercord");
    });
});

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

export function _fluxProps(id: string) {
    return getSettings(id)?.makeProps();
};

export function connectStores(id: string) {
    return getSettings(id)?.connectStore();
};