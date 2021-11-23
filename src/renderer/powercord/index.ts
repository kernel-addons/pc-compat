import {Webpack} from "../modules";

export {default as components} from "./components/index";
export {default as webpack} from "./webpack";
export {default as injector} from "./injector";
export * as entities from "./entities";
export * as managers from "./managers/index"
export * as api from "./api/index";
export * as util from "./util";
export * as modal from "./modal";

export let initialized = false;

const WebpackPromise = Webpack.wait();

WebpackPromise.then(() => {
    initialized = true;
});

export function once(event: string, callback: Function) {
    switch (event) {
        case "loaded": {
            return WebpackPromise.then(callback as unknown as any);
        }
    }
}