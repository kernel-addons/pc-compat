export {default as components} from "./components/index";
export {default as pluginManager} from "./pluginmanager"
export {default as styleManager} from "./stylemanager"
export {default as constants} from "./constants";
export {default as injector} from "./injector";
export {default as http} from "./http/index";
export {default as webpack} from "./webpack";
export * as compilers from "./compilers";
import Webpack from "@modules/webpack";
export * as entities from "./entities";
export * as api from "./api/index";
export * as modal from "./modal";
export * as util from "./util";

export let initialized = false;

Webpack.whenReady.then(() => {
    initialized = true;
});

export const account = null;

export function fetchAccount () { return null };

export function once(event: string, callback: Function) {
    switch (event) {
        case "loaded": {
            return Webpack.whenReady.then(callback as unknown as any);
        }
    }
}
