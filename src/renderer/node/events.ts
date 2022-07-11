import LoggerModule from "@modules/logger";

const Logger = LoggerModule.create("Events");

export default !window.process || process.contextIsolated ? class EventEmitter {
    static get EventEmitter() {return EventEmitter;}

    static get defaultMaxListeners() {return 10;}

    maxListeners: number;

    events: any;

    constructor() {
        this.maxListeners = EventEmitter.defaultMaxListeners;
        this.events = {
            newListener: new Set()
        };
    }

    setMaxListeners(count: number) {
        if (typeof (count) !== "number" || count < 0 || Number.isNaN(count)) throw new Error(`Invalid argument for "count": ${count}`);

        this.maxListeners = count;

        return this;
    }

    emit(event: string, ...args: any[]) {
        if (!this.events[event]) return this;

        for (const [index, listener] of this.events[event].entries()) {
            try {
                listener(...args);
            } catch (error) {
                Logger.error("Emitter", `Cannot fire listener for event ${event} at position ${index}:`, error);
            }
        }

        return this;
    }

    off(event: string, callback: Function) {
        if (!this.events[event]) return;

        this.events[event].delete(callback);

        return this;
    }

    on(event: string, callback: Function) {
        if (!this.events[event]) this.events[event] = new Set();
        this.emit("newListener", event, callback);

        this.events[event].add(callback);

        return this;
    }

    once(event: string, callback: Function) {
        const wrapped = (...args) => {
            this.off(event, wrapped);

            return Reflect.apply(callback, null, args);
        };

        this.on(event, callback);

        return this;
    }

    removeAllListeners(event: string) {
        if (this.events[event]) {
            this.events[event].clear();
        }

        return this;
    }

    listenerCount(eventName: string) {return this.events[eventName]?.size ?? 0;}

    getMaxListeners() {return this.maxListeners;}

    eventNames() {return Reflect.ownKeys(this.events);}

    // Aliases
    get removeListener() {return this.off;}

    get addListener() {return this.on;}
} : window.require("events");
