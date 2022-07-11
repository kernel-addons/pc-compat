export * from "@common/util";
import path from "path";

export const isPacked: boolean = path.basename(__dirname) !== "dist";
export const basePath: string = isPacked ? __dirname : path.resolve(__dirname, "..");

export function makeEmitter() {
    const events = {};

    const ctx = {
        on(event: string, listener: Function) {
            events[event] || (events[event] = new Set());
            events[event].add(listener);
            return () => events[event].delete(listener);
        },
        off(event: string, listener: Function) {
            return Boolean(events[event]?.delete(listener));
        },
        emit(event: string, ...args: any[]) {
            if (event !== "all" && "all" in events) ctx.emit("all", event, ...args);

            if (event in events) for (const fn of events[event]) fn(...args);
        },
        events() {return Object.keys(events);}
    };

    return ctx;
}