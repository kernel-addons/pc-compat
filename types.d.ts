/// <reference path="./types/electron.d.ts" />

declare const PCCompatNative: import("./src/preload/index").API;

declare namespace NodeJS {
    interface Process {
        readonly contextIsolated: boolean;
    }
}

declare const React: typeof import("react");
declare const _: typeof import("lodash");
declare const powercord: typeof import("@powercord"); // TODO: Add "powercord" global typings.
declare const __NODE_ENV__: "DEVELOPMENT" | "PRODUCTION";