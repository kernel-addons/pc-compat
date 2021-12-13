import {promise} from "@modules/discord";
import {getSettings} from "@powercord/classes/settings";

export let store = null;
export let settings = new Map();
export const tabs = new Proxy(settings, {
    has(target, key) {return settings.has(key) || target[key] != null;},
    set(target, key, value) {return target[key] = value, true;},
    get(target, key) {
        // JS Proxy doesn't allow me to override this using the "has" handler.
        if (key === "hasOwnProperty") return (key: string) => {return settings.has(key) || key in settings;};

        return settings.get(key) ?? target[key];
    }
});

promise.then(() => {
    store = Object.assign(getSettings("powercord"), {
        // powerCord momento
        _fluxProps(id: string) {return getSettings(id).makeProps();}
    });
});

export function registerSettings(id: string, options: any) {
    id = id || options.category;

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