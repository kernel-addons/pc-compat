/// <reference path="./types/electron.d.ts" />

declare const PCCompatNative: {
    executeJS(js: string): any;
    getAppPath(): string;
    getBasePath(): string;
    setDevtools(opened: boolean): void;
    IPC: {
        on(event: string, callback: Function): () => void;
        off(event: string, callback: Function): void;
        once(event: string, callback: Function): void;
        dispatch(event: string, ...args: any[]): void;
    }
};

declare namespace NodeJS {
    interface Process {
        contextIsolated: boolean;
    }
}

declare const React: typeof import("react");
declare const _: typeof import("lodash");
declare const powercord: typeof import("@powercord"); // TODO: Add "powercord" global typings.
declare const __NODE_ENV__: "DEVELOPMENT" | "PRODUCTION";