import Webpack from "../modules/webpack";

export {default as components} from "./components/index";
export {default as webpack} from "./webpack";
export {default as injector} from "./injector";
export {default as pluginManager} from "./pluginmanager"
export {default as styleManager} from "./stylemanager"
export * as entities from "./entities";
export * as api from "./api/index";
export * as util from "./util";
export * as modal from "./modal";
export {default as http} from "./http/index";
export {default as constants} from "./constants";
export * as compilers from "./compilers";

export let initialized = false;

Webpack.whenReady.then(() => {
    initialized = true;
});

export function once(event: string, callback: Function) {
    switch (event) {
        case "loaded": {
            return Webpack.whenReady.then(callback as unknown as any);
        }
    }
}
