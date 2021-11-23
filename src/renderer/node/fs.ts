/// <reference path="../../../types.d.ts" />

export default class fs {
    static readFileSync(path: string, options = "utf8") {
        return PCCompatNative.executeJS(`require("fs").readFileSync(${JSON.stringify(path)}, ${JSON.stringify(options)});`);
    }

    static writeFileSync(path: string, data: any, options: string | object) {
        return PCCompatNative.executeJS(`require("fs").writeFileSync(${JSON.stringify(path)}, ${JSON.stringify(data)}, ${JSON.stringify(options)})`);
    }

    static writeFile(path: string, data: string, options: string | object, callback: (error: void | Error) => void) {
        if (typeof (options) === "function") {
            (callback as CallableFunction) = options;
            options = null;
        }

        const ret = {error: null};
        try {this.writeFileSync(path, data, options);}
        catch (error) {ret.error = error}

        callback(ret.error);
    }

    static readdirSync(path: string, options: string | object) {
        return PCCompatNative.executeJS(`require("fs").readdirSync(${JSON.stringify(path)}, ${JSON.stringify(options)});`);
    }

    static existsSync(path: string) {
        return PCCompatNative.executeJS(`require("fs").existsSync(${JSON.stringify(path)});`);
    }

    static mkdirSync(path: string, options?: string | object) {
        return PCCompatNative.executeJS(`require("fs").mkdirSync(${JSON.stringify(path)}, ${JSON.stringify(options)});`);
    }

    static statSync(path: string, options?: string | object): import("fs").Stats {
        return PCCompatNative.executeJS(`
            const stats = require("fs").statSync(${JSON.stringify(path)}, ${JSON.stringify(options)});
            const ret = {
                ...stats,
                isFile: () => stats.isFile(),
                isDirectory: () => stats.isDirectory()
            };
            ret
        `);
    }

    static watch(path: string, options: any, callback?: Function) {
        if (typeof (options) === "function") {
            callback = options;
            options = null;
        }

        const eventId = "bdcompat-watcher-" + Math.random().toString(36).slice(2, 10);

        PCCompatNative.IPC.on(eventId, (event: "rename" | "change", filename: string) => {
            callback(event, filename);
        });

        return PCCompatNative.executeJS(`
            require("fs").watch(${JSON.stringify(path)}, ${JSON.stringify(options)}, (event, filename) => {
                PCCompatNative.IPC.dispatch(${JSON.stringify(eventId)}, event, filename);
            });
        `);
    }
}