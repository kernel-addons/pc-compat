import {sleep} from "../modules/utilities";
import Webpack from "../modules/webpack";
import modules from "./data/modules";

export function getModule<module = any>(filter: (Function | string[]), retry: boolean = true, forever: boolean = false): module | Promise<module> {
    if (Array.isArray(filter)) {
        const props = filter;

        filter = (m: any) => m && props.every(key => typeof(key) === "function" ? (key as CallableFunction)(m) : key in m);
    }

    if (typeof (filter) !== "function") return retry ? Promise.resolve(null) : null;

    if (!retry) return Webpack.findModule(filter, false, true);

    return new Promise<module>(async (resolve) => {
        for (let i = 0; i < (forever ? 666 : 21); i++) {
            const found = Webpack.findModule((filter as Function), false, true);
            if (found) {
                return resolve(found);
            }

            await sleep(100);
        }
    });
};

export function getModuleByDisplayName<module = any>(displayName: string, retry?: boolean, forever?: boolean): (module | void) | Promise<module | void> {
    return getModule<any>((m: any) => m.displayName?.toLowerCase() === displayName.toLowerCase(), retry, forever);
};

export function getAllModules(filter: Function | string[]) {
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