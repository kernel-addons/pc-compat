import {makeLazy} from "@common/util";
import Buffer from "./buffer";
import EventEmitter from "./events";

type HttpModule = typeof import("src/preload/bindings/https");

const binding = window.require ? window.require("https") : makeLazy(() => PCCompatNative.getBinding("https") as HttpModule);

export function get(...args: any[]) {
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

export function request(...args: any[]) {return Reflect.apply(get, this, args);}

export function createServer() {
    // @ts-expect-error
    return DiscordNative.nativeModules.requireModule("discord_rpc").RPCWebSocket.http.createServer.apply(this, arguments);
}
