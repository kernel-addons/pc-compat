import {sleep} from "../modules/utilities";
import Webpack from "../modules/webpack";
import modules from "./data/modules";

type FilterFn = (m: any) => boolean;

export function getModule<module = any>(filter: (FilterFn | string[]), retry: boolean = true, forever: boolean = false): module | Promise<module> {
    if (Array.isArray(filter)) {
        const props = filter;

        filter = (m: any) => m && props.every(key => typeof(key) === "function" ? (key as CallableFunction)(m) : key in m);
    }

    if (typeof (filter) !== "function") return retry ? Promise.resolve(null) : null;

    if (!retry) return Webpack.findModule(filter, {cache: true, all: false});

    return async function() {
        for (let i = 0; i < (forever ? 666 : 21); i++) {
            const found = Webpack.findModule((filter as FilterFn), {cache: true, all: false});
            if (found) {
                return found;
            }

            await sleep(100);
        }

        return null;
    }();
};

export function getModuleByDisplayName<module = any>(displayName: string, retry?: boolean, forever?: boolean): (module | void) | Promise<module | void> {
    return getModule<any>((m: any) => m.displayName?.toLowerCase() === displayName.toLowerCase(), retry, forever);
};

export function getAllModules(filter: FilterFn | string[]) {
    if (Array.isArray(filter)) {
        const props = filter;

        filter = (m: any) => m && props.every(key => key in m);
    }

    return Webpack.findModules(filter);
};

export async function init() {
    for (const [moduleId, props] of Object.entries(modules)) {
        webpack[moduleId] = await getModule((props as string[]));
    }
    
    Object.freeze(webpack);
}

const webpack = {getModule, getAllModules, getModuleByDisplayName};

export default webpack;
