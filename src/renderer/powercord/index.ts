import Webpack from "../modules/webpack";

export {default as components} from "./components/index";
export {default as webpack} from "./webpack";
export {default as injector} from "./injector";
export * as entities from "./entities";
export * as managers from "./managers/index"
export * as api from "./api/index";
export * as util from "./util";
export * as modal from "./modal";
export {default as http} from "./http/index";

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