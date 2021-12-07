import {promise} from "@modules/discord";
import {getSettings} from "@powercord/classes/settings";

export let store = null;

export let settings = new Map();

promise.then(() => {
    store = Object.assign(getSettings("powercord"), {
        // powerCord momento
        _fluxProps(id: string) {return getSettings(id).makeProps();}
    });
});

export function registerSettings(id: string, options: any) {
    id = options.category || id;

    options.render = connectStores(id)(options.render);
    settings.set(id, options);
};

export function unregisterSettings(id: string) {
    settings.delete(id);
};

export function _fluxProps(id: string) {
    return getSettings(id)?.makeProps();
};


export function connectStores(id: string) {
    return getSettings(id)?.connectStore();
};