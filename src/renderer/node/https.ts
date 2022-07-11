import {makeLazy} from "@common/util";
import EventEmitter from "./events";
import Buffer from "./buffer";

type HttpModule = typeof import("src/preload/bindings/https");

const isIsolated = !window.process || process.contextIsolated;
const binding = makeLazy(() => isIsolated ? PCCompatNative.getBinding("https") as HttpModule : window.require("https"));

export function get(...args: any[]) {
    if (!isIsolated) {
        return binding().get.apply(binding(), arguments);
    }

    const res = args.pop();

    const emitter = new EventEmitter();
    const req = binding().get(...args);
    req.on("all", (event: string, ...args: any[]) => {
        if (event === "end") {
            const data = args.shift();

            Object.assign(emitter, data);
        }

        if (event === "data" && args[0] instanceof Uint8Array) {
            args[0] = Buffer.Buffer.from(args[0]);
        }

        emitter.emit(event, ...args);
    });

    Object.assign(emitter, {end: req.end});

    return res(emitter), emitter;
}

export function request(...args: any[]) {
    if (!isIsolated) {
        return binding().get.apply(binding(), arguments);
    }

    return Reflect.apply(get, this, args);
}

export function createServer() {
    if (!isIsolated) {
        return binding().createServer.apply(binding(), arguments);
    }

    // @ts-expect-error
    return DiscordNative.nativeModules.requireModule("discord_rpc").RPCWebSocket.http.createServer.apply(this, arguments);
}
